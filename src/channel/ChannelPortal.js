import { Routes, Route, useParams } from 'react-router-dom';
import ChannelHome from './ChannelHome';
import ChannelNotice from './ChannelNotice';
import ChannelCalendar from './ChannelCalendar';
import Notice from './Notice';
import { useState, useEffect } from 'react';
import { getChannel } from 'API';
import ErrorScreen from './ErrorScreen';
import { useAuthContext } from '../context/AuthContext';
const ChannelPortal = () => {
  let { channelId } = useParams();
  const {
    value: { isLoggedIn, isLoading },
  } = useAuthContext();
  channelId = +channelId;
  console.log(channelId);
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);
  console.log(isLoggedIn, isLoading);
  useEffect(() => {
    if (!isLoading)
      getChannel(channelId)
        .then((channel) => {
          setChannelData(() => channel);
          setError(null);
        })
        .catch((error) => {
          setError(error.response?.data?.error);
        });
    // return () => setError(null);
  }, [isLoggedIn, isLoading]);
  if (isLoading) return <></>;
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
