import { useState } from 'react';
import 'calendar/EventBar.css';
import { EventModal } from 'calendar/Event';
import { useCalendarContext } from 'context/CalendarContext';
import {
  COLORS,
  getDateLength,
  getNumDaysofMonth,
  isSameDate,
} from 'Constants';
const EventBar = ({ eventNo, color, date, pos }) => {
  const [showEvent, setShowEvent] = useState(false);
  const { getEvent, channelColors } = useCalendarContext();
  let e;
  if (Number.isInteger(eventNo)) {
    e = getEvent(eventNo);
  }
  if (!e) return <></>;
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
  const LAST_DAY_OF_THE_MONTH = new Date(
    date.getFullYear(),
    date.getMonth(),
    getNumDaysofMonth(date.getFullYear(), date.getMonth())
  );
  //date: start date of this eventbar
  const firstDate = //start date of the event
    isSameDate(date, THIS_SUNDAY) && date > e.start
      ? date
      : new Date(e.start.getFullYear(), e.start.getMonth(), e.start.getDate());
  const maxDate =
    THIS_SATURDAY < LAST_DAY_OF_THE_MONTH
      ? THIS_SATURDAY
      : LAST_DAY_OF_THE_MONTH;
  const lastDate = //end date of the bar
    !isSameDate(maxDate, e.end) && e.end < maxDate
      ? new Date(e.end.getFullYear(), e.end.getMonth(), e.end.getDate())
      : maxDate;
  //determine round edge of the bar
  const isStart = isSameDate(e.start, date);
  const isEnd = isSameDate(e.end, lastDate);
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
          width: 100 * Math.min(getDateLength(date, lastDate)) + '%',
          backgroundColor:
            COLORS[channelColors?.get(e.channel)] ??
            channelColors?.get(e.channel),
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
