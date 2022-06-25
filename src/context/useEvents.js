import { getChannelEvents, getMyEvents } from 'API';
import { useEffect, useState } from 'react';
import {
  getNumDaysofMonth,
  toDateString,
  toTimeString,
  useUpdateLogger,
  CHANNEL_HOLIDAYS,
} from '../Constants';
import { useAuthContext } from './AuthContext';
export class Event {
  constructor(event) {
    if (event instanceof Event)
      for (let [k, v] of Object.assign({}, event)) {
        this[k] = v;
        return;
      }

    this.id = event.id;
    this.title = event.title;
    this.memo = event.memo;
    this.channel = event.channel;
    this.channelName = event.channel_name;
    this.createdAt = new Date(event.created_at);
    this.updatedAt = new Date(event.updated_at);
    this.createdBy = event.writer;
    this.start = new Date(
      event.has_time
        ? event.start_date + 'T' + event.start_time + '+09:00'
        : event.start_date + 'T00:00:00+09:00' //new Date(...event.start_date.split('-'))
    );
    this.end = new Date(
      event.has_time
        ? event.due_date + 'T' + event.due_time + '+09:00'
        : event.due_date + 'T23:59:59+09:00'
    );
    this.isAllDay = !event.has_time;
  }
  getMonthlyInfo(year, monthIndex) {
    if (
      year < this.start.getFullYear() ||
      (year === this.start.getFullYear() && monthIndex < this.start.getMonth())
    )
      return { start: undefined, end: undefined, len: 0 };
    if (
      year > this.end.getFullYear() ||
      (year === this.end.getFullYear() && monthIndex > this.end.getMonth())
    )
      return { start: undefined, end: undefined, len: 0 };

    let start, end;

    if (year > this.start.getFullYear() || monthIndex > this.start.getMonth())
      start = 1;
    else start = this.start.getDate();

    if (year < this.end.getFullYear() || monthIndex < this.end.getMonth())
      end = getNumDaysofMonth(year, monthIndex);
    else end = this.end.getDate();

    // start = this.start.getMonth() !== monthIndex ? 1 : this.start.getDate();
    // end =
    //   this.end.getMonth() !== monthIndex
    //     ? getNumDaysofMonth(year, monthIndex)
    //     : this.end.getDate();
    return { start, end, len: end - start + 1 };
  }
  static getMonths(event) {
    let startYear = event.start.getFullYear();
    let startMonth = event.start.getMonth();
    const endYear = event.end.getFullYear();
    const endMonth = event.end.getMonth();
    return (function* () {
      while (startYear !== endYear || startMonth !== endMonth) {
        yield [startYear, startMonth];
        startMonth++;
        if (startMonth === 12) {
          startMonth = 0;
          startYear++;
        }
      }
      yield [endYear, endMonth];
    })();
  }
  toObject() {
    return {
      id: this.id,
      title: this.title,
      memo: this.memo,
      channel: this.channel,
      channel_name: this.channelName,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      writer: this.createdBy,
      start_date: toDateString(this.start),
      start_time: toTimeString(this.start),
      due_date: toDateString(this.end),
      due_time: toTimeString(this.end),
      has_time: !this.isAllDay,
    };
  }
}

const useEvents = ({ year, monthIndex, channelList }) => {
  const [events, setEvents] = useState(new Map());
  const [newEvents, setNewEvents] = useState(new Map());
  const [isFetching, setIsFetching] = useState(false);
  const [monthlyEvents, setMonthlyEvents] = useState(null);
  const [channelEvents, setChannelEvents] = useState(null);
  const {
    value: { isLoggedIn, default_channels },
  } = useAuthContext();
  console.log(default_channels);
  useUpdateLogger('events', events);
  useUpdateLogger('monthlyEvents', monthlyEvents);
  useUpdateLogger('channelEvents', channelEvents);
  useUpdateLogger('newEvents', newEvents);
  useUpdateLogger('isFetching', isFetching);

  const filterNewEvents = (evts) => {
    evts = evts.map((event) => new Event(event));
    const freshEvents = [];
    for (const event of evts) {
      if (event.updatedAt === events?.get(event.id)?.updatedAt) continue;
      freshEvents.push(event);
    }
    setNewEvents((prev) => {
      const curr = new Map(prev);
      freshEvents.forEach((e) => curr.set(e.id, e));
      return curr;
    });
    //FIX: deleted event???
  };

  useEffect(() => {
    setIsFetching(() => (newEvents.size === 0 ? false : true));
  }, [newEvents]);
  useEffect(() => {
    const month =
      year !== undefined && monthIndex !== undefined
        ? `${year}-${monthIndex + 1}`
        : '';
    console.log(year, monthIndex, month);
    if (channelList) {
      Promise.all(
        channelList.map((channelId) => getChannelEvents({ channelId, month }))
      ).then((eventsArray) =>
        filterNewEvents(
          eventsArray.reduce(
            (first, second) => first.concat(second.results),
            []
          )
        )
      );
      return;
    }
    if (isLoggedIn)
      getMyEvents({ month }).then((events) => filterNewEvents(events));
    else
      Promise.all(
        [...default_channels].map((channelId) =>
          getChannelEvents({ channelId, month })
        )
      ).then((eventsArray) =>
        filterNewEvents(
          eventsArray.reduce(
            (first, second) => first.concat(second.results),
            []
          )
        )
      );
  }, [year, monthIndex]);

  useEffect(() => {
    //update new events

    if (newEvents.size === 0) return;

    ////update monthlyEvents
    for (const [id, event] of newEvents)
      if (events.has(id)) deleteEventFromMonthlyMap(event.id);
    addEventsToMonthlyMap([...newEvents.values()]);
    ////update channelEvents
    setChannelEvents((channelEvents) => {
      const newChannelEvents = new Map(channelEvents);
      for (const [id, event] of newEvents) {
        if (!newChannelEvents.has(event.channel))
          newChannelEvents.set(event.channel, new Set());
        newChannelEvents.get(event.channel).add(id);
      }
      return newChannelEvents;
    });

    ////add ${newEvents} to ${events}
    setEvents((events) => {
      const latestEvents = new Map(events);
      for (const [id, event] of newEvents) latestEvents.set(id, event);

      return latestEvents;
    });

    ////empty queue
    setNewEvents(() => new Map());
  }, [newEvents]);
  const getEvent = (id) => events.get(id);
  const getMonthlyEvents = () => {
    //프로미스로 해보기
    // await fetchMonthlyEvents({ month: `${year}-${monthIndex + 1}` });
    console.log(year, monthIndex, channelList);

    // console.log(monthEvents);
    const monthEvents = monthlyEvents.get(`${year}-${monthIndex}`);
    if (!monthEvents) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!');
      return undefined;
    }
    let activeChannelEvents = []; //list of event IDs of active channels
    //get all monthly active events
    activeChannelEvents = new Map(channelEvents);
    activeChannelEvents = [...activeChannelEvents.values()].reduce(
      (prev, curr) => [...prev, ...curr],
      []
    );

    console.log('activeChannelEvents', activeChannelEvents);
    const activeMonthlyEvents = new Map();
    for (let [day, events] of monthEvents) {
      activeMonthlyEvents.set(
        day,
        new Set([...events].filter((e) => activeChannelEvents?.includes(e)))
      );
    }
    return {
      eventsList: [
        ...new Set(
          [...activeMonthlyEvents.values()].reduce(
            (prev, curr) => [...prev, ...curr],
            []
          )
        ),
      ],
      dailyEventsMap: activeMonthlyEvents,
    };
  };
  const updateEvent = (event) => {
    //update single event directly
    setNewEvents((prev) => {
      const curr = new Map(prev);
      curr.set(event.id, event);
      return curr;
    });
  };

  const deleteEvent = (event) => {
    setIsFetching(() => true);
    deleteEventFromMonthlyMap(event.id);
    setChannelEvents((channelEvents) => {
      const newChannelEvents = channelEvents;
      newChannelEvents.get(event.channel)?.delete(event.id);
      return newChannelEvents;
    });
    setEvents((events) => {
      const newEvents = new Map(events);
      newEvents.delete(event.id);
      return newEvents;
    });
    setIsFetching(() => false);
  };

  const deleteEventFromMonthlyMap = (id) => {
    const event = events.get(id);
    if (!event) {
      console.error(
        `useEvents: Invalid event. Cannot delete event. event: ${event}`
      );
      return;
    }
    //delete event in monthlyMap
    for (let [year, monthIndex] of Event.getMonths(event)) {
      const thisMonthMap = monthlyEvents.get(`${year}-${monthIndex}`);
      if (!thisMonthMap) continue;
      const { start, end } = event.getMonthlyInfo(year, monthIndex);
      for (let date = start; date <= end; date++)
        thisMonthMap.get(date)?.delete(event.id);
    }
    setMonthlyEvents(() => new Map(monthlyEvents));
  };

  const addEventsToMonthlyMap = (events) => {
    const newMonthlyEvents = new Map(monthlyEvents);
    console.log(events);
    events.forEach((event) => addEventToMonthlyMap(event, newMonthlyEvents));
    setMonthlyEvents(newMonthlyEvents);
  };
  const addEventToMonthlyMap = (event, newMonthlyEvents) => {
    for (let [year, monthIndex] of Event.getMonths(event)) {
      if (!newMonthlyEvents.has(`${year}-${monthIndex}`))
        newMonthlyEvents.set(`${year}-${monthIndex}`, new Map());

      const thisMonthMap = newMonthlyEvents.get(`${year}-${monthIndex}`);

      const { start, end } = event.getMonthlyInfo(year, monthIndex);
      for (let date = start; date <= end; date++) {
        if (!thisMonthMap.has(date)) thisMonthMap.set(date, new Set());
        thisMonthMap.get(date).add(event.id);
      }
    }
  };
  const isHoliday = (date) => {
    if (!channelEvents || !monthlyEvents) return;
    const holidays = channelEvents.get(CHANNEL_HOLIDAYS);
    if (!holidays) return;
    const events = monthlyEvents
      .get(`${date.getFullYear()}-${date.getMonth()}`)
      ?.get(date.getDate());
    if (!events) return;
    for (const event of events) if (holidays.has(event)) return true;

    return false;
  };
  return {
    events,
    monthlyEvents,
    channelEvents,
    isFetching,
    isHoliday,
    getEvent,
    getMonthlyEvents,
    updateEvent,
    deleteEvent,
  };
};
export default useEvents;
