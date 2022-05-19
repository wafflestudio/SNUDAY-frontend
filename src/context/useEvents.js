import { getMyEvents } from 'API';
import { useEffect, useState } from 'react';
import {
  getNumDaysofMonth,
  toDateString,
  toTimeString,
  useUpdateLogger,
} from '../Constants';
export class Event {
  constructor(event) {
    if (event instanceof Event) {
      for (let [k, v] of Object.assign({}, event)) {
        this[k] = v;
        return;
      }
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

const useEvents = ({ year, monthIndex }) => {
  const [events, setEvents] = useState(new Map());
  const [newEvents, setNewEvents] = useState(new Map());
  const [isFetching, setIsFetching] = useState(false);
  const [monthlyEvents, setMonthlyEvents] = useState(null);
  const [channelEvents, setChannelEvents] = useState(null);
  useUpdateLogger('events', events);
  useUpdateLogger('monthlyEvents', monthlyEvents);
  useUpdateLogger('channelEvents', channelEvents);
  useUpdateLogger('newEvents', newEvents);
  useUpdateLogger('isFetching', isFetching);
  useEffect(() => {
    setIsFetching(() => (newEvents.size === 0 ? false : true));
  }, [newEvents]);
  useEffect(() => {
    console.log(year, monthIndex);
    getMyEvents(
      year && monthIndex ? { month: `${year}-${monthIndex + 1}` } : {}
    ).then((evts) => {
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
    });
  }, [year, monthIndex]);

  useEffect(() => {
    //update new events

    if (newEvents.size === 0) return;

    ////update monthlyEvents
    for (const [id, event] of newEvents) {
      if (events.has(id)) {
        //update event
        deleteEventFromMonthlyMap(event.id);
      } else {
        //add event
        // console.log('newEvent');
      }
      addEventToMonthlyMap(event);
    }

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
      for (const [id, event] of newEvents) {
        latestEvents.set(id, event);
      }
      return latestEvents;
    });

    ////empty queue
    setNewEvents(() => new Map());
  }, [newEvents]);

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
      let startDate =
        event.start.getMonth() === monthIndex ? event.start.getDate() : 1;
      let dueDate =
        event.end.getMonth() === monthIndex
          ? event.end.getDate()
          : getNumDaysofMonth(year, monthIndex);
      for (let date = startDate; date <= dueDate; date++) {
        thisMonthMap.get(date)?.delete(event.id);
      }
    }
    setMonthlyEvents(() => new Map(monthlyEvents));
  };

  const addEventToMonthlyMap = (event) => {
    setMonthlyEvents((prev) => {
      const newMonthlyEvents = new Map(prev);
      for (let [year, monthIndex] of Event.getMonths(event)) {
        if (!newMonthlyEvents.has(`${year}-${monthIndex}`)) {
          newMonthlyEvents.set(`${year}-${monthIndex}`, new Map());
        }
        const thisMonthMap = newMonthlyEvents.get(`${year}-${monthIndex}`);
        let startDate =
          event.start.getMonth() === monthIndex ? event.start.getDate() : 1;
        let dueDate =
          event.end.getMonth() === monthIndex
            ? event.end.getDate()
            : getNumDaysofMonth(year, monthIndex);
        for (let date = startDate; date <= dueDate; date++) {
          if (!thisMonthMap.has(date)) thisMonthMap.set(date, new Set());
          thisMonthMap.get(date).add(event.id);
        }
      }
      return newMonthlyEvents;
    });
  };
  return {
    events,
    monthlyEvents,
    channelEvents,
    isFetching,
    updateEvent,
    deleteEvent,
  };
};
export default useEvents;
