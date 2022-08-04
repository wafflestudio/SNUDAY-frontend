import axios, { AxiosError, AxiosResponse } from 'axios';

const logError = (error: AxiosError) => {
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
export const loginUser = (data: {
  username: User['username'];
  password: User['password'];
}) =>
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
export const searchUser = (username: User['username']) =>
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
export const getUser = (id: User['id']) =>
  new Promise<User>((resolve, reject) => {
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
export const sendAuthEmail = (addr: string) =>
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
export const verifyAuthEmail = (addr: string, code: string) =>
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
export const findUserId = (addr: string) =>
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
export const findUserPassword = ({
  username,
  first_name,
  last_name,
  email,
}: {
  username: User['username'];
  first_name: User['first_name'];
  last_name: User['last_name'];
  email: User['email'];
}) =>
  new Promise((resolve, reject) => {
    const email_prefix = email.slice(0, email.indexOf('@'));
    const data = { username, first_name, last_name, email_prefix };
    console.table(data);
    axios
      .post('/users/find/password/', data)
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const patchUser = (user: Partial<User>) =>
  new Promise((resolve, reject) => {
    axios
      .patch('/users/me/', user)
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const patchUserPassword = (data: {
  old_password: User['password'];
  new_password: User['password'];
}) =>
  new Promise((resolve, reject) => {
    axios
      .patch('/users/me/change_password/', data)
      .then((response) => resolve(response.data))
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });
export const postUser = (
  data: Omit<User, 'id' | 'private_channel_id'> | { username: User['username'] }
) =>
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
export const checkDuplicateID = (username: User['username']) =>
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
export const getMyEvents = ({ month, date }: { month: string; date: string }) =>
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
export const postEvent = (channelId: Channel['id'], event: Event) =>
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
export const deleteEvent = (channelId: Channel['id'], eventId: Event['id']) =>
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
export const patchEvent = (channelId: Channel['id'], event: Partial<Event>) =>
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
export const getChannelEvents = async ({
  channelId,
  month,
  date,
  cursor,
  getAll = false,
}: {
  channelId: Channel['id'];
  month: string;
  date: string;
  cursor: string;
  getAll: boolean;
}) =>
  new Promise(async (resolve, reject) => {
    cursor = cursor?.substring(cursor.indexOf('?cursor='));
    const response = await axios.get(
      `channels/${channelId}/events/${cursor ?? ''}`,
      {
        params: { month, date },
      }
    );
    console.log('data', response.data);

    if (getAll && response.data.next) {
      let results = response.data.results;
      let data: any = await getChannelEvents({
        channelId,
        month,
        date,
        cursor: response.data.next,
        getAll: true,
      });
      console.log(data.results);
      resolve({ results: results.concat(data.results) });
    }
    resolve(response.data);
  });
export const subscribeChannel = (id: Channel['id']) => {
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
export const unsubscribeChannel = (id: Channel['id']) => {
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
export const getAwaiters = (id: Channel['id']) =>
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
export const postAllowAwaiters = ({
  channelId,
  userId,
}: {
  channelId: Channel['id'];
  userId: User['id'];
}) =>
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
export const deleteRejectAwaiters = ({
  channelId,
  userId,
}: {
  channelId: Channel['id'];
  userId: User['id'];
}) =>
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
export const searchChannels = ({
  type,
  q,
  cursor,
}: {
  type: SearchChannelType;
  q: string;
  cursor?: string;
}) =>
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
export const getChannels = (cursor?: string) =>
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
export const getChannel = (id: Channel['id']) =>
  new Promise((resolve, reject) => {
    axios
      .get(`channels/${id}/`)
      .then((response) => {
        resolve(response.data);
        localStorage.setItem(
          'channel',
          JSON.stringify({
            ...JSON.parse(localStorage.getItem('channel') ?? '{}'),
            [id]: response.data.name,
          })
        );
      })
      .catch((e) => {
        logError(e);
        reject(e);
      });
  });

export const addChannel = (data: Channel) =>
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
export const patchChannel = (data: FormData) =>
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
export const getUserNotices = ({ cursor }: { cursor?: string }) =>
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
export const searchUserNotices = ({
  type,
  q,
  cursor,
}: {
  type: SearchNoticeType;
  q: string;
  cursor?: string;
}) =>
  new Promise((resolve, reject) => {
    cursor = cursor?.substring(cursor.indexOf('?cursor='));

    axios
      .get(`users/me/notices/search/${cursor ?? ''}`, { params: { type, q } })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => logError(e));
  });
export const getChannelNotices = ({
  id,
  cursor,
}: {
  id: Channel['id'];
  cursor: string;
}) =>
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
export const getNotice = ({
  channelId,
  noticeId,
}: {
  channelId: Channel['id'];
  noticeId: Notice['id'];
}) =>
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
export const deleteNotice = ({
  channelId,
  noticeId,
}: {
  channelId: Channel['id'];
  noticeId: Notice['id'];
}) =>
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
export const postNotice = ({
  title,
  contents,
  channelId,
}: {
  title: Notice['title'];
  contents: Notice['contents'];
  channelId: Channel['id'];
}) =>
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
export const patchNotice = ({
  title,
  contents,
  channelId,
  noticeId,
}: {
  title: Notice['title'];
  contents: Notice['contents'];
  channelId: Channel['id'];
  noticeId: Notice['id'];
}) =>
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
