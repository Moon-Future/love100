// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: app.globalData.userInfo || {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    CustomBar: app.globalData.CustomBar,
    modalShow: false
  },
  async onLoad(options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    wx.showToast({
      title: JSON.stringify(options),
      icon: 'success',
      duration: 2000
    })

    const result = await this.login()
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        ...result.userInfo
      }
    })
    // console.log('onLoad', result)
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    const userInfo = this.data.userInfo
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: {
            ...userInfo,
            ...res.userInfo,
            login: true
          },
          hasUserInfo: true,
          modalShow: false
        })
        app.globalData.userInfo = this.data.userInfo
        this.updateUserInfo()
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    const userInfo = this.data.userInfo
    this.setData({
      userInfo: {
        ...userInfo,
        ...e.detail.userInfo,
        login: true
      },
      hasUserInfo: true,
      modalShow: false
    })
    app.globalData.userInfo = this.data.userInfo
    this.updateUserInfo()
  },
  goPage(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: `/pages/${url}/${url}`
    })
  },
  // 登录
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {
          const result = await wx.$http({
            url: 'login',
            data: {
              code: res.code
            }
          })
          resolve(result)
        },
      })
    })
  },
  async updateUserInfo() {
    const userInfo = this.data.userInfo
    wx.setStorageSync('userInfo', userInfo)
    await wx.$http({
      url: 'updateUserInfo',
      data: userInfo
    })
  },
  // 用户触发更新信息
  updateUser() {
    if (!this.data.userInfo.login) return
    this.setData({
      modalShow: true
    })
  },
  hideModal() {
    this.setData({
      modalShow: false
    })
  },
  // 邀请na
  invited() {
    if (!this.data.userInfo.login) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onShareAppMessage(e) {
    const userInfo = this.data.userInfo
    return {
      title: '恋爱100件小事-臭宝，和我来一起完成吧',
      path: `/pages/index/index?user=${userInfo.id}`,
      imageUrl: 'https://love100-1255423800.cos.ap-shanghai.myqcloud.com/images/cover/cover-01.jpg'
    }
  }
})
