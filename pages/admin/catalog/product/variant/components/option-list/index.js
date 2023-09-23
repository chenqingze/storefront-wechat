import { createOption, fetchAllOptionList } from '../../../../../../../services/catalogService';

// pages/admin/catalog/product/variant/components/option-popup/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    selectedOptionList: {
      type: Array,
      value: [],
      observer: function (newVal) {
        const selectedOptionList = newVal;
        this.setData({ selectedOptionList });
        const selectedOptionIds = selectedOptionList.map((item) => item.id);
        this.setData({ selectedOptionIds });
        console.log(this.data);
      },
    },
  },
  /**
   * Component initial data
   */
  pageNum: 0,
  pageSize: 15,
  total: 0,
  isLast: false,
  data: {
    visible: false,
    loadMoreStatus: 0, // 0:idle（空闲） 1:loading（加载中）  2:noMoreData（没有更多数据） 3:error（错误加载失败）,
    searchValue: '',
    selectedOption: undefined,
    selectedOptionList: [],
    allOptionList: [],
    resultOptionList: [],
  },

  /**
   * Component methods
   */
  methods: {
    loadData() {
      // const { loadMoreStatus, allOptionList } = this.data;
      const { loadMoreStatus } = this.data;
      if (loadMoreStatus === 1) return;
      this.setData({
        loadMoreStatus: 1,
      });
      fetchAllOptionList()
        .then((result) => {
          this.setData({
            loadMoreStatus: 0,
            allOptionList: result,
            resultOptionList: result,
          });
        })
        .catch(() => {
          this.setData({
            loadMoreStatus: 0,
          });
          wx.showToast({
            title: '查询失败，请稍候重试',
          });
        });
    },

    createOption() {
      // console.log(this.data.searchValue);
      const { allOptionList, searchValue } = this.data;
      if (!searchValue) {
        wx.showToast({ title: '规格名不能为空', icon: 'warning' });
        return;
      }
      const alreadyExist = allOptionList.findIndex((item) => item.name === searchValue);
      if (alreadyExist !== -1) {
        wx.showToast({ title: '规格名已存在', icon: 'warning' });
        return;
      }
      createOption({ name: searchValue, displayName: searchValue })
        .then(() => {
          wx.showToast({ title: '添加成功', icon: 'success' });
          this.setData({ loadMoreStatus: 0 });
          this.loadData(true);
          this.setData({ searchValue: '' });
        })
        .catch(() => {
          wx.showToast({ title: '添加失败', icon: 'error' });
          this.setData({ searchValue: '' });
        });
    },

    onSearchValueChange(e) {
      // console.log(e.detail);
      this.searchFilter(e.detail.value);
    },

    searchFilter(optionName) {
      const resultOptionList = this.data.allOptionList.filter((item) => item.name.includes(optionName));
      this.setData({ resultOptionList });
    },

    onPopupVisibleChange(e) {
      const { visible } = e.detail;
      this.setData({
        visible,
      });
      if (!visible) {
        this.triggerEvent('closePopupEvent');
      }
    },

    onOptionValuePopup(e) {
      console.log(e);
      let selectedOption;
      if (e.type === 'tap') {
        const selectedOptionId = e.currentTarget.dataset.id;
        if (this.data.selectedOptionIds.includes(selectedOptionId)) return;
        selectedOption = e.currentTarget.dataset.option;
      } else if (e.type === 'optionValuePopupEvent') {
        selectedOption = e.detail.option;
      }
      this.setData({ selectedOption });
      const optionValueListComponent = this.selectComponent('#optionValueList');
      if (optionValueListComponent.data.searchValue) {
        optionValueListComponent.setData({ searchValue: '' });
      }
      this.setData({ visible: true });
      // console.log(optionValueListComponent.data);
    },

    onSubmit(e) {
      // console.log('onSubmit', e);
      this.setData({ visible: false });
      this.triggerEvent('closePopupEvent');
      this.triggerEvent('optionSelectedEvent', e.detail);
    },
  },
});
