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
  isLast: false,
  data: {
    // sideBarIndex和swipperIndex 的值保持同步状态，因为官方bug所以没有绑定同一个变量，详见（https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html#Bug-Tip）
    sideBarIndex: '0',
    swipperIndex: '0',
    collectionList: [{ name: '全部分类', id: '0', path: '/.', displayOrder: 0, parentId: null, visible: true }],
    productList: [],
    loadMoreStatus: 0, // 0:idle（空闲） 1:loading（加载中）  2:noMoreData（没有更多数据） 3:error（错误加载失败）
  },
  /**
   * 选择分类
   * @param {*} e
   */
  onSideBarChange(e) {
    console.log(e);
    const { value } = e.detail;
    const { loadMoreStatus } = this.data;
    // 在加载中或者无更多数据，直接返回
    if (loadMoreStatus !== 0) return;
    this.setData({ loadMoreStatus: 1 });
    if (String(value) === '0') {
      this.loadProductListData(0);
    } else {
      this.loadProductListDataByCollection(value, 0);
    }
  },
  onSwipperChange() {
    // const { current } = e.detail;
    // this.setData({  });
    // getFoodListByCategory(this.data.categoryList[current].id).then((foodList) =>
    //   this.setData({ sideBarIndex: current, foodList: foodList, loading: false, hasLoaded: true }),
    // );
  },

  /**
   * 分页获取全部产品列表
   */
  loadProductListData(pageNum) {
    const reset = !pageNum;
    fetchProductList(pageNum, this.pageSize)
      .then((result) => {
        const { content, totalElements, last } = result;
        const { productList } = this.data;
        this.pageNum = pageNum;
        this.total = totalElements;
        this.last = last;
        this.setData({
          sideBarIndex: '0',
          swipperIndex: '0',
          productList: reset ? content : productList.concat(content),
          loadMoreStatus: 0,
        });
      })
      .catch(() => {
        this.setData({
          loadMoreStatus: 0,
        });
        wx.showToast({ title: '查询失败，请稍候重试', icon: 'error' });
      });
  },
  /**
   * 根据分类分页获取产品列表
   */
  loadProductListDataByCollection(collectionId, pageNum) {
    const reset = !pageNum;
    fetchProductListByCollection(collectionId, pageNum, this.pageSize)
      .then((result) => {
        console.log(result);
        const { content, totalElements, last } = result;
        this.setData({
          sideBarIndex: collectionId,
          swipperIndex: collectionId,
          productList: reset ? content : productList.concat(content),
          loadMoreStatus: 0,
        });
        this.pageNum = pageNum;
        this.total = totalElements;
        this.last = last;
      })
      .catch(() => {
        this.setData({
          loadMoreStatus: 0,
        });
        wx.showToast({ title: '查询失败，请稍候重试', icon: 'error' });
      });
  },
  /**
   * 添加产品
   */
  onAdd() {
    wx.navigateTo({
      url: '/pages/admin/catalog/product/add/index',
    });
  },
  init() {
    fetchAllCollectionList().then((result) => {
      const { collectionList } = this.data;
      this.setData({ collectionList: collectionList.concat(result) });
    });
    this.loadProductListData(0);
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    this.init();
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {},

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
