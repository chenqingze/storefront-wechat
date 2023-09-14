// app.js
import updateManager from './common/updateManager';
App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);
    // // 登录
    // wx.login({
    //   success: (res) => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   },
    // });
  },
  onShow: function () {
    updateManager();
  },
  globalData: {
    userInfo: {},
    openid: null,
    isLogin: false,
    isAdmin: false,
    cusid: null,
    isHaveOrder: false,
    limit: false,
    appid: null,
  },
});
