import { baseUrl } from '../config/index';
import { Request } from '../utils/request';
const catalogBaseUrl = `${baseUrl}/admin/catalog`;

/**
 * 添加产品分类
 */
const createCategory = (collecctionData) => {
  return new Request().post(`${catalogBaseUrl}/categories`, collecctionData);
};
/**
 * 编辑产品分类
 */
const updateCategory = (categoryId, collecctionData) => {
  return new Request().put(`${catalogBaseUrl}/categories/${categoryId}`, collecctionData);
};
/**
 * 删除产品分类
 * @param {产品分类主键} categoryId
 */
const deleteCategory = (categoryId) => {
  return new Request().delete(`${catalogBaseUrl}/categories/${categoryId}`);
};
/**
 * 添加选项
 * @param {*} option
 */
const createOption = (option) => {
  return new Request().post(`${catalogBaseUrl}/options`, option);
};
/**
 * 更新选项
 * @param {*} optionId
 * @param {*} optionData
 */
const updateOption = (optionId, optionData) => {
  return new Request().put(`${catalogBaseUrl}/options/${optionId}`, optionData);
};
/**
 * 删除选项
 * @param {*} optionId
 */
const deleteOption = (optionId) => {
  return new Request().delete(`${catalogBaseUrl}/options/${optionId}`);
};

const fetchOptionList = (page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/options?page=${page}&size=${size}`);
};

const fetchAllOptionList = () => {
  return new Request().get(`${catalogBaseUrl}/options`);
};

const createOptionValue = (optionId, optionValue) => {
  return new Request().post(`${catalogBaseUrl}/options/${optionId}/values`, optionValue);
};

const updateOptionValue = (optionId, optionValueId, optionValueData) => {
  return new Request().put(`${catalogBaseUrl}/options/${optionId}/values/${optionValueId}`, optionValueData);
};

const deleteOptionValue = (optionId, optionValueId) => {
  return new Request().delete(`${catalogBaseUrl}/options/${optionId}/values/${optionValueId}`);
};

const fetchAllOptionValueListByOption = (optionId) => {
  return new Request().get(`${catalogBaseUrl}/options/${optionId}/values`);
};
/**
 * 添加产品
 * @param {*} product
 */
const createProduct = (product) => {
  return new Request().post(`${catalogBaseUrl}/products`, product);
};
/**
 * 更新产品
 * @param {*} product
 */
const updateProduct = (productId, product) => {
  return new Request().put(`${catalogBaseUrl}/products/${productId}`, product);
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
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategoryDetails,
  fetchCategoryList,
  fetchAllCategoryList,
  createOption,
  updateOption,
  deleteOption,
  fetchOptionList,
  fetchAllOptionList,
  createOptionValue,
  updateOptionValue,
  deleteOptionValue,
  fetchAllOptionValueListByOption,
  createProduct,
  updateProduct,
  fetchProductDetails,
  fetchProductList,
  fetchProductListByCategory,
};
