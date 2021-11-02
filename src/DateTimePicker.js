import { useState } from 'react';
import './DateTimePicker.css';
const DateTimePicker = ({ date, setDate, time, setTime }) => {
  let dateDate = new Date(date);
  let dateOptions = {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  };
  if (dateDate.getFullYear() !== new Date().getFullYear())
    dateOptions = { ...dateOptions, year: 'numeric' };
  return (
    <div className='input-datetime'>
      {date ? (
        <div className='input-date-container'>
          {dateDate.toLocaleDateString('ko-KR', dateOptions)}
          <input
            className='input-date'
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          ></input>
        </div>
      ) : (
        <></>
      )}
      {time ? (
        <div className='input-date-container'>
          {time}
          <input
            className='input-time'
            type='time'
            value={time}
            onChange={(e) => setTime(e.target.value)}
          ></input>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default DateTimePicker;
