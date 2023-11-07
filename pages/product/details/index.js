import { addItemToCart } from '../../../services/cartService';
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
    showBackTop: false,
    product: null,
    pictures: [],
    quantity: 1, // 选择购买的数量
    name: '',
    retailPrice: '',
    salePrice: '',
    selectedOptionValueNames: null,
    selectedVariant: null,
  },
  goBack() {
    wx.navigateBack();
  },
  toNav(e) {
    const { url } = e.detail;
    wx.switchTab({
      url: url,
    });
  },
  onAddItemToCart(e) {
    const isLogined = this.selectComponent('#loginPopup').checkLoginStatus();
    if (!isLogined) {
      return;
    }
    console.log(e.type !== 'addItemToCartEvent');
    const { product } = this.data;
    // 判断是否显示VariantsSelectPopup
    if (product.productType === 'VARIANT_BASED' && e.type !== 'addItemToCartEvent') {
      this.onShowVariantsSelectPopup();
      return;
    }
    // 提交加入购物车请求
    if (product.productType === 'STANDARD') {
      const cartId = getApp().getUserInfo().userId;
      const variantId = product.defaultVariantId;
      const { quantity } = this.data;
      const cartItem = { cartId, variantId, quantity };
      // 直接加入购物车
      addItemToCart(cartId, cartItem).then(() => console.log('加入购物车成功！'));
    } else if (product.productType === 'VARIANT_BASED') {
      const cartId = getApp().getUserInfo().userId;
      const variantId = this.data.selectedVariant.id;
      const { quantity } = this.data;
      const cartItem = { cartId, variantId, quantity };
      addItemToCart(cartId, cartItem).then(() => console.log('加入购物车成功！'));
    }
  },
  onShowVariantsSelectPopup() {
    this.setData({ isVariantsSelectPopupShow: true });
  },
  onHideVariantsSelectPopup() {
    this.setData({ isVariantsSelectPopupShow: false });
  },
  onBuyQuantityChange(e) {
    const quantity = e.detail;
    this.setData({ quantity });
  },
  onSelectedOptionValueForVariant(e) {
    const { productType, name, pictures, salePrice, retailPrice } = this.data.product;
    // console.log(e);
    const selectedVariant = e.detail;
    // const pictures = product.pictures.map((picture) => `http://localhost:8080/files/${picture.url}`);
    const _pictures =
      selectedVariant.pictures && selectedVariant.pictures.length > 0
        ? selectedVariant.pictures
        : pictures && pictures.length > 0
        ? pictures
        : [
            'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
            'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
          ];
    const selectedOptionValueNames = selectedVariant.optionValues.map((optionValue) => optionValue.label).join('-');
    this.setData({
      productType,
      pictures: _pictures,
      selectedVariant,
      name: selectedVariant.name ? selectedVariant.name : name,
      salePrice: selectedVariant.salePrice ? selectedVariant.salePrice : salePrice,
      retailPrice: selectedVariant.retailPrice ? selectedVariant.retailPrice : retailPrice,
      selectedOptionValueNames,
    });
  },
  onPageScroll: function (e) {
    // console.log(e.scrollTop);
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
    // 查询商品详情
    const { productId } = options;
    fetchProductDetails(productId).then((product) => {
      const { productType, variants, name, pictures, salePrice, retailPrice } = product;
      if (productType === 'STANDARD') {
        // todo:删掉测试图片链接，使用珍珠的图片链接
        const _pictures = [
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
          'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
        ];
        this.setData({ product, productType, name, pictures: _pictures, salePrice, retailPrice });
      } else if (productType === 'VARIANT_BASED') {
        const selectedVariant = variants.at(0);
        // const pictures = product.pictures.map((picture) => `http://localhost:8080/files/${picture.url}`);
        const _pictures =
          selectedVariant.pictures && selectedVariant.pictures.length > 0
            ? selectedVariant.pictures
            : pictures && pictures.length > 0
            ? pictures
            : [
                'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09a.png',
                'https://cdn-we-retail.ym.tencent.com/tsr/goods/nz-09b.png',
              ];
        const selectedOptionValueNames = selectedVariant.optionValues.map((optionValue) => optionValue.label).join('-');
        this.setData({
          product,
          productType,
          pictures: _pictures,
          selectedVariant,
          name: selectedVariant.name ? selectedVariant.name : name,
          salePrice: selectedVariant.salePrice ? selectedVariant.salePrice : salePrice,
          retailPrice: selectedVariant.retailPrice ? selectedVariant.retailPrice : retailPrice,
          selectedOptionValueNames,
        });
      }
      // console.log(this.data);
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
