import { baseUrl } from '../config/index';
import { Request } from '../utils/request';

const customerBaseUrl = `${baseUrl}/customers`;

const addShippingAddress = (customerId, address) => {
  return new Request().post(`${customerBaseUrl}/${customerId}/addresses`, address);
};
const updateShippingAddress = (customerId, addressId, address) => {
  return new Request().put(`${customerBaseUrl}/${customerId}/addresses/${addressId}`, address);
};
const removeShippingAddress = (customerId, addressId) => {
  return new Request().delete(`${customerBaseUrl}/${customerId}/addresses/${addressId}`);
};
const fetchAllShippingAddressList = (customerId) => {
  return new Request().get(`${customerBaseUrl}/${customerId}/addresses`);
};

const fetchShippingAddressDetails = (customerId, addressId) => {
  return new Request().get(`${customerBaseUrl}/${customerId}/addresses/${addressId}`);
};

const fetchDefaultShippingAddressDetails = (customerId) => {
  return new Request().get(`${customerBaseUrl}/${customerId}/addresses/default`);
};
const setDefaultShippingAddress = (customerId, addressId) => {
  return new Request().put(`${customerBaseUrl}/${customerId}/addresses/${addressId}/set-default`);
};
export {
  addShippingAddress,
  updateShippingAddress,
  removeShippingAddress,
  fetchAllShippingAddressList,
  fetchShippingAddressDetails,
  fetchDefaultShippingAddressDetails,
  setDefaultShippingAddress,
};
