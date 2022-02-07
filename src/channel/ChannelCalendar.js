import { getChannel } from 'API';
import { CalendarContextProvider } from 'context/CalendarContext';
import Header from 'Header';

const { CalendarBody, default: Calendar } = require('calendar/Calendar');
const { useState, useEffect } = require('react');

const ChannelCalendar = ({ match }) => {
  const channelId = +match.params.id;
  const [channelName, setChannelName] = useState('');
  useEffect(() => {
    getChannel(channelId).then((channel) => setChannelName(channel.name));
  }, []);
  // const [year, setYear] = useState(new Date().getFullYear());
  // const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  //   {getChannel(match.params.id).then((channel) => channel.id)}
  return (
    <CalendarContextProvider>
      <Header>{'학사일정'}</Header>
      <Calendar type="channel" channelId={channelId}></Calendar>
    </CalendarContextProvider>
  );
};
export default ChannelCalendar;
