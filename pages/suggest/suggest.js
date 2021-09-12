const app = getApp()
Page({
  data: {
    types: [
      { id: 1, name: '功能建议' },
      { id: 2, name: '内容建议' },
      { id: 3, name: 'BUG反馈' },
      { id: 4, name: '界面建议' },
      { id: 5, name: '交互建议' },
      { id: 6, name: '其他' }
    ],
    active: 0,
    content: '',
    contact: '',
  },

  changeTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ active: index })
  },

  changeTextarea(e) {
    const value = e.detail.value
    this.setData({ content: value.trim() })
  },

  changeInput(e) {
    const value = e.detail.value
    this.setData({ contact: value.trim() })
  },

  async submit() {
    const { content, contact, active, types } = this.data
    if (content === '') {
      wx.showToast({
        title: '请输入您的宝贵意见~',
        icon: 'none'
      })
      return
    }
    try {
      wx.showLoading({
        title: '正在提交',
        mask: true
      })
      const result = await wx.$http({
        url: 'suggest',
        data: {
          typeItem: types[active],
          content,
          contact,
          user: app.globalData.userInfo.id
        }
      })
      wx.hideLoading()
      if (result.message) {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      }
    } catch(e) {
      wx.hideLoading()
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  }
})