const util = require('../../utils/util')
// const { cards } = require('./cardList')
const { lazyImage } = require('./constants')
const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    swiperList: [],
    finishedLength: 0,
    modalShow: false,
    modalTitle: '',
    painterData: {},
    drawShow: false,
    formAdr: '',
    formDate: '',
    cardCur: 0,
    showType: 'card',
    filterList: [
      { id: 1, name: '全部' },
      { id: 2, name: '已完成' },
      { id: 3, name: '未完成' },
    ],
    filterActive: { id: 1, name: '全部' },
    filterModalShow: false
  },

  lifetimes: {
    async ready() {
      try {
        wx.showLoading({
          title: '加载中'
        })
        this.imageReady = {}
        let swiperList = []
        let result = await wx.$http({
          url: 'getCardList',
          data: {
            common: app.globalData.userInfo.common
          }
        })
        let cardList = result.cardList
        let finishedList = result.finishedList
        let finishedMap = {}
        finishedList.forEach(ele => {
          finishedMap[ele.cardId] = ele
        })
        for (let i = 0, len = cardList.length; i < len; i++) {
          let cardItem = cardList[i]
          let finishedItem = finishedMap[cardItem.id] || { adr: '', date: '' }
          swiperList.push({
            ...cardItem,
            src: lazyImage,
            adr: finishedItem.adr,
            date: finishedItem.date,
            fingerLeft: 10000,
            fingerTop: 10000,
            imgOnload: false,
            finished: finishedMap[cardItem.id] ? finishedItem.id : '',
          })
        }
        this.swiperListCache = swiperList
        this.setData({
          swiperList,
          finishedLength: finishedList.length
        })
        this.filterData()
        // if (swiperList.length !== 0) {
        //   this.setImage(this.data.cardCur)
        // }
        wx.hideLoading()
      } catch(e) {
        console.log(e)
        wx.hideLoading()
        wx.showToast({
          title: '服务器开小差啦😅',
          icon: 'none'
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    typeChange(e) {
      const type = e.currentTarget.dataset.type
      this.setData({
        showType: type
      })
    },
    // 设置图片
    setImage(index) {
      let flag = false
      let swiperList = this.data.swiperList
      // 筛选数据为空
      if (!swiperList[index]) return
      let id = swiperList[index].id
      if (!this.imageReady[id]) {
        swiperList[index].src = swiperList[index].url
        this.imageReady[id] = true
        flag = true
      }
      // 当前图片前一张
      if (index !== 0 && !this.imageReady[swiperList[index - 1].id]) {
        swiperList[index - 1].src = swiperList[index - 1].url
        this.imageReady[swiperList[index - 1].id] = true
        flag = true
      }
      // 当前图片后一张
      if (index !== swiperList.length - 1 && !this.imageReady[swiperList[index + 1].id]) {
        swiperList[index + 1].src = swiperList[index + 1].url
        this.imageReady[swiperList[index + 1].id] = true
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
        cardCur: current
      })
      this.posInfo(current)
    },
    imageOnLoad(e) {
      const index = e.currentTarget.dataset.index
      let imgOnload = `swiperList[${index}].imgOnload`
      this.setData({
        [imgOnload]: true
      })
      if (!this.width) {
        this.posInfo(this.data.cardCur)
      }
    },
    // 完成信息定位
    posInfo(index) {
      let item = this.data.swiperList[index]
      let adrLeft = `swiperList[${index}].adrLeft`
      let adrTop = `swiperList[${index}].adrTop`
      let dateLeft = `swiperList[${index}].dateLeft`
      let dateTop = `swiperList[${index}].dateTop`
      let fingerLeft = `swiperList[${index}].fingerLeft`
      let fingerTop = `swiperList[${index}].fingerTop`
      if (this.width) {
        this.setData({
          [adrLeft]: item.adrWidth / item.width * this.width,
          [adrTop]: item.adrHeight / item.height * this.height,
          [dateLeft]: item.dateWidth / item.width * this.width,
          [dateTop]: item.dateHeight / item.height * this.height,
          [fingerLeft]: item.fingerWidth / item.width * this.width,
          [fingerTop]: item.fingerHeight / item.height * this.height
        })
      } else {
        this.createSelectorQuery().select(`#image${index}`).boundingClientRect((rect) => {
          this.width = rect.width
          this.height = rect.height
          this.setData({
            [adrLeft]: item.adrWidth / item.width * this.width,
            [adrTop]: item.adrHeight / item.height * this.height,
            [dateLeft]: item.dateWidth / item.width * this.width,
            [dateTop]: item.dateHeight / item.height * this.height,
            [fingerLeft]: item.fingerWidth / item.width * this.width,
            [fingerTop]: item.fingerHeight / item.height * this.height
          })
        }).exec()
      }
    },
    // 列表选择
    listSelect(e) {
      let cardCur = e.currentTarget.dataset.index
      this.setImage(cardCur)
      this.setData({
        cardCur: cardCur
      })
      this.posInfo(cardCur)
      this.setData({
        showType: 'card'
      })
    },
    // 选择完成或取消
    finished() {
      let index = this.data.cardCur
      let finished = `swiperList[${index}].finished`
      let item = this.data.swiperList[index]
      if (item.finished) {
        wx.showModal({
          content: '确定取消完成吗？',
          success: async (res) => {
            if (res.confirm) {
              let item = this.data.swiperList[index]
              let finished = `swiperList[${index}].finished`
              let adrField = `swiperList[${index}].adr`
              let dateField = `swiperList[${index}].date`
              try {
                wx.showLoading({
                  title: '正在保存',
                  mask: true
                })
                let result = await wx.$http({
                  url: 'cardEdit',
                  data: {
                    finishedId: item.finished || '',
                    cardId: item.id,
                    common: app.globalData.userInfo.common,
                    adr: item.adr,
                    date: item.date,
                    delFlag: true,
                    userInfo: app.globalData.userInfo,
                    cardTitle: item.title
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
                  this.setData({
                    [finished]: '',
                    [adrField]: '',
                    [dateField]: '',
                    finishedLength: this.data.finishedLength - 1
                  })
                  // swiperListCache 缓存数据也要处理
                  for (let i = 0, len = this.swiperListCache.length; i < len; i++) {
                    if (this.swiperListCache[i].id === item.id) {
                      this.swiperListCache[i].finished = ''
                      this.swiperListCache[i].adr = ''
                      this.swiperListCache[i].date = ''
                      break
                    }
                  }
                  if (this.data.filterActive.id === 2) {
                    this.filterData(Math.max(0, index - 1))
                  }
                } else if (result.status === 0) {
                  this.updateUserInfo()
                }
              } catch(e) {
                wx.hideLoading()
                wx.showToast({
                  title: '服务器开小差啦😅',
                  icon: 'none'
                })
              }
            }
          }
        })
      } else {
        if (!app.globalData.userInfo.lover) {
          wx.showToast({
            title: '请邀请对象一起完成哦~',
            icon: 'none'
          })
          return
        }
        this.setData({
          [finished]: '',
          modalShow: item.finished ? false : true,
          modalTitle: item.title,
          formAdr: '',
          formDate: util.formatTime(Date.now(), 'yyyy-MM-dd')
        })
      }
    },
    // 完成后编辑
    edit() {
      let imageItem = this.data.swiperList[this.data.cardCur]
      this.setData({
        modalShow: true,
        formAdr: imageItem.adr,
        formDate: imageItem.date
      })
    },
    // 绘图分享
    async share() {
      wx.showLoading({
        title: '图片生成中',
        mask: true
      })
      let sentence = ''
      try {
        sentence = (await wx.$http({
          url: 'getSentence'
        })).data
      } catch(e) {
        sentence = ''
      }
      let imageItem = this.data.swiperList[this.data.cardCur]
      let canvasWidth = imageItem.width / imageItem.height * this.height
      let painterData = {
        background: '#fff',
        width: canvasWidth + 'px',
        height: this.height + 100 + 'px',
        imageHeight: this.height + 100,
        borderRadius: '20rpx',
        views: [
          {
            type: 'image',
            url: imageItem.url,
            mode: 'scaleToFill',
            css: {
              width: canvasWidth + 'px',
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
              left: imageItem.fingerWidth / imageItem.width * canvasWidth + 'px',
              top: imageItem.fingerHeight / imageItem.height * this.height + 'px'
            },
          },
          {
            type: 'text',
            text: imageItem.adr,
            css: {
              width: canvasWidth - imageItem.dateWidth / imageItem.width * canvasWidth + 'px',
              left: imageItem.adrWidth / imageItem.width * canvasWidth + 'px',
              top: imageItem.adrHeight / imageItem.height * this.height + 'px'
            }
          },
          {
            type: 'text',
            text: imageItem.date,
            css: {
              left: imageItem.dateWidth / imageItem.width * canvasWidth + 'px',
              top: imageItem.dateHeight / imageItem.height * this.height + 'px'
            }
          },
          // 底部二维码区域
          {
            type: 'image',
            url: '../../static/images/barcode.jpg',
            mode: 'scaleToFill',
            css: {
              width: '80px',
              height: '80px',
              right: '10px',
              bottom: '10px'
            },
          },
          {
            type: 'text',
            text: sentence,
            css: {
              width: canvasWidth - 110 + 'px',
              left: '10px',
              top: this.height + 10 + 'px',
              lineHeight: '14px'
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
    async save(e) {
      let index = this.data.cardCur
      let item = this.data.swiperList[index]
      let finishedLength = this.data.finishedLength
      let finished = `swiperList[${index}].finished`
      let adrField = `swiperList[${index}].adr`
      let dateField = `swiperList[${index}].date`
      let { adr, date } = e.detail
      try {
        wx.showLoading({
          title: '正在保存',
          mask: true
        })
        let result = await wx.$http({
          url: item.finished ? 'cardEdit' : 'cardFinished',
          data: {
            finishedId: item.finished || '',
            cardId: item.id,
            common: app.globalData.userInfo.common,
            adr: adr,
            date: date,
            userInfo: app.globalData.userInfo,
            cardTitle: item.title
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
          this.setData({
            [finished]: result.finishedId,
            [adrField]: adr,
            [dateField]: date,
            modalShow: false,
            finishedLength: item.finished ? finishedLength : (finishedLength + 1)
          })
          // swiperListCache 缓存数据也要处理
          for (let i = 0, len = this.swiperListCache.length; i < len; i++) {
            if (this.swiperListCache[i].id === item.id) {
              this.swiperListCache[i].finished = result.finishedId
              this.swiperListCache[i].adr = adr
              this.swiperListCache[i].date = date
              break
            }
          }
          if (this.data.filterActive.id === 3) {
            this.filterData(Math.max(0, index - 1))
          }
        } else if (result.status === 0) {
          this.updateUserInfo()
        }
      } catch(e) {
        wx.hideLoading()
        wx.showToast({
          title: '服务器开小差啦😅',
          icon: 'none'
        })
      }
    },
    updateUserInfo() {
      let swiperList = this.data.swiperList
      let userInfo = app.globalData.userInfo
      userInfo.common = ''
      userInfo.lover = ''
      userInfo.loverNickName = ''
      userInfo.loverAvatarUrl = ''
      wx.setStorageSync('userInfo', userInfo)
      app.globalData.userInfo = userInfo
      swiperList.forEach(ele => {
        ele.finished = ''
      })
      this.setData({
        swiperList,
        modalShow: false
      })
    },

    // 筛选展示数据
    filterData(index = 0) {
      const { id } = this.data.filterActive
      let list = this.swiperListCache
      if (id === 2) {
        // 已完成
        list = list.filter(item => !!item.finished)
      } else if (id === 3) {
        // 未完成
        list = list.filter(item => !item.finished)
      }
      this.setData({ swiperList: list, cardCur: index }, () => {
        // 筛选后从第一张开始
        this.setImage(index)
      })
    },

    // 点击筛选
    filterClick() {
      this.filterActiveCache = this.data.filterActive
      this.setData({ filterModalShow: true })
    },

    // 筛选完成
    filterConfirm() {
      this.setData({ filterModalShow: false })
      this.filterData()
    },

    // 筛选取消
    filterCancel() {
      this.setData({ filterModalShow: false, filterActive: this.filterActiveCache })
    },

    // 选择条件
    finishSelect(e) {
      const item = e.currentTarget.dataset.item
      this.setData({ filterActive: item })
    }
  }
})
