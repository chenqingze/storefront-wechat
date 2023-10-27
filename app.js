// app.js
import updateManager from './common/updateManager';
App({
  onLaunch() {
    this.globalData.token = wx.getStorageSync('token') || '';
    // wx.setStorageSync('logs', logs);
  },
  onShow: function () {
    updateManager();
  },
  globalData: {
    userInfo: {},
    token: '',
    isAdmin: false,
  },
});
