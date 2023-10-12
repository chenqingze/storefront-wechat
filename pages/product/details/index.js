import { fetchProductDetails } from '../../../services/catalogService';

// pages/catalog/details/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    current: 0,
    navigation: { type: 'fraction' },
    pictures: [],
    product: {},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    console.log(options);
    const { productId } = options;
    fetchProductDetails(productId).then((product) => {
      // const pictures = product.pictures.map((picture) => `http://localhost:8080/files/${picture.url}`);
      const pictures = [
        'https://tdesign.gtimg.com/miniprogram/images/cell1.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
      ];
      this.setData({ pictures, product });
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
