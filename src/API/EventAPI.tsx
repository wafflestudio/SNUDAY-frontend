import axios, { AxiosError, AxiosResponse } from 'axios';
import { logError } from './api';

class EventAPI {
  static postEvent = (channelId: Channel['id'], event: Event) =>
    new Promise((resolve, reject) => {
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
  static deleteEvent = (channelId: Channel['id'], eventId: Event['id']) =>
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
  static patchEvent = (channelId: Channel['id'], event: Partial<Event>) =>
    new Promise((resolve, reject) => {
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
  static getChannelEvents = async ({
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
      if (getAll && response.data.next) {
        let results = response.data.results;
        let data: any = await EventAPI.getChannelEvents({
          channelId,
          month,
          date,
          cursor: response.data.next,
          getAll: true,
        });
        resolve({ results: results.concat(data.results) });
      }
      resolve(response.data);
    });
}
export default EventAPI;
