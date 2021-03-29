import axios from 'axios';

const logError = (error) => {
  const log = error?.response;
  console.log(log);
  console.log(`${log?.status} ${log?.statusText}`);
  console.log(`${log?.config?.method} ${log?.config?.url}`);
  console.log(log?.data);
  return log?.data;
};
axios.defaults.headers['Accept'] = 'application/json';
axios.defaults.baseURL =
  'http://ec2-13-125-255-126.ap-northeast-2.compute.amazonaws.com/api/v1/';
//USERS
export const loginUser = (data) =>
  new Promise((resolve, reject) => {
    axios
      .post('users/login/', data)
      .then((response) => {
        axios.defaults.headers[
          'Authorization'
        ] = `Bearer ${response.data.access}`;
        resolve(response.data);
      })
      .catch((e) => {
        reject(e.response.status);
      });
  });
export const getUserMe = () =>
  new Promise((resolve, reject) => {
    axios
      .get('users/me/')
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const postUser = (data) =>
  new Promise((resolve, reject) => {
    axios
      .post('users/', data)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        logError(e);
        const errorData = e?.response.data;
        if (errorData.username !== undefined) {
          for (let error of errorData.username) {
            if (error.includes('중복')) reject('duplicate');
          }
        }
        reject('error'); //default
      });
  });
export const checkDuplicateID = (username) =>
  new Promise((resolve, reject) => {
    postUser({ username })
      .then()
      .catch((e) => {
        console.log(e);
        resolve(e === 'duplicate' ? true : false);
      });
  });
export const getMyEvents = (userInfo) =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/events/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const postMyEvents = (event) =>
  new Promise((resolve, reject) => {
    axios
      .put(`users/me/events/`, event)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
