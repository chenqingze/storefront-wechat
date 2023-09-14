// pages/admin/catalog/collection/components/collection-dialog/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    config: {
      visible: Boolean,
      operatingMode: String,
      title: String,
      id: String, // 分类id
      name: String, // 分类名称
    },
  },
  observers: {
    config: function (newConfig) {
      const { visible, title, operatingMode, id, name } = newConfig;
      this.setData({ visible, title, operatingMode, id, name });
    },
  },
  /**
   * Component initial data
   */
  data: {
    visible: false,
    operatingMode: 'add',
    title: '',
    id: '', // 分类id
    name: '', // 分类名称
  },

  /**
   * Component methods
   */
  methods: {
    onPopupVisibleChange(e) {
      this.setData({
        visible: e.detail.visible,
      });
    },
    // onInput(e) {
    //   this.setData({
    //     name: e.detail.value,
    //   });
    // },
    onCancal() {
      this.setData({ visible: false });
    },
    onConfirm() {
      if (!this.data.name) {
        wx.showToast({
          title: '分类名称不能为空！',
        });
        return;
      }
      if (this.data.operatingMode === 'add') {
        const { name } = this.data;
        this.triggerEvent('createCollection', { name });
        this.setData({ visible: false });
        return;
      }
      if (this.data.operatingMode === 'edit') {
        const { id, name } = this.data;
        this.triggerEvent('updateCollection', { id, name });
        this.setData({ visible: false });
        return;
      }
    },
  },
});
