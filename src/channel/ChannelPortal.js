import { Routes, Route, useParams } from 'react-router-dom';
import ChannelHome from './ChannelHome';
import ChannelNotice from './ChannelNotice';
import ChannelCalendar from './ChannelCalendar';
import Notice from './Notice';
import { useState, useEffect } from 'react';
import { getChannel } from 'API';
import ErrorScreen from './ErrorScreen';
const ChannelPortal = () => {
  let { channelId } = useParams();
  channelId = +channelId;
  console.log(channelId);
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    getChannel(channelId)
      .then((channel) => setChannelData(() => channel))
      .catch((error) => {
        setError(error.response?.data?.error);
      });
  }, []);
  if (error) {
    switch (error) {
      case 'private channel은 열람할 수 없습니다.':
        return <ErrorScreen />;
    }
  }
  return (
    <Routes>
      <Route path="" element={<ChannelHome />} />
      <Route path="notice" element={<ChannelNotice />} />
      <Route path="events" element={<ChannelCalendar />} />
      <Route path="notice/:noticeId" element={<Notice />} />
    </Routes>
  );
};
export default ChannelPortal;
