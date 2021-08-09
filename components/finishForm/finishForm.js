// components/finishForm/finishForm.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    adr: {
      type: String,
      value: ''
    },
    date: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal(e) {
      this.triggerEvent('hideModal')
    },
    dateChange(e) {
      this.setData({
        date: e.detail.value
      })
    },
    inputChange(e) {
      this.setData({
        adr: e.detail.value
      })
    },
    save() {
      if (this.data.loading) return
      let { adr, date } = this.data
      adr = adr.trim()
      if (adr === '') {
        wx.showToast({
          title: '请填写完成地点',
          icon: 'none',
        })
        return
      }
      this.triggerEvent('save', { adr: adr, date: date })
    }
  }
})
