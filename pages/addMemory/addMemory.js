const calendar = require('../../lib/calendar.js')
const onfire = require('../../lib/onfire')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    initDate: {},
    title: '',
    dateInfo: {},
    datePickerShow: false,
    editFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (app.globalData.memoryEditItem) {
      const { date, isLunar, title } = app.globalData.memoryEditItem
      const arr = date.split('-')
      const dateInfo = !!isLunar ? calendar.lunar2solar(Number(arr[0]), Number(arr[1]), Number(arr[2])) : calendar.solar2lunar(Number(arr[0]), Number(arr[1]), Number(arr[2]))
      dateInfo.isLunar = !!isLunar
      dateInfo.name = isLunar ? `(农历) ${dateInfo.lYear}年${dateInfo.IMonthCn}${dateInfo.IDayCn}` : `(公历) ${dateInfo.date}`
      this.setData({ dateInfo, title, editFlag: true, initDate: { date: isLunar ? `${dateInfo.lYear}-${dateInfo.lMonth}-${dateInfo.lDay}` : dateInfo.date, isLunar } }) 
    } else {
      const date = options.date
      const arr = date.split('-')
      const dateInfo = calendar.solar2lunar(Number(arr[0]), Number(arr[1]), Number(arr[2]))
      dateInfo.isLunar = false
      dateInfo.name = `(公历) ${dateInfo.date}`
      this.setData({ dateInfo, initDate: { date: dateInfo.date, isLunar: false } }) 
    }
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
    const { title, dateInfo, editFlag } = this.data
    const memoryEditItem = app.globalData.memoryEditItem
    if (title.trim() === '') {
      wx.showToast({
        title: '请先输入纪念日',
        icon: 'none'
      })
      return
    }
    if (editFlag && title.trim() === memoryEditItem.title && dateInfo.isLunar === !!memoryEditItem.isLunar && 
      ((dateInfo.isLunar && dateInfo.lunarDate === memoryEditItem.date) || (!dateInfo.isLunar && dateInfo.date === memoryEditItem.date))) {
      wx.showToast({
        title: '无更改，无需提交',
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
          user: app.globalData.userInfo.id,
          id: editFlag ? memoryEditItem.id : ''
        }
      })
      wx.hideLoading()
      if (result.message) {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      }
      if (result.status === 1) {
        onfire.fire('updateMemory', { data: result.data, type: this.data.editFlag ? 'edit' : 'add' })
        wx.navigateBack({
          delta: 1
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
  },

  async delete() {
    wx.showModal({
      content: '确定要删除吗？',
      success: async res => {
        if (res.confirm) {
          // 用户点击了确定 可以调用删除方法了
          this.handleDelete()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  async handleDelete() {
    const { editFlag } = this.data
    if (!editFlag) return
    const id = app.globalData.memoryEditItem.id
    try {
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      let result = await wx.$http({
        url: 'deleteMemory',
        data: {
          id: id
        }
      })
      if (result.message) {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      } else {
        wx.hideLoading()
      }
      if (result.status === 1) {
        onfire.fire('updateMemory', { data: { id }, type: 'del' })
        wx.navigateBack({
          delta: 1
        })
      }
    } catch (e) {
      console.log(e)
      wx.hideLoading()
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  }
})
