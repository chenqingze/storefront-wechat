export class Request {
  constructor() {
    this.requestTask = null;
    this.uploadTask = null;
  }
  // static getInstance() {
  //   new Request();
  // }

  get(url, data) {
    return this.request('GET', url, data);
  }

  post(url, data) {
    return this.request('POST', url, data);
  }

  put(url, data) {
    return this.request('PUT', url, data);
  }

  delete(url, data) {
    return this.request('DELETE', url, data);
  }

  request(method, url, data, extraOptions) {
    return new Promise((resolve, reject) => {
      // wx.showLoading({
      //   title: 'title',
      //   mask: true,
      // });
      this.requestTask = wx.request({
        method,
        url,
        data,
        ...extraOptions,
        success: (res) => {
          if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            //授权失效
            reject('登录已过期');
            // todo: 跳转到登录页
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
