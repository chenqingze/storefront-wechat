// pages/admin/catalog/product/variant/components/variant-card/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
    },
    variantListIndex: {
      type: Number,
    },
    variant: {
      type: Object,
    },
    selectedVariantOptionValues: {
      type: Array,
      observer: function (newVal) {
        if (newVal) {
          let variantOptionValues;
          // console.log(Array.isArray(this.data.variant.values));
          if (!Array.isArray(this.data.variant.values)) {
            variantOptionValues = [this.data.variant.values];
          } else {
            variantOptionValues = this.data.variant.values;
          }
          // console.log(variantOptionValues);
          // console.log('newVal=============>', newVal);
          let exist = true;
          outfor: for (const val of newVal) {
            for (const item of variantOptionValues) {
              if (item.optionId !== val.optionId) {
                continue;
              }
              if (val.value !== '0' && val.value !== item.id) {
                exist = false;
                break outfor;
              }
            }
          }
          this.setData({ visible: exist });
        }
      },
    },
    optionValueIds: {
      type: Array,
    },
  },

  /**
   * Component initial data
   */
  data: {
    visible: true,
  },

  /**
   * Component methods
   */
  methods: {
    inputValueChange(e) {
      console.log(e);

      const priceErrorKey = `${e.currentTarget.dataset.key}Error`;
      const priceError = this.data[priceErrorKey] ?? false;
      const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value) || e.detail.value === '';
      if (priceError === isNumber) {
        this.setData({
          [priceErrorKey]: !isNumber,
        });
      }

      const { value } = e.detail;
      const { key, index } = e.currentTarget.dataset;
      this.triggerEvent('inputChangeEvent', { value, index, key });
    },
  },
});
