import { baseUrl } from '../config/index';
import { Request } from '../utils/request';
// const checkoutBaseUrl = `${baseUrl}/checkout`;
const checkout = (cartItemIds) => {
  const idsStr = cartItemIds.join();
  return new Request().get(`${baseUrl}/checkout?ids=${idsStr}`);
};

export { checkout };
