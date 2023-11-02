// app.js
import updateManager from './common/updateManager';
import { checkXAuthToken } from '/services/authService';
App({
  onLaunch() {
    this.checkToken();
    console.log(this.getUserInfo());
  },
  onShow: function () {
    updateManager();
  },
  globalData: {
    isLogined: false,
    isAdmin: false,
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
  checkToken: function () {
    const token = this.getToken();
    // 检查token 是否存在
    if (!token) {
      this.globalData.isLogined = false;
      return;
    }
    // 检查token是否过期
    checkXAuthToken(token)
      .then(() => {
        // xAuthToken没过期
        // do nothing
        console.log('========xAuthToken没过期');
      })
      .catch((err) => {
        console.log('===xAuthToken过期，显示授权登录=====', err);
        // xAuthToken过期，删除本地用户信息
        wx.removeStorageSync('userInfo');
        // 访问需要认证的页面需要弹出显示授权登录
        this.globalData.isLogined = false;
      });
  },
  getUserInfo: () => (wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')) : undefined),
  getToken: () => (wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')).xAuthToken : undefined),
});
