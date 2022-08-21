import axios, { AxiosError, AxiosResponse } from 'axios';
import { logError } from './api';

class ChannelAPI {
  static searchChannels = ({
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
  static getChannels = (cursor?: string) =>
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
  static getChannel = (id: Channel['id']) =>
    new Promise<Channel>((resolve, reject) => {
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

  static addChannel = (data: Channel) =>
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
  static patchChannel = (data: FormData) =>
    new Promise((resolve, reject) => {
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

  static subscribeChannel = (id: Channel['id']) => {
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
  static unsubscribeChannel = (id: Channel['id']) => {
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
  static getAwaiters = (id: Channel['id']) =>
    new Promise((resolve, reject) => {
      axios
        .get(`channels/${id}/awaiters/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          logError(e);
          reject(e);
        });
    });
  static postAllowAwaiters = ({
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
  static deleteRejectAwaiters = ({
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
}
export default ChannelAPI;
