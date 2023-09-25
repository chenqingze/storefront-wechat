// pages/setting/catalog/index.js

import {
  fetchAllCollectionList,
  fetchProductList,
  fetchProductListByCollection,
} from '../../../services/catalogService';

Page({
  /**
   * Page initial data
   */
  pageNum: 0,
  pageSize: 15,
  total: 0,
  last: false,
  data: {
    collectionList: [{ name: '全部分类', id: '0', path: '/.', displayOrder: 0, parentId: null, visible: true }],
    productList: [],
    sideBarIndex: 0,
    loadMoreStatus: 0, // 0:idle（空闲） 1:loading（加载中）  2:noMoreData（没有更多数据） 3:error（错误加载失败）,
    scrollTop: 0,
  },
  /**
   * 选择分类
   * @param {*} e
   */
  onSideBarChange(e) {
    // console.log(e);
    // value 是被选中的siderbar item
    const { value } = e.detail;
    this.setData({ sideBarIndex: value });
    this.loadData();
  },
  loadData(reset = true) {
    const { sideBarIndex, loadMoreStatus } = this.data;
    let _pageNum = this.pageNum || 0;
    if (reset) {
      _pageNum = 0;
    } else {
      if (loadMoreStatus !== 0) return;
      _pageNum++;
    }
    // console.log(this.data);
    // 开始查询锁定查询状态
    this.setData({ loadMoreStatus: 1 });
    if (sideBarIndex === 0) {
      // 分页获取全部产品列表
      fetchProductList(_pageNum, this.pageSize)
        .then((result) => {
          const { content, totalElements, last } = result;
          const { productList } = this.data;
          const _productList = reset ? content : productList.concat(content);
          const _loadMoreStatus = last ? 2 : 0;
          this.pageNum = _pageNum;
          this.total = totalElements;
          this.last = last;
          this.setData({
            productList: _productList,
            loadMoreStatus: _loadMoreStatus,
          });
          if (reset) {
            this.setData({ scrollTop: 0 });
          }
        })
        .catch(() => {
          this.setData({
            loadMoreStatus: 0,
          });
          wx.showToast({ title: '查询失败，请稍候重试', icon: 'error' });
        });
    } else {
      fetchProductListByCollection(this.data.collectionList[sideBarIndex].id, _pageNum, this.pageSize)
        .then((result) => {
          // console.log(result);
          const { content, totalElements, last } = result;
          const _productList = reset ? content : productList.concat(content);
          const _loadMoreStatus = last ? 2 : 0;
          this.pageNum = _pageNum;
          this.total = totalElements;
          this.last = last;
          this.setData({
            productList: _productList,
            loadMoreStatus: _loadMoreStatus,
          });
          if (reset) {
            this.setData({ scrollTop: 0 });
          }
        })
        .catch(() => {
          this.setData({
            loadMoreStatus: 3,
          });
          wx.showToast({ title: '查询失败，请稍候重试', icon: 'error' });
        });
    }
  },
  onScrollToLower() {
    // console.log('onScrollToLower');
    this.loadData(false);
  },

  /**
   * 添加产品
   */
  onAdd() {
    wx.navigateTo({
      url: '/pages/admin/catalog/product/details/index',
    });
  },
  onProductDetails(e) {
    console.log(e);
    const { productId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/catalog/product/details/index?productId=${productId}`,
    });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    fetchAllCollectionList().then((result) => {
      const { collectionList } = this.data;
      this.setData({ collectionList: collectionList.concat(result) });
      // this.loadData(); // onshow的时候已经查询过了
    });
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    this.setData({ sideBarIndex: 0 });
    this.loadData();
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom() {},
});
