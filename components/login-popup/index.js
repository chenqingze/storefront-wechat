import { wechatLogin } from '../../services/authService';

// components/login-popup/index.js
Component({
  attached: function () {
    this.onLoad();
  },
  /**
   * Component properties
   */
  properties: {},

  /**
   * Component initial data
   */
  data: {
    show: false,
  },

  /**
   * Component methods
   */
  methods: {
    onLoad() {
      const { token } = getApp().globalData;
      // checkToken是否过期
      // 没有token或者token过期显示授权登录
      this.setData({ show: !token });
    },
    bindPhoneNumberAndLogin(e) {
      const getPhoneNumberCode = e.detail.code;
      if (getPhoneNumberCode) {
        wx.checkSession({
          success() {
            //session_key 未过期，并且在本生命周期一直有效
            wechatLogin(getPhoneNumberCode)
              .then((userInfo) =>
                // wx.setStorageSync('logs', logs);
                console.log(userInfo),
              )
              .catch((err) => console.error(err));
          },
          fail() {
            // session_key 已经失效，需要重新执行登录流程
            //重新登录
            wx.login({
              success(res) {
                if (res.code) {
                  //发起网络请求
                  wechatLogin(getPhoneNumberCode)
                    .then((userInfo) =>
                      // wx.setStorageSync('logs', logs);
                      console.log(userInfo),
                    )
                    .catch((err) => console.error(err));
                } else {
                  console.log(`登录失败！${res.errMsg}`);
                }
              },
            });
          },
        });
      } else {
        wx.showToast({
          title: '授权失败请重试！',
        });
      }
    },

    onHideLoginPopup() {
      this.setData({ show: false });
    },
  },
});
