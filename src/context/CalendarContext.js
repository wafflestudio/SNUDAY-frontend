import React, { useContext, useEffect, useState } from 'react';
import { getMyEvents, getChannelEvents } from '../API';
import { useAuthContext } from './AuthContext';
import { Calendar } from '../calendar/cal';
import { COLORS } from '../Constants';
const CalendarContext = React.createContext({
  getNumDays: () => {},
  day: null,
  setDay: () => {},
  calendar: null,
  events: null,
  fetchMonthlyEvents: () => {},
});
export const CalendarContextProvider = ({ value, children }) => {
  const [events, setEvents] = useState(new Map()); //containing all fetched events
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
    fetchMonthlyEvents();
  }, [userInfo]);
  useEffect(() => {
    console.log(events);
    setMonthlyEventsMap();
    setChannelEventsMap();
    setIsFetching(false);
  }, [events]);
  useEffect(() => {
    fetchMonthlyEvents(value.year, value.monthIndex);
  }, [value.year, value.monthIndex]);

  useEffect(() => {
    // get/set channel colors
    if (!userInfo) return;
    // console.log('set colors');
    const colors = Object.keys(COLORS);
    const savedColors = localStorage.getItem('channelColors');
    if (savedColors) {
      const presetColors = new Map(JSON.parse(savedColors));
      userInfo?.subscribing_channels.forEach((channel, index) => {
        if (!presetColors.has(channel))
          presetColors.set(
            channel,
            colors[Math.floor(Math.random() * colors.length)]
          );
      });
      // console.log(presetColors);
      setChannelColors(presetColors);
      localStorage.setItem('channelColors', JSON.stringify([...presetColors]));
    } else {
      const presetColors = new Map();
      userInfo?.subscribing_channels.forEach((channel, index) =>
        presetColors.set(channel, colors[index % colors.length])
      );
      setChannelColors(presetColors);
      localStorage.setItem('channelColors', JSON.stringify([...presetColors]));
      // console.log(presetColors);
    }
  }, [userInfo?.subscribing_channels]);

  const setChannelColor = (channel, color) => {
    const newColors = new Map([...channelColors, [channel, color]]);
    setChannelColors((prev) => newColors);
    localStorage.setItem('channelColors', JSON.stringify([...newColors]));
  };

  //fetch map of all events
  //FIX: fetchEvents와 updateEvents로 나누기
  //전체 새로 로드/변경 이벤트만 로드
  const fetchMonthlyEvents = async (
    year = new Date().getFullYear(),
    monthIndex = new Date().getMonth() + 1
  ) => {
    setIsFetching(true);
    //FIX?
    setMonthEvents(new Map());
    setChannelEvents(new Map());
    //
    const newEvents = new Map(events);
    //API: get user events
    const monthEvents = await getMyEvents({
      month: `${parseInt(year)}-${parseInt(monthIndex) + 1}`,
    });
    console.log('events:', monthEvents);
    console.log('year,month', value.year, value.monthIndex);
    //adjust data format
    monthEvents.forEach((event) => {
      //skip if no update in an event
      if (
        events.has(event.id) &&
        event.updated_at === events.get(event.id).updated_at
      )
        return;
      newEvents.set(event.id, {
        ...event,
        start_date: new Date(
          event.has_time
            ? event.start_date + 'T' + event.start_time + '+09:00'
            : event.start_date
        ),
        due_date: new Date(
          event.has_time
            ? event.due_date + 'T' + event.due_time + '+09:00'
            : event.due_date
        ),
      });
    });
    //save events
    setEvents(newEvents);
  };

  //sort ${events} by month => ${EventsByMonth}
  //EventsByMonth = {'2022-4': {1, 2, 3:eventNo}:Set}:Map
  const sortEventsByMonth = () => {
    const EventsByMonth = new Map();
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
        if (!EventsByMonth.has(`${year}-${month % 12}`))
          EventsByMonth.set(`${year}-${month % 12}`, new Set());
        EventsByMonth.get(`${year}-${month % 12}`).add(id);
      }
    });
    return EventsByMonth;
  };
  const sortMonthlyEventsByDay = (monthlyEvents, year, monthIndex) => {
    const sortedMonthlyEvents = new Map();
    for (const eventNo of monthlyEvents) {
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
        if (!sortedMonthlyEvents.has(date))
          sortedMonthlyEvents.set(date, new Set());
        sortedMonthlyEvents.get(date).add(eventNo);
      }
    }
    return sortedMonthlyEvents;
  };
  //fetch events map sorted by month
  //{month:{day:Set([...eventNo]),...},...}
  const setMonthlyEventsMap = () => {
    if (!events) {
      setMonthEvents(new Map());
      return;
    }
    const EventsByMonth = sortEventsByMonth();
    //construct events map per month
    //{'2022-4':
    //  {1://2022-04-01
    //    {1, 2, 3:eventNo}:Set
    //  }:Map
    //}:Map
    for (const [year_month, thisMonthEvents] of EventsByMonth) {
      const [year, monthIndex] = year_month
        .split('-')
        .map((str) => parseInt(str, 10));
      if (thisMonthEvents instanceof Set) {
        EventsByMonth.set(
          year_month,
          sortMonthlyEventsByDay(thisMonthEvents, year, monthIndex)
        );
      }
    }
    setMonthEvents(EventsByMonth);
  };

  //fetch events map sorted by channel_id
  const setChannelEventsMap = () => {
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

  const getMonthlyEvents = (year, monthIndex) => {
    // while (!monthEvents) await new Promise((r) => setTimeout(r, 2000));

    let thisMonthEvents = monthEvents?.get(`${year}-${monthIndex}`);
    if (thisMonthEvents instanceof Set) {
      const newThisMonthEvents = sortMonthlyEventsByDay(
        thisMonthEvents,
        year,
        monthIndex
      );
      monthEvents.set(`${year}-${monthIndex}`, newThisMonthEvents);
      setMonthEvents(new Map(monthEvents));
      return; //newThisMonthEvents
    }
    return thisMonthEvents;
  };
  //return monthly events for active channels
  const getMonthlyActiveEvents = async (year, monthIndex, channelId) => {
    //프로미스로 해보기
    // await fetchMonthlyEvents({ month: `${year}-${monthIndex + 1}` });
    console.log(year, monthIndex, channelId);

    console.log(monthEvents);
    const monthlyEvents = getMonthlyEvents(year, monthIndex);
    console.log(monthlyEvents);
    if (!monthlyEvents) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!');
      return undefined;
    }
    console.log('monthlyEvents', monthlyEvents);
    let activeChannelEvents; //list of event IDs of active channels
    if (channelId) {
      //get specific channel's active events
      if (userInfo?.subscribing_channels?.has(channelId)) {
        //구독 중인 채널
        activeChannelEvents = channelEvents.get(parseInt(channelId, 10));
        if (activeChannelEvents !== undefined)
          activeChannelEvents = Array.from(activeChannelEvents);
      } else {
        //FIXIT: 채널 이벤트가 10개씩 옴. 전체가 오도록 해야할 듯
        getChannelEvents({ channelId }).then((events) => {
          console.log(`Channel #${channelId} events`, events);
          activeChannelEvents = events.results.map((event) => event.id);
        });
      }
    } else {
      //get all monthly active events
      activeChannelEvents = new Map(channelEvents);
      for (const ch of disabledChannels) {
        activeChannelEvents.delete(ch);
      }
      activeChannelEvents = [...activeChannelEvents.values()].reduce(
        (prev, curr) => [...prev, ...curr],
        []
      );
    }
    console.log('activeChannelEvents', activeChannelEvents);
    const activeMonthlyEvents = new Map();
    for (let [day, events] of monthlyEvents) {
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
  const getDailyEvents = (date) => {
    const monthEvents = getMonthlyEvents(date.getFullYear(), date.getMonth());
    const dailyEvents = monthEvents?.get(date.getDate());
    return dailyEvents ? [...dailyEvents].map((id) => events.get(id)) : [];
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
        getMonthlyActiveEvents,
        getDailyEvents,
        channelEvents,
        channelColors,
        fetchMonthlyEvents,
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
