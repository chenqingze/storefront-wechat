import { baseUrl } from '../config/index';
import { Request } from '../utils/request';

const authBaseUrl = `${baseUrl}/wechat`;

const wechatLogin = (code) => {
  new Request().get(`${authBaseUrl}/login?code=${code}`);
};

export { wechatLogin };
