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