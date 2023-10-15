// pages/admin/catalog/product/variant/components/option-value-list/index.js
import {
  createOptionValue,
  fetchAllOptionValueListByOption,
} from '../../../../../../../../services/adminCatalogService';
Component({
  /**
   * Component properties
   */
  properties: {
    show: {
      value: false,
      type: Boolean,
    },
    option: {
      type: Object,
      value: '',
      observer: function (newSelectedOption) {
        if (newSelectedOption) {
          this.setData({
            option: newSelectedOption,
          });
          this.loadData();
        }
      },
    },
  },
  /**
   * Component initial data
   */
  data: {
    loadMoreStatus: 0, // 0:idle（空闲） 1:loading（加载中）  2:noMoreData（没有更多数据） 3:error（错误加载失败）,
    searchValue: '',
    allOptionValueList: [],
    resultOptionValueList: [],
    selectedOptionValueIds: [],
    selectedOptionValueLabels: [],
    selectedOptionValues: [],
  },

  /**
   * Component methods
   */
  methods: {
    loadData() {
      const { option } = this.data;
      if (!option) return;
      const optionId = option.id;
      const { loadMoreStatus } = this.data;
      if (loadMoreStatus === 1) return;
      this.setData({
        loadMoreStatus: 1,
      });
      fetchAllOptionValueListByOption(optionId)
        .then((result) => {
          this.setData({
            loadMoreStatus: 0,
            allOptionValueList: result,
            resultOptionValueList: result,
          });
          const { optionValueIds = [], optionValueLabels = [], optionValues = [] } = option;
          const selectedOptionValueIds = optionValueIds;
          const selectedOptionValueLabels = optionValueLabels;
          const selectedOptionValues = optionValues;
          this.setData({ selectedOptionValueIds, selectedOptionValueLabels, selectedOptionValues });
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

    createOptionValue() {
      // console.log('{},searchValue===>:{}', this.data.searchValue, this.data.option);
      const { option, allOptionValueList, searchValue } = this.data;
      if (!searchValue) {
        wx.showToast({ title: '规格值不能为空', icon: 'warning' });
        return;
      }
      const alreadyExist = allOptionValueList.findIndex((item) => item.label === searchValue);
      if (alreadyExist !== -1) {
        wx.showToast({ title: '规格值已存在', icon: 'warning' });
        return;
      }
      createOptionValue(option.id, { label: searchValue })
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

    searchFilter(label) {
      const resultOptionValueList = this.data.allOptionValueList.filter((item) => item.label.includes(label));
      this.setData({ resultOptionValueList });
    },

    onSelectChange(e) {
      const selectedOptionValueIds = e.detail.value;
      // console.log(selectedOptionValueIds);
      const selectedOptionValueLabels = [];
      const selectedOptionValues = [];
      selectedOptionValueIds.forEach((optionValueId) => {
        const optionValue = this.data.allOptionValueList.find((item) => item.id === optionValueId);
        selectedOptionValueLabels.push(optionValue.label);
        selectedOptionValues.push(optionValue);
      });
      this.setData({ selectedOptionValueIds, selectedOptionValueLabels, selectedOptionValues });
      // console.log(this.data);
    },
    onHideOptionValuePopup() {
      this.triggerEvent('hideOptionValuePopupEvent');
    },
    onSubmit() {
      const { option } = this.data;
      const { selectedOptionValueIds, selectedOptionValueLabels, selectedOptionValues } = this.data;
      option.optionValueIds = selectedOptionValueIds;
      option.optionValueLabels = selectedOptionValueLabels;
      option.optionValues = selectedOptionValues;
      // console.log(option);
      this.triggerEvent('submitEvent', { option });
    },
  },
});
