// components/setting-menu/index.js
Component({
  attached: function () {
    // 注册监听器函数
    getApp().registerListener(this.checkAdminButtonShowStatus.bind(this));
    this.checkAdminButtonShowStatus();
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
    placement: 'left',
    sidebar: [],
    menuItems: [
      {
        title: '订单管理',
        icon: 'app',
        url: '/pages/admin/order/index.js',
      },
      {
        title: '产品目录',
        icon: 'app',
        url: '/pages/admin/catalog/index',
      },
      {
        title: '分类管理',
        icon: 'app',
        url: '/pages/admin/catalog/category/index',
      },
      {
        title: '产品详情',
        icon: 'app',
        url: '/pages/catalog/product/details/index',
      },
    ],
  },

  /**
   * Component methods
   */
  methods: {
    checkAdminButtonShowStatus() {
      console.log(getApp().globalData);
      this.setData({ show: getApp().globalData.isLogined && getApp().globalData.isAdmin });
    },
    openAdminMenu() {
      this.setData({
        visible: true,
        sidebar: this.data.menuItems,
      });
    },

    itemClick(e) {
      console.log(e.detail);
      const { url } = e.detail.item;
      console.log(url);
      wx.navigateTo({
        url: url,
      });
    },

    overlayClick(e) {
      console.log(e.detail);
    },
  },
});
