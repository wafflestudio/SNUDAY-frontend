import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'App.css';
import { AndroidCalendar } from 'calendar/Calendar';
import { useAuthContext } from './context/AuthContext';
import Home from 'Home';
import Navigation from 'Navigation';
import ChannelPortal from 'channel/ChannelPortal';
import MyChannels from 'channel/MyChannels';
import NoticeHome from 'channel/NoticeHome';
import SearchHome from 'SearchHome';
import Signup from 'auth/Signup';
import Login from 'auth/Login';
import FindMyId from 'auth/FindMyId';
import FindMyPassword from 'auth/FindMyPassword';
import MyPage from 'auth/MyPage';
import ChangeUsername from 'auth/ChangeUsername';
import ChangePassword from 'auth/ChangePassword';
import Policy from 'policy/Policy';
import * as NavScroll from 'NavigationScroll';
function App() {
  const location = useLocation();
  const {
    value: { user },
  } = useAuthContext();
  if (location.pathname === '/android') return <AndroidCalendar />;
  // if (isLoading) return <></>;
  if (!user)
    return (
      <Routes>
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Login />} />
        <Route path="findmyid" element={<FindMyId />} />
        <Route path="findmypw" element={<FindMyPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="channel/:channelId/*" element={<ChannelPortal />} />
        <Route path="policy/:type" element={<Policy />} />
        <Route
          path="*"
          element={<Navigate to="signin" state={{ prev: location.pathname }} />}
        />
      </Routes>
    );
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="notice" element={<NoticeHome />} />
        <Route path="search" element={<SearchHome />} />
        <Route path="channel" element={<MyChannels />} />
        <Route path="channel/:channelId/*" element={<ChannelPortal />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="mypage/changePw" element={<ChangePassword />} />
        <Route path="mypage/changeId" element={<ChangeUsername />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Login />} />
        <Route path="findmyid" element={<FindMyId />} />
        <Route path="findmypw" element={<FindMyPassword />} />
        <Route path="policy/:type" element={<Policy />} />
        <Route
          path="*"
          element={<Home />} //FIXIT:404 Page 만들기
        />
      </Routes>
      <Navigation />
    </>
  );
}
export default App;
