import axios, { AxiosError, AxiosResponse } from 'axios';
import ChannelAPI from './ChannelAPI';
import EventAPI from './EventAPI';
import NoticeAPI from './NoticeAPI';
import UserAPI from './UserAPI';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL =
  'http://ec2-52-79-115-201.ap-northeast-2.compute.amazonaws.com/api/v1/';

export const logError = (error: AxiosError) => {
  const log = error?.response;
  console.error(log);
  console.error(`${log?.status} ${log?.statusText}`);
  console.error(`${log?.config?.method} ${log?.config?.url}`);
  console.error(log?.data);
  return log?.data;
};

class api {
  static channel = ChannelAPI;
  static event = EventAPI;
  static notice = NoticeAPI;
  static user = UserAPI;
}

export default api;
