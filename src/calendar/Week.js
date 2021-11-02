import { useCalendarContext } from 'context/CalendarContext';
import Day from './Day';
const Week = ({ year, monthIndex, day, events, eventPositions }) => {
  const monthStart = 1 - new Date(year, monthIndex).getDay();
  const date = new Date(year, monthIndex, day);
  const startDate = day - date.getDay();
  // const { getMonthEvents } = useCalendarContext();
  // events = events ?? getMonthEvents(year, monthIndex);
  return (
    <div className="week">
      {[...Array(7).keys()].map((weekday) => (
        <Day
          key={`${year}-${monthIndex}-${startDate + weekday}`}
          year={year}
          monthIndex={monthIndex}
          day={startDate + weekday}
          events={events}
          eventPositions={eventPositions}
        />
      ))}
    </div>
  );
};
export default Week;
