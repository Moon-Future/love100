// components/userBar/userBar.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    messageList: {
      type: Array,
      value: []
    },
    unreadLength: {
      type: Number,
      value: 0
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
      wx.navigateTo({
        url: `/pages/${url}/${url}`
      })
    }
  }
})
