import { getChannel } from 'API';
import { CalendarContextProvider } from 'context/CalendarContext';
import Header from 'Header';
import { useParams } from 'react-router-dom';

const { CalendarBody, default: Calendar } = require('calendar/Calendar');
const { useState, useEffect } = require('react');

const ChannelCalendar = ({ id }) => {
  const params = useParams();
  const channelId = id || +params.channelId;
  const [channelName, setChannelName] = useState('');
  useEffect(() => {
    window.scrollTo(0, 0);
    getChannel(channelId).then((channel) => setChannelName(channel.name));
  }, []);
  // const [year, setYear] = useState(new Date().getFullYear());
  // const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  //   {getChannel(match.params.id).then((channel) => channel.id)}
  return (
    <>
      <Header>{channelName}</Header>
      <Calendar type="channel" channelId={channelId}></Calendar>
    </>
  );
};
export default ChannelCalendar;
