import axios from 'axios';
import { useAuthContext } from './context/AuthContext';

const logError = (error) => {
  const log = error?.response;
  console.error(log);
  console.error(`${log?.status} ${log?.statusText}`);
  console.error(`${log?.config?.method} ${log?.config?.url}`);
  console.error(log?.data);
  return log?.data;
};
axios.defaults.headers['Accept'] = 'application/json';
axios.defaults.baseURL =
  'http://ec2-52-79-115-201.ap-northeast-2.compute.amazonaws.com/api/v1/';
//USERS
export const loginUser = (data) =>
  new Promise((resolve, reject) => {
    axios
      .post('users/login/', data)
      .then((response) => {
        console.log(axios.defaults.headers);
        axios.defaults.headers[
          'Authorization'
        ] = `Bearer ${response.data.access}`;
        resolve(response.data);
      })
      .catch((e) => {
        reject(e.response.status);
      });
  });
export const getUser = (id) =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/${id}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
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
export const sendAuthEmail = (addr) =>
  new Promise((resolve, reject) => {
    const email_prefix = addr.slice(0, addr.indexOf('@'));
    axios
      .post('/users/mail/send/', { email_prefix })
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const verifyAuthEmail = (addr, code) =>
  new Promise((resolve, reject) => {
    const email_prefix = addr.slice(0, addr.indexOf('@'));
    axios
      .post('/users/mail/verify/', { email_prefix, code })
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(false);
      });
  });
export const findUserId = (addr) =>
  new Promise((resolve, reject) => {
    const email_prefix = addr.slice(0, addr.indexOf('@'));
    axios
      .post('/users/find/username/', { email_prefix })
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const findUserPassword = (addr) =>
  new Promise((resolve, reject) => {
    const email_prefix = addr.slice(0, addr.indexOf('@'));
    axios
      .post('/users/find/password/', { email_prefix })
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
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
        reject(e); //default
      });
  });
export const checkDuplicateID = (username) =>
  new Promise((resolve, reject) => {
    postUser({ username })
      .then()
      .catch((e) => {
        const errorData = e?.response.data;
        if (errorData.username !== undefined)
          for (let error of errorData.username)
            if (error.includes('중복')) resolve(true);

        resolve(false);
      });
  });
export const getMyEvents = (date) =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/events/`, { params: { date } })
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const postEvents = (channelId, event) =>
  new Promise((resolve, reject) => {
    console.log(event);
    axios
      .post(`channels/${channelId}/events/`, event)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const getChannelEvents = ({ channelId, date }) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/${channelId}/events/`, { params: { date } })
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const subscribeChannel = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`channels/${id}/subscribe/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
};
export const unsubscribeChannel = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`channels/${id}/subscribe/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
};
export const getSubscribedChannels = () =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/subscribing_channels/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const getManagingChannels = () =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/managing_channels/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const searchChannels = ({ type, q }) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/search/`, { params: { type, q } })
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const getChannels = () =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const getChannel = (id) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/${id}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });

export const addChannel = (data) =>
  new Promise((resolve, reject) => {
    axios
      .post('channels/', data)
      .then((response) => resolve(response.data))
      .catch(logError);
  });

//NOTICES
export const getUserNotices = ({ cursor }) =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/notices/`, { params: {} })
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const searchUserNotices = ({ type, q, cursor }) =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/notices/search/`, { params: { type, q } })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => logError(e));
  });
export const getChannelNotices = ({ id, cursor }) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/${id}/notices/`, { params: {} })
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const getNotice = ({ channelId, noticeId }) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/${channelId}/notices/${noticeId}/`)
      .then((response) => {
        let notice = response.data;
        getUser(notice.writer)
          .then((response) => {
            notice.username = response.username;
            resolve(notice);
          })
          .then(resolve);
      })
      .catch(logError);
  });
export const deleteNotice = ({ channelId, noticeId }) =>
  new Promise((resolve, reject) => {
    axios
      .delete(`channels/${channelId}/notices/${noticeId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const postNotice = ({ title, contents, channelId }) =>
  new Promise((resolve, reject) => {
    axios
      .post(`channels/${channelId}/notices/`, { title, contents })
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
export const patchNotice = ({ title, contents, channelId, noticeId }) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`channels/${channelId}/notices/${noticeId}/`, { title, contents })
      .then((response) => {
        resolve(response.data);
      })
      .catch(logError);
  });
