import { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'Home';
import Login from 'Login';
import Navigation from 'Navigation';
import Signup from 'Signup';
import 'App.css';
import MyPage from 'MyPage';
import { AuthProvider } from 'context/AuthContext';
import ChannelMain from 'channel/ChannelMain';
import ChannelHome from 'channel/ChannelHome';
import SearchHome from 'SearchHome';
import NoticeHome from 'channel/NoticeHome';
import ChannelNotice from 'channel/ChannelNotice';
import Notice from 'channel/Notice';
import FindMyId from 'FindMyId';
import ChangeUsername from 'ChangeUsername';
import ChangePassword from 'ChangePassword';
import FindMyPassword from 'FindMyPassword';
function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function App() {
  let lastScrollTop = 0;
  const stickNav = (e) => {
    console.log(window.pageYOffset);
    const NavBar = document.getElementById('navigation-bar');
    const AddButton = document.getElementById('add-button');
    if (window.pageYOffset > lastScrollTop) {
      NavBar.style.bottom = '-4.5rem';
      AddButton.style.bottom = '0';
    } else {
      NavBar.style.bottom = '0';
      AddButton.style.bottom = '4.5rem';
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
    for (let touch of e.changedTouches) ongoingTouches.push(touch);
  };
  window.ontouchmove = (e) => {
    const NavBar = document.getElementById('navigation-bar');
    const AddButton = document.getElementById('add-button');
    for (let touch of e.changedTouches) {
      let id = ongoingTouchIndexById(touch.identifier);
      if (id >= 0)
        if (touch.clientY < ongoingTouches[id].clientY - 12) {
          //scrollDown
          NavBar.style.bottom = '-4.5rem';
          if (AddButton) AddButton.style.bottom = '0';
          ongoingTouches.splice(id, 1, touch);
        } else if (touch.clientY > ongoingTouches[id].clientY + 12) {
          //scrollUp
          NavBar.style.bottom = '0';
          if (AddButton) AddButton.style.bottom = '4.5rem';
          ongoingTouches.splice(id, 1, touch);
        }
    }
  };
  window.ontouchend = (e) => {
    const NavBar = document.getElementById('navigation-bar');
    const AddButton = document.getElementById('add-button');
    for (let touch of e.changedTouches) {
      let id = ongoingTouchIndexById(touch.identifier);
      if (id >= 0) {
        if (touch.clientY < ongoingTouches[id].clientY - 5) {
          //scrollDown
          NavBar.style.bottom = '-4.5rem';
          if (AddButton) AddButton.style.bottom = '0';
        } else if (touch.clientY > ongoingTouches[id].clientY + 5) {
          //scrollUp
          NavBar.style.bottom = '0';
          if (AddButton) AddButton.style.bottom = '4.5rem';
        }
        ongoingTouches.splice(id, 1);
      }
    }
  };
  window.onresize = () => {
    const NavBar = document.getElementById('navigation-bar');
    const AddButton = document.getElementById('add-button');
    NavBar.style.bottom = '-4.5rem';
    if (AddButton) AddButton.style.bottom = '0';
  };
  return (
    <AuthProvider>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/mypage/ChangePw" component={ChangePassword} />
        <Route exact path="/mypage/ChangeId" component={ChangeUsername} />
        <Route exact path="/mypage" component={MyPage} />
        <Route exact path="/notice" component={NoticeHome} />
        <Route exact path="/search" component={SearchHome} />
        <Route exact path="/channel" component={ChannelMain} />
        <Route path="/channel/:channelId/notice/:noticeId" component={Notice} />
        <Route path="/channel/:id/notice" component={ChannelNotice} />
        <Route path="/channel/:id" component={ChannelHome} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Login} />
        <Route exact path="/findmyid" component={FindMyId} />
        <Route exact path="/findmypw" component={FindMyPassword} />
      </Switch>
      <Navigation />
    </AuthProvider>
  );
}

export default App;
