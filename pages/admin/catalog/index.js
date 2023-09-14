// pages/setting/catalog/index.js

Page({
  /**
   * Page initial data
   */
  pageNum: 0,
  pageSize: 15,
  total: 0,
  isLast: false,
  data: {
    border: {
      color: '#f6f6f6',
    },
    collectionList: [],
    productList: [],
    hasLoaded: false,
    loadMoreStatus: 0,
    loading: true,
  },

  onAdd() {
    wx.navigateTo({
      url: '/pages/admin/catalog/product/add/index',
    });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    // fetchAllCollectionList().then((collectionList) => this.setData({ collectionList }));
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
