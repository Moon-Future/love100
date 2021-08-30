// components/homeMenu/homeMenu.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    controlMap: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goPage(e) {
      let url = e.currentTarget.dataset.url
      if (!url) {
        wx.showToast({
          title: '精心准备中😊',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: `/pages/${url}/${url}`
      })
    },
  }
})
