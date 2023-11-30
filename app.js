// app.js
import updateManager from './common/updateManager';
import { fetchCartItemTotalQuantity } from './services/cartService';
import { fetchDefaultShippingAddressDetails } from './services/customerService';
import { checkAccessToken } from '/services/authService';
App({
  onLaunch() {
    this.checkAccessToken().then((userInfo) => {
      console.log(this.globalData);
      // 做一些需要认证的初始化操作
      this.getTotalCartItemQuantity(userInfo.id);
      this.getDefaultShippingAddress(userInfo.id);
    });
  },
  onShow: function () {
    updateManager();
  },
  globalData: {
    isLogined: false,
    isAdmin: true,
    cartItemTotalQuantity: 0,
    defaultShippingAddress: undefined,
    listeners: [], // 存储监听器函数的数组
  },
  // 注册监听器函数的方法
  registerListener: function (listener) {
    this.globalData.listeners.push(listener);
  },
  // 触发监听器函数的方法
  triggerListeners: function () {
    const { listeners } = this.globalData;
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  },
  checkAccessToken: function () {
    const accessToken = this.getAccessToken();
    // console.log('========', accessToken);
    // 检查token 是否存在
    if (!accessToken) {
      this.globalData.isLogined = false;
      this.triggerListeners();
      return new Promise((resolve, reject) => {
        reject('access token 不存在');
      });
    }
    // 检查token是否过期
    return checkAccessToken(accessToken)
      .then(() => {
        // access_token没过期
        // do nothing
        // console.log('========access_token没过期');
        this.globalData.isLogined = true;
        this.triggerListeners();
        return this.getUserInfo();
      })
      .catch((err) => {
        // console.log('===access_token过期，显示授权登录=====', err);
        // access_token过期，删除本地用户信息
        wx.removeStorageSync('userInfo');
        // 访问需要认证的页面需要弹出显示授权登录
        this.globalData.isLogined = false;
        this.triggerListeners();
        return err;
      });
  },
  getUserInfo: () => (wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')) : undefined),
  // getUserInfo: () => ({
  //   accessToken: 'e13bd7ee-fbae-4b0f-8246-e1c3e938c277',
  //   accountNonExpired: true,
  //   accountNonLocked: true,
  //   authorities: [],
  //   credentialsNonExpired: true,
  //   enabled: true,
  //   name: null,
  //   userId: 1,
  //   username: '18853996882',
  // }),
  getAccessToken: function () {
    return this.getUserInfo() ? this.getUserInfo().accessToken : undefined;
  },
  getTotalCartItemQuantity: function (userId) {
    const id = userId ? userId : this.getUserInfo().userId;
    return fetchCartItemTotalQuantity(id).then((cartItemTotalQuantity) => {
      this.globalData.cartItemTotalQuantity = cartItemTotalQuantity;
      this.triggerListeners();
    });
  },
  getDefaultShippingAddress: function (userId) {
    const id = userId ? userId : this.getUserInfo().userId;
    fetchDefaultShippingAddressDetails(id).then((address) => (this.globalData.defaultShippingAddress = address));
  },
});
