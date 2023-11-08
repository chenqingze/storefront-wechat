import { fetchCartItemList, updateCartItem } from '../../services/cartService';

// pages/cart/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    selectedItemIndex: [],
    totalQuantity: 0,
    cartItemList: [],
  },
  onQuantityChange(e) {
    const { index, value } = e.detail;
    this.data.cartItemList[index].quantity = value;
    const totalQuantity = this.data.selectedItemIndex.reduce(
      (accumulator, currentIdx) => accumulator + this.data.cartItemList[currentIdx].quantity,
      0,
    );
    this.setData({ totalQuantity });
    const { variantId, quantity } = this.data.cartItemList[index];
    // console.log(variantId);
    const cartId = getApp().getUserInfo().userId;
    updateCartItem(cartId, variantId, { variantId, quantity }).then();
  },
  onCheckboxSelectChange(e) {
    const selectedItemIndex = e.detail.value.filter((value) => !['', null, undefined, NaN].includes(value));
    const totalQuantity = selectedItemIndex.reduce(
      (accumulator, currentIdx) => accumulator + this.data.cartItemList[currentIdx].quantity,
      0,
    );
    // console.log('===selectedItemIndex==totalQuantity=', selectedItemIndex, totalQuantity);
    this.setData({ selectedItemIndex, totalQuantity });
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
