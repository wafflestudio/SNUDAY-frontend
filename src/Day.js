import React, { useContext, useState } from 'react';
import CalendarContext from './context/CalendarContext';
import DayEventsModal from './DayEventsModal';
import EventBar from './EventBar';
const Day = ({ year, monthIndex, day }) => {
  const date = new Date(year, monthIndex, day);
  const [showEvent, setShowEvent] = useState(false);
  const { calendar, getNumDays, day: selectedDay, setDay } = useContext(
    CalendarContext
  );
  let dayClass = 'day';
  if (day < 1) dayClass += ' past';
  if (day > getNumDays(year, monthIndex)) dayClass += ' next';
  const holiday = calendar.getHoliday(date);
  let dateClass = 'date';
  if (holiday) dateClass += ' holiday';

  //api/v1/channels/{channel_id}/events/?date=2021-03-16
  return (
    <div
      id={`${year}-${monthIndex}-${date.toLocaleDateString('ko-KR')}`}
      className={dayClass}
      onClick={() => {
        if (day !== selectedDay) {
          setDay(day);
        }
        setShowEvent(true);
      }}
    >
      <div className={dateClass}>
        <span>
          {date.getDate()} {holiday}
        </span>
      </div>
      <div className='day-todo-box'>
        <EventBar />
      </div>
      {showEvent ? (
        <DayEventsModal isActive={setShowEvent} date={date} />
      ) : (
        <></>
      )}
    </div>
  );
};
export default Day;
