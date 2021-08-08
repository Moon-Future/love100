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
    },
    cardCur: {
      type: Number,
      value: 0
    },
    showType: {
      type: String,
      value: 'card'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalShow: false,
    modalTitle: '',
    painterData: {},
    drawShow: false
  },

  lifetimes: {
    ready() {
      this.imageReady = {}
      // let swiperList = this.data.swiperList
      // let cardCur = this.data.cardCur
      // swiperList[cardCur].src = swiperList[cardCur].url
      // this.imageReady[cardCur] = true
      // if (cardCur !== 0) {
      //   swiperList[cardCur - 1].src = swiperList[cardCur - 1].url
      //   this.imageReady[cardCur - 1] = true
      // }
      // if (cardCur !== swiperList.length - 1) {
      //   swiperList[cardCur + 1].src = swiperList[cardCur + 1].url
      //   this.imageReady[cardCur + 1] = true
      // }
      // this.setData({
      //   swiperList
      // })
      this.setImage(this.data.cardCur)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置图片
    setImage(index) {
      let flag = false
      let swiperList = this.data.swiperList
      if (!this.imageReady[index]) {
        swiperList[index].src = swiperList[index].url
        this.imageReady[index] = true
        flag = true
      }
      if (index !== 0 && !this.imageReady[index - 1]) {
        swiperList[index - 1].src = swiperList[index - 1].url
        this.imageReady[index - 1] = true
        flag = true
      }
      if (index !== swiperList.length - 1 && !this.imageReady[index + 1]) {
        swiperList[index + 1].src = swiperList[index + 1].url
        this.imageReady[index + 1] = true
        flag = true
      }
      if (flag) {
        this.setData({ swiperList })
      }
    },
    // 左右切换
    cardSwiper(e) {
      let current = e.detail.current
      this.setImage(current)
      this.setData({
        cardCur: e.detail.current
      })
      this.posInfo(current)
    },
    imageOnLoad() {
      if (!this.width) {
        this.posInfo(this.data.cardCur)
      }
    },
    // 完成信息定位
    posInfo(index) {
      let item = this.data.swiperList[index]
      let adrLeft = `swiperList[${index}].adrLeft`
      let adrTop = `swiperList[${index}].adrTop`
      let timeLeft = `swiperList[${index}].timeLeft`
      let timeTop = `swiperList[${index}].timeTop`
      let avaLeft = `swiperList[${index}].avaLeft`
      let avaTop = `swiperList[${index}].avaTop`
      if (this.width) {
        this.setData({
          [adrLeft]: item.adrWidth / item.width * this.width,
          [adrTop]: item.adrHeight / item.height * this.height,
          [timeLeft]: item.timeWidth / item.width * this.width,
          [timeTop]: item.timeHeight / item.height * this.height,
          [avaLeft]: item.avaWidth / item.width * this.width,
          [avaTop]: item.avaHeight / item.height * this.height
        })
      } else {
        this.createSelectorQuery().select(`#image${index}`).boundingClientRect((rect) => {
          this.width = rect.width
          this.height = rect.height
          this.setData({
            [adrLeft]: item.adrWidth / item.width * this.width,
            [adrTop]: item.adrHeight / item.height * this.height,
            [timeLeft]: item.timeWidth / item.width * this.width,
            [timeTop]: item.timeHeight / item.height * this.height,
            [avaLeft]: item.avaWidth / item.width * this.width,
            [avaTop]: item.avaHeight / item.height * this.height
          })
        }).exec()
      }
    },
    // 列表选择
    listSelect(e) {
      this.setData({
        cardCur: e.currentTarget.dataset.index
      })
      this.setImage(this.data.cardCur)
      this.triggerEvent('listSelect')
    },
    // 选择完成或取消
    finished(e) {
      let index = e.currentTarget.dataset.index
      let finished = `swiperList[${index}].finished`
      let item = this.data.swiperList[index]
      this.selectIndex = index
      if (item.finished) {
        wx.showModal({
          content: '确定取消完成吗？',
          success: (res) => {
            if (res.confirm) {
              let finished = `swiperList[${this.selectIndex}].finished`
              this.setData({
                [finished]: false
              })
            }
          }
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
      wx.showLoading({
        title: '图片生成中',
        mask: true
      })
      let imageItem = this.data.swiperList[this.data.cardCur]
      let canvasWitdh = imageItem.width / imageItem.height * this.height
      let painterData = {
        background: '#fff',
        width: canvasWitdh + 'px',
        height: this.height + 100 + 'px',
        imageHeight: this.height + 100,
        borderRadius: '20rpx',
        views: [
          {
            type: 'image',
            url: imageItem.url,
            mode: 'scaleToFill',
            css: {
              width: canvasWitdh + 'px',
              height: this.height + 'px',
              borderRadius: '20rpx 20rpx 0 0',
            },
          },
          {
            type: 'image',
            url: '../../static/images/finger.png',
            mode: 'scaleToFill',
            css: {
              width: '120rpx',
              height: '120rpx',
              left: imageItem.avaWidth / imageItem.width * canvasWitdh + 'px',
              top: imageItem.avaHeight / imageItem.height * this.height + 'px'
            },
          },
          {
            type: 'text',
            text: '中华人民共和国',
            css: {
              width: canvasWitdh - imageItem.timeWidth / imageItem.width * canvasWitdh + 'px',
              left: imageItem.adrWidth / imageItem.width * canvasWitdh + 'px',
              top: imageItem.adrHeight / imageItem.height * this.height + 'px'
            }
          },
          {
            type: 'text',
            text: '2021-08-08',
            css: {
              left: imageItem.timeWidth / imageItem.width * canvasWitdh + 'px',
              top: imageItem.timeHeight / imageItem.height * this.height + 'px'
            }
          }
        ]
      }
      this.setData({
        painterData,
        drawShow: true
      })
    },
    onImgOK() {
      wx.hideLoading()
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
    }
  }
})
