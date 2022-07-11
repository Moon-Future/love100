// pages/festival/festival.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeDayInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 选择天
  selectDay(e) {
    const activeDayInfo = e.detail
    this.setData({ activeDayInfo })
    console.log('selectDay', activeDayInfo)
  }
})