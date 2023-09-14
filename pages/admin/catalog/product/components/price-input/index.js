// pages/admin/catalog/product/components/price-input/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    token: String,
    label: String,
    priceValue: {
      value: '',
      type: String,
    },
    placeholder: {
      value: '0.00',
      type: String,
    },
    errorMsg: {
      value: '请输入正确的价格',
      type: String,
    },
  },

  /**
   * Component initial data
   */
  data: {
    priceError: false,
  },

  /**
   * Component methods
   */
  methods: {
    onPriceInput(e) {
      const { priceError } = this.data;
      const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value);
      if (priceError === isNumber) {
        this.setData({
          priceError: !isNumber,
        });
      } else {
        this.triggerEvent('priceChangeEvent', { token: this.data.token, priceValue: e.detail.value });
      }
    },
  },
});
