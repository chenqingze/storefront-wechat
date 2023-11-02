import { baseUrl } from '../config/index';
import { Request } from '../utils/request';

const authBaseUrl = `${baseUrl}/wechat`;

const wechatLogin = (code) => {
  return new Request().get(`${authBaseUrl}/login?code=${code}`);
};

const checkXAuthToken = (xAuthToken) => {
  return new Request().get(`${authBaseUrl}/checkXAuthToken?xAuthToken=${xAuthToken}`);
};

export { wechatLogin, checkXAuthToken };
