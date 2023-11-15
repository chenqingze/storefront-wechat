// pages/cart/components/cart-item/index.js
import Dialog from 'tdesign-miniprogram/dialog/index';
Component({
  attached() {
    this.setData({ quantity: this.properties.cartItem.quantity });
  },
  /**
   * Component properties
   */
  properties: {
    cartItem: {
      type: Object,
    },
    itemIndex: {
      type: Number,
    },
  },

  /**
   * Component initial data
   */
  data: {
    quantity: 0,
  },

  /**
   * Component methods
   */
  methods: {
    onQuantityChange(e) {
      const { index } = e.currentTarget.dataset;
      const { value } = e.detail;
      console.log(value);
      if (value === 0) {
        const dialogConfig = {
          context: this,
          title: '删除商品',
          content: '确定删除该商品吗？',
          confirmBtn: '确定',
          cancelBtn: '取消',
        };
        Dialog.confirm(dialogConfig)
          .then(() => this.triggerEvent('quantityChangeEvent', { index, value }))
          .catch(() => {
            this.setData({ quantity: 1 });
            console.log('点击了取消');
          })
          .finally(() => Dialog.close());
      }
      if (value > 0) {
        this.setData({ quantity: value });
        this.triggerEvent('quantityChangeEvent', { index, value });
      }
    },
  },
});
