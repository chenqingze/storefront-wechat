import { baseUrl } from '../config/index';
import { Request } from '../utils/request';

const authBaseUrl = `${baseUrl}/wechat`;

const wechatLogin = (code) => {
  return new Request().get(`${authBaseUrl}/login?code=${code}`);
};

const checkAccessToken = (accessToken) => {
  return new Request().get(`${authBaseUrl}/me?access_token=${accessToken}`);
};

export { wechatLogin, checkAccessToken };
