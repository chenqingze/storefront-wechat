import { deleteCartItem, fetchCartItemList, updateCartItem } from '../../services/cartService';
import { Decimal } from 'decimal.js';
import Dialog from 'tdesign-miniprogram/dialog/index';
// pages/cart/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    selectedItemIndexes: [],
    totalQuantity: 0,
    totalPrice: 0,
    cartItemList: [],
  },
  onCheckout() {
    const { selectedItemIndexes, cartItemList } = this.data;
    if (selectedItemIndexes.length <= 0) {
      Dialog.confirm({
        context: this,
        content: '没有选中任何商品',
        confirmBtn: '确定',
      })
        .then(() => console.log('点击了确定'))
        .catch(() => console.log('点击了取消'))
        .finally(() => Dialog.close());
      return;
    }
    const selectedItemIds = selectedItemIndexes.map((index) => cartItemList[index].id);
    wx.navigateTo({
      url: `/pages/order/confirm/index?ids=${selectedItemIds}`,
    });
  },
  onQuantityChange(e) {
    const { index, value } = e.detail;
    this.data.cartItemList[index].quantity = value;
    const totalQuantity = this.data.selectedItemIndexes.reduce(
      (accumulator, currentIdx) => accumulator + this.data.cartItemList[currentIdx].quantity,
      0,
    );
    this.setData({ totalQuantity });
    const { variantId, quantity } = this.data.cartItemList[index];
    // console.log(variantId);
    const cartId = getApp().getUserInfo().userId;
    if (value === 0) {
      deleteCartItem(cartId, variantId).then(() => this.loadData());
    }
    if (value > 0) {
      updateCartItem(cartId, variantId, { variantId, quantity }).then();
    }
    this.onCheckboxSelectChange();
  },
  onCheckboxSelectChange(e) {
    let selectedItemIndexes;
    if (e) {
      selectedItemIndexes = e.detail.value.filter((value) => !['', null, undefined, NaN].includes(value));
    } else {
      selectedItemIndexes = this.data.selectedItemIndexes;
    }
    const totalQuantity = selectedItemIndexes.reduce(
      (accumulator, currentIdx) => accumulator + this.data.cartItemList[currentIdx].quantity,
      0,
    );
    const totalPrice = selectedItemIndexes.reduce(
      (accumulator, currentIdx) =>
        Decimal.mul(
          this.data.cartItemList[currentIdx].quantity,
          this.data.cartItemList[currentIdx].salePrice ?? this.data.cartItemList[currentIdx].retailPrice,
        )
          .plus(accumulator)
          .toFixed(2),
      0,
    );
    // console.log('===selectedItemIndex==totalQuantity=', selectedItemIndexes, totalQuantity);
    this.setData({ selectedItemIndexes, totalQuantity, totalPrice });
  },
  loadData(page, size) {
    const cartId = getApp().getUserInfo().userId;
    fetchCartItemList(cartId, page, size).then((res) => this.setData({ cartItemList: res.content ?? [] }));
  },
  initData() {
    const { isLogined } = getApp().globalData;
    if (!isLogined) {
      return;
    }
    this.loadData();
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    getApp().registerListener(this.initData.bind(this));
  },
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
    // console.log('======isLogined========', isLogined);
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
