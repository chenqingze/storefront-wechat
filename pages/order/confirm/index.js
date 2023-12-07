import { fetchDefaultShippingAddressDetails } from '../../../services/customerService';
import { Decimal } from 'decimal.js';
// pages/order/order-confirm/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    address: undefined,
    cartItemList: [],
    totalFulfillmentCharges: 0,
    totalPrice: 0,
    totalAmount: 0,
  },
  onPayment() {
    // 后端创建订单
    // 配送地址信息
    // cartItem 信息（variantId quantity）
    // 优惠信息
    // 包装费用
    // 配送费用
  },
  performCheckout(cartItemList) {
    const totalPrice = cartItemList.reduce(
      (accumulator, current) =>
        Decimal.mul(current.salePrice ? current.salePrice : current.retailPrice, current.quantity)
          .plus(accumulator)
          .toFixed(2),
      0,
    );
    // todo:配送费
    const totalFulfillmentCharges = 0;
    const totalAmount = Decimal.add(totalPrice, totalFulfillmentCharges).toFixed(2);
    this.setData({ totalFulfillmentCharges, totalPrice, totalAmount });
  },
  onTapAddress() {
    wx.navigateTo({
      url: '/pages/my/address/list/index?selectMode=true',
    });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad({ selectedCartItems }) {
    if (!selectedCartItems) {
      wx.navigateBack();
      return;
    }
    const cartItemList = JSON.parse(selectedCartItems);
    this.setData({ cartItemList });
    // 查询默认收货地址
    const customerId = getApp().getUserInfo().userId;
    fetchDefaultShippingAddressDetails(customerId).then((address) => this.setData({ address }));
    // 计算费用,可以前端处理也可以调用后端处理
    // 调用后端的处理方式：
    //checkout(cartItemIds).then((data) => console.log(data));
    // 前端的处理方式
    this.performCheckout(cartItemList);
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
