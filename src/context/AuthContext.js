import React, { useContext, useEffect, useState } from 'react';
import { getUserMe } from '../API';
const AuthContext = React.createContext();
const AuthProvider = (props) => {
  const isLoggedIn = false;
  const access = undefined;
  const refresh = undefined;
  const userInfo = {};
  const setToken = ({ access, refresh }) => {
    let newState = { ...state };
    newState.value.access = access;
    newState.value.refresh = refresh;
    setState((prev) => ({ ...prev, value: { ...prev.value, access, refresh } }));
  };
  const setIsLoggedIn = (isLoggedIn) => {
    let newState = { ...state };
    newState.value.isLoggedIn = isLoggedIn;
    setState((prev) => ({ ...prev, value: { ...prev.value, isLoggedIn } }));
  };

  const setUserInfo = () => {
    getUserMe().then((userInfo) => {
      console.log(userInfo)
      setState((prev) => ({ ...prev, value: { ...prev.value, userInfo } }));
    });
  };
  const value = { isLoggedIn, access, refresh, userInfo };
  const action = { setToken, setIsLoggedIn };
  const [state, setState] = useState({ value, action });
  useEffect(() => {
    setUserInfo();
  },[state.value.access]);
  console.log(state)
  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};
const useAuthContext = () => useContext(AuthContext);
export { AuthProvider, useAuthContext };
