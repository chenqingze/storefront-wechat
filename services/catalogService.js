import { baseUrl } from '../config/index';
import { Request } from '../utils/request';
const catalogBaseUrl = `${baseUrl}/catalog`;

const fetchOptionList = (page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/options?page=${page}&size=${size}`);
};

const fetchAllOptionList = () => {
  return new Request().get(`${catalogBaseUrl}/options`);
};

const fetchAllOptionValueListByOption = (optionId) => {
  return new Request().get(`${catalogBaseUrl}/options/${optionId}/values`);
};

/**
 * 一次性获取所有分类
 */
const fetchAllCategoryList = () => {
  return new Request().get(`${catalogBaseUrl}/categories`);
};
/**
 * 分页获取分类
 */
const fetchCategoryList = (page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/categories?page=${page}&size=${size}`);
};
const fetchCategoryDetails = (categoryId) => {
  return new Request().get(`${catalogBaseUrl}/categories/${categoryId}`);
};
const fetchProductList = (page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/products?page=${page}&size=${size}`);
};
/**
 * 根据产品分类获取产品列表
 * @param {*} categoryId
 * @param {*} page
 * @param {*} size
 */
const fetchProductListByCategory = (categoryId, page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/categories/${categoryId}/products?page=${page}&size=${size}`);
};
/**
 * 查询产品详情
 * @param {产品主键} productId
 */
const fetchProductDetails = (productId) => {
  return new Request().get(`${catalogBaseUrl}/products/${productId}`);
};

export {
  fetchCategoryDetails,
  fetchCategoryList,
  fetchAllCategoryList,
  fetchOptionList,
  fetchAllOptionList,
  fetchAllOptionValueListByOption,
  fetchProductDetails,
  fetchProductList,
  fetchProductListByCategory,
};
