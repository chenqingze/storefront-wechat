import { baseUrl } from '../config/index';
import { Request } from '../utils/request';
const orderBaseUrl = `${baseUrl}/orders`;

createOrder = (order) => {
  return new Request().post(orderBaseUrl, order);
};
