import { baseUrl } from '../config/index';
import { Request } from '../utils/request';
const cartBaseUrl = `${baseUrl}/carts`;
const fetchCartItemTotalQuantity = (cartId) => {
  return new Request().get(`${cartBaseUrl}/${cartId}/total-quantity`);
};
const fetchCartItemList = (cartId, page = 0, size = 15) => {
  return new Request().get(`${cartBaseUrl}/${cartId}/items?page=${page}&size=${size}`);
};
const addItemToCart = (cartId, cartItem) => {
  return new Request().post(`${cartBaseUrl}/${cartId}/items`, cartItem);
};
const updateCartItem = (cartId, itemId, cartItem) => {
  return new Request().put(`${cartBaseUrl}/${cartId}/items/${itemId}`, cartItem);
};
const deleteCartItem = (cartItemId) => {
  return new Request().delete(`${cartBaseUrl}/${cartId}/items/${cartItemId}`);
};

export { fetchCartItemTotalQuantity, fetchCartItemList, addItemToCart, updateCartItem, deleteCartItem };
