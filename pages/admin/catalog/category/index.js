import {
  createCategory,
  fetchCategoryDetails,
  updateCategory,
  fetchCategoryList,
} from '../../../../services/catalogService';

// pages/setting/catalog/category/index.js
Page({
  /**
   * Page initial data
   */
  pageNum: 0,
  pageSize: 15,
  total: 0,
  isLast: false,
  data: {
    selectedCategoryNames: [], // 选中的分类名称
    selectedCategoryIds: [], // 选中的分类id
    categoryList: [], // 后端返回的有分类
    pageLoading: false,
    hasLoaded: false,
    loadMoreStatus: 0, // 0:idle（空闲） 1:loading（加载中）  2:noMoreData（没有更多数据） 3:error（错误加载失败）,    loading: true,
    addButtonPopupVisible: true,
    forSelection: false, // page 用于分类管理（false）还是用于分类选择（true）
    dialogConfig: {
      visible: false,
      operatingMode: 'add',
      title: '添加分类',
      id: '',
      name: '',
    },
  },
  loadData(reset = true, isPullDownRefresh = false) {
    if (isPullDownRefresh) {
      wx.stopPullDownRefresh();
      this.setData({
        pageLoading: true,
      });
    }
    const { loadMoreStatus, categoryList } = this.data;
    if (loadMoreStatus === 1) return;
    if (loadMoreStatus !== 0 && reset === false) return;
    this.setData({
      addButtonPopupVisible: false,
      loadMoreStatus: 1,
      loading: true,
    });
    const pagenationObj = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      total: this.total,
      isLast: this.isLast,
    };
    if (reset) {
      pagenationObj.pageNum = 0;
      pagenationObj.last = false;
    } else {
      pagenationObj.pageNum++;
    }
    // console.log(pagenationObj);
    fetchCategoryList(pagenationObj.pageNum, pagenationObj.pageSize)
      .then((result) => {
        // console.log(result);
        const { content, totalElements, last } = result;
        const _categoryList = reset ? content : categoryList.concat(content);
        const _loadMoreStatus = last ? 2 : 0;
        this.pageNum = pagenationObj.pageNum;
        this.total = totalElements;
        this.isLast = last;
        // console.log(this.pageNum, this.pageSize, this.isLast, this.total);
        this.setData({
          addButtonPopupVisible: true,
          pageLoading: false,
          hasLoaded: true,
          loadMoreStatus: _loadMoreStatus,
          loading: false,
          categoryList: _categoryList,
        });
      })
      .catch(() => {
        this.setData({
          addButtonPopupVisible: true,
          pageLoading: false,
          hasLoaded: true,
          loadMoreStatus: 0,
          loading: false,
        });
        wx.showToast({ title: '查询失败，请稍候重试', icon: 'error' });
      });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // console.log(options);
    if (options) {
      const { forSelection, categoryIds } = options;
      const selectedCategoryIds = categoryIds ? categoryIds.split(',') : [];
      this.setData({ forSelection, selectedCategoryIds });
      // console.log(this.data);
    }
    this.loadData(true);
  },

  openDialog(e) {
    // console.log(e);
    let dataset;
    if (!!Object.keys(e.currentTarget.dataset).length) {
      dataset = e.currentTarget.dataset;
    } else {
      dataset = e.detail.currentTarget.dataset;
    }
    const { mode, id } = dataset;
    if (mode === 'add') {
      this.setData({
        dialogConfig: {
          visible: true,
          operatingMode: mode,
          title: '添加分类',
          id: '',
          name: '',
        },
      });
      return;
    }
    if (mode === 'edit') {
      fetchCategoryDetails(id).then((data) =>
        this.setData({
          dialogConfig: {
            visible: true,
            operatingMode: mode,
            title: '编辑分类',
            id: data.id,
            name: data.name,
          },
        }),
      );

      return;
    }
  },
  onSelectChange(e) {
    // console.log(e);
    const { value } = e.detail;
    const selectedCategoryNames = [];
    const selectedItems = this.data.categoryList.filter((item) => value.includes(item.id));
    selectedItems.forEach((item) => {
      selectedCategoryNames.push(item.name);
    });
    this.setData({ selectedCategoryNames, selectedCategoryIds: value });
    // console.log(this.data);
  },
  confirmSelectedCategory() {
    if (!this.data.forSelection) return;
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({
      categoryNames: this.data.selectedCategoryNames,
      categoryIds: this.data.selectedCategoryIds,
    });
    wx.navigateBack({
      //返回上一页面
      delta: 1,
    });
  },
  createCategory(e) {
    createCategory(e.detail)
      .then(() => {
        wx.showToast({ title: '添加成功', icon: 'success' });
        this.setData({ loadMoreStatus: 0 });
        this.loadData(true);
      })
      .catch(() => {
        wx.showToast({ title: '添加失败', icon: 'error' });
      });
  },

  updateCategory(e) {
    // console.log(e.detail);
    updateCategory(e.detail.id, e.detail).then(
      () => {
        wx.showToast({ title: '编辑成功', icon: 'success' });
        this.loadData(true);
      },
      () => {
        wx.showToast({ title: '编辑失败', icon: 'error' });
      },
    );
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
  onPullDownRefresh() {
    this.loadData(true, true);
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {
    const { categoryList } = this.data;
    const { total = 0 } = this;
    if (categoryList.length === total) {
      this.setData({
        loadMoreStatus: 2,
      });
      return;
    }
    this.loadData(false);
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
