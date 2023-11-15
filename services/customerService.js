import { baseUrl } from '../config/index';
import { Request } from '../utils/request';

const customerBaseUrl = `${baseUrl}/customers`;

const createDeliveryAddress = (customerId, address) => {
  return new Request().post(`${customerBaseUrl}/${customerId}/addresses`, address);
};
const updateDeliveryAddress = (customerId, address) => {
  return new Request().put(`${customerBaseUrl}/${customerId}/addresses`, address);
};
const deleteDeliveryAddress = (customerId, addressId) => {
  return new Request().delete(`${customerBaseUrl}/${customerId}/addresses/${addressId}`);
};
const fetchDeliveryAddressList = (customerId) => {
  return new Request().get(`${customerBaseUrl}/${customerId}/addresses`);
};
export { fetchDeliveryAddressList, createDeliveryAddress, updateDeliveryAddress, deleteDeliveryAddress };
