// pages/admin/catalog/product/variant/components/option-value-list/index.js
import { createOptionValue, fetchAllOptionValueListByOptionId } from '../../../../../../../../services/catalogService';
Component({
  /**
   * Component properties
   */
  properties: {
    option: {
      type: Object,
      value: '',
      observer: function (newVal) {
        this.setData({ option: newVal });
        // console.log(this.data);
      },
    },
  },
  /**
   * Component initial data
   */
  data: {
    hasLoaded: true,
    loadMoreStatus: 0, // 0:可加载 1:正在加载  2:不可以加载
    loading: true,
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
      const optionId = this.data.option.id;
      const { loadMoreStatus } = this.data;
      if (loadMoreStatus === 1) return;
      this.setData({
        loadMoreStatus: 1,
        loading: true,
      });
      fetchAllOptionValueListByOptionId(optionId)
        .then((result) => {
          this.setData({
            hasLoaded: true,
            loadMoreStatus: 0,
            loading: false,
            allOptionValueList: result,
            resultOptionValueList: result,
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
      const selectedOptionValues = [];
      const selectedOptionValueLabels = [];
      selectedOptionValueIds.forEach((optionValueId) => {
        const optionValue = this.data.allOptionValueList.find((item) => item.id === optionValueId);
        selectedOptionValueLabels.push(optionValue.label);
        selectedOptionValues.push(optionValue);
      });
      this.setData({ selectedOptionValueIds, selectedOptionValueLabels, selectedOptionValues });
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
