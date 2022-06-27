import { useState, useEffect, useReducer } from 'react';
import { patchEvent, postEvent } from 'API';
import { useAuthContext } from 'context/AuthContext';
import { useCalendarContext } from 'context/CalendarContext';
import DateTimePicker from 'DateTimePicker';
import Modal from 'Modal';
import ToggleButton from 'ToggleButton';
import Tag from 'Tag';
import TagBar from 'calendar/TagBar';
import { toDateString, toTimeString, useUpdateLogger } from 'Constants';
import { Event } from 'context/useEvents';
const AddEventModalHeader = ({ isModifying }) => {
  return (
    <>
      <h3 className="title">{isModifying ? '일정 고치기' : '새로운 일정'}</h3>
    </>
  );
};
const AddEventModalContent = ({ eventObj, setEvent, isModifying }) => {
  const [isSettingChannel, setIsSettingChannel] = useState(false);
  const {
    value: { userInfo },
  } = useAuthContext();
  return (
    <div
      className="event-input-container"
      style={isSettingChannel ? { overflow: 'hidden' } : {}}
    >
      <Tag
        id={eventObj.channel}
        onClick={() => (isModifying ? undefined : setIsSettingChannel(true))}
      />
      {isSettingChannel ? (
        <TagBar
          category="managing"
          className="tagbar expand"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            minHeight: '100%',
            maxHeight: '100%',
            backgroundColor: 'white',
            padding: '12px 20px',
            zIndex: 100,
          }}
          onTagClick={(ch) => {
            setEvent({ key: 'channel', value: ch });
            setIsSettingChannel(false);
          }}
          onScroll={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        />
      ) : (
        <></>
      )}
      <input
        id="event-name"
        className="input-flat input-title"
        type="text"
        placeholder="제목"
        value={eventObj.title}
        onChange={(e) => setEvent({ key: 'title', value: e.target.value })}
      ></input>
      <div className="input-datetime-container">
        <label>시작</label>
        <DateTimePicker
          dateString={eventObj.start_date}
          setDate={(date) => setEvent({ key: 'start_date', value: date })}
          timeString={eventObj.has_time ? eventObj.start_time : undefined}
          setTime={(time) => setEvent({ key: 'start_time', value: time })}
        />
      </div>
      <div className="input-datetime-container">
        <label>종료</label>
        <DateTimePicker
          dateString={eventObj.due_date}
          setDate={(date) => setEvent({ key: 'due_date', value: date })}
          timeString={eventObj.has_time ? eventObj.due_time : undefined}
          setTime={(time) => setEvent({ key: 'due_time', value: time })}
        />
      </div>
      <div className="button-timeset">
        <label>하루 종일</label>
        <ToggleButton
          value={!eventObj.has_time}
          sendValue={(value) => setEvent({ key: 'has_time', value: !value })}
        />
      </div>
      <textarea
        className="event-memo"
        value={eventObj.memo ?? ''}
        onChange={(e) => setEvent({ key: 'memo', value: e.target.value })}
        placeholder="메모"
      ></textarea>
    </div>
  );
};
const AddEventModalButton = ({ addEvent }) => {
  return (
    <div>
      <hr style={{ marginTop: '2px' }} />
      <button className="button-save" onClick={() => addEvent()}>
        저장하기
      </button>
    </div>
  );
};
const AddEventModal = ({ isActive, date, event: existingEvent, channelId }) => {
  const {
    value: { userInfo },
  } = useAuthContext();
  const { updateEvent } = useCalendarContext();
  const today = new Date();
  const initialDate = date ? toDateString(date) : toDateString(today);
  const initialState = existingEvent
    ? {
        ...existingEvent.toObject(),
        start_time: !existingEvent.isAllDay
          ? toTimeString(existingEvent.start).slice(0, -3)
          : `${(((today.getHours() + 1) % 24) + '').padStart(2, '0')}:00`,
        due_time: !existingEvent.isAllDay
          ? toTimeString(existingEvent.end).slice(0, -3)
          : `${(((today.getHours() + 2) % 24) + '').padStart(2, '0')}:00`,
      }
    : {
        channel:
          channelId ??
          [...userInfo.managing_channels][userInfo.managing_channels.size - 1],
        //FIX
        //userInfo.managing_channels.values().next().value,
        title: '',
        has_time: true,
        start_date: initialDate,
        start_time: `${(((today.getHours() + 1) % 24) + '').padStart(
          2,
          '0'
        )}:00`,
        due_date: initialDate,
        due_time: `${(((today.getHours() + 2) % 24) + '').padStart(2, '0')}:00`,
        memo: '',
      };
  const reducer = (state, action) => {
    const key = action.key;
    const value = action.value;
    if (key in state) {
      let newState = { ...state };
      newState[key] = value;
      return newState;
    }
  };
  const [event, setEvent] = useReducer(reducer, initialState);
  useUpdateLogger('event', event);
  useEffect(() => {
    if (new Date(event.start_date) > new Date(event.due_date))
      setEvent({ key: 'due_date', value: event.start_date });
  }, [event.start_date]);
  useEffect(() => {
    if (new Date(event.start_date) > new Date(event.due_date))
      setEvent({ key: 'start_date', value: event.due_date });
  }, [event.due_date]);
  useEffect(() => {
    if (
      event.start_date === event.due_date &&
      event.start_time > event.due_time
    )
      setEvent({ key: 'due_time', value: event.start_time });
  }, [event.start_time]);
  useEffect(() => {
    if (
      event.start_date === event.due_date &&
      event.start_time > event.due_time
    )
      setEvent({ key: 'start_time', value: event.due_time });
  }, [event.due_time]);
  const addEvent = () => {
    if (event.title === '') setEvent({ key: 'title', value: '새 일정' });
    let newEvent = {
      ...event,
      title: event.title === '' ? '새 일정' : event.title,
    };
    if (!newEvent.memo) delete newEvent.memo;
    (existingEvent ? patchEvent : postEvent)(newEvent.channel, newEvent).then(
      (eventObj) => {
        console.log(eventObj);
        //FIX: 현재 선택된 달이 fetch되도록
        const [year, monthIndex] = eventObj.start_date.split('-');
        console.log(year, monthIndex);
        updateEvent(new Event(eventObj));
        isActive(false);
      }
    );
  };
  return (
    <Modal
      isActive={isActive}
      header={<AddEventModalHeader isModifying={!!existingEvent} />}
      content={
        <AddEventModalContent
          eventObj={event}
          setEvent={setEvent}
          isModifying={channelId || !!existingEvent}
        />
      }
      button={<AddEventModalButton addEvent={addEvent} />}
    ></Modal>
  );
};
export default AddEventModal;
