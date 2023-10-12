// components/setting-menu/index.js
Component({
  /**
   * Component properties
   */
  properties: {},

  /**
   * Component initial data
   */
  data: {
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
        url: '/pages/admin/catalog/collection/index',
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
