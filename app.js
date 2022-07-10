const { http } = require('./utils/http')
const { setNavBar } = require('./utils/util')
wx.$http = http
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.userInfo = wx.getStorageSync('userInfo')

    setNavBar(this.globalData)
  },
  globalData: {
    userInfo: null,
    controlMap: {}
  },
})
