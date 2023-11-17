/* eslint-disable no-param-reassign */
import Toast from 'tdesign-miniprogram/toast/index';
import { fetchAllDeliveryAddressList, removeDeliveryAddress } from '../../../../services/customerService';

Page({
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
  confirmDeleteHandle({ detail }) {
    const { id } = detail || {};
    if (id !== undefined) {
      this.setData({ deleteID: id, showDeleteConfirm: true });
      Toast({
        context: this,
        selector: '#t-toast',
        message: '地址删除成功',
        theme: 'success',
        duration: 1000,
      });
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '需要组件库发新版才能拿到地址ID',
        icon: '',
        duration: 1000,
      });
    }
  },
  onDeleteAddress(e) {
    const customerId = getApp().getUserInfo().userId;
    const { addressId } = e.currentTarget.dataset;
    removeDeliveryAddress(customerId, addressId).then(this.loadData());
  },
  onEditAddress(e) {
    const { addressId } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/my/address/details/index?id=${addressId}` });
  },
  selectHandle({ detail }) {
    if (this.selectMode) {
      this.hasSelect = true;
      // resolveAddress(detail);
      wx.navigateBack({ delta: 1 });
    } else {
      this.editAddressHandle({ detail });
    }
  },
  createHandle() {
    wx.navigateTo({ url: '/pages/my/address/details/index' });
  },
  onLoad() {},
  onShow() {
    this.loadData();
  },
});
