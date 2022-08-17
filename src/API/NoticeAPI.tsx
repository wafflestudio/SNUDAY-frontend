import axios, { AxiosError, AxiosResponse } from 'axios';
import { logError } from './api';
import UserAPI from './UserAPI';

class NoticeAPI {
  static getUserNotices = ({ cursor }: { cursor?: string }) =>
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
  static searchUserNotices = ({
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
  static getChannelNotices = ({
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
  static getNotice = ({
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
          UserAPI.getUser(notice.writer)
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
  static deleteNotice = ({
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
  static postNotice = ({
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
  static patchNotice = ({
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
        .patch(`channels/${channelId}/notices/${noticeId}/`, {
          title,
          contents,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          logError(e);
          reject(e);
        });
    });
}
export default NoticeAPI;
