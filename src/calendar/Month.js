import { useEffect, useState } from 'react';
import { useCalendarContext } from 'context/CalendarContext';
import Week from './Week';
const Month = ({ year, monthIndex, channelId }) => {
  const {
    monthEvents,
    getEvent,
    getMonthlyActiveEvents,
    getDateLength,
    disabledChannels,
    getNumDays,
  } = useCalendarContext();
  const [monthlyActiveEvents, setMonthlyActiveEvents] = useState(undefined);
  const [posEvents, setPosEvents] = useState(null);
  const date = new Date(year, monthIndex);
  const startDate = 1 - date.getDay();
  const numWeeks = Math.ceil(
    (date.getDay() + getNumDays(year, monthIndex)) / 7
  );

  useEffect(() => {
    document
      .getElementById(
        `${year}-${monthIndex}-${new Date().toLocaleDateString('ko-KR')}`
      )
      ?.classList.add('today');
  }, []);

  useEffect(() => {
    //update events if there is an calendar update
    getMonthlyActiveEvents(year, monthIndex, channelId).then(
      (monthlyActiveEvents) => {
        // if(channel) monthActiveEvents = channelEvents.get(channel)
        setMonthlyActiveEvents(monthlyActiveEvents);
        console.log(monthlyActiveEvents);
      }
    );
  }, [monthEvents, disabledChannels]);

  useEffect(() => {
    //update position if there is an event update
    const eventsOrder = new Map();
    const occupiedPos = new Map();
    const posEvents = new Map();
    //[id,start,end]
    const eventsPeriod = new Map();
    monthlyActiveEvents?.eventsList.forEach((eventId) => {
      const start =
        getEvent(eventId).start_date.getMonth() !== monthIndex
          ? 1
          : getEvent(eventId).start_date.getDate();
      const end =
        getEvent(eventId).due_date.getMonth() !== monthIndex
          ? getNumDays(year, monthIndex)
          : getEvent(eventId).due_date.getDate();

      eventsPeriod.set(eventId, [start, end, end - start]);
    });

    monthlyActiveEvents?.eventsList
      .sort(
        //이번 달의 기간으로 정렬
        (a, b) => eventsPeriod.get(b)[2] - eventsPeriod.get(a)[2]
        // getDateLength(getEvent(b).start_date, getEvent(b).due_date) -
        // getDateLength(getEvent(a).start_date, getEvent(a).due_date)
      )
      .forEach((id, idx) => eventsOrder.set(id, idx));
    console.log('events order:', eventsOrder);
    if (monthlyActiveEvents)
      [...eventsOrder.keys()].forEach((id) => {
        if (!posEvents.get(id)) {
          let excludedPos = occupiedPos.get(getEvent(id).start_date.getDate());
          if (!excludedPos) excludedPos = [];
          let pos = 0;
          while (excludedPos.includes(pos)) pos++;
          posEvents.set(id, pos);
          const start =
            getEvent(id).start_date.getMonth() !== monthIndex
              ? 1
              : getEvent(id).start_date.getDate();
          const end =
            getEvent(id).due_date.getMonth() !== monthIndex
              ? getNumDays(year, monthIndex)
              : getEvent(id).due_date.getDate();
          for (let d = start; d <= end; d++)
            occupiedPos.set(d, [...excludedPos, pos]);
        }
      });
    // [...monthActiveEvents.dailyEventsMap.entries()]
    //   ?.sort((a, b) => b.length - a.length)
    //   ?.forEach((d) => {
    //     const idx = Array.from(new Array(d[1].size), (x, i) => i);
    //     d[1].forEach((id) => {
    //       if (posEvents.get(id)) idx.splice(posEvents.get(id), 1);
    //     });
    //     [...d[1]]
    //       .sort((a, b) => eventsOrder.get(a) - eventsOrder.get(b))
    //       .forEach((id) => {
    //         if (!posEvents.get(id)) posEvents.set(id, idx.shift());
    //       });
    //   });
    setPosEvents(posEvents);
  }, [monthlyActiveEvents]);

  return (
    <div className="month">
      {[...Array(numWeeks).keys()].map((weekNo) => (
        <Week
          key={`${year}-${monthIndex}-${weekNo + 1}w`}
          year={year}
          monthIndex={monthIndex}
          day={startDate + 7 * weekNo}
          channelId={channelId}
          events={monthlyActiveEvents}
          eventPositions={posEvents}
        />
      ))}
    </div>
  );
};
export default Month;
