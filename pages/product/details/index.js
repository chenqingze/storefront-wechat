import { fetchProductDetails } from '../../../services/catalogService';

// pages/catalog/details/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    current: 0,
    navigation: { type: 'fraction' },
    isVariantsSelectPopupShow: false,
    product: null,
    pictures: [],
    buyNum: 1,
    selectedOptionValueNames: null,
    selectedVariant: null,
    showBackTop: false,
  },
  goBack() {
    wx.navigateBack();
  },
  onShowVariantsSelectPopup() {
    this.setData({ isVariantsSelectPopupShow: true });
  },
  onHideVariantsSelectPopup() {
    this.setData({ isVariantsSelectPopupShow: false });
  },

  onPageScroll: function (e) {
    console.log(e.scrollTop);
    if (e.scrollTop > 100) {
      this.setData({
        showBackTop: true,
      });
    } else {
      this.setData({
        showBackTop: false,
      });
    }
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // console.log(options);
    const { productId } = options;
    fetchProductDetails(productId).then((product) => {
      // const pictures = product.pictures.map((picture) => `http://localhost:8080/files/${picture.url}`);
      const pictures = [
        'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
      ];
      const defaultVariants = product.variants.find((variant) => variant.defaultVariant === true);
      const selectedOptionValueNames = defaultVariants.optionValues.map((optionValue) => optionValue.label).join('-');
      this.setData({ product, pictures, selectedVariant: defaultVariants, selectedOptionValueNames });
      console.log(this.data);
    });
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
