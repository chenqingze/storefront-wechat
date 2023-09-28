import { updateProduct, createProduct, fetchProductDetails } from '../../../../../services/catalogService';
// pages/admin/catalog/product/detials/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    fileList: [],
    id: '',
    name: '',
    collectionNames: [],
    collectionIds: [],
    pictures: [],
    brandId: '',
    brandName: '',
    model: '',
    gtin: '',
    productType: 'STANDARD', // STANDARD:单规格产品/标准产品 ; VARIANT_BASED:多规格产品/多变体产品
    salePrice: '',
    retailPrice: '',
    cost: '',
    weight: '',
    optionIds: [],
    variantList: [],
    optionList: [],
  },
  onUploadImageAdd(e) {
    // const { fileList } = this.data;
    const { files } = e.detail;
    // console.log('onUploadImageAdd===========>', files.length);
    files.forEach((file) => this.uploadFile(file));
  },
  uploadFile(file) {
    const { fileList } = this.data;
    this.setData({
      fileList: [...fileList, { ...file, status: 'loading' }],
    });
    const { length } = fileList;
    // todo: 封装uploadFile 方法到request内
    const task = wx.uploadFile({
      url: 'http://localhost:8081/upload/file', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      // formData: { user: 'test' },
      success: (result) => {
        const image = JSON.parse(result.data);
        const picture = { name: image.name, url: image.path, displayOrder: this.data.pictures.length + 1 };
        this.data.pictures.push(picture);
        this.setData({
          [`fileList[${length}].status`]: 'done',
        });
      },
      fail: () => {
        this.setData({
          [`fileList[${length}].status`]: 'failed',
        });
      },
    });
    task.onProgressUpdate((res) => {
      this.setData({
        [`fileList[${length}].percent`]: res.progress,
      });
    });
  },
  onUploadImageSuccess() {
    // console.log('onUploadImageSuccess============>', e);
    // const { files } = e.detail;
  },
  onUploadImageRemove(e) {
    // console.log('onUploadImageRemove============>', e);
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },
  onUploadImageClick(e) {
    console.log(e.detail.file);
  },
  onProductTypeChange(e) {
    const { value } = e.detail;
    const productType = value ? 'VARIANT_BASED' : 'STANDARD';
    // 控制数据完整性
    if (value) {
      this.setData({ salePrice: '', retailPrice: '', cost: '', weight: '' });
    } else {
      this.setData({ variants: [] });
    }
    this.setData({ productType: productType });
  },
  onPriceInput(e) {
    // console.log(e);
    const priceErrorKey = `${e.currentTarget.dataset.key}Error`;
    const priceError = this.data[priceErrorKey] ?? false;
    const isNumber = /^\d+(\.\d+)?$/.test(e.detail.value) || e.detail.value === '';
    if (priceError === isNumber) {
      this.setData({
        [priceErrorKey]: !isNumber,
      });
    }
  },
  onVariantPage() {
    console.log('onVariantPage');
    const { optionList, variantList } = this.data;
    console.log(this.data);
    const data = JSON.stringify({ optionList, variantList });
    // console.log(data);
    wx.navigateTo({ url: `/pages/admin/catalog/product/variant/index?data=${data}` });
  },
  onSubmit() {
    const {
      id,
      name,
      collectionIds,
      pictures,
      brandId,
      model,
      gtin,
      productType,
      salePrice,
      retailPrice,
      cost,
      weight,
      variantList,
      optionList,
    } = this.data;
    console.log(this.data);

    if (productType === 'VARIANT_BASED' && variantList.length === 0) {
      wx.showToast({ title: '请配置商品规格！', icon: 'warning' });
      return;
    }
    if (productType === 'STANDARD') {
      if (!name) {
        wx.showToast({ title: '请填写产品名称！', icon: 'warning' });
        return;
      }
      if (!salePrice) {
        wx.showToast({ title: '请配填写产品售价！', icon: 'warning' });
        return;
      }
    }
    const optionIds = optionList.map((item) => item.id);
    const variants = variantList.map((item) => {
      // console.log('item=========>', item);
      const valueIds = item.values.map((value) => value.id);
      // console.log('valueIds=======>', valueIds);
      return {
        cost: item.cost,
        retailPrice: item.retailPrice,
        salePrice: item.salePrice,
        valueIds: valueIds,
        weight: item.weight,
      };
    });
    console.log(variants);
    const product = {
      id,
      name,
      collectionIds,
      pictures,
      brandId,
      model,
      gtin,
      productType,
      salePrice,
      retailPrice,
      cost,
      weight,
      optionIds,
      variants,
    };
    if (id) {
      updateProduct(id, product)
        .then(() => {
          wx.showToast({ title: '更新成功', icon: 'success' });
          wx.navigateBack();
        })
        .catch(() => {
          wx.showToast({ title: '更新失败', icon: 'error' });
        });
    } else {
      createProduct(product)
        .then(() => {
          wx.showToast({ title: '添加成功', icon: 'success' });
          wx.navigateBack();
        })
        .catch(() => {
          wx.showToast({ title: '添加失败', icon: 'error' });
        });
    }
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // console.log(options);
    const { productId } = options;
    if (productId) {
      this.setData({ id: productId });
      fetchProductDetails(productId).then((product) => {
        const {
          id,
          name,
          collections = [],
          brandId,
          brandName,
          pictures,
          model,
          gtin,
          productType,
          salePrice,
          retailPrice,
          cost,
          weight,
          variants,
        } = product;
        const collectionNames = [];
        const collectionIds = [];
        collections.forEach((item) => {
          collectionIds.push(item.id);
          collectionNames.push(item.name);
        });
        this.setData({
          id,
          name,
          collectionIds,
          collectionNames,
          pictures,
          brandId,
          brandName, // todo
          model,
          gtin,
          productType,
          salePrice,
          retailPrice,
          cost,
          weight,
          variantList: variants,
        });
      });
    } else {
      wx.setNavigationBarTitle({
        title: '添加产品',
      });
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    // console.log(this.data);
  },

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