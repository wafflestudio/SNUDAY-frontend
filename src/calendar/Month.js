import { useEffect, useState } from 'react';
import { useCalendarContext } from 'context/CalendarContext';
import { useAuthContext } from '../context/AuthContext';
import Week from './Week';
import { getNumDaysofMonth } from 'Constants';
import sortBy from 'lodash-es/sortBy';
const Month = ({ year, monthIndex, channelList }) => {
  const { isFetching, getEvent, getMonthlyActiveEvents } = useCalendarContext();
  const {
    value: { disabled_channels },
  } = useAuthContext();
  const [monthlyActiveEvents, setMonthlyActiveEvents] = useState(undefined);
  const [posEvents, setPosEvents] = useState(null);
  const date = new Date(year, monthIndex);
  const startDate = 1 - date.getDay();
  const numWeeks = Math.ceil(
    (date.getDay() + getNumDaysofMonth(year, monthIndex)) / 7
  );

  useEffect(() => {
    document
      .getElementById(
        `${year}-${monthIndex}-${new Date().toLocaleDateString('ko-KR')}`
      )
      ?.classList.add('today');
  }, []);

  useEffect(() => {
    if (isFetching) return;
    //update events if there is an calendar update
    getMonthlyActiveEvents(year, monthIndex, channelList).then(
      (monthlyActiveEvents) => {
        // if(channel) monthActiveEvents = channelEvents.get(channel)
        setMonthlyActiveEvents(monthlyActiveEvents);
        console.log(monthlyActiveEvents);
      }
    );
  }, [isFetching, disabled_channels, year, monthIndex, channelList]);
  useEffect(() => {
    //update position if there is an event update
    //정렬 순서
    //1. 날짜 긴 순
    //2. 시작 시간 앞선 순
    //3. 이름 순
    let eventsOrder = [];
    const posEvents = new Map();
    const eventPositions = [];
    for (let i = 0; i < 32; i++) eventPositions.push([]);
    const eventsPeriod = new Map();
    monthlyActiveEvents?.eventsList.forEach((eventId) => {
      const event = getEvent(eventId);
      eventsPeriod.set(eventId, event?.getMonthlyInfo(year, monthIndex));
    });
    eventsOrder = sortBy(monthlyActiveEvents?.eventsList, [
      (id) => -eventsPeriod.get(id).len,
      (id) => getEvent(id).start,
      (id) => getEvent(id).title,
    ]);
    if (monthlyActiveEvents)
      eventsOrder.forEach((id) => {
        const { start, end } = eventsPeriod.get(id);
        const occupied = [];
        let pos = 0;
        for (let d = start; d <= end; d++)
          for (let i = 0; i < eventPositions[d].length; i++)
            if (eventPositions[d][i]) occupied[i] = true;
        for (; pos < occupied.length; pos++) if (!occupied[pos]) break;
        for (let d = start; d <= end; d++) eventPositions[d][pos] = id;
        posEvents.set(id, pos);
      });
    setPosEvents(posEvents);
    // console.log(monthlyActiveEvents);
    // console.log(eventsPeriod);
    // console.log(eventPositions);
    // console.log(posEvents);
    // console.log(eventsOrder.map((id) => getEvent(id)));
  }, [monthlyActiveEvents]);

  return (
    <div className="month">
      {[...Array(numWeeks).keys()].map((weekNo) => (
        <Week
          key={`${year}-${monthIndex}-${weekNo + 1}w`}
          year={year}
          monthIndex={monthIndex}
          day={startDate + 7 * weekNo}
          channelList={channelList}
          events={monthlyActiveEvents}
          eventPositions={posEvents}
        />
      ))}
    </div>
  );
};
export default Month;
