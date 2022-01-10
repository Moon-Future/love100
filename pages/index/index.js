// index.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util')
Page({
  data: {
    userInfo: app.globalData.userInfo || {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    CustomBar: app.globalData.CustomBar,
    Android: app.globalData.Android,
    updateModalShow: false,
    breakModalShow: false,
    invitedModalShow: false,
    invitedFrom: null,
    resultModalShow: false,
    resultFrom: {},
    messageList: [],
    unreadLength: 0,
    controlMap: {}
  },
  async onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    app.globalData.userInfo = userInfo
    this.setData({
      userInfo
    })
    await this.getMessage()
  },
  async onLoad(options) {
    util.setNavBar(app.globalData)
    this.setData({
      CustomBar: app.globalData.CustomBar,
      Android: app.globalData.Android
    })

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    // options = {
    //   id: '0710',
    //   nickName: '媛媛',
    //   avatarUrl: 'https://love100-1255423800.cos.ap-shanghai.myqcloud.com/images/avatar/avatar-01.jpg'
    // }

    await this.getControl()
    await this.getUserInfoFromDB()

    if (options.id) {
      // 如果被人邀请进入
      if (this.data.userInfo.lover !== options.id) {
        this.setData({
          invitedModalShow: true,
          invitedFrom: {
            id: options.id,
            nickName: options.nickName,
            avatarUrl: options.avatarUrl
          }
        })
      }
    }
  },
  async getControl() {
    try {
      const controlResult = await wx.$http({ url: 'getControl' })
      this.setData({ controlMap: controlResult.controlMap })
    } catch(e) {}
  },
  async getUserInfoFromDB() {
    try {
      wx.showLoading({
        title: '加载中'
      })
      const result = await this.login()
      result.userInfo.loverAvatarUrl = result.userInfo.loverAvatarUrl || ''
      result.userInfo.loverNickName = result.userInfo.loverNickName || ''
      this.setData({
        userInfo: {
          ...this.data.userInfo,
          ...result.userInfo,
          login: result.userInfo.nickName ? true : false
        }
      })
      this.setUserInfo(this.data.userInfo)
      wx.hideLoading()
    } catch(e) {
      wx.hideLoading()
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  },
  async getMessage() {
    try {
      const result = await wx.$http({
        url: 'getMessage',
        data: {
          user: this.data.userInfo.id
        }
      })
      let unreadLength = 0
      result.messageList.forEach(ele => {
        if (ele.reador != 1) {
          unreadLength++
        }
        ele.date = util.formatTime(ele.date, 'yyyy-MM-dd hh:mm:ss')
      })
      app.globalData.messageList = result.messageList
      this.setData({ messageList: result.messageList, unreadLength })
    } catch(e) {
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  },
  hideResultModal() {
    this.setData({
      resultModalShow: false
    })
  },
  setUserInfo(userInfo) {
    wx.setStorageSync('userInfo', userInfo)
    app.globalData.userInfo = userInfo
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    const userInfo = this.data.userInfo
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: async (res) => {
        this.setData({
          userInfo: {
            ...userInfo,
            ...res.userInfo,
            login: true
          },
          canIUseOpenData: false,
          hasUserInfo: true,
          updateModalShow: false
        })
        app.globalData.userInfo = this.data.userInfo
        await this.updateUserInfo()
        if (this.data.invitedFrom) {
          this.agree()
        }
      }
    })
  },
  async getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    const userInfo = this.data.userInfo
    this.setData({
      userInfo: {
        ...userInfo,
        ...e.detail.userInfo,
        login: true
      },
      canIUseOpenData: false,
      hasUserInfo: true,
      updateModalShow: false
    })
    app.globalData.userInfo = this.data.userInfo
    await this.updateUserInfo()
    if (this.data.invitedFrom) {
      this.agree()
    }
  },
  // 登录
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {
          try {
            const result = await wx.$http({
              url: 'login',
              data: {
                code: res.code
              }
            })
            resolve(result)
          } catch(e) {
            wx.showToast({
              title: '服务器开小差啦😅',
              icon: 'none'
            })
          }
        },
      })
    })
  },
  async updateUserInfo() {
    try {
      const userInfo = this.data.userInfo
      this.setUserInfo(userInfo)
      await wx.$http({
        url: 'updateUserInfo',
        data: userInfo
      })
    } catch(e) {
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  },
  // 用户触发更新信息
  updateUser() {
    if (!this.data.userInfo.login) return
    this.setData({
      updateModalShow: true
    })
  },
  // 展开分开窗口
  breakModal() {
    this.setData({
      breakModalShow: true
    })
  },
  // 断开
  async breakup() {
    let userInfo = this.data.userInfo
    let result = await wx.$http({
      url: 'breakup',
      data: {
        id: userInfo.id,
        nickName: userInfo.nickName,
        lover: userInfo.lover,
        loverNickName: userInfo.loverNickName,
        common: userInfo.common
      }
    })
    wx.showToast({
      title: result.message,
      icon: 'none'
    })
    if (result.status !== 1) return 
    userInfo.common = ''
    userInfo.lover = ''
    userInfo.loverNickName = ''
    userInfo.loverAvatarUrl = ''
    this.setData({
      userInfo,
      breakModalShow: false
    })
    this.setUserInfo(userInfo)
  },
  hideModal() {
    this.setData({
      updateModalShow: false,
      breakModalShow: false
    })
  },
  // 邀请TA
  invited() {
    if (!this.data.userInfo.login) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      })
    }
  },
  hideInvitedModal() {
    this.setData({
      invitedModalShow: false,
      invitedFrom: null
    })
  },
  // 同意邀请
  async agree() {
    let userInfo = this.data.userInfo
    let invitedFrom = this.data.invitedFrom
    if (userInfo.lover) {
      if (userInfo.lover === invitedFrom.id) {
        wx.showToast({
          title: '你们早已经是恋人啦~',
          icon: 'none'
        })
        this.setData({
          invitedModalShow: false
        })
      } else {
        wx.showToast({
          title: '记住，你不是一只单身狗！',
          icon: 'none'
        })
      }
    } else {
      wx.showLoading({
        mask: true
      })
      let result = await wx.$http({
        url: 'toBeLover',
        data: {
          from: invitedFrom.id,
          to: userInfo.id
        }
      })
      wx.hideLoading()
      wx.showToast({
        title: userInfo.id === invitedFrom.id ? '即使没有TA，我也能一路向前' : result.message,
        icon: 'none'
      })
      if (result.status === 1) {
        userInfo.common = result.data.common
        userInfo.lover = invitedFrom.id
        userInfo.loverNickName = invitedFrom.nickName
        userInfo.loverAvatarUrl = invitedFrom.avatarUrl
        this.setData({
          userInfo,
          invitedModalShow: false
        })
        this.setUserInfo(userInfo)
      }
    }
  },
  // 婉拒邀请
  refuse() {
    wx.$http({
      url: 'refuse',
      data: {
        userInfo: this.data.userInfo,
        invitedFrom: this.data.invitedFrom
      }
    })
    this.setData({
      invitedModalShow: false,
      invitedFrom: null
    })
  },
  onShareAppMessage(e) {
    const userInfo = this.data.userInfo
    if (e.from === 'button') {
      return {
        title: '【情侣100件事】-臭宝，和我来一起完成吧',
        path: `/pages/index/index?id=${userInfo.id}&nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`,
        imageUrl: 'https://love100-1255423800.cos.ap-shanghai.myqcloud.com/images/cover/cover-01.jpg'
      }
    } else {
      return {
        title: '【情侣100件事】爱情，需要仪式感，100件关于我们的小故事',
        path: `/pages/index/index`,
        imageUrl: 'https://love100-1255423800.cos.ap-shanghai.myqcloud.com/images/cover/cover-01.jpg'
      }
    }
  },
  async refresh() {
    await this.getUserInfoFromDB()
  },
  async onPullDownRefresh() {
    await this.refresh()
    await this.getMessage()
    await this.getControl()
    wx.stopPullDownRefresh()
  }
})
