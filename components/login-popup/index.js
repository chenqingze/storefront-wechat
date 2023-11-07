import { wechatLogin } from '../../services/authService';
import { fetchCartItemTotalQuantity } from '../../services/cartService';
// components/login-popup/index.js
Component({
  attached: function () {
    if (this.properties.autoCheckAuth) {
      // 注册监听器函数
      this.checkLoginStatus();
      getApp().registerListener(this.checkLoginPopupShowStatus.bind(this));
    }
  },
  /**
   * Component properties
   */
  properties: {
    autoCheckAuth: {
      type: Boolean,
      value: false,
    },
    show: {
      type: Boolean,
      value: false,
    },
    failUrl: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: 'navigateTo',
    },
    delta: {
      type: Number,
      value: 1,
    },
  },

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
    checkLoginStatus() {
      const { isLogined } = getApp().globalData;
      console.log('测试。。。。');
      this.setData({ show: !isLogined });
      return isLogined;
    },
    onHideLoginPopup(e) {
      console.log(e.detail);
      this.setData({ show: false });
      this.triggerEvent('hideLoginPopupEvent');
      this.toNav();
    },
    toNav() {
      console.log('====toNav=====');
      const url = this.data.failUrl;
      const { type } = this.data;
      //url是否跳转的tabbar页面，可以自行书写判断代码，如果是type = 'switchTab';否则就自行传递type的值为switchTab;
      //type类型有navigateTo（默认）、redirectTo、switchTab、reLaunch、navigateBack
      //delta参数只有后退才用得着，后台层数。
      if (type == 'navigateTo') {
        wx.navigateTo({
          url: url,
        });
      } else if (type == 'redirectTo') {
        wx.redirectTo({
          url: url,
        });
      } else if (type == 'switchTab') {
        wx.switchTab({
          url: url,
        });
      } else if (type == 'reLaunch') {
        wx.reLaunch({
          url: url,
        });
      } else if (type == 'navigateBack') {
        wx.navigateBack({
          delta: this.data.delta,
        });
      }
    },
  },
});
