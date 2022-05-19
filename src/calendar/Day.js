import React, { useContext, useState } from 'react';
import { useCalendarContext } from 'context/CalendarContext';
import DayEventsModal from './DayEventsModal';
import EventBar from './EventBar';
import { getNumDaysofMonth } from 'Constants';
const Day = ({ year, monthIndex, day, channelId, events, eventPositions }) => {
  const date = new Date(year, monthIndex, day);
  const [showEvent, setShowEvent] = useState(false);
  const { calendar, setDay } = useCalendarContext();
  let dayClass = 'day';
  if (day < 1) dayClass += ' past';
  if (day > getNumDaysofMonth(year, monthIndex)) dayClass += ' next';
  const holiday = calendar.getHoliday(date);
  let dateClass = 'date';
  if (holiday) dateClass += ' holiday';
  //api/v1/channels/{channel_id}/events/?date=2021-03-16
  // console.log('events', date.getDate(), events);
  //event numbers
  let overflow = false;
  let dayEvents = events?.dailyEventsMap.get(date.getDate());
  if (dayEvents) {
    dayEvents = [...dayEvents];
    for (const e of dayEvents) {
      if (eventPositions.get(e) > 4) {
        overflow = true;
        break;
      }
    }
  }

  //events showing on display
  let showingDayEvents = dayEvents
    ? overflow
      ? dayEvents.filter((e) => eventPositions.get(e) < 4)
      : dayEvents
    : [];
  if (overflow && dayEvents?.length - showingDayEvents.length > 0)
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
      {day < 1 || day > getNumDaysofMonth(year, monthIndex) ? (
        <></>
      ) : (
        <>
          <div className={dateClass}>
            <span>{date.getDate()}</span>
            <span className="holiday"> {holiday}</span>
          </div>
          <div className="day-todo-box">
            {showingDayEvents.map((eventNo) => (
              <EventBar
                key={eventNo}
                eventNo={eventNo}
                date={date}
                pos={eventPositions.get(eventNo)}
              />
            ))}
            {overflow ? (
              <div
                className="eventbar"
                style={{
                  position: 'absolute',
                  transform: `translateY(${4 * 105}%)`,
                  color: 'black',
                }}
              >{`+${
                dayEvents.length - showingDayEvents.length - (overflow === 4)
              }개`}</div>
            ) : (
              <></>
            )}
          </div>
          {showEvent ? (
            <DayEventsModal
              isActive={setShowEvent}
              date={date}
              channelId={channelId}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};
export default Day;
