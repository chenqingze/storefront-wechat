import { baseUrl } from '../config/index';
import { Request } from '../utils/request';
const cartBaseUrl = `${baseUrl}/carts`;
const fetchCartItemList = (cartId) => {
  return new Request().get(`${cartBaseUrl}/${cartId}/items`);
};
const createCartItem = (cartItem) => {
  return new Request().post(`${cartBaseUrl}/${cartId}/items`, cartItem);
};
const deleteCartItem = (cartItemId) => {
  return new Request().delete(`${cartBaseUrl}/${cartId}/items/${cartItemId}`);
};
const updateCartItemQuantity = (quantity) => {
  return new Request().put(`${cartBaseUrl}/${cartId}/items/${cartItemId}`, quantity);
};

export { fetchCartItemList, createCartItem, deleteCartItem, updateCartItemQuantity };
