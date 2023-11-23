/* eslint-disable no-param-reassign */
import Toast from 'tdesign-miniprogram/toast/index';
import {
  fetchAllDeliveryAddressList,
  removeDeliveryAddress,
  setDefaultDeliveryAddress,
} from '../../../../services/customerService';

Page({
  /** 选择模式 */
  selectMode: false,
  data: {
    addressList: [],
  },
  loadData() {
    const customerId = getApp().getUserInfo().userId;
    fetchAllDeliveryAddressList(customerId).then((addressList) => {
      let defaultSelectedValue;
      addressList.forEach((address, index) => {
        if (address.defaultAddress) {
          defaultSelectedValue = index;
        }
      });
      this.setData({ addressList, defaultSelectedValue });
    });
  },
  getWXAddressHandle() {
    wx.chooseAddress({
      success: (res) => {
        if (res.errMsg.indexOf('ok') === -1) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.errMsg,
            icon: '',
            duration: 1000,
          });
          return;
        }
        Toast({
          context: this,
          selector: '#t-toast',
          message: '添加成功',
          icon: '',
          duration: 1000,
        });
        const { length: len } = this.data.addressList;
        this.setData({
          [`addressList[${len}]`]: {
            name: res.userName,
            phoneNumber: res.telNumber,
            address: `${res.provinceName}${res.cityName}${res.countryName}${res.detailInfo}`,
            isDefault: 0,
            tag: '微信地址',
            id: len,
          },
        });
      },
    });
  },
  onDeleteAddress(e) {
    const customerId = getApp().getUserInfo().userId;
    const { addressId } = e.currentTarget.dataset;
    removeDeliveryAddress(customerId, addressId).then(() => {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '地址删除成功',
        theme: 'success',
        duration: 1000,
      });
      this.loadData();
    });
  },
  onEditAddress(e) {
    const { addressId } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/my/address/details/index?id=${addressId}` });
  },
  onDefaultAddressChange(e) {
    const index = e.detail.value;
    const customerId = getApp().getUserInfo().userId;
    const address = this.data.addressList[index];
    const addressId = address.id;
    setDefaultDeliveryAddress(customerId, addressId).then(() => {
      if (this.selectMode) {
        const pages = getCurrentPages(); // 获取页面栈
        const prevPage = pages[pages.length - 2]; // 上一个页面
        prevPage.setData({ address, addressId });
        wx.navigateBack({ delta: 1 });
      } else {
        this.loadData();
      }
    });
  },
  createHandle() {
    wx.navigateTo({ url: '/pages/my/address/details/index' });
  },
  onLoad(options) {
    const { selectMode = false } = options;
    this.selectMode = !!selectMode;
  },
  onShow() {
    this.loadData();
  },
});
