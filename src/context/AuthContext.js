import React, { useContext, useEffect, useState } from 'react';
import {
  getManagingChannels,
  getSubscribedChannels,
  getAwaitingChannels,
  getUserMe,
} from '../API';
const AuthContext = React.createContext();
const AuthProvider = (props) => {
  const setToken = ({ access, refresh }) => {
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
    const subscribingChannels = await getSubscribedChannels();
    const awaitingChannels = await getAwaitingChannels();
    const myChannel = managingChannels.find((channel) => channel.is_personal);
    const newUserInfo = {
      ...userInfo,
      managing_channels: new Set(managingChannels.map((ch) => ch.id)),
      subscribing_channels: new Set(subscribingChannels.map((ch) => ch.id)),
      awaiting_channels: new Set(awaitingChannels.map((ch) => ch.id)),
      my_channel: myChannel.id,
    };
    console.log(newUserInfo);
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
    initUserInfo();
  }, [state.value.access]);
  console.log(state);
  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};
const useAuthContext = () => useContext(AuthContext);
export { AuthProvider, useAuthContext };
