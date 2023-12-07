import { deleteCartItem, fetchCartItemList, updateCartItem, selectCartItems } from '../../services/cartService';
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
    // 检测是有配送地址，没有则提示增加
    if (!getApp().globalData.defaultShippingAddress) {
      Dialog.confirm({
        context: this,
        content: '您还没有添加配送地址',
        cancelBtn: '取消',
        confirmBtn: '去添加',
        closeBtn: false,
      })
        .then(() =>
          wx.navigateTo({
            url: '/pages/my/address/details/index',
          }),
        )
        .catch(() => console.log('点击了取消'))
        .finally(() => Dialog.close());
      return;
    }
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
    const selectedCartItems = JSON.stringify(selectedItemIndexes.map((index) => cartItemList[index]));
    wx.navigateTo({
      url: `/pages/order/confirm/index?selectedCartItems=${selectedCartItems}`,
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
      updateCartItem(cartId, variantId, { variantId, quantity }).then(() => getApp().getTotalCartItemQuantity(cartId));
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
    const { cartItemList } = this.data;
    // 购物车商品的被选中状态同步到数据库:todo完善后端
    const cartId = getApp().getUserInfo().userId;
    const selectedItemIds = selectedItemIndexes.map((index) => cartItemList[index].variantId);
    selectCartItems(cartId, selectedItemIds).then();
    const totalQuantity = selectedItemIndexes.reduce(
      (accumulator, currentIdx) => accumulator + cartItemList[currentIdx].quantity,
      0,
    );
    const totalPrice = selectedItemIndexes.reduce(
      (accumulator, currentIdx) =>
        Decimal.mul(
          cartItemList[currentIdx].quantity,
          cartItemList[currentIdx].salePrice ?? cartItemList[currentIdx].retailPrice,
        )
          .plus(accumulator)
          .toFixed(2),
      0,
    );
    // console.log('===selectedItemIndex==totalQuantity=', selectedItemIndexes, totalQuantity);
    this.setData({ selectedItemIndexes, totalQuantity, totalPrice });
  },
  async loadData(page, size) {
    const cartId = getApp().getUserInfo().userId;
    fetchCartItemList(cartId, page, size).then((res) => this.setData({ cartItemList: res.content ?? [] }));
  },
  initData() {
    const { isLogined, cartItemTotalQuantity } = getApp().globalData;
    if (!isLogined) {
      return;
    }
    this.setData({ totalQuantity: cartItemTotalQuantity });
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
