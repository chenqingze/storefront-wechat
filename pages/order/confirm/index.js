import { fetchDefaultDeliveryAddressDetails } from '../../../services/customerService';

// pages/order/order-confirm/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    address: undefined,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad({ ids }) {
    console.log(ids);
    const customerId = getApp().getUserInfo().userId;
    fetchDefaultDeliveryAddressDetails(customerId).then((address) => {
      this.setData({ address });
    });
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
