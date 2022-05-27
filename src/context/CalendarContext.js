import React, { useContext, useEffect, useState } from 'react';
import { getChannelEvents } from '../API';
import { useAuthContext } from './AuthContext';
import { Calendar } from '../calendar/cal';
import {
  CHANNEL_ACADEMIC_CALENDAR,
  CHANNEL_HOLIDAYS,
  COLORS,
} from '../Constants';
import useEvents from './useEvents';
const CalendarContext = React.createContext({
  getNumDays: () => {},
  day: null,
  setDay: () => {},
  calendar: null,
  events: null,
});
export const CalendarContextProvider = ({ value, children }) => {
  const {
    events,
    monthlyEvents,
    channelEvents,
    isFetching,
    isHoliday,
    updateEvent,
    deleteEvent,
  } = useEvents({
    year: value.year,
    monthIndex: value.monthIndex,
  });
  const [disabledChannels, setDisabledChannels] = useState([]);
  const [channelColors, setChannelColors] = useState(undefined);
  const {
    value: { userInfo },
  } = useAuthContext();
  useEffect(() => {
    // fetchMonthlyEvents();
  }, [userInfo]);
  useEffect(() => {
    // get/set channel colors
    if (!userInfo) return;
    // console.log('set colors');
    const colors = Object.keys(COLORS);
    const savedColors = localStorage.getItem('channelColors');
    if (savedColors) {
      const presetColors = new Map(JSON.parse(savedColors));
      presetColors.set(
        userInfo.my_channel,
        colors[Math.floor(Math.random() * colors.length)]
      );
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
      presetColors.set(
        userInfo.my_channel,
        colors[Math.floor(Math.random() * colors.length)]
      );
      userInfo?.subscribing_channels.forEach((channel, index) =>
        presetColors.set(channel, colors[index % colors.length])
      );
      //Default colors for public channel
      // if (!presetColors.has(CHANNEL_ACADEMIC_CALENDAR))
      presetColors.set(CHANNEL_ACADEMIC_CALENDAR, 'rgb(15, 15, 112)');
      // if (!presetColors.has(CHANNEL_HOLIDAYS))
      presetColors.set(CHANNEL_HOLIDAYS, COLORS['POMEGRANATE']);
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
  //return monthly events for active channels
  const getMonthlyActiveEvents = async (year, monthIndex, channelId) => {
    //프로미스로 해보기
    // await fetchMonthlyEvents({ month: `${year}-${monthIndex + 1}` });
    console.log(year, monthIndex, channelId);

    // console.log(monthEvents);
    const monthEvents = monthlyEvents.get(`${year}-${monthIndex}`);
    if (!monthEvents) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!');
      return undefined;
    }
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
  const getDailyEvents = (date) => {
    const monthEvents = monthlyEvents?.get(
      `${date.getFullYear()}-${date.getMonth()}`
    );
    const dailyEvents = monthEvents?.get(date.getDate());
    return dailyEvents ? [...dailyEvents].map((id) => events.get(id)) : [];
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        channelEvents,
        isFetching,
        isHoliday,
        updateEvent,
        deleteEvent,
        getEvent: (id) => events.get(id),
        getMonthlyActiveEvents,
        getDailyEvents,
        channelColors,
        // fetchMonthlyEvents,
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
