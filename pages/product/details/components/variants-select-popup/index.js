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
      const { productType, variants, options } = product;
      let allOptionValues = [];
      // 根据variant获取所有的的规格值
      variants.forEach((variant) => {
        const _optionValues = [...variant.optionValues];
        allOptionValues = allOptionValues.concat(_optionValues);
      });
      // 规格值去重
      allOptionValues = this.distinctOptionValues(allOptionValues);
      // 获取默认选中的variant
      const defaultVariant = variants.filter((variant) => variant.defaultVariant).at(0);
      const defaultSelectedOptionValueIds = defaultVariant.optionValues.map((optionValue) => optionValue.id);
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
        defaultVariant,
        selectedVariant: defaultVariant,
        selectedOptionValues: defaultVariant.optionValues,
      });
    },
    onChooseOptionValue(e) {
      console.log(this.data);
      const { optionId, optionValueId } = e.currentTarget.dataset;
      const _allOptions = this.data.allOptions;
      let _selectedOptionValue;
      const _selectedOptionIndex = _allOptions.findIndex((option) => option.id === optionId);
      _allOptions.at(_selectedOptionIndex).optionValues.forEach((optionValue) => {
        if (optionValue.id === optionValueId) {
          optionValue.isSelected = true;
          _selectedOptionValue = optionValue;
        } else {
          optionValue.isSelected = false;
        }
      });
      const _selectedOptionValues = this.data.selectedOptionValues;
      const _selectedOptionValuesIndex = _selectedOptionValues.findIndex(
        (selectedOptionValue) => selectedOptionValue.optionId === optionId,
      );
      _selectedOptionValues[_selectedOptionValuesIndex] = _selectedOptionValue;
      this.setData({ allOptions: _allOptions, selectedOptionValues: _selectedOptionValues });
      console.log(this.data);
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
