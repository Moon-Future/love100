const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      messageList: app.globalData.messageList
    })
  },

  async read(e) {
    try {
      let index = e.currentTarget.dataset.index
      let item = this.data.messageList[index]
      if (item.reador == 1) return
      await wx.$http({
        url: 'readMessage',
        data: {
          id: item.id
        }
      })
      this.setData({
        [`messageList[${index}].reador`]: 1
      })
    } catch(e) {
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  },

  async readAll() {
    try {
      let messageList = this.data.messageList
      let flag = false
      for (let i = 0, len = messageList.length; i < len; i++) {
        if (messageList[i].reador != 1) {
          flag = true
          break
        }
      }
      if (!flag) return
      await wx.$http({
        url: 'readMessage',
        data: {
          user: app.globalData.userInfo.id
        }
      })
      messageList.forEach(ele => {
        ele.reador = 1
      })
      this.setData({
        messageList
      })
    } catch(e) {
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  },

  async onPullDownRefresh() {
    try {
      wx.showLoading({
        title: '加载中'
      })
      const result = await wx.$http({
        url: 'getMessage',
        data: {
          user: app.globalData.userInfo.id
        }
      })
      result.messageList.forEach(ele => {
        ele.date = util.formatTime(ele.date, 'yyyy-MM-dd hh:mm:ss')
      })
      app.globalData.messageList = result.messageList
      this.setData({ messageList: result.messageList })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    } catch(e) {
      console.log(e)
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  }
})