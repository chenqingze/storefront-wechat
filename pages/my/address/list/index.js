/* eslint-disable no-param-reassign */
import Toast from 'tdesign-miniprogram/toast/index';
import { fetchAllDeliveryAddressList, removeDeliveryAddress } from '../../../../services/customerService';

Page({
  /** 选择模式 */
  selectMode: false,
  data: {
    addressList: [],
  },
  loadData() {
    const customerId = getApp().getUserInfo().userId;
    fetchAllDeliveryAddressList(customerId).then((addressList) => {
      addressList.forEach((address) => {
        if (address.defaultAddress) {
          address.checked = true;
        }
      });
      this.setData({ addressList });
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
  selectHandle(e) {
    if (this.selectMode) {
      const pages = getCurrentPages(); // 获取页面栈
      const prevPage = pages[pages.length - 2]; // 上一个页面
      const { address, addressId } = e.currentTarget.dataset;
      prevPage.setData({ address, addressId });
      wx.navigateBack({ delta: 1 });
    } else {
      this.onEditAddress(e);
    }
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
