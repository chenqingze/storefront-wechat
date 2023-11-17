// app.js
import updateManager from './common/updateManager';
import { fetchCartItemTotalQuantity } from './services/cartService';
import { checkAccessToken } from '/services/authService';
App({
  async onLaunch() {
    await this.checkAccessToken().then((userInfo) => {
      fetchCartItemTotalQuantity(userInfo.userId).then(
        (cartItemTotalQuantity) => (this.globalData.cartItemTotalQuantity = cartItemTotalQuantity),
      );
    });
    console.log(this.getUserInfo());
  },
  onShow: function () {
    updateManager();
  },
  globalData: {
    isLogined: false,
    isAdmin: true,
    cartItemTotalQuantity: 0,
    listeners: [], // 存储监听器函数的数组
  },
  // 注册监听器函数的方法
  registerListener: function (listener) {
    this.globalData.listeners.push(listener);
  },
  // 触发监听器函数的方法
  triggerListeners: function () {
    var { listeners } = this.globalData;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  },
  checkAccessToken: function () {
    return new Promise((resolve, reject) => {
      const accessToken = this.getAccessToken();
      // 检查token 是否存在
      if (!accessToken) {
        this.globalData.isLogined = false;
        reject();
        return;
      }
      // 检查token是否过期
      checkAccessToken(accessToken)
        .then(() => {
          // access_token没过期
          // do nothing
          // console.log('========access_token没过期');
          this.globalData.isLogined = true;
          resolve(this.getUserInfo());
        })
        .catch((err) => {
          // console.log('===access_token过期，显示授权登录=====', err);
          // access_token过期，删除本地用户信息
          wx.removeStorageSync('userInfo');
          // 访问需要认证的页面需要弹出显示授权登录
          this.globalData.isLogined = false;
          reject(err);
        });
    });
  },
  // getUserInfo: () => (wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')) : undefined),
  getUserInfo: () => {
    return {
      accessToken: 'd33edde8-faa5-4888-a872-406ef00f6e89',
      accountNonExpired: true,
      accountNonLocked: true,
      authorities: [],
      credentialsNonExpired: true,
      enabled: true,
      name: null,
      userId: 1,
      username: '18853996882',
    };
  },
  getAccessToken: () => {
    // return wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')).accessToken : undefined;
    return 'd33edde8-faa5-4888-a872-406ef00f6e89';
  },
});
