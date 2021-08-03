Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    active: {
      type: Number,
      value: 1
    }
  },
  methods: {
    goPage(e) {
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: `/pages/${url}/${url}`
      })
    }
  }
})