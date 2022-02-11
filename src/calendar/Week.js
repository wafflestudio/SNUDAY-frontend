import { useCalendarContext } from 'context/CalendarContext';
import Day from './Day';
const Week = ({ year, monthIndex, day, channelId, events, eventPositions }) => {
  let date = new Date();
  if (year === undefined) {
    year = date.getFullYear();
    if (monthIndex === undefined) {
      if (day === undefined) {
        monthIndex = date.getMonth();
        day = date.getDate();
      } else {
        monthIndex = 0;
      }
    } else if (day === undefined) day = 1;
  } else {
    if (monthIndex === undefined) monthIndex = 0;
    if (day === undefined) day = 1;
  }
  date = new Date(year, monthIndex, day);
  const startDayOfWeek = day - date.getDay();
  // const { getMonthEvents } = useCalendarContext();
  // events = events ?? getMonthEvents(year, monthIndex);
  return (
    <div className="week">
      {[...Array(7).keys()].map((weekday) => (
        <Day
          key={`${year}-${monthIndex}-${startDayOfWeek + weekday}`}
          year={year}
          monthIndex={monthIndex}
          day={startDayOfWeek + weekday}
          channelId={channelId}
          events={events}
          eventPositions={eventPositions}
        />
      ))}
    </div>
  );
};
export default Week;
