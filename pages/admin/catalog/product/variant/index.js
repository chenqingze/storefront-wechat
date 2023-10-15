// pages/admin/catalog/product/variant/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    isOptionPopupShow: false,
    variantList: [],
    optionList: [],
  },

  /**
   *  optionList弹出层控制
   */
  onShowOptionPopup() {
    this.setData({ isOptionPopupShow: true });
    const optionListComponnet = this.selectComponent('#optionList');
    optionListComponnet.loadData();
    if (optionListComponnet.data.searchValue) {
      optionListComponnet.setData({ searchValue: '' });
    }
  },
  onHideOptionPopup() {
    this.setData({ isOptionPopupShow: false });
  },

  /**
   *
   * optionValue弹出层控制
   */
  onOptionValuePopup(e) {
    // console.log(e);
    this.setData({ isOptionPopupShow: true });
    const optionListComponnet = this.selectComponent('#optionList');
    optionListComponnet.loadData();
    if (optionListComponnet.data.searchValue) {
      optionListComponnet.setData({ searchValue: '' });
    }
    optionListComponnet.onShowOptionValuePopup(e);
  },

  onOptionSelected(e) {
    // console.log('onOptionSelected', e);
    const { option } = e.detail;
    const index = this.data.optionList.findIndex((item) => item.id === option.id);
    let optionList = [];
    if (index !== -1) {
      // console.log('if', index);
      this.data.optionList[index] = option;
      optionList = [...this.data.optionList];
    } else {
      this.data.optionList.push(option);
      optionList = this.data.optionList;
    }
    // console.log(optionList);
    // 规格变动，更新规格，清空规格明细variantList
    this.setData({ optionList, variantList: [] });
  },

  onDeleteOption(e) {
    const { optionIdx } = e.currentTarget.dataset;
    const optionList = this.data.optionList.filter((item) => item !== this.data.optionList[optionIdx]);
    this.setData({ optionList, variantList: [] });
    // console.log(this.data);
  },

  onVaraintsConfig() {
    // console.log('onVaraintsConfig');
    const data = { optionList: this.data.optionList, variantList: this.data.variantList };
    const dataStr = JSON.stringify(data);
    wx.navigateTo({
      url: `/pages/admin/catalog/product/variant/variants-details/index?data=${dataStr}`,
    });
  },

  onSubmit() {
    // console.log(this.data);
    const { variantList, optionList } = this.data;
    if (optionList.length !== 0 && variantList.length === 0) {
      wx.showToast({ title: '请确保信息完善正确！', icon: 'warning' });
      return;
    }
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 上一个页面
    // console.log(prevPage.data);
    prevPage.setData({ variantList: variantList, optionList: optionList });
    wx.navigateBack();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // console.log(options);
    if (options.data) {
      const { id, optionList, variantList } = JSON.parse(options.data);
      this.setData({ id, optionList, variantList });
      // console.log(this.data);
    }
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
