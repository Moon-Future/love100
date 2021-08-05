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
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1].route
      if (`pages/${url}/${url}` === currentPage) return
      wx.navigateTo({
        url: `/pages/${url}/${url}`
      })
    }
  }
})