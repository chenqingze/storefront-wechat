// pages/cart/components/cart-item/index.js
Component({
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
  data: {},

  /**
   * Component methods
   */
  methods: {
    onQuantityChange(e) {
      const { index } = e.currentTarget.dataset;
      const { value } = e.detail;
      this.triggerEvent('quantityChangeEvent', { index, value });
    },
  },
});
