import { Routes, Route, useParams } from 'react-router-dom';
import ChannelHome from './ChannelHome';
import ChannelNotice from './ChannelNotice';
import ChannelCalendar from './ChannelCalendar';
import Notice from './Notice';
import { useState, useEffect } from 'react';
import { getChannel } from 'API';
import ErrorScreen from './ErrorScreen';
const ChannelPortal = () => {
  let { id } = useParams();
  id = +id;
  console.log(id);
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    getChannel(id)
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
      <Route path="channel/:id" element={<ChannelHome />} />
      <Route path="channel/:id/notice" element={<ChannelNotice />} />
      <Route path="channel/:id/events" element={<ChannelCalendar />} />
      <Route path="channel/:channelId/notice/:noticeId" element={<Notice />} />
    </Routes>
  );
};
export default ChannelPortal;
