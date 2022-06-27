import { useState } from 'react';
import './DateTimePicker.css';
const DateTimePicker = ({ dateString, setDate, timeString, setTime }) => {
  let dateDate = new Date(dateString);
  let dateOptions = {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  };
  if (dateDate.getFullYear() !== new Date().getFullYear())
    dateOptions = { ...dateOptions, year: 'numeric' };
  return (
    <div className="input-datetime">
      {dateString ? (
        <div className="input-date-container">
          {dateDate.toLocaleDateString('ko-KR', dateOptions)}
          <input
            className="input-date"
            type="date"
            value={dateString}
            onChange={(e) => setDate(e.target.value)}
          ></input>
        </div>
      ) : (
        <></>
      )}
      {timeString ? (
        <div className="input-date-container">
          {timeString}
          <input
            className="input-time"
            type="time"
            value={timeString}
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
