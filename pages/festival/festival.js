// pages/festival/festival.js
const app = getApp()
const onfire = require('../../lib/onfire')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeDayInfo: {},
    finishedList: [],
    finishedMap: {},
    todayFinished: [],
    memoryList: [],
    memoryMap: {},
    todayMemory: [],
    previewList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    onfire.on('updateMemory', this.updateMemory.bind(this))
    this.getFestival()
  },

  updateMemory(e) {
    const { data, type } = e
    const { memoryList } = this.data
    const memoryMap = { solar: {}, lunar: {} }
    if (type === 'add') {
      memoryList.push(data)
    } else {
      let index = -1
      for (let i = 0, len = memoryList.length; i < len; i++) {
        if (memoryList[i].id === data.id) {
          index = i
          break
        }
      }
      if (type === 'edit') {
        memoryList.splice(index, 1, data)
      } else if (type === 'del') {
        memoryList.splice(index, 1)
      }
    }
    memoryList.forEach(item => {
      const dateArr = item.date.split('-')
      memoryMap[item.isLunar ? 'lunar' : 'solar'][`${Number(dateArr[1])}-${Number(dateArr[2])}`] = true
    })
    this.setData({
      memoryMap: memoryMap,
      memoryList: memoryList
    })
    this.filterTodayList()
  },

  // 选择天
  selectDay(e) {
    const activeDayInfo = e.detail
    this.setData({ activeDayInfo })
    this.filterTodayList()
  },

  async getFestival() {
    try {
      let result = await wx.$http({
        url: 'getFestival',
        data: {
          user: app.globalData.userInfo.id,
        }
      })
      const finishedMap = {}
      const memoryMap = { solar: {}, lunar: {} }
      result.finishedList.forEach(item => {
        const dateArr = item.date.split('-')
        item.date = `${Number(dateArr[0])}-${Number(dateArr[1])}-${Number(dateArr[2])}`
        finishedMap[item.date] = true
      })
      result.memoryList.forEach(item => {
        const dateArr = item.date.split('-')
        memoryMap[item.isLunar ? 'lunar' : 'solar'][`${Number(dateArr[1])}-${Number(dateArr[2])}`] = true
      })
      this.setData({
        finishedList: result.finishedList || [],
        finishedMap: finishedMap,
        memoryMap: memoryMap,
        memoryList: result.memoryList || []
      })
      this.filterTodayList()
    } catch (e) {
      console.log(e)
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  },

  // 处理当天数据
  filterTodayList() {
    const { activeDayInfo, finishedList, memoryList } = this.data
    const todayFinished = []
    const todayMemory = []
    const previewList = []
    finishedList.forEach(item => {
      if (item.date === activeDayInfo.date) {
        todayFinished.push(item)
        previewList.push(item.url)
      }
    })
    memoryList.forEach(item => {
      const [year, month, day] = item.date.split('-')
      if (item.isLunar && Number(month) === activeDayInfo.lMonth && Number(day) === activeDayInfo.lDay) {
        item.years = Math.max(0, activeDayInfo.lYear - year)
        todayMemory.push(item)
      } else if (!item.isLunar && Number(month) === activeDayInfo.cMonth && Number(day) === activeDayInfo.cDay) {
        item.years = Math.max(0, activeDayInfo.cYear - year)
        todayMemory.push(item)
      }
    })
    this.setData({
      todayFinished,
      todayMemory,
      previewList
    })
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的 http 链接
      urls: this.data.  previewList // 需要预览的图片 http 链接列表
    })
  },

  addFestival() {
    app.globalData.memoryEditItem = null
    wx.navigateTo({
      url: `/pages/addMemory/addMemory?date=${this.data.activeDayInfo.date}`
    })
  },

  editMemory(e) {
    const item = e.currentTarget.dataset.item
    app.globalData.memoryEditItem = item
    wx.navigateTo({
      url: '/pages/addMemory/addMemory'
    })
  }
})