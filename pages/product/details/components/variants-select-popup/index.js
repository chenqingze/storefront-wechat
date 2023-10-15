// pages/product/details/components/variants-popup/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    product: {
      type: Object,
      observer(product) {
        if (product) {
          this.initData(product);
        }
      },
    },
  },

  /**
   * Component initial data
   */
  data: {
    productType: 'STANDARD',
    allOptions: [],
    allOptionValues: [],
    defaultVariant: null,
  },

  /**
   * Component methods
   */
  methods: {
    initData(product) {
      const { productType, variants, options } = product;
      let allOptionValues = [];
      let defaultVariant = null;
      variants.forEach((variant) => {
        const _optionValues = [...variant.optionValues];
        if (variant.defaultVariant) {
          defaultVariant = variant;
          _optionValues.forEach((optionValue) => (optionValue.isSelected = true));
        } else {
          _optionValues.forEach((optionValue) => (optionValue.isSelected = false));
        }
        allOptionValues = allOptionValues.concat(_optionValues);
      });
      const allOptions = [...options];
      allOptions.forEach((option) => {
        const _optionValues = [];
        allOptionValues.forEach((optionValue) => {
          if (optionValue.optionId === option.id) {
            _optionValues.push(optionValue);
          }
        });
        option.optionValues = _optionValues;
      });
      this.setData({ productType, allOptions, allOptionValues, defaultVariant });
    },
    onChooseOptionValue(e) {
      console.log(e);
    },
    onHideVariantsSelectPopup() {
      this.triggerEvent('hideVariantsSelectPopupEvent');
    },
    onBuyNumChange(e) {
      const { value } = e.detail;
      this.setData({
        buyNum: value,
      });
    },
  },
});
