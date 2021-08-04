const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    swiperList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cardCur: 0,
    modalShow: false,
    modalTitle: '',
    messageShow: false,
    message: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cardSwiper(e) {
      let current = e.detail.current
      let swiperList = this.data.swiperList
      let flag = false
      this.lazyIndex = this.lazyIndex || 2
      if (current > this.lazyIndex - 2) {
        if (swiperList[current + 2]) {
          swiperList[current + 2].src = swiperList[current + 2].url
          this.lazyIndex++
          flag = true
        }
      }
      if (flag) {
        this.setData({
          cardCur: e.detail.current,
          swiperList
        })
      } else {
        this.setData({
          cardCur: e.detail.current
        })
      }
      this.posInfo(current)
    },
    onLoad() {
      if (!this.width) {
        this.posInfo(0)
      }
    },
    // 完成信息定位
    posInfo(index) {
      let item = this.data.swiperList[index]
      let left = `swiperList[${index}].left`
      let top = `swiperList[${index}].top`
      if (this.width) {
        this.setData({
          [left]: item.w * this.width,
          [top]: item.h * this.height
        })
      } else {
        this.createSelectorQuery().select('#image0').boundingClientRect((rect) => {
          this.width = rect.width
          this.height = rect.height
          this.setData({
            [left]: item.w * this.width,
            [top]: item.h * this.height
          })
        }).exec()
      }
    },
    // 选择完成或取消
    finished(e) {
      let index = e.currentTarget.dataset.index
      let finished = `swiperList[${index}].finished`
      let item = this.data.swiperList[index]
      this.selectIndex = index
      if (item.finished) {
        this.setData({
          message: '确定取消完成吗？',
          messageShow: true
        })
      } else {
        this.setData({
          [finished]: false,
          modalShow: item.finished ? false : true,
          modalTitle: item.title
        })
      }
    },
    // 完成后编辑
    edit() {

    },
    // 绘图分享
    share() {
      app.globalData.painterData = {
        width: this.width,
        height: this.height,
        imageItem: this.data.swiperList[this.data.cardCur]
      }
      wx.navigateTo({
        url: '/pages/draw/draw'
      })
    },
    // 表单模拟框
    hideModal(e) {
      this.setData({
        modalShow: false
      })
    },
    // 表单保存
    save() {
      let finished = `swiperList[${this.selectIndex}].finished`
      this.setData({
        [finished]: true,
        modalShow: false
      })
    },
    // 提示信息确认
    confirm() {
      let finished = `swiperList[${this.selectIndex}].finished`
      this.setData({
        [finished]: false,
        messageShow: false
      })
    },
    // 提示信息取消
    cancel() {
      this.setData({
        messageShow: false
      })
    }
  }
})
