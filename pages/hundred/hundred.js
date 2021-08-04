// pages/hundred/hundred.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let swiperList = []
    for (let i = 0, len = 100; i < len; i++) {
      swiperList.push({
        id: i,
        title: '一起雪中漫步',
        url: '/static/images/01.jpg',
        src: i < 3 ? '/static/images/01.jpg' : '',
        width: 1647,
        height: 2586,
        ratioW: 1070 / 1647,
        ratioH: 950 / 2586,
        left: 10000,
        top: 10000,
        finished: true
      })
    }
    this.setData({
      swiperList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})