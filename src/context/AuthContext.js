import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  getManagingChannels,
  getSubscribedChannels,
  getAwaitingChannels,
  getUserMe,
  loginUser,
} from 'API';
const AuthContext = React.createContext();
const AuthProvider = (props) => {
  const setValue = ({ type, value }) => {
    setState((prev) => ({
      ...prev,
      value: { ...prev.value, [type]: value },
    }));
  };
  const setToken = ({
    access = state.value.access,
    refresh = state.value.refresh ?? localStorage.getItem('refresh'),
  }) => {
    setState((prev) => ({
      ...prev,
      value: { ...prev.value, access, refresh },
    }));
  };
  const setIsLoggedIn = (isLoggedIn) =>
    setValue({ type: 'isLoggedIn', value: isLoggedIn });
  const setUserInfo = (userInfo) =>
    setValue({ type: 'userInfo', value: userInfo });
  const initUserInfo = async () => {
    const userInfo = await getUserMe();
    const managingChannels = await getManagingChannels();
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
    setUserInfo(newUserInfo);
    const disabledChannels = JSON.parse(
      localStorage.getItem('disabled_channels')
    )?.[userInfo.id];
    if (disabledChannels)
      setValue({ type: 'disabled_channels', value: disabledChannels });
  };
  const login = async ({ username, password }) =>
    new Promise(async (resolve, reject) => {
      loginUser({ username, password })
        .then((data) => {
          setToken(data);
          initUserInfo()
            .catch(reject)
            .then(() => {
              setIsLoggedIn(true);
              resolve(data);
            });
        })
        .catch(reject);
    });
  const logout = () => {
    delete axios.defaults.headers['Authorization'];
    localStorage.removeItem('refresh');
    setState((prev) => ({ ...prev, value: defaultValue }));
  };
  const defaultValue = {
    isLoggedIn: false,
    access: undefined,
    refresh: undefined,
    userInfo: null,
    default_channels: new Set([65, 73]),
    disabled_channels: [],
  };
  const action = {
    initUserInfo,
    login,
    logout,
    setIsLoggedIn,
    setToken,
    setUserInfo,
    setValue,
  };
  const [state, setState] = useState({ value: defaultValue, action });
  useEffect(() => {
    if (state.value.access) initUserInfo();
  }, [state.value.access]);
  useEffect(() => {
    let prev = localStorage.getItem('disabled_channels');
    if (prev) prev = JSON.parse(prev);
    localStorage.setItem(
      'disabled_channels',
      JSON.stringify(
        prev
          ? {
              ...prev,
              [state.value.userInfo?.id]: state.value.disabled_channels,
            }
          : { [state.value.userInfo?.id]: state.value.disabled_channels }
      )
    );
  }, [state.value.disabled_channels]);
  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};
const useAuthContext = () => useContext(AuthContext);
export { AuthProvider, useAuthContext };
