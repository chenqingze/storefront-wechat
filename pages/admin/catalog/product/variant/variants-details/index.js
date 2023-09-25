const { cartesian } = require('../../../../../../utils/util');

// pages/admin/catalog/product/variant/variants-details/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    keys: { value: 'id', lable: 'label' },
    selectedVariantOptionValues: [], // 过滤 variant
    optionValuesList: [], // 用于展示和筛选过滤
    optionList: [],
    variantList: [],
  },
  onOptionValueSelected(e) {
    console.log(e);
    const { value } = e.detail;
    const { optionId } = e.currentTarget.dataset;
    const selectedVariantOptionValues = [...this.data.selectedVariantOptionValues];
    const changedOptionValueIndex = selectedVariantOptionValues.findIndex((item) => item.optionId === optionId);
    if (changedOptionValueIndex !== -1) {
      selectedVariantOptionValues[changedOptionValueIndex].value = value;
    }
    this.setData({ selectedVariantOptionValues });
  },
  onInputChange(e) {
    const { value, index, key } = e.detail;
    this.data.variantList[index][key] = value;
  },
  onSubmit() {
    // console.log(this.data);
    const { variantList } = this.data;
    if (variantList.some((variant) => !variant.salePrice || isNaN(variant.salePrice))) {
      wx.showToast({ title: '请配置规格明细！', icon: 'warning' });
      return;
    }
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({ variantList });
    wx.navigateBack();
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    const { optionList, variantList } = JSON.parse(options.data);
    // console.log(optionList);
    // console.log(variantList);
    const optionValuesCartesian = cartesian(...optionList.map((item) => item.optionValues));
    if (variantList.length == 0) {
      const variantListTmp = optionValuesCartesian.map((item) => {
        return {
          salePrice: '',
          retailPrice: '',
          cost: '',
          weight: '',
          values: item,
        };
      });
      this.setData({ optionList, variantList: variantListTmp });
    } else {
      this.setData({ optionList, variantList });
    }
    // console.log(this.data);
    // 用于展示过滤
    const optionValuesList = optionList.map((item) => {
      const { optionValues } = item;
      optionValues.push({ id: '0', optionId: item.id, label: `全部${item.name}` });
      return optionValues;
    });
    const selectedVariantOptionValues = optionList.map((item) => {
      return { optionId: item.id, value: '0' };
    });
    this.setData({ optionValuesList, selectedVariantOptionValues });
    console.log(this.data);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
