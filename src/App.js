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

function App() {
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
          // if (NavBar) NavBar.style.bottom = '-' + NavBar.offsetHeight + 'px';
          if (NavBar) NavBar.classList.add(['hide']);
          if (NavBar && AddButton) AddButton.style.bottom = '0';
          ongoingTouches.splice(id, 1, touch);
        } else if (touch.clientY > ongoingTouches[id].clientY + 12) {
          //scrollUp
          // if (NavBar) NavBar.style.bottom = '0';
          if (NavBar) NavBar.classList.remove(['hide']);
          if (NavBar && AddButton)
            AddButton.style.bottom = NavBar.offsetHeight + 'px';
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
          // if (NavBar) NavBar.style.bottom = '-' + NavBar.offsetHeight + 'px';
          if (NavBar) NavBar.classList.add(['hide']);
          if (NavBar && AddButton) AddButton.style.bottom = '0';
        } else if (touch.clientY > ongoingTouches[id].clientY + 5) {
          //scrollUp
          // if (NavBar) NavBar.style.bottom = '0';
          if (NavBar) NavBar.classList.remove(['hide']);
          if (NavBar && AddButton)
            AddButton.style.bottom = NavBar.offsetHeight + 'px';
        }
        ongoingTouches.splice(id, 1);
      }
    }
  };
  const location = useLocation();
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  if (location.pathname === '/android') return <AndroidCalendar />;
  // if (isLoading) return <></>;
  if (!isLoggedIn)
    return (
      <Routes>
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Login />} />
        <Route path="findmyid" element={<FindMyId />} />
        <Route path="findmypw" element={<FindMyPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="channel/:channelId/*" element={<ChannelPortal />} />
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
        <Route
          path="*"
          element={<Home />} //FIXIT:404 Page 만들기
        />
      </Routes>
      <footer />
      <Navigation />
    </>
  );
}
export default App;
