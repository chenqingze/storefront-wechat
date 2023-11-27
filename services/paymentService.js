import { baseUrl } from '../config/index';
import { Request } from '../utils/request';

const payment = () => {
  return new Request().post(`${baseUrl}/payments`);
};

export { payment };
