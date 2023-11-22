import TabMenu from './data';
Component({
  attached() {
    getApp().registerListener(this.updateCartItemTotalQuantity.bind(this));
  },
  data: {
    active: 0,
    list: TabMenu,
    cartItemTotalQuantity: { count: getApp().globalData.cartItemTotalQuantity },
  },
  methods: {
    updateCartItemTotalQuantity() {
      this.setData({ cartItemTotalQuantity: { count: getApp().globalData.cartItemTotalQuantity } });
    },
    onChange(event) {
      this.setData({ active: event.detail.value });
      console.log(this.data);
      wx.switchTab({
        url: this.data.list[event.detail.value].url.startsWith('/')
          ? this.data.list[event.detail.value].url
          : `/${this.data.list[event.detail.value].url}`,
      });
    },
    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const active = this.data.list.findIndex(
        (item) => (item.url.startsWith('/') ? item.url.substr(1) : item.url) === `${route}`,
      );
      this.setData({ active, cartItemTotalQuantity: { count: getApp().globalData.cartItemTotalQuantity } });
    },
  },
});
