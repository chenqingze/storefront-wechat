import { createOption, fetchAllOptionList } from '../../../../../../../services/catalogService';

// pages/admin/catalog/product/variant/components/option-popup/index.js
Component({
  attached: function () {
    const selectedOptionIds = this.properties.selectedOptionList.map((item) => item.id) ?? [];
    this.setData({ selectedOptionIds });
    // console.log(this.data);
  },
  /**
   * Component properties
   */
  properties: {
    selectedOptionList: {
      type: Array,
      value: [],
      observer: function (newVal) {
        this.setData({ optionList: newVal });
        const selectedOptionIds = newVal.map((item) => item.id);
        this.setData({ selectedOptionIds });
        // console.log(this.data);
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
    selectedOption: null,
    hasLoaded: true,
    loadMoreStatus: 0, // 0:可加载 1:正在加载  2:不可以加载
    loading: true,
    allOptionList: [],
    searchValue: '',
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
        loading: true,
      });
      fetchAllOptionList()
        .then((result) => {
          this.setData({
            hasLoaded: true,
            loadMoreStatus: 0,
            loading: false,
            allOptionList: result,
            resultOptionList: result,
          });
        })
        .catch(() => {
          this.setData({
            hasLoaded: true,
            loadMoreStatus: 0,
            loading: false,
          });
          wx.showToast({
            title: '查询失败，请稍候重试',
          });
        });

      // const pagenationObj = {
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize,
      //   total: this.total,
      //   isLast: this.isLast,
      // };
      // if (reset) {
      //   pagenationObj.pageNum = 0;
      //   pagenationObj.last = false;
      // } else {
      //   pagenationObj.pageNum++;
      // }
      // fetchOptionList(pagenationObj.pageNum, pagenationObj.pageSize)
      //   .then((result) => {
      //     const { content, totalElements, last } = result;
      //     const _allOptionList = reset ? content : allOptionList.concat(content);
      //     const _loadMoreStatus = last ? 2 : 0;
      //     this.pageNum = pagenationObj.pageNum;
      //     this.total = totalElements;
      //     this.isLast = last;
      //     this.setData({
      //       hasLoaded: true,
      //       loadMoreStatus: _loadMoreStatus,
      //       loading: false,
      //       allOptionList: _allOptionList,
      //       resultOptionList: _allOptionList,
      //     });
      //   })
      //   .catch(() => {
      //     this.setData({
      //       hasLoaded: true,
      //       loading: false,
      //     });
      //     wx.showToast({
      //       title: '查询失败，请稍候重试',
      //     });
      //   });
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
      // console.log(e);
      let selectedOption;
      let selectedOptionValueIds;
      if (e.type === 'tap') {
        const selectedOptionId = e.currentTarget.dataset.id;
        if (this.data.selectedOptionIds.includes(selectedOptionId)) return;
        selectedOption = e.currentTarget.dataset.option;
        selectedOptionValueIds = [];
      } else if (e.type === 'optionValuePopupEvent') {
        // console.log(e.detail);
        selectedOption = e.detail.option;
        selectedOptionValueIds = selectedOption.optionValueIds;
      }
      this.setData({ visible: true, selectedOption });
      const optionValueListComponent = this.selectComponent('#optionValueList');
      optionValueListComponent.loadData();
      optionValueListComponent.setData({
        option: selectedOption,
        selectedOptionValueIds,
      });
      if (optionValueListComponent.data.searchValue) {
        optionValueListComponent.setData({ searchValue: '' });
      }
    },
    onSubmit(e) {
      // console.log('onSubmit', e);
      this.setData({ visible: false });
      this.triggerEvent('closePopupEvent');
      this.triggerEvent('optionSelectedEvent', e.detail);
    },
  },
});
