import { baseUrl } from '../config/index';
import { Request } from '../utils/request';
const cartBaseUrl = `${baseUrl}/carts`;
const fetchCartItemTotalQuantity = (cartId) => {
  return new Request().get(`${cartBaseUrl}/${cartId}/total-quantity`);
};
const fetchCartItemList = (cartId) => {
  return new Request().get(`${cartBaseUrl}/${cartId}/items`);
};
const addItemToCart = (cartId, cartItem) => {
  return new Request().post(`${cartBaseUrl}/${cartId}/items`, cartItem);
};
const deleteCartItem = (cartItemId) => {
  return new Request().delete(`${cartBaseUrl}/${cartId}/items/${cartItemId}`);
};

export { fetchCartItemTotalQuantity, fetchCartItemList, addItemToCart, deleteCartItem };
