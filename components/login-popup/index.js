import { wechatLogin } from '../../services/authService';
import { fetchCartItemTotalQuantity } from '../../services/cartService';
// components/login-popup/index.js
Component({
  attached: function () {
    // 注册监听器函数
    this.checkLoginPopupShowStatus();
    getApp().registerListener(this.checkLoginPopupShowStatus.bind(this));
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
    bindPhoneNumberAndLogin(e) {
      const getPhoneNumberCode = e.detail.code;
      if (getPhoneNumberCode) {
        const that = this;
        wx.checkSession({
          success() {
            //session_key 未过期，并且在本生命周期一直有效
            wechatLogin(getPhoneNumberCode)
              .then((userInfo) => {
                wx.setStorageSync('userInfo', JSON.stringify(userInfo));
                getApp().globalData.isLogined = true;
                getApp().triggerListeners();
                fetchCartItemTotalQuantity(userInfo.userId).then(
                  (cartItemTotalQuantity) => (getApp().globalData.cartItemTotalQuantity = cartItemTotalQuantity),
                );
                that.setData({ show: false });
                console.log(userInfo);
              })
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
                    .then((userInfo) => {
                      wx.setStorageSync('userInfo', JSON.stringify(userInfo));
                      getApp().globalData.isLogined = true;
                      getApp().triggerListeners();
                      fetchCartItemTotalQuantity(userInfo.userId).then(
                        (cartItemTotalQuantity) => (getApp().globalData.cartItemTotalQuantity = cartItemTotalQuantity),
                      );
                      console.log(userInfo);
                      that.setData({ show: false });
                    })
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
    checkLoginPopupShowStatus() {
      console.log('测试。。。。');
      this.setData({ show: !getApp().globalData.isLogined });
    },
    onHideLoginPopup() {
      this.setData({ show: false });
    },
  },
});
