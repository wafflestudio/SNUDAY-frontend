import axios, { AxiosError, AxiosResponse } from 'axios';
import { logError } from './api';
class UserAPI {
  static refresh = () =>
    new Promise((resolve, reject) => {
      const token = localStorage.getItem('refresh');
      if (!token) reject('no refresh token available');
      axios
        .post('users/refresh/', { refresh: token })
        .then((response) => {
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.access}`;
          resolve(response.data);
        })
        .catch(reject);
    });
  static loginUser = (data: {
    username: User['username'];
    password: User['password'];
  }) =>
    new Promise((resolve, reject) => {
      axios
        .post('users/login/', data)
        .then((response) => {
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.access}`;
          localStorage.setItem('refresh', response.data.refresh);
          resolve(response?.data);
        })
        .catch((e) => {
          reject(e.response?.status);
        });
    });
  static searchUser = (username: User['username']) =>
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
  static getUser = (id: User['id']) =>
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
  static getUserMe = () =>
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
  static sendAuthEmail = (addr: string) =>
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
  static verifyAuthEmail = (addr: string, code: string) =>
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
  static findUserId = (addr: string) =>
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
  static findUserPassword = ({
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
  static patchUser = (user: Partial<User>) =>
    new Promise((resolve, reject) => {
      axios
        .patch('/users/me/', user)
        .then((response) => resolve(response.data))
        .catch((e) => {
          logError(e);
          reject(e);
        });
    });
  static patchUserPassword = (data: {
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
  static postUser = (
    data:
      | Omit<User, 'id' | 'private_channel_id'>
      | { username: User['username'] }
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
  static checkDuplicateID = (username: User['username']) =>
    new Promise((resolve, reject) => {
      UserAPI.postUser({ username })
        .then()
        .catch((e) => {
          const errorData = e?.response.data;
          if (errorData.username !== undefined)
            for (let error of errorData.username)
              if (error.includes('중복')) resolve(true);

          resolve(false);
        });
    });
  static getMyEvents = ({ month, date }: { month: string; date: string }) =>
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
  static getAwaitingChannels = () =>
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
  static getSubscribedChannels = () =>
    new Promise<Channel[]>((resolve, reject) => {
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
  static getManagingChannels = () =>
    new Promise<Channel[]>((resolve, reject) => {
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
}
export default UserAPI;
