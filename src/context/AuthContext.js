import React, { useContext, useEffect, useState } from 'react';
import {
  getManagingChannels,
  getSubscribedChannels,
  getAwaitingChannels,
  getUserMe,
} from '../API';
const AuthContext = React.createContext();
const AuthProvider = (props) => {
  const setToken = ({
    access = state.value.access,
    refresh = state.value.refresh ?? localStorage.getItem('refresh'),
  }) => {
    setState((prev) => ({
      ...prev,
      value: { ...prev.value, access, refresh },
    }));
  };
  const setIsLoggedIn = (isLoggedIn) => {
    let newState = { ...state };
    newState.value.isLoggedIn = isLoggedIn;
    setState((prev) => ({ ...prev, value: { ...prev.value, isLoggedIn } }));
  };
  const setUserInfo = (userInfo) => {
    let newState = { ...state };
    newState.value.userInfo = userInfo;
    setState((prev) => ({ ...prev, value: { ...prev.value, userInfo } }));
  };
  const initUserInfo = async () => {
    const userInfo = await getUserMe();
    const managingChannels = await getManagingChannels();
    console.log('managingChannels', managingChannels);
    const subscribingChannels = await getSubscribedChannels();
    const awaitingChannels = await getAwaitingChannels();
    const newUserInfo = {
      ...userInfo,
      my_channel: userInfo.private_channel_id,
      managing_channels: new Set(managingChannels.map((ch) => ch.id)),
      subscribing_channels: new Set(subscribingChannels.map((ch) => ch.id)),
      awaiting_channels: new Set(awaitingChannels.map((ch) => ch.id)),
    };
    newUserInfo.managing_channels.delete(newUserInfo.my_channel);
    //FIX:오류로 임시 코드. 나중에 지우기. DELETE!
    // newUserInfo.managing_channels.delete(36);
    // newUserInfo.managing_channels.delete(46);
    //
    setState((prev) => ({
      ...prev,
      value: { ...prev.value, userInfo: newUserInfo },
    }));
  };
  const defaultValue = {
    isLoggedIn: false,
    access: undefined,
    refresh: undefined,
    userInfo: null,
  };
  const action = { setToken, setIsLoggedIn, setUserInfo, initUserInfo };
  const [state, setState] = useState({ value: defaultValue, action });
  useEffect(() => {
    if (state.value.access) initUserInfo();
  }, [state.value.access]);
  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};
const useAuthContext = () => useContext(AuthContext);
export { AuthProvider, useAuthContext };
