import { regionData } from '../../../../config/index';
import {
  fetchShippingAddressDetails,
  addShippingAddress,
  updateShippingAddress,
} from '../../../../services/customerService';
import Toast from 'tdesign-miniprogram/toast/index';

const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';
const tagOptions = ['家', '公司'];

Page({
  options: {
    multipleSlots: true,
  },
  data: {
    address: {
      id: '',
      name: '',
      phoneNumber: '',
      countryCode: '',
      countryName: '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      detailAddress: '',
      tag: '',
      defaultAddress: false,
    },
    regionData: regionData,
    tags: tagOptions,
    regionPickerVisible: false,
    submitActive: false,
    visible: false,
    columns: 3,
  },
  privateData: {
    verifyTips: '请完善信息后保存！',
  },
  onLoad(options) {
    const { id } = options;
    console.log(id);
    if (id) {
      this.getAddressDetail(id);
    }
  },
  getAddressDetail(addressId) {
    const customerId = getApp().getUserInfo().userId;
    fetchShippingAddressDetails(customerId, addressId).then((address) => {
      const { tag } = address;
      if (tag && !tagOptions.includes(tag)) {
        tagOptions.push(tag);
      }
      this.setData({ address }, () => {
        const { isLegal, tips } = this.onVerifyInputLegal();
        this.setData({
          submitActive: isLegal,
        });
        this.privateData.verifyTips = tips;
      });
    });
  },
  onInputValue(e) {
    const { item } = e.currentTarget.dataset;
    if (item === 'address') {
      const { selectedOptions = [] } = e.detail;
      this.setData({
        'address.provinceCode': selectedOptions[0].value,
        'address.provinceName': selectedOptions[0].label,
        'address.cityName': selectedOptions[1].label,
        'address.cityCode': selectedOptions[1].value,
        'address.countyCode': selectedOptions[2].value,
        'address.countyName': selectedOptions[2].label,
        regionPickerVisible: false,
      });
      const { isLegal, tips } = this.onVerifyInputLegal();
      console.log(isLegal, tips);
      this.setData({
        submitActive: isLegal,
      });
      this.privateData.verifyTips = tips;
    } else {
      const { value = '' } = e.detail;
      this.setData({
        [`address.${item}`]: value,
      });
      const { isLegal, tips } = this.onVerifyInputLegal();
      this.setData({
        submitActive: isLegal,
      });
      this.privateData.verifyTips = tips;
    }
  },
  onPickRegion() {
    this.setData({ regionPickerVisible: true });
  },
  onPickTags(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      'address.tag': item,
    });
  },
  addLabels() {
    this.setData({
      visible: true,
    });
  },
  confirmHandle() {
    const { tags, tagValue } = this.data;
    this.setData({
      visible: false,
      tags: [...tags, tagValue],
      tagValue: '',
    });
  },
  cancelHandle() {
    this.setData({
      visible: false,
      tagValue: '',
    });
  },
  // onCheckDefaultAddress({ detail }) {
  //   const { value } = detail;
  //   this.setData({
  //     'address.defaultAddress': value,
  //   });
  // },

  onVerifyInputLegal() {
    const { name, phoneNumber, detailAddress, countyName } = this.data.address;
    const prefixPhoneReg = String(this.properties.phoneReg || innerPhoneReg);
    const prefixNameReg = String(this.properties.nameReg || innerNameReg);
    const nameRegExp = new RegExp(prefixNameReg);
    const phoneRegExp = new RegExp(prefixPhoneReg);

    if (!name || !name.trim()) {
      return {
        isLegal: false,
        tips: '请填写收货人',
      };
    }
    if (!nameRegExp.test(name)) {
      return {
        isLegal: false,
        tips: '收货人仅支持输入中文、英文（区分大小写）、数字',
      };
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return {
        isLegal: false,
        tips: '请填写手机号',
      };
    }
    if (!phoneRegExp.test(phoneNumber)) {
      return {
        isLegal: false,
        tips: '请填写正确的手机号',
      };
    }
    if (!countyName || !countyName.trim()) {
      return {
        isLegal: false,
        tips: '请选择省市区信息',
      };
    }
    if (!detailAddress || !detailAddress.trim()) {
      return {
        isLegal: false,
        tips: '请完善详细地址',
      };
    }
    if (detailAddress && detailAddress.trim().length > 50) {
      return {
        isLegal: false,
        tips: '详细地址不能超过50个字符',
      };
    }
    return {
      isLegal: true,
      tips: '添加成功',
    };
  },

  builtInSearch({ code, name }) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting[code] === false) {
            wx.showModal({
              title: `获取${name}失败`,
              content: `获取${name}失败，请在【右上角】-小程序【设置】项中，将【${name}】开启。`,
              confirmText: '去设置',
              confirmColor: '#FA550F',
              cancelColor: '取消',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(settinRes) {
                      if (settinRes.authSetting[code] === true) {
                        resolve();
                      } else {
                        console.warn('用户未打开权限', name, code);
                        reject();
                      }
                    },
                  });
                } else {
                  reject();
                }
              },
              fail() {
                reject();
              },
            });
          } else {
            resolve();
          }
        },
        fail() {
          reject();
        },
      });
    });
  },

  onSearchAddress() {
    this.builtInSearch({ code: 'scope.userLocation', name: '地址位置' }).then(() => {
      wx.chooseLocation({
        success: (res) => {
          if (res.name) {
            this.triggerEvent('addressParse', {
              address: res.address,
              name: res.name,
              latitude: res.latitude,
              longitude: res.longitude,
            });
          } else {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '地点为空，请重新选择',
              icon: '',
              duration: 1000,
            });
          }
        },
        fail: function (res) {
          console.warn(`wx.chooseLocation fail: ${JSON.stringify(res)}`);
          if (res.errMsg !== 'chooseLocation:fail cancel') {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '地点错误，请重新选择',
              icon: '',
              duration: 1000,
            });
          }
        },
      });
    });
  },
  onSubmit() {
    const { submitActive } = this.data;
    if (!submitActive) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: this.privateData.verifyTips,
        icon: '',
        duration: 1000,
      });
      return;
    }
    const { address } = this.data;
    console.log(address);
    const { userId } = getApp().getUserInfo();
    if (address.id) {
      updateShippingAddress(userId, address.id, address).then(wx.navigateBack({ delta: 1 }));
    } else {
      addShippingAddress(userId, address).then(wx.navigateBack({ delta: 1 }));
    }
  },
  getWeixinAddress(e) {
    const { address } = this.data;
    const weixinAddress = e.detail;
    this.setData(
      {
        address: { ...address, ...weixinAddress },
      },
      () => {
        const { isLegal, tips } = this.onVerifyInputLegal();
        this.setData({
          submitActive: isLegal,
        });
        this.privateData.verifyTips = tips;
      },
    );
  },
});
