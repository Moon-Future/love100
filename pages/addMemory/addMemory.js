const calendar = require('../../lib/calendar.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    initDate: '',
    title: '',
    dateInfo: {},
    datePickerShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const date = options.date
    const arr = date.split('-')
    const dateInfo = calendar.solar2lunar(Number(arr[0]), Number(arr[1]), Number(arr[2]))
    dateInfo.isLunar = false
    dateInfo.name = `(公历) ${dateInfo.date}`
    this.setData({ dateInfo, initDate: dateInfo.date }) 
  },

  datePickerClick() {
    this.setData({ datePickerShow: true })
  },

  dateConfirm(e) {
    this.setData({ datePickerShow: false, dateInfo: e.detail })
  },

  dateCancel() {
    this.setData({ datePickerShow: false })
  },

  inputChange(e) {
    this.setData({
      title: e.detail.value
    })
  },

  async save() {
    const { title, dateInfo } = this.data
    if (title.trim() === '') {
      wx.showToast({
        title: '请先输入纪念日',
        icon: 'none'
      })
      return
    }
    try {
      wx.showLoading({
        title: '保存中',
        mask: true
      })
      let result = await wx.$http({
        url: 'addMemory',
        data: {
          title: title.trim(),
          dateInfo,
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
      console.log(e)
      wx.hideLoading()
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  }
})
