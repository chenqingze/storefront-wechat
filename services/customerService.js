import { baseUrl } from '../config/index';
import { Request } from '../utils/request';

const customerBaseUrl = `${baseUrl}/customers`;

const addDeliveryAddress = (customerId, address) => {
  return new Request().post(`${customerBaseUrl}/${customerId}/addresses`, address);
};
const updateDeliveryAddress = (customerId, address) => {
  return new Request().put(`${customerBaseUrl}/${customerId}/addresses`, address);
};
const removeDeliveryAddress = (customerId, addressId) => {
  return new Request().delete(`${customerBaseUrl}/${customerId}/addresses/${addressId}`);
};
const fetchAllDeliveryAddressList = (customerId) => {
  return new Request().get(`${customerBaseUrl}/${customerId}/addresses`);
};
export { addDeliveryAddress, updateDeliveryAddress, removeDeliveryAddress, fetchAllDeliveryAddressList };
