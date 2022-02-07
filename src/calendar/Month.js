import { useEffect, useState } from 'react';
import { useCalendarContext } from 'context/CalendarContext';
import Week from './Week';
const Month = ({ year, monthIndex, channel }) => {
  const date = new Date(year, monthIndex);
  const startDate = 1 - date.getDay();
  const getNumDays = (year, monthIndex) => {
    return 32 - new Date(year, monthIndex, 32).getDate();
  };
  const numWeeks = Math.ceil(
    (date.getDay() + getNumDays(year, monthIndex)) / 7
  );
  const {
    monthEvents,
    channelEvents,
    getEvent,
    getMonthActiveEvents,
    getDateLength,
    disabledChannels,
  } = useCalendarContext();
  const [monthActiveEvents, setActiveMonthEvents] = useState(undefined);
  const [posEvents, setPosEvents] = useState(new Map());
  useEffect(() => {
    console.log(channel);
    let monthActiveEvents = getMonthActiveEvents(year, monthIndex, channel);
    // if(channel) monthActiveEvents = channelEvents.get(channel)
    setActiveMonthEvents(monthActiveEvents);
    console.log(monthActiveEvents);
  }, [monthEvents, disabledChannels]);
  useEffect(() => {
    const eventsOrder = new Map();
    const occupiedPos = new Map();
    const posEvents = new Map();

    monthActiveEvents?.eventsList
      .sort(
        (a, b) =>
          getDateLength(getEvent(b).start_date, getEvent(b).due_date) -
          getDateLength(getEvent(a).start_date, getEvent(a).due_date)
      )
      .forEach((id, idx) => eventsOrder.set(id, idx));
    console.log(eventsOrder);
    if (monthActiveEvents)
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
    // [...monthActiveEvents.dayEventsMap.entries()]
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
    setPosEvents(() => posEvents);
  }, [monthActiveEvents]);
  useEffect(() => {
    document
      .getElementById(
        `${year}-${monthIndex}-${new Date().toLocaleDateString('ko-KR')}`
      )
      ?.classList.add('today');
  }, []);
  return (
    <div className="month">
      {[...Array(numWeeks).keys()].map((weekNo) => (
        <Week
          key={`${year}-${monthIndex}-${weekNo}w`}
          year={year}
          monthIndex={monthIndex}
          day={startDate + 7 * weekNo}
          events={monthActiveEvents}
          eventPositions={posEvents}
        />
      ))}
    </div>
  );
};
export default Month;
