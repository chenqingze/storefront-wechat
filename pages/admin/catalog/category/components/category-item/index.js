import { deleteCategory } from '../../../../../../services/catalogService';

// pages/admin/catalog/category/category-item/index.js
Component({
  attached: function () {
    // 在组件实例进入页面节点树时执行
    this.setData({ id: this.properties.cid, name: this.properties.name });
  },

  /**
   * Component properties
   */
  properties: {
    cid: String, // 分类id
    name: String, // 分类名称
  },

  /**
   * Component initial data
   */
  data: {
    id: '',
    name: '',
  },

  /**
   * Component methods
   */
  methods: {
    onClick() {
      wx.showToast({ title: '编辑成功', icon: 'success' });
    },
    onEdit(e) {
      this.triggerEvent('openDialog', e);
    },
    onDelete() {
      deleteCategory(this.data.id).then(wx.showToast({ title: '删除成功', icon: 'success' }));
    },
  },
});
