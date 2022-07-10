// pages/addThing/addThing.js
const { HOST } = require('../../utils/http')
const onfire = require('../../lib/onfire')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    file: '',
    name: '',
    type: 'add',
    editFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.needUpload = true
    if (app.globalData.cardEditItem) {
      this.setData({
        file: app.globalData.cardEditItem.url,
        name: app.globalData.cardEditItem.title,
        type: 'edit',
        editFlag: true,
      })
      this.needUpload = false
    }
  },

  inputChange(e) {
    this.setData({ name: e.detail.value })
  },

  selectImage() {
    wx.chooseImage({
      //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        this.setData({
          file: res.tempFilePaths[0],
        })
      }
    })
  },

  // 删除照片
  deleteImage(event) {
    this.setData({ file: '' })
    if (this.data.editFlag) {
      this.needUpload = true
    }
  },

  async submit() {
    const { file, name, editFlag } = this.data
    const userInfo = app.globalData.userInfo
    if (!userInfo) return
    if (name.trim() === '') {
      wx.showToast({
        title: '总得干点什么吧？',
        icon: 'none'
      })
      return
    }
    try {
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      let uploadResult = { filePath: '' }
      if (editFlag && !this.needUpload) {
        uploadResult.filePath = file
      } else if (file && this.needUpload) {
        uploadResult = await this.uploadFile(file, { user: userInfo.id })
        uploadResult.filePath = `https://${uploadResult.filePath}`
      }
      if (editFlag && name === app.globalData.cardEditItem.title && uploadResult.filePath === app.globalData.cardEditItem.url) {
        wx.showToast({
          title: '无更改，无需提交',
          icon: 'none'
        })
        return
      } 
      let result = await wx.$http({
        url: 'cardAdd',
        data: {
          title: name,
          url: uploadResult.filePath,
          user: userInfo.id,
          id: editFlag ? app.globalData.cardEditItem.id : ''
        }
      })
      if (result.message) {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      } else {
        wx.hideLoading()
      }
      if (result.status === 1) {
        this.setData({ file: '', name: '' })
        onfire.fire('updateCard', { data: result.data, type: this.data.type })
        wx.navigateBack({
          delta: 1
        })
      }
    } catch (e) {
      console.log(e)
      wx.hideLoading()
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  },

  async delete() {
    wx.showModal({
      content: '确定要删除吗？',
      success: async res => {
        if (res.confirm) {
          // 用户点击了确定 可以调用删除方法了
          this.handleDelete()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  async handleDelete() {
    const { editFlag } = this.data
    const userInfo = app.globalData.userInfo
    if (!userInfo || !editFlag) return
    const id = app.globalData.cardEditItem.id
    try {
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      let result = await wx.$http({
        url: 'cardDelete',
        data: {
          user: userInfo.id,
          id: id
        }
      })
      if (result.message) {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      } else {
        wx.hideLoading()
      }
      if (result.status === 1) {
        this.setData({ file: '', name: '' })
        onfire.fire('updateCard', { data: { id }, type: 'del' })
        wx.navigateBack({
          delta: 1
        })
      }
    } catch (e) {
      console.log(e)
      wx.hideLoading()
      wx.showToast({
        title: '服务器开小差啦😅',
        icon: 'none'
      })
    }
  },

  uploadFile(file, formData) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${HOST}/api/wxLove100/uploadFile/`,
        method: 'POST',
        filePath: file,
        name: 'file',
        formData: formData,
        // 成功回调
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch(e) {
            console.log(e)
            reject(e)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
})
