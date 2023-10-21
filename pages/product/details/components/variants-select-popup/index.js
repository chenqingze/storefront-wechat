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
      quantity: {
        type: Number,
        value: 1,
      },
    },
  },

  /**
   * Component initial data
   */
  data: {
    productType: 'STANDARD',
    primaryPicture: '',
    name: '',
    salePrice: null,
    retailPrice: null,
    allOptions: [],
    allOptionValues: [],
    selectedVariant: null,
    selectedOptionValues: [],
  },

  /**
   * Component methods
   */
  methods: {
    // 去重方法
    distinctOptionValues(arr) {
      const newArray = [];
      const newMap = new Map();
      for (let i = 0, len = arr.length; i < len; i++) {
        if (!newMap.has(arr[i].id)) {
          newMap.set(arr[i].id, arr[i].id);
          newArray.push(arr[i]);
        }
      }
      return newArray;
    },
    initData(product) {
      const { productType, variants, options, name, primaryPicture, salePrice, retailPrice } = product;
      if (product.productType === 'STANDARD') {
        this.setData({ productType, name, primaryPicture, salePrice, retailPrice });
      } else if (product.productType === 'VARIANT_BASED') {
        let allOptionValues = [];
        // 根据variant获取所有的的规格值
        variants.forEach((variant) => {
          const _optionValues = [...variant.optionValues];
          allOptionValues = allOptionValues.concat(_optionValues);
        });
        // 规格值去重
        allOptionValues = this.distinctOptionValues(allOptionValues);
        // 获取默认选中的variant
        const selectedVariant = { ...variants.at(0) };
        const defaultSelectedOptionValueIds = selectedVariant.optionValues.map((optionValue) => optionValue.id);
        allOptionValues.forEach((optionValue) => {
          if (defaultSelectedOptionValueIds.includes(optionValue.id)) {
            optionValue.isSelected = true;
          } else {
            optionValue.isSelected = false;
          }
        });
        // 拼装所有规格
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
        this.setData({
          productType,
          allOptions,
          allOptionValues,
          selectedVariant,
          primaryPicture,
          name: selectedVariant.name ? selectedVariant.name : name,
          salePrice: selectedVariant.salePrice ? selectedVariant.salePrice : salePrice,
          retailPrice: selectedVariant.retailPrice ? selectedVariant.retailPrice : retailPrice,
          selectedOptionValues: [...selectedVariant.optionValues],
        });
      }
    },
    onChooseOptionValue(e) {
      // 修改默认数量
      this.onBuyQuantityChange(1);
      const { name, salePrice, retailPrice } = this.data.product;
      const { optionId, optionValueId } = e.currentTarget.dataset;
      const { allOptions } = this.data;
      let selectedOptionValue;
      const selectedOptionIndex = allOptions.findIndex((option) => option.id === optionId);
      allOptions.at(selectedOptionIndex).optionValues.forEach((optionValue) => {
        if (optionValue.id === optionValueId) {
          optionValue.isSelected = true;
          selectedOptionValue = optionValue;
        } else {
          optionValue.isSelected = false;
        }
      });
      const { selectedOptionValues } = this.data;
      const selectedOptionValuesIndex = selectedOptionValues.findIndex(
        (selectedOptionValue) => selectedOptionValue.optionId === optionId,
      );
      selectedOptionValues[selectedOptionValuesIndex] = selectedOptionValue;
      // 查找默认选择的variant
      const selectedOptionValueIds = selectedOptionValues.map((selectedOptionValue) => selectedOptionValue.id);
      const selectedVariant = this.data.product.variants.find((_variant) => {
        const variantOptionValueIds = _variant.optionValues.map((optionValue) => optionValue.id);
        return variantOptionValueIds.every((optionValueId) => selectedOptionValueIds.includes(optionValueId));
      });
      this.setData({
        allOptions,
        selectedOptionValues,
        name: selectedVariant.name ? selectedVariant.name : name,
        salePrice: selectedVariant.salePrice ? selectedVariant.salePrice : salePrice,
        retailPrice: selectedVariant.retailPrice ? selectedVariant.retailPrice : retailPrice,
        selectedOptionValues: [...selectedVariant.optionValues],
      });
      this.triggerEvent('selectedOptionValueForVariantEvent', selectedVariant);
      // console.log(this.data);
    },
    onHideVariantsSelectPopup() {
      this.triggerEvent('hideVariantsSelectPopupEvent');
    },
    onBuyQuantityChange(e) {
      console.log(e);
      let value;
      if (e.type && e.type === 'change') {
        value = e.detail.value;
      } else {
        value = e;
      }
      this.setData({
        quantity: value,
      });
      this.triggerEvent('buyQuantityChangeEvent', value);
    },
  },
});
