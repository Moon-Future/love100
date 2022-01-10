const app = getApp()
const { setNavBar } = require('../../utils/util')
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    painterData: {
      type: Object,
      value: {}
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalShow: false,
    imageSrc: '',
    CustomBar: app.globalData.CustomBar
  },

  lifetimes: {
    ready() {
      setNavBar(app.globalData)
      this.setData({
        CustomBar: app.globalData.CustomBar
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImgOK(e) {
      this.path = e.detail.path
      this.triggerEvent('onImgOK')
      this.setData({
        modalShow: true,
        imageSrc: e.detail.path
      })
    },
    saveImage() {
      wx.saveImageToPhotosAlbum({
        filePath: this.path,
        success: () => {
          this.setData({
            modalShow: false
          })
        }
      })
    },
    cancel() {
      this.setData({
        modalShow: false
      })
    }
  }
})
