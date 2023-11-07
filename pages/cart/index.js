// pages/cart/index.js
Page({
  /**
   * Page initial data
   */
  data: {},
  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {},

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    this.getTabBar().init();
    const isLogined = this.selectComponent('#loginPopup').checkLoginStatus();
    if (!isLogined) {
      return;
    }
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
