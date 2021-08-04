const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    painterData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options, app.globalData)
    let { width, height, imageItem } = app.globalData.painterData
    let painterData = {
      background: '#eee',
      width: width + 'px',
      height: height + 'px',
      borderRadius: '20rpx',
      views: [
        {
          type: 'image',
          url: imageItem.url,
          mode: 'scaleToFill',
          css: {
            // top: '20px',
            // left: '20px',
            // width: width + 'px',
            height: height + 'px',
            borderRadius: '20rpx',
          },
        }
      ]
    }
    this.setData({
      painterData
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

  onImgOK(e) {
    console.log('onImgOK', e)
  }
})