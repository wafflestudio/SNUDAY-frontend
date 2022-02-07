import { useState } from 'react';
import 'calendar/EventBar.css';
import { EventModal } from 'calendar/Event';
import { useCalendarContext } from 'context/CalendarContext';
import { COLORS } from 'Constants';
const EventBar = ({ eventNo, color, date, pos }) => {
  const [showEvent, setShowEvent] = useState(false);
  const { getEvent, getDateLength, channelColors } = useCalendarContext();
  let e;
  if (Number.isInteger(eventNo)) {
    e = getEvent(eventNo);
  }
  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  //first day of the month
  const FIRST_DAY = new Date(date.getFullYear(), date.getMonth(), 1);
  const THIS_SUNDAY = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay()
  );
  const THIS_SATURDAY = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay() + 6
  );
  //date: start date of this eventbar
  const firstDate = //start date of the event
    isSameDate(date, THIS_SUNDAY) && date > e.start_date
      ? date
      : new Date(
          e.start_date.getFullYear(),
          e.start_date.getMonth(),
          e.start_date.getDate()
        );
  const lastDate = //end date of the event
    !isSameDate(THIS_SATURDAY, e.due_date) && e.due_date < THIS_SATURDAY
      ? new Date(
          e.due_date.getFullYear(),
          e.due_date.getMonth(),
          e.due_date.getDate()
        )
      : THIS_SATURDAY;

  const isStart = isSameDate(e.start_date, date);
  const isEnd = isSameDate(e.due_date, lastDate);
  if (
    !(isStart || isSameDate(date, THIS_SUNDAY) || isSameDate(date, FIRST_DAY))
  ) {
    // console.log(e, date, 'not showing');
    return <></>;
  }

  let className = 'eventbar';
  if (isStart) className += ' start';
  if (isEnd) className += ' end';
  return (
    <>
      <div
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          setShowEvent(true);
          console.log(e.target);
        }}
        style={{
          position: 'absolute',
          width: 100 * getDateLength(date, lastDate) + '%',
          backgroundColor: COLORS[channelColors?.get(e.channel)],
          transform: `translateY(${pos * 105}%)`,
        }}
      >
        {e?.title}
      </div>
      {showEvent ? <EventModal isActive={setShowEvent} event={e} /> : <></>}
    </>
  );
};
export default EventBar;
