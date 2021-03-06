import axios from 'axios';
import {get, set} from '../utils/local';
import {Toast, WhiteSpace, WingBlank, Button} from 'antd-mobile';
import {hashHistory} from 'react-router'
import * as env from '../utils/env'
let baseUrl = '';
if (env.isDev) {
  baseUrl = 'http://localhost:3000';
}
if (env.isProduction) {
  baseUrl = 'http://beijingshishigongjiao.leanapp.cn';
}
// baseUrl = 'http://beijingshishigongjiao.leanapp.cn';
let instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 50,
  // headers: {'ck': get('ck')||''},
  validateStatus: status => {
    // 如果是200和299之间 就不处理后面
    if (status >= 200 && status < 300) {
      return status >= 200 && status < 300;
    }
    switch (status) {
      case 404:
        Toast.offline('错误代码：404 ！');
        break;
      case 500:
        Toast.offline('错误代码：500 ！');
        break;
    }
  }
});
//请求
instance.interceptors.request.use(function (config) {
  return config;
});
//响应
instance.interceptors.response.use(function (response) {
  if (response.data.length == 0) {
    // Toast.success('数据丢失,已重新查询');
    // set('ck', '');
    // set('ckLine', '');
    // hashHistory.push('/');
    return undefined;
  }

  //所有不是正确的请求都写本地存储
  if (response.data.status != 200) {
    // let error = {
    //   请求: JSON.parse(response.config.data),
    //   响应: response.data
    // };
    // set('error', error);
  }
  switch (response.data.status) {
    case 1:
      return response;
    case 2:
      // message.error(response.data.data);
      Toast.offline(response.data.data);
      return undefined;
    case 9:
      //tokenId过期
      Storage.set('user', '');
      // browserHistory.push('/login');
      return undefined;

  }

  return response;
}, function (error) {
  Toast.offline('系统错误！');
  return Promise.reject(error);
});


const http = {
  init() {
    instance.defaults.headers = {'ck': get('ck') || ''};
  },
  get(url, data) {
    this.init();
    return instance.get(url, {params: data});
  },
  post(url, data) {
    this.init();
    return instance.post(url, data);
  },
  delete(url) {
    this.init();
    return instance.delete(url);
  }
};

module.exports = http;

// export  default http;
