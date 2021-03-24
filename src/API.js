import axios from 'axios';

const logError = (error) => {
  const log = error?.response;
  console.log(`${error?.status} ${error?.statusText}`);
  console.log(`${log?.config?.method} ${log?.config?.url}`);
  return log?.data;
};
axios.defaults.headers['Accept'] = 'application/json';
axios.defaults.baseURL =
  'http://ec2-13-125-255-126.ap-northeast-2.compute.amazonaws.com/api/v1/';

export const postUser = (data) =>
  new Promise((resolve, reject) => {
    axios
      .post('user/login/', data)
      .then((response) => {
        console.log(response);
      })
      .catch(logError);
  });
