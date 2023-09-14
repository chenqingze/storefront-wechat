// pages/admin/catalog/product/variant/components/option-card/index.js
Component({
  options: {
    multipleSlots: true,
  },
  /**
   * Component properties
   */
  properties: {
    option: {
      type: Object,
      value: null,
      observer: function (newVal) {
        this.setData({ option: newVal });
      },
    },
  },

  /**
   * Component initial data
   */
  data: {},

  /**
   * Component methods
   */
  methods: {
    onOptionValuePopup() {
      this.triggerEvent('optionValuePopupEvent', {
        option: this.data.option,
      });
    },
  },
});
