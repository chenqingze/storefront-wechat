// pages/admin/catalog/product/components/rich-editor/index.js
Component({
  attached: function () {
    this.onLoad();
  },
  /**
   * Component properties
   */
  properties: {
    visible: {
      value: false,
      type: Boolean,
      observer: function (newVal) {
        this.setData({ visible: newVal });
      },
    },
    description: {
      value: '',
      type: String,
      observer: function (newVal) {
        this.setData({ description: newVal });
      },
    },
  },

  /**
   * Component initial data
   */
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
  },

  /**
   * Component methods
   */
  methods: {
    onVisibleChange(e) {
      this.setData({ visible: e.detail.visible });
    },
    onDescriptionEditorCancel() {
      this.triggerEvent('closeDescriptionEditorPopup');
    },
    onDescriptionEditorConfirm() {
      this.editorCtx.getContents({
        success: (res) => {
          this.triggerEvent('descriptionEditorConfirm', res.html);
        },
        fail: () => {
          console.log('获取editor内容失败！');
        },
      });
    },
    readOnlyChange() {
      this.setData({
        readOnly: !this.data.readOnly,
      });
    },
    onLoad() {
      const { platform } = wx.getSystemInfoSync();
      const isIOS = platform === 'ios';
      this.setData({ isIOS });
      const that = this;
      this.updatePosition(0);
      let keyboardHeight = 0;
      wx.onKeyboardHeightChange((res) => {
        if (res.height === keyboardHeight) return;
        const duration = res.height > 0 ? res.duration * 1000 : 0;
        keyboardHeight = res.height;
        setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: 0,
            success() {
              that.updatePosition(keyboardHeight);
              that.editorCtx.scrollIntoView();
            },
          });
        }, duration);
      });
    },
    updatePosition(keyboardHeight) {
      const toolbarHeight = 50;
      const { windowHeight } = wx.getSystemInfoSync();
      const editorHeight = keyboardHeight > 0 ? windowHeight - keyboardHeight - toolbarHeight : windowHeight;
      this.setData({ editorHeight, keyboardHeight });
    },
    calNavigationBarAndStatusBar() {
      const systemInfo = wx.getSystemInfoSync();
      const { statusBarHeight, platform } = systemInfo;
      const isIOS = platform === 'ios';
      const navigationBarHeight = isIOS ? 44 : 48;
      return statusBarHeight + navigationBarHeight;
    },
    onEditorReady() {
      this.createSelectorQuery()
        .select('#editor')
        .context((res) => {
          this.editorCtx = res.context;
          this.editorCtx.setContents({
            html: this.data.description,
            success: () => {
              console.log('editor初始化内容执行成功！');
            },
            fail: () => {
              console.log('editor初始化内容执行失败！');
            },
          });
        })
        .exec();
    },
    blur() {
      this.editorCtx.blur();
    },
    format(e) {
      const { name, value } = e.target.dataset;
      if (!name) return;
      // console.log('format', name, value)
      this.editorCtx.format(name, value);
    },
    onStatusChange(e) {
      const formats = e.detail;
      this.setData({ formats });
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success');
        },
      });
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log('clear success', res);
        },
      });
    },
    removeFormat() {
      this.editorCtx.removeFormat();
    },
    insertDate() {
      const date = new Date();
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.editorCtx.insertText({
        text: formatDate,
      });
    },
    insertImage() {
      wx.chooseImage({
        count: 1,
        success: (res) => {
          console.log(res);
          // 上传图片
          wx.uploadFile({
            filePath: res.tempFilePaths[0],
            name: 'file',
            url: 'http://localhost:8080/upload/file',
            success: (result) => {
              const image = JSON.parse(result.data);
              console.log(image.path);
              // 显示图片
              this.editorCtx.insertImage({
                src: `http://localhost:8080/files/${image.path}`,
                data: {
                  id: 'abcd',
                  role: 'god',
                },
                width: '80%',
                success: function () {
                  console.log('insert image success');
                },
              });
            },
            fail: () => {
              console.log('失败...');
            },
          });
        },
      });

      // wx.chooseMedia({
      //   count: 1,
      //   mediaType: 'image',
      //   success: function (res) {
      //     console.log(res);
      //     that.editorCtx.insertImage({
      //       src: res.tempFilePaths[0],
      //       data: {
      //         id: 'abcd',
      //         role: 'god',
      //       },
      //       width: '80%',
      //       success: function () {
      //         console.log('insert image success');
      //         // todo:上传图片
      //       },
      //     });
      //   },
      // });
    },
  },
});
