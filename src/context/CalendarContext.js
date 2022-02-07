import React, { useContext, useEffect, useState } from 'react';
import { getMyEvents } from '../API';
import { useAuthContext } from './AuthContext';
import { Calendar } from '../calendar/cal';
import { COLORS } from '../Constants';
const CalendarContext = React.createContext({
  getNumDays: () => {},
  day: null,
  setDay: () => {},
  calendar: null,
  events: null,
  fetchEvents: () => {},
});
export const CalendarContextProvider = ({ value, children }) => {
  const [events, setEvents] = useState(undefined);
  const [isFetching, setIsFetching] = useState(true);
  const [monthEvents, setMonthEvents] = useState(new Map());
  const [channelEvents, setChannelEvents] = useState(new Map());
  const [disabledChannels, setDisabledChannels] = useState([]);
  const [channelColors, setChannelColors] = useState(undefined);
  const {
    value: { userInfo },
  } = useAuthContext();
  const getNumDays = (year, month) => {
    return 32 - new Date(year, month, 32).getDate();
  };
  useEffect(() => {
    if (!userInfo) return;
    const colors = Object.keys(COLORS);
    const savedColors = localStorage.getItem('channelColors');
    console.log('savedColors', savedColors);
    if (savedColors) {
      const presetColors = new Map(JSON.parse(savedColors));
      userInfo?.subscribing_channels.forEach((channel, index) => {
        if (!presetColors.has(channel))
          presetColors.set(
            channel,
            colors[Math.floor(Math.random() * colors.length)]
          );
      });
      setChannelColors(presetColors);
      localStorage.setItem('channelColors', JSON.stringify([...presetColors]));
    } else {
      const presetColors = new Map();
      userInfo?.subscribing_channels.forEach((channel, index) =>
        presetColors.set(channel, colors[index % colors.length])
      );
      setChannelColors(presetColors);
      localStorage.setItem('channelColors', JSON.stringify([...presetColors]));
      console.log(presetColors);
    }
  }, [userInfo?.subscribing_channels]);
  const setChannelColor = (channel, color) => {
    const newColors = new Map([...channelColors, [channel, color]]);
    setChannelColors((prev) => newColors);
    localStorage.setItem('channelColors', JSON.stringify([...newColors]));
  };
  useEffect(() => {
    fetchEvents();
  }, [userInfo]);
  useEffect(() => {
    console.log(events);
    fetchMonthEvents();
    fetchChannelEvents();
    setIsFetching(false);
  }, [events]);

  //fetch map of all events
  const fetchEvents = () => {
    setIsFetching(true);
    setMonthEvents(new Map());
    setChannelEvents(new Map());
    const newEvents = new Map();
    getMyEvents()
      .then((evts) => {
        console.log('events:', evts);
        evts.forEach((ev) =>
          newEvents.set(ev.id, {
            ...ev,
            start_date: new Date(
              ev.has_time
                ? ev.start_date + 'T' + ev.start_time + '+09:00'
                : ev.start_date
            ),
            due_date: new Date(
              ev.has_time
                ? ev.due_date + 'T' + ev.due_time + '+09:00'
                : ev.due_date
            ),
          })
        );
        setEvents(newEvents);
      })
      .catch(console.log);
  };
  //fetch events map sorted by month
  const fetchMonthEvents = () => {
    if (!events) {
      setMonthEvents(new Map());
      return;
    }
    const monthEvents = new Map();
    events.forEach((event, id) => {
      const start = event.start_date;
      const due = event.due_date;
      let months =
        12 * (due.getFullYear() - start.getFullYear()) + due.getMonth() + 1;
      for (
        let year = start.getFullYear(), month = start.getMonth();
        month < months;
        month++, year += month % 12 === 0
      ) {
        if (!monthEvents.has(`${year}-${month % 12}`))
          monthEvents.set(`${year}-${month % 12}`, new Set());
        monthEvents.get(`${year}-${month % 12}`).add(id);
      }
    });
    console.log(monthEvents);
    //construct events map per month
    for (const [year_month, thisMonthEvents] of monthEvents) {
      console.log(year_month, thisMonthEvents);
      const [year, monthIndex] = year_month
        .split('-')
        .map((str) => parseInt(str, 10));
      if (thisMonthEvents instanceof Set) {
        const newThisMonthEvents = new Map();
        for (const eventNo of thisMonthEvents) {
          const event = events.get(eventNo);
          let startDate =
            event.start_date.getMonth() === monthIndex
              ? event.start_date.getDate()
              : 1;
          let dueDate =
            event.due_date.getMonth() === monthIndex
              ? event.due_date.getDate()
              : getNumDays(year, monthIndex);
          // console.log(event, startDate, dueDate);
          for (let date = startDate; date <= dueDate; date++) {
            if (!newThisMonthEvents.has(date))
              newThisMonthEvents.set(date, new Set());
            newThisMonthEvents.get(date).add(eventNo);
          }
        }
        monthEvents.set(year_month, newThisMonthEvents);
      }
    }
    console.log(monthEvents);
    setMonthEvents(new Map(monthEvents));
  };
  //fetch events map sorted by channel_id
  const fetchChannelEvents = () => {
    if (!events) {
      setChannelEvents(new Map());
      return;
    }
    events.forEach((event, id) => {
      if (!channelEvents.has(event.channel))
        channelEvents.set(event.channel, new Set());
      channelEvents.get(event.channel).add(id);
    });
    setChannelEvents(new Map(channelEvents));
  };
  const getMonthEvents = (year, monthIndex) => {
    // while (!monthEvents) await new Promise((r) => setTimeout(r, 2000));

    let thisMonthEvents = monthEvents?.get(`${year}-${monthIndex}`);
    if (thisMonthEvents instanceof Set) {
      const newThisMonthEvents = new Map();
      for (const eventNo of thisMonthEvents) {
        const event = events.get(eventNo);
        let startDate =
          event.start_date.getMonth() === monthIndex
            ? event.start_date.getDate()
            : 1;
        let dueDate =
          event.due_date.getMonth() === monthIndex
            ? event.due_date.getDate()
            : getNumDays(year, monthIndex);
        for (let date = startDate; date <= dueDate; date++) {
          if (!newThisMonthEvents.has(date))
            newThisMonthEvents.set(date, new Set());
          newThisMonthEvents.get(date).add(eventNo);
        }
      }
      monthEvents.set(`${year}-${monthIndex}`, newThisMonthEvents);
      setMonthEvents(new Map(monthEvents));
      return newThisMonthEvents;
    }
    return thisMonthEvents;
  };
  //return monthly events for active channels
  const getMonthActiveEvents = (year, monthIndex, channelId) => {
    //프로미스로 해보기
    const monthActiveEvents = new Map(getMonthEvents(year, monthIndex));
    if (!getMonthEvents(year, monthIndex)) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!');
      return undefined;
    }
    console.log(monthActiveEvents);
    //event IDs of active channels
    let activeChannelEvents;
    if (channelId) {
      activeChannelEvents = channelEvents.get(parseInt(channelId, 10));
      if (activeChannelEvents !== undefined)
        activeChannelEvents = Array.from(activeChannelEvents);
    } else {
      activeChannelEvents = new Map(channelEvents);
      for (const ch of disabledChannels) {
        activeChannelEvents.delete(ch);
      }
      activeChannelEvents = [...activeChannelEvents.values()].reduce(
        (prev, curr) => [...prev, ...curr],
        []
      );
    }
    console.log(activeChannelEvents);
    for (let [day, events] of monthActiveEvents) {
      monthActiveEvents.set(
        day,
        new Set([...events].filter((e) => activeChannelEvents?.includes(e)))
      );
    }
    return {
      eventsList: [
        ...new Set(
          [...monthActiveEvents.values()].reduce(
            (prev, curr) => [...prev, ...curr],
            []
          )
        ),
      ],
      dayEventsMap: monthActiveEvents,
    };
  };
  const getDayEvents = (date) => {
    const monthEvents = getMonthEvents(date.getFullYear(), date.getMonth());
    const dayEvents = monthEvents?.get(date.getDate());
    return dayEvents ? [...dayEvents].map((id) => events.get(id)) : [];
  };
  const getDateLength = (date1, date2) => {
    const dayInMs = 60 * 60 * 24 * 1000;
    date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return (date2.getTime() - date1.getTime()) / dayInMs + 1;
  };
  return (
    <CalendarContext.Provider
      value={{
        getNumDays,
        getDateLength,
        events,
        getEvent: (id) => events.get(id),
        monthEvents,
        getMonthActiveEvents,
        getDayEvents,
        channelEvents,
        channelColors,
        fetchEvents,
        isFetching,
        disabledChannels,
        setDisabledChannels,
        setChannelColor,
        calendar: new Calendar(),
        ...value,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
export const useCalendarContext = () => useContext(CalendarContext);
