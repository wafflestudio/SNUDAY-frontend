import React, { useContext, useEffect, useState } from 'react';
import { getUserMe } from '../API';
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

  const setUserInfo = () => {
    getUserMe().then((userInfo) => {
      console.log(userInfo);
      setState((prev) => ({ ...prev, value: { ...prev.value, userInfo } }));
    });
  };
  const defaultValue = {
    isLoggedIn: false,
    access: undefined,
    refresh: undefined,
    userInfo: {},
  };
  const action = { setToken, setIsLoggedIn };
  const [state, setState] = useState({ value: defaultValue, action });
  useEffect(() => {
    setUserInfo();
  }, [state.value.access]);
  console.log(state);
  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};
const useAuthContext = () => useContext(AuthContext);
export { AuthProvider, useAuthContext };
