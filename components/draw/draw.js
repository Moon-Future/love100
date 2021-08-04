// components/draw/draw.js
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
    imageSrc: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImgOK(e) {
      console.log('onImgOK', e)
      this.triggerEvent('onImgOK')
      this.setData({
        modalShow: true,
        imageSrc: e.detail.path
      })
    },
    cancel() {
      this.setData({
        modalShow: false
      })
    }
  }
})