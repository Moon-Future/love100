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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    adr: '',
    date: '2021-08-04',
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
      if (adr === '') return
      console.log(adr, date)
      this.triggerEvent('save')
    }
  }
})
