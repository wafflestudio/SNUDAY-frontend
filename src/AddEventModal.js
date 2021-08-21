import { useState, useEffect, useReducer } from 'react';
import { postEvents } from './API';
import { useAuthContext } from './context/AuthContext';
import DateTimePicker from './DateTimePicker';
import Modal from './Modal';
import ToggleButton from './ToggleButton';
const AddEventModalHeader = () => {
  return (
    <>
      <h3 className="title">새로운 일정</h3>
    </>
  );
};
const AddEventModalContent = ({ event, setEvent }) => {
  return (
    <div className="event-input-container">
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
          date={event.startDate}
          setDate={(date) => setEvent({ key: 'startDate', value: date })}
          time={event.allDay ? undefined : event.startTime}
          setTime={(time) => setEvent({ key: 'startTime', value: time })}
        />
      </div>
      <div className="input-datetime-container">
        <label>종료</label>
        <DateTimePicker
          date={event.endDate}
          setDate={(date) => setEvent({ key: 'endDate', value: date })}
          time={event.allDay ? undefined : event.endTime}
          setTime={(time) => setEvent({ key: 'endTime', value: time })}
        />
      </div>
      <div className="button-timeset">
        <label>하루 종일</label>
        <ToggleButton
          value={event.allDay}
          sendValue={(value) => setEvent({ key: 'allDay', value })}
        />
      </div>
      <textarea
        className="event-memo"
        value={event.memo}
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
const AddEventModal = ({ isActive, date }) => {
  const {
    value: { userInfo },
  } = useAuthContext();
  console.log(userInfo);
  const today = new Date();
  const initialDate = date
    ? date
    : `${today.getFullYear()}-${(today.getMonth() + 1 + '').padStart(
        2,
        '0'
      )}-${(today.getDate() + '').padStart(2, '0')}`;
  const initialState = {
    title: '',
    allDay: false,
    startDate: initialDate,
    startTime: `${(((today.getHours() + 1) % 24) + '').padStart(2, '0')}:00`,
    endDate: initialDate,
    endTime: `${(((today.getHours() + 2) % 24) + '').padStart(2, '0')}:00`,
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
    if (new Date(event.startDate) > new Date(event.endDate))
      setEvent({ key: 'endDate', value: event.startDate });
  }, [event.startDate]);
  useEffect(() => {
    if (new Date(event.startDate) > new Date(event.endDate))
      setEvent({ key: 'startDate', value: event.endDate });
  }, [event.endDate]);
  useEffect(() => {
    if (event.startDate === event.endDate && event.startTime > event.endTime)
      setEvent({ key: 'endTime', value: event.startTime });
  }, [event.startTime]);
  useEffect(() => {
    if (event.startDate === event.endDate && event.startTime > event.endTime)
      setEvent({ key: 'startTime', value: event.endTime });
  }, [event.endTime]);
  const addEvent = () => {
    if (event.title === '') setEvent({ key: 'title', value: '새 일정' });
    let newEvent = {
      ...event,
      title: event.title === '' ? '새 일정' : event.title,
    };
    delete Object.assign(newEvent, { has_time: !event.allDay }).allDay;
    delete Object.assign(newEvent, { start_date: event.startDate }).startDate;
    delete Object.assign(newEvent, { start_time: event.startTime }).startTime;
    delete Object.assign(newEvent, { due_date: event.endDate }).endDate;
    delete Object.assign(newEvent, { due_time: event.endTime }).endTime;
    delete Object.assign(newEvent, { memo: event.memo ?? null }).memo;

    postEvents(userInfo.my_channel, newEvent).then(console.log);
  };
  return (
    <Modal
      isActive={isActive}
      header={<AddEventModalHeader />}
      content={<AddEventModalContent event={event} setEvent={setEvent} />}
      button={<AddEventModalButton addEvent={addEvent} />}
    ></Modal>
  );
};
export default AddEventModal;
