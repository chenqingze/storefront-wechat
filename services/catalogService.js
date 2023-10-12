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
const fetchAllCollectionList = () => {
  return new Request().get(`${catalogBaseUrl}/collections`);
};
/**
 * 分页获取分类
 */
const fetchCollectionList = (page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/collections?page=${page}&size=${size}`);
};
const fetchCollectionDetails = (collectionId) => {
  return new Request().get(`${catalogBaseUrl}/collections/${collectionId}`);
};
const fetchProductList = (page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/products?page=${page}&size=${size}`);
};
/**
 * 根据产品分类获取产品列表
 * @param {*} collectionId
 * @param {*} page
 * @param {*} size
 */
const fetchProductListByCollection = (collectionId, page = 0, size = 15) => {
  return new Request().get(`${catalogBaseUrl}/collections/${collectionId}/products?page=${page}&size=${size}`);
};
/**
 * 查询产品详情
 * @param {产品主键} productId
 */
const fetchProductDetails = (productId) => {
  return new Request().get(`${catalogBaseUrl}/products/${productId}`);
};

export {
  fetchCollectionDetails,
  fetchCollectionList,
  fetchAllCollectionList,
  fetchOptionList,
  fetchAllOptionList,
  fetchAllOptionValueListByOption,
  fetchProductDetails,
  fetchProductList,
  fetchProductListByCollection,
};
