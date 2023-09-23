// pages/admin/catalog/product/variant/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    visible: false,
    variantList: [],
    optionList: [],
  },

  /**
   *  弹出层控制
   */
  onOptionPopup() {
    this.setData({ visible: true });
    const optionListComponnet = this.selectComponent('#optionList');
    optionListComponnet.loadData();
    if (optionListComponnet.data.searchValue) {
      optionListComponnet.setData({ searchValue: '' });
    }
  },
  onClosePopup() {
    this.setData({ visible: false });
  },

  onPopupVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },

  onOptionValuePopup(e) {
    // console.log(e);
    this.setData({ visible: true });
    const optionListComponnet = this.selectComponent('#optionList');
    optionListComponnet.loadData();
    if (optionListComponnet.data.searchValue) {
      optionListComponnet.setData({ searchValue: '' });
    }
    optionListComponnet.onOptionValuePopup(e);
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
    console.log(optionList);
    this.setData({ optionList });
  },

  onDeleteOption(e) {
    const { optionIdx } = e.currentTarget.dataset;
    const optionList = this.data.optionList.filter((item) => item !== this.data.optionList[optionIdx]);
    this.setData({ optionList });
  },

  onVaraintsConfig() {
    console.log('onVaraintsConfig');
    const data = { optionList: this.data.optionList, variantList: this.data.variantList };
    const dataStr = JSON.stringify(data);
    wx.navigateTo({
      url: `/pages/admin/catalog/product/variant/variants-details/index?data=${dataStr}`,
    });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {},

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
