// pages/festival/festival.js
const app = getApp()
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
    todayMemory: [],
    previewList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFestival()
  },

  // 选择天
  selectDay(e) {
    const activeDayInfo = e.detail
    this.setData({ activeDayInfo })
    this.filterTodayList()
    console.log('selectDay', activeDayInfo)
  },

  async getFestival() {
    try {
      let result = await wx.$http({
        url: 'getFestival',
        data: {
          user: app.globalData.userInfo.id || 'ot6KX5MsCLGrSvkXur_jdqbnYkIk',
        }
      })
      const finishedMap = {}
      result.finishedList.forEach(item => {
        const dateArr = item.date.split('-')
        item.date = `${Number(dateArr[0])}-${Number(dateArr[1])}-${Number(dateArr[2])}`
        finishedMap[item.date] = true
      })
      this.setData({
        finishedList: result.finishedList || [],
        finishedMap: finishedMap,
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
    this.setData({
      todayFinished,
      memoryList,
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
    console.log('addFestival')
  }
})