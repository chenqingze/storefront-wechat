import { updateProduct, fetchProductDetails } from '../../../../../services/catalogService';

// pages/admin/catalog/product/add/index.js
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
    barcode: '',
    productType: 'STANDARD', // STANDARD:单规格产品/标准产品 ; VARIANT_BASED:多规格产品/多变体产品
    salePrice: '',
    retailPrice: '',
    cost: '',
    weightWeight: '',
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
      url: 'http://10.0.0.6:8081/upload/file', // 仅为示例，非真实的接口地址
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
  onSubmit() {
    const {
      id,
      name,
      collectionIds,
      pictures,
      brandId,
      barcode,
      productType,
      salePrice,
      retailPrice,
      cost,
      weightWeight,
    } = this.data;
    const product = {
      id,
      name,
      collectionIds,
      pictures,
      brandId,
      barcode,
      productType,
      salePrice,
      retailPrice,
      cost,
      weightWeight,
    };
    updateProduct(id, product)
      .then(() => {
        wx.showToast({ title: '更新成功', icon: 'success' });
        wx.navigateBack();
      })
      .catch(() => {
        wx.showToast({ title: '更新失败', icon: 'error' });
      });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // console.log(options);
    const { productId } = options;
    fetchProductDetails(productId).then((product) => {
      const {
        id,
        name,
        collections = [],
        brandId,
        brandName,
        pictures,
        barcode,
        productType,
        salePrice,
        retailPrice,
        cost,
        weightWeight,
        weightWeightUnits,
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
        barcode,
        productType,
        salePrice,
        retailPrice,
        cost,
        weightWeight,
        weightWeightUnits,
      });
    });
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
