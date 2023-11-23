import { baseUrl } from '../config/index';
import { Request } from '../utils/request';

const customerBaseUrl = `${baseUrl}/customers`;

const addDeliveryAddress = (customerId, address) => {
  return new Request().post(`${customerBaseUrl}/${customerId}/addresses`, address);
};
const updateDeliveryAddress = (customerId, addressId, address) => {
  return new Request().put(`${customerBaseUrl}/${customerId}/addresses/${addressId}`, address);
};
const removeDeliveryAddress = (customerId, addressId) => {
  return new Request().delete(`${customerBaseUrl}/${customerId}/addresses/${addressId}`);
};
const fetchAllDeliveryAddressList = (customerId) => {
  return new Request().get(`${customerBaseUrl}/${customerId}/addresses`);
};

const fetchDeliveryAddressDetails = (customerId, addressId) => {
  return new Request().get(`${customerBaseUrl}/${customerId}/addresses/${addressId}`);
};

const fetchDefaultDeliveryAddressDetails = (customerId) => {
  return new Request().get(`${customerBaseUrl}/${customerId}/addresses/default`);
};
const setDefaultDeliveryAddress = (customerId, addressId) => {
  return new Request().put(`${customerBaseUrl}/${customerId}/addresses/${addressId}/set-default`);
};
export {
  addDeliveryAddress,
  updateDeliveryAddress,
  removeDeliveryAddress,
  fetchAllDeliveryAddressList,
  fetchDeliveryAddressDetails,
  fetchDefaultDeliveryAddressDetails,
  setDefaultDeliveryAddress,
};
