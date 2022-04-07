import axios from 'axios';

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
export const refresh = () =>
  new Promise((resolve, reject) => {
    const token = localStorage.getItem('refresh');
    if (!token) reject('no refresh token available');
    axios
      .post('users/refresh/', { refresh: token })
      .then((response) => {
        axios.defaults.headers[
          'Authorization'
        ] = `Bearer ${response.data.access}`;
        resolve(response.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
export const loginUser = (data) =>
  new Promise((resolve, reject) => {
    axios
      .post('users/login/', data)
      .then((response) => {
        console.log(axios.defaults.headers);
        axios.defaults.headers[
          'Authorization'
        ] = `Bearer ${response.data.access}`;
        localStorage.setItem('refresh', response.data.refresh);
        resolve(response?.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response?.status);
      });
  });
export const searchUser = (username) =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/search/`, { params: { type: 'username', q: username } })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const getUser = (id) =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/${id}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const getUserMe = () =>
  new Promise((resolve, reject) => {
    axios
      .get('users/me/')
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
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
export const findUserPassword = (user) =>
  new Promise((resolve, reject) => {
    user.email_prefix = user.email.slice(0, user.email.indexOf('@'));
    delete user.email;
    console.table(user);
    axios
      .post('/users/find/password/', user)
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const patchUser = (user) =>
  new Promise((resolve, reject) => {
    axios
      .patch('/users/me/', user)
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const patchUserPassword = (data) =>
  new Promise((resolve, reject) => {
    axios
      .patch('/users/me/change_password/', data)
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
export const getMyEvents = ({ month, date }) =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/events/`, { params: { month, date } })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const postEvent = (channelId, event) =>
  new Promise((resolve, reject) => {
    console.log(event);
    axios
      .post(`channels/${channelId}/events/`, event)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const deleteEvent = (channelId, eventId) =>
  new Promise((resolve, reject) => {
    axios
      .delete(`channels/${channelId}/events/${eventId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const patchEvent = (channelId, event) =>
  new Promise((resolve, reject) => {
    console.log(event);
    axios
      .patch(`channels/${channelId}/events/${event.id}/`, event)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const getChannelEvents = ({ channelId, date }) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/${channelId}/events/`, { params: { date } })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const subscribeChannel = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`channels/${id}/subscribe/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
};
export const unsubscribeChannel = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`channels/${id}/subscribe/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
};
export const getAwaiters = (id) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/${id}/awaiters/`)
      .then((response) => {
        console.log(response.data);
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const postAllowAwaiters = ({ channelId, userId }) =>
  new Promise((resolve, reject) => {
    axios
      .post(`channels/${channelId}/awaiters/allow/${userId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const deleteRejectAwaiters = ({ channelId, userId }) =>
  new Promise((resolve, reject) => {
    axios
      .delete(`channels/${channelId}/awaiters/allow/${userId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const getAwaitingChannels = () =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/awaiting_channels/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const getSubscribedChannels = () =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/subscribing_channels/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const getManagingChannels = () =>
  new Promise((resolve, reject) => {
    axios
      .get(`users/me/managing_channels/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const searchChannels = ({ type, q, cursor }) =>
  new Promise((resolve, reject) => {
    cursor = cursor?.substring(cursor.indexOf('?cursor='));
    axios
      .get(`channels/search/${cursor ?? ''}`, {
        params: {
          type,
          q,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const getChannels = (cursor) =>
  new Promise((resolve, reject) => {
    cursor = cursor?.substring(cursor.indexOf('?cursor='));
    axios
      .get(`channels/${cursor ?? ''}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const getChannel = (id) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/${id}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });

export const addChannel = (data) =>
  new Promise((resolve, reject) => {
    axios
      .post('channels/', data, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const patchChannel = (data) =>
  new Promise((resolve, reject) => {
    console.log(data);
    axios
      .patch(`channels/${data.get('id')}/`, data, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });

//NOTICES
export const getUserNotices = ({ cursor }) =>
  new Promise((resolve, reject) => {
    cursor = cursor?.substring(cursor.indexOf('?cursor='));

    axios
      .get(`users/me/notices/${cursor ?? ''}`, { params: {} })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const searchUserNotices = ({ type, q, cursor }) =>
  new Promise((resolve, reject) => {
    cursor = cursor?.substring(cursor.indexOf('?cursor='));

    axios
      .get(`users/me/notices/search/${cursor ?? ''}`, { params: { type, q } })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => logError(e));
  });
export const getChannelNotices = ({ id, cursor }) =>
  new Promise((resolve, reject) => {
    cursor = cursor?.substring(cursor.indexOf('?cursor='));

    axios
      .get(`channels/${id}/notices/${cursor ?? ''}`, { params: {} })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
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
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const deleteNotice = ({ channelId, noticeId }) =>
  new Promise((resolve, reject) => {
    axios
      .delete(`channels/${channelId}/notices/${noticeId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const postNotice = ({ title, contents, channelId }) =>
  new Promise((resolve, reject) => {
    axios
      .post(`channels/${channelId}/notices/`, { title, contents })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const patchNotice = ({ title, contents, channelId, noticeId }) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`channels/${channelId}/notices/${noticeId}/`, { title, contents })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
