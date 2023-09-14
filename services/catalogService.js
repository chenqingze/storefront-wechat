import { baseUrl } from '../config/index';
import { Request } from '../utils/request';
const catalogBaseUrl = `${baseUrl}/catalog`;

/**
 * 添加产品分类
 */
const createCollection = (collecctionData) => {
  return new Request().post(`${catalogBaseUrl}/collections`, collecctionData);
};
/**
 * 编辑产品分类
 */
const updateCollection = (collectionId, collecctionData) => {
  return new Request().put(`${catalogBaseUrl}/collections/${collectionId}`, collecctionData);
};
/**
 * 删除产品分类
 * @param {产品分类主键} collectionId
 */
const deleteCollection = (collectionId) => {
  return new Request().delete(`${catalogBaseUrl}/collections/${collectionId}`);
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

const fetchAllOptionValueListByOptionId = (optionId) => {
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
 * 获取所有分类
 */
const fetchAllCollectionList = () => {
  return new Request().get(`${catalogBaseUrl}/collections`);
};
/**
 * 分页获取分类
 */
const fetchCollectionList = (page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/collections?page=${page}&size=${size}`);
};
const fetchCollectionById = (collectionId) => {
  return new Request().get(`${catalogBaseUrl}/collections/${collectionId}`);
};
/**
 * 根据产品分类id获取产品列表
 * @param {产品分类主键} collectionId
 */
const fetchAllProductListByCollectionId = (collectionId) => {
  return new Request().get(`${catalogBaseUrl}/collections/${collectionId}/products`);
};
/**
 * 查询产品详情
 * @param {产品主键} productId
 */
const fetchProductDetails = (productId) => {
  return new Request().get(`${catalogBaseUrl}/products/${productId}`);
};

export {
  createCollection,
  updateCollection,
  deleteCollection,
  fetchCollectionById,
  fetchCollectionList,
  fetchAllCollectionList,
  createOption,
  updateOption,
  deleteOption,
  createProduct,
  fetchOptionList,
  fetchAllOptionList,
  createOptionValue,
  updateOptionValue,
  deleteOptionValue,
  fetchAllOptionValueListByOptionId,
  fetchAllProductListByCollectionId,
  fetchProductDetails,
};
