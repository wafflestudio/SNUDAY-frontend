import { useState, useEffect } from 'react';
import DateTimePicker from './DateTimePicker';
import Modal from './Modal';
import ToggleButton from './ToggleButton';
const AddEventModalHeader = () => {
  return (
    <h3 className='title'>
      새로운 일정
      <hr />
    </h3>
  );
};
const AddEventModalContent = ({ date }) => {
  const today = new Date();
  const [title, setTitle] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState(
    date
      ? date
      : `${today.getFullYear()}-${(today.getMonth() + 1 + '').padStart(
          2,
          '0'
        )}-${(today.getDate() + '').padStart(2, '0')}`
  );
  const [startTime, setStartTime] = useState(
    `${(today.getHours() + 1 + '').padStart(2, '0')}:00`
  );
  const [endDate, setEndDate] = useState(startDate);
  const [endTime, setEndTime] = useState(
    `${(today.getHours() + 2 + '').padStart(2, '0')}:00`
  );
  useEffect(() => {
    if (new Date(startDate) > new Date(endDate)) setEndDate(() => startDate);
  }, [startDate]);
  useEffect(() => {
    if (new Date(startDate) > new Date(endDate)) setStartDate(() => endDate);
  }, [endDate]);
  useEffect(() => {
    if (startDate === endDate && startTime > endTime)
      setEndTime(() => startTime);
  }, [startTime]);
  useEffect(() => {
    if (startDate === endDate && startTime > endTime)
      setStartTime(() => endTime);
  }, [endTime]);
  return (
    <div className='event-input-container'>
      <input
        className='input-flat input-title'
        type='text'
        placeholder='제목'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <div className='input-datetime-container'>
        <label>시작</label>
        <DateTimePicker
          date={startDate}
          setDate={setStartDate}
          time={allDay ? undefined : startTime}
          setTime={setStartTime}
        />
      </div>
      <div className='input-datetime-container'>
        <label>종료</label>
        <DateTimePicker
          date={endDate}
          setDate={setEndDate}
          time={allDay ? undefined : endTime}
          setTime={setEndTime}
        />
      </div>
      <div className='button-timeset'>
        <label>하루 종일</label>
        <ToggleButton value={allDay} sendValue={setAllDay} />
      </div>
      <textarea className='event-memo' placeholder='메모'></textarea>
    </div>
  );
};
const AddEventModalButton = () => {
  return (
    <div>
      <hr />
      <button className='button-save'>저장하기</button>
    </div>
  );
};
const AddEventModal = ({ isActive }) => {
  return (
    <Modal
      isActive={isActive}
      header={<AddEventModalHeader />}
      content={<AddEventModalContent />}
      button={<AddEventModalButton />}
    ></Modal>
  );
};
export default AddEventModal;
