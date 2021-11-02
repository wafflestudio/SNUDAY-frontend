import React, { useContext, useState } from 'react';
import { useCalendarContext } from 'context/CalendarContext';
import DayEventsModal from './DayEventsModal';
import EventBar from './EventBar';
const Day = ({ events, eventPositions, year, monthIndex, day }) => {
  const date = new Date(year, monthIndex, day);
  const [showEvent, setShowEvent] = useState(false);
  const { calendar, getNumDays, setDay } = useCalendarContext();
  let dayClass = 'day';
  if (day < 1) dayClass += ' past';
  if (day > getNumDays(year, monthIndex)) dayClass += ' next';
  const holiday = calendar.getHoliday(date);
  let dateClass = 'date';
  if (holiday) dateClass += ' holiday';
  //api/v1/channels/{channel_id}/events/?date=2021-03-16
  const { getMonthEvents } = useCalendarContext();
  // console.log('events', date.getDate(), events);
  let dayEvents = events?.dayEventsMap.get(date.getDate());
  let maxPos = 0;
  let showingDayEvents = dayEvents
    ? [...dayEvents].filter((e) => {
        if (eventPositions.get(e) === 4) maxPos = 4;
        return eventPositions.get(e) < 5;
      })
    : [];
  if (maxPos === 4 && dayEvents?.length - showingDayEvents.length > 0)
    showingDayEvents.slice(0, -1);
  //const dayEvents = getMonthEvents(date.getMonth()).get(date.getDate());
  // const dayEvents =
  //   events instanceof Map
  //     ? events.get(date.getDate())
  //     : getMonthEvents(date.getMonth()).get(date.getDate());
  return (
    <div
      id={`${year}-${monthIndex}-${date.toLocaleDateString('ko-KR')}`}
      className={dayClass}
      onClick={(e) => {
        setDay(day);
        setShowEvent(true);
      }}
    >
      <div className={dateClass}>
        <span>{date.getDate()}</span>
        <span className="holiday"> {holiday}</span>
      </div>
      <div className="day-todo-box">
        {showingDayEvents.map((eventNo) => (
          <EventBar
            eventNo={eventNo}
            date={date}
            pos={eventPositions.get(eventNo)}
          />
        ))}
        {dayEvents && dayEvents.length - showingDayEvents.length > 0 ? (
          <div className="eventbar" style={{ color: 'black' }}>{`+${
            dayEvents.length - showingDayEvents.length - (maxPos === 4)
          }개...`}</div>
        ) : (
          <></>
        )}
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
