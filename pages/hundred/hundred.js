// pages/hundred/hundred.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    cardCur: 0,
    showType: 'card'
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
        // src: i < 3 ? '/static/images/01.jpg' : '',
        width: 1350,
        height: 2100,
        adrWidth: 900,
        adrHeight: 790,
        timeWidth: 900,
        timeHeight: 925,
        avaWidth: 865,
        avaHeight: 380,
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

  },

  typeChange(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      showType: type
    })
  },

  listSelect() {
    this.setData({
      showType: 'card'
    })
  }
})