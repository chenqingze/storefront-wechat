export class Request {
  constructor() {
    this.requestTask = null;
    this.uploadTask = null;
  }
  // static getInstance() {
  //   new Request();
  // }

  get(url, data, customHeaders) {
    return this.request('GET', url, data, customHeaders);
  }

  post(url, data, customHeaders) {
    return this.request('POST', url, data, customHeaders);
  }

  put(url, data, customHeaders) {
    return this.request('PUT', url, data, customHeaders);
  }

  delete(url, data, customHeaders) {
    return this.request('DELETE', url, data, customHeaders);
  }

  request(method, url, data, customheaders, extraOptions) {
    return new Promise((resolve, reject) => {
      // wx.showLoading({
      //   title: 'title',
      //   mask: true,
      // });
      const accessToken = getApp()?.getAccessToken();
      const defaultHeader = { 'content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
      let header = accessToken ? Object.assign({ 'X-Auth-Token': accessToken }, defaultHeader) : defaultHeader;
      if (customheaders) {
        header = Object.assign(header, customheaders);
      }
      // console.log(header);
      this.requestTask = wx.request({
        method,
        url,
        data,
        header,
        ...extraOptions,
        success: (res) => {
          if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            // todo: 跳转到登录页或弹出登录组件
            // 这里通过改变全局isLogined状态触发组件弹窗
            getApp().globalData.isLogined = false;
            getApp().triggerListeners();
            //授权失效
            reject('登录已过期');
          } else {
            //请求失败
            reject(`请求失败：${res.statusCode}`);
          }
        },
        fail: (res) => {
          reject({
            msg: `请求失败,服务器连接异常，请检查网络再试：${res}`,
            url,
            method,
            data,
          });
        },
        complete: () => {
          // wx.hideLoading();
        },
      });
    });
  }
  // todo: 完善
  uploadFile() {
    // return new Promise((resolve, reject) => {
    //   this.uploadTask = wx.uploadFile({
    //     filePath: 'filePath',
    //     name: 'name',
    //     url: 'url',
    //   });
    // });
  }
  abort() {
    if (this.requestTask) {
      this.requestTask.abort();
    }
  }
}
