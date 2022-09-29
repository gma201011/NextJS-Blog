import axios  from 'axios';
import { config } from 'process';

const requestInstance = axios.create({
  baseURL: '/'
});

requestInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

requestInstance.interceptors.response.use(res => {
  if (res?.status === 200) {
    return res?.data;
  } else {
    return {
      code: -1,
      msg: '未知錯誤',
      data: null
    };
  }
}, error => Promise.reject(error));

export default requestInstance;