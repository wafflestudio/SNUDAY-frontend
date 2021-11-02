import { useState, useEffect, useReducer } from 'react';
import { patchEvent, postEvent } from 'API';
import { useAuthContext } from 'context/AuthContext';
import { useCalendarContext } from 'context/CalendarContext';
import DateTimePicker from 'DateTimePicker';
import Modal from 'Modal';
import ToggleButton from 'ToggleButton';
import Tag from 'Tag';
import TagBar from 'calendar/TagBar';
const AddEventModalHeader = ({ isModifying }) => {
  return (
    <>
      <h3 className="title">{isModifying ? '일정 고치기' : '새로운 일정'}</h3>
    </>
  );
};
const AddEventModalContent = ({ event, setEvent }) => {
  const [isSettingChannel, setIsSettingChannel] = useState(false);
  const {
    value: { userInfo },
  } = useAuthContext();
  return (
    <div className="event-input-container">
      <Tag id={event.channel} onClick={() => setIsSettingChannel(true)} />
      {isSettingChannel ? (
        <TagBar
          category="managing"
          className="tagbar expand"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            padding: '12px 20px',
          }}
          onTagClick={(ch) => {
            setEvent({ key: 'channel', value: ch });
            setIsSettingChannel(false);
          }}
        />
      ) : (
        <></>
      )}
      <input
        id="event-name"
        className="input-flat input-title"
        type="text"
        placeholder="제목"
        value={event.title}
        onChange={(e) => setEvent({ key: 'title', value: e.target.value })}
      ></input>
      <div className="input-datetime-container">
        <label>시작</label>
        <DateTimePicker
          date={event.start_date}
          setDate={(date) => setEvent({ key: 'start_date', value: date })}
          time={event.has_time ? event.start_time : undefined}
          setTime={(time) => setEvent({ key: 'start_time', value: time })}
        />
      </div>
      <div className="input-datetime-container">
        <label>종료</label>
        <DateTimePicker
          date={event.due_date}
          setDate={(date) => setEvent({ key: 'due_date', value: date })}
          time={event.has_time ? event.due_time : undefined}
          setTime={(time) => setEvent({ key: 'due_time', value: time })}
        />
      </div>
      <div className="button-timeset">
        <label>하루 종일</label>
        <ToggleButton
          value={!event.has_time}
          sendValue={(value) => setEvent({ key: 'has_time', value: !value })}
        />
      </div>
      <textarea
        className="event-memo"
        value={event.memo ?? ''}
        onChange={(e) => setEvent({ key: 'memo', value: e.target.value })}
        placeholder="메모"
      ></textarea>
    </div>
  );
};
const AddEventModalButton = ({ addEvent }) => {
  return (
    <div>
      <hr />
      <button className="button-save" onClick={() => addEvent()}>
        저장하기
      </button>
    </div>
  );
};
const AddEventModal = ({ isActive, date, event: existingEvent }) => {
  const {
    value: { userInfo },
  } = useAuthContext();
  const { fetchEvents } = useCalendarContext();
  const today = new Date();
  const initialDate = date
    ? date
    : `${today.getFullYear()}-${(today.getMonth() + 1 + '').padStart(
        2,
        '0'
      )}-${(today.getDate() + '').padStart(2, '0')}`;
  const initialState = existingEvent
    ? {
        ...existingEvent,
        start_date: existingEvent.start_date.toISOString().substring(0, 10),
        due_date: existingEvent.due_date.toISOString().substring(0, 10),
        start_time: existingEvent.start_time
          ? existingEvent.start_time.substring(0, 5)
          : `${(((today.getHours() + 1) % 24) + '').padStart(2, '0')}:00`,
        due_time: existingEvent.due_time
          ? existingEvent.due_time.substring(0, 5)
          : `${(((today.getHours() + 2) % 24) + '').padStart(2, '0')}:00`,
      }
    : {
        channel: userInfo.my_channel,
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
    if (newEvent.memo === '') delete newEvent.memo;
    (existingEvent ? patchEvent : postEvent)(newEvent.channel, newEvent).then(
      (event) => {
        console.log(event);
        fetchEvents();
        isActive(false);
      }
    );
  };
  return (
    <Modal
      isActive={isActive}
      header={<AddEventModalHeader isModifying={!!existingEvent} />}
      content={<AddEventModalContent event={event} setEvent={setEvent} />}
      button={<AddEventModalButton addEvent={addEvent} />}
    ></Modal>
  );
};
export default AddEventModal;
