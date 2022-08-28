import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  getManagingChannels,
  getSubscribedChannels,
  getAwaitingChannels,
  getUserMe,
  loginUser,
} from 'API';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { refresh } from '../API';
const AuthContext = React.createContext();
const getUserInfo = async () =>
  Promise.all([
    getUserMe(),
    getManagingChannels(),
    getSubscribedChannels(),
    getAwaitingChannels(),
  ]).then(
    ([userInfo, managingChannels, subscribingChannels, awaitingChannels]) => {
      const disabledChannels = JSON.parse(
        localStorage.getItem('disabled_channels')
      )?.[userInfo.id];
      const newUserInfo = {
        ...userInfo,
        my_channel: userInfo.private_channel_id,
        managing_channels: new Set(managingChannels.map((ch) => ch.id)),
        subscribing_channels: new Set(subscribingChannels.map((ch) => ch.id)),
        awaiting_channels: new Set(awaitingChannels.map((ch) => ch.id)),
        disabled_channels: disabledChannels ?? [],
      };
      newUserInfo.managing_channels.delete(newUserInfo.my_channel);
      delete newUserInfo.private_channel_id;
      // if (disabledChannels)
      //   setValue({ type: 'disabled_channels', value: disabledChannels });
      return newUserInfo;
    }
  );
const AuthProvider = (props) => {
  const queryClient = useQueryClient();
  const useToken = useQuery(
    ['token'],
    () => refresh(queryClient.getQueryData(['token'])?.refresh),
    {
      // initialData: localStorage.getItem('refresh')
      //   ? { refresh: localStorage.getItem('refresh') }
      //   : undefined,
      staleTime: Infinity,
    }
  );
  const token = useToken.data?.access;
  console.log(token);
  const useUser = useQuery(['user'], getUserInfo, {
    onError: () => {
      refresh(queryClient.getQueryData(['token'])?.refresh).then(console.log);
    },
    enabled: !!token,
    staleTime: Infinity,
  });
  useEffect(() => {
    setValue({ type: 'user', value: useUser.data });
  }, [useUser.data]);
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

  const useLogin = useMutation(loginUser, {
    onSuccess: async (token) => {
      queryClient.invalidateQueries(['token']);
      queryClient.setQueryData(['token'], token);
      const user = await queryClient.fetchQuery(['user'], getUserInfo);
      console.log(user);
    },
  });
  const login = async ({ username, password }) => {
    setValue({ type: 'isLoading', value: true });
    return new Promise((resolve, reject) => {
      loginUser({ username, password })
        .then((data) => {
          setToken(data);
          initUserInfo()
            .then(() => {
              // setIsLoggedIn(true);
              // setValue({ type: 'isLoading', value: false });
              setState((prev) => ({
                ...prev,
                value: { ...prev.value, isLoggedIn: true, isLoading: false },
              }));
              resolve(data);
            })
            .catch((e) => {
              setValue({ type: 'isLoading', value: false });
              reject(e);
            });
        })
        .catch(reject);
    });
  };
  const logoutMutation = () => {
    delete axios.defaults.headers['Authorization'];
    localStorage.removeItem('refresh');
    queryClient.removeQueries();
  };
  const logout = () => {
    logoutMutation();
    setState((prev) => ({
      ...prev,
      value: { ...defaultValue, isLoading: false },
    }));
  };
  const defaultValue = {
    isLoading: true,
    isLoggedIn: false,
    access: undefined,
    refresh: undefined,
    userInfo: null,
    default_channels: new Set([65, 73]),
    disabled_channels: [],
    useUser,
  };
  const action = {
    initUserInfo,
    login,
    qlogin: useLogin.mutate,
    logout,
    setIsLoggedIn,
    setToken,
    setUserInfo,
    getUserInfo,
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
  useEffect(() => {
    if (!state.value.isLoggedIn && state.value.isLoading)
      refresh()
        .then((data) => {
          console.log(data);
          setToken(data); //data.access
          setState((prev) => ({
            ...prev,
            value: { ...prev.value, isLoggedIn: true, isLoading: false },
          }));
          console.log('welcome back');
        })
        .catch(() => {
          setValue({ type: 'isLoading', value: false });
        });
  }, [state.value.isLoggedIn, state.value.isLoading]);

  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};
const useAuthContext = () => useContext(AuthContext);
export { AuthProvider, useAuthContext };
