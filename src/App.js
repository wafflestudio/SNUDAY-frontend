import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from 'Home';
import Login from 'auth/Login';
import Navigation from 'Navigation';
import Signup from 'auth/Signup';
import 'App.css';
import MyPage from 'auth/MyPage';
import { useAuthContext } from './context/AuthContext';
import ChannelMain from 'channel/ChannelMain';
import ChannelHome from 'channel/ChannelHome';
import SearchHome from 'SearchHome';
import NoticeHome from 'channel/NoticeHome';
import ChannelNotice from 'channel/ChannelNotice';
import Notice from 'channel/Notice';
import FindMyId from 'auth/FindMyId';
import ChangeUsername from 'auth/ChangeUsername';
import ChangePassword from 'auth/ChangePassword';
import FindMyPassword from 'auth/FindMyPassword';
import ChannelCalendar from 'channel/ChannelCalendar';
function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function App() {
  const [sctop, setsctop] = useState(window.scrollY);
  let lastScrollTop = 0;
  const stickNav = (e) => {
    console.log(window.pageYOffset);
    const NavBar = document.getElementById('navigation-bar');
    const AddButton = document.getElementById('add-button');
    if (window.pageYOffset > lastScrollTop) {
      NavBar.style.bottom = '-' + NavBar.offsetHeight + 'px';
      AddButton.style.bottom = '0';
    } else {
      NavBar.style.bottom = '0';
      AddButton.style.bottom = NavBar.offsetHeight + 'px';
    }
    lastScrollTop = window.pageYOffset;
  };
  //window.addEventListener('scroll', stickNav);
  let ongoingTouches = [];
  function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      let id = ongoingTouches[i].identifier;
      if (id === idToFind) return i;
    }
    return -1; // not found
  }
  window.ontouchstart = (e) => {
    if (
      window.navigator.standalone ||
      window.matchMedia('(display-mode: standalone)').matches
    )
      return; //iOS||Android standalone
    for (let touch of e.changedTouches) ongoingTouches.push(touch);
  };
  window.ontouchmove = (e) => {
    if (
      window.navigator.standalone ||
      window.matchMedia('(display-mode: standalone)').matches
    )
      return;

    const NavBar = document.getElementById('navigation-bar');
    const AddButton = document.getElementById('add-button');
    for (let touch of e.changedTouches) {
      let id = ongoingTouchIndexById(touch.identifier);
      if (id >= 0)
        if (touch.clientY < ongoingTouches[id].clientY - 12) {
          //scrollDown
          if (NavBar) NavBar.style.bottom = '-' + NavBar.offsetHeight + 'px';
          if (AddButton) AddButton.style.bottom = '0';
          ongoingTouches.splice(id, 1, touch);
        } else if (touch.clientY > ongoingTouches[id].clientY + 12) {
          //scrollUp
          if (NavBar) NavBar.style.bottom = '0';
          if (AddButton) AddButton.style.bottom = NavBar.offsetHeight + 'px';
          ongoingTouches.splice(id, 1, touch);
        }
    }
  };
  window.ontouchend = (e) => {
    if (
      window.navigator.standalone ||
      window.matchMedia('(display-mode: standalone)').matches
    )
      return;

    const NavBar = document.getElementById('navigation-bar');
    const AddButton = document.getElementById('add-button');
    for (let touch of e.changedTouches) {
      let id = ongoingTouchIndexById(touch.identifier);
      if (id >= 0) {
        if (touch.clientY < ongoingTouches[id].clientY - 5) {
          //scrollDown
          if (NavBar) NavBar.style.bottom = '-' + NavBar.offsetHeight + 'px';
          if (AddButton) AddButton.style.bottom = '0';
        } else if (touch.clientY > ongoingTouches[id].clientY + 5) {
          //scrollUp
          if (NavBar) NavBar.style.bottom = '0';
          if (AddButton) AddButton.style.bottom = NavBar.offsetHeight + 'px';
        }
        ongoingTouches.splice(id, 1);
      }
    }
  };
  const {
    value: { isLoggedIn, userInfo },
  } = useAuthContext();
  const navigate = useNavigate();
  if (!isLoggedIn) {
    // navigate('/signin');

    return (
      <Routes>
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Login />} />
        <Route path="findmyid" element={<FindMyId />} />
        <Route path="findmypw" element={<FindMyPassword />} />
        <Route path="*" element={<Navigate to="signin" replace />} />
      </Routes>
    );
  }
  //FIX: userInfo takes time to update after refresh
  // if (!userInfo) return <></>;
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="mypage/ChangePw" element={<ChangePassword />} />
        <Route path="mypage/ChangeId" element={<ChangeUsername />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="notice" element={<NoticeHome />} />
        <Route path="search" element={<SearchHome />} />
        <Route path="channel" element={<ChannelMain />} />
        <Route
          path="channel/:channelId/notice/:noticeId"
          element={<Notice />}
        />
        <Route path="channel/:id/notice" element={<ChannelNotice />} />
        <Route path="channel/:id/events" element={<ChannelCalendar />} />
        <Route path="channel/:id" element={<ChannelHome />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Login />} />
        <Route path="findmyid" element={<FindMyId />} />
        <Route path="findmypw" element={<FindMyPassword />} />
      </Routes>
      <Navigation />
    </>
  );
}

export default App;
