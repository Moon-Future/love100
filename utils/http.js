const baseUrl = 'http://localhost:5555/api/wxLove100/'
// const baseUrl = 'https://wxproject.cl8023.com/api/wxName/'

const API = {
  login: baseUrl + 'login',
  updateUserInfo: baseUrl + 'updateUserInfo',
  getArticle: baseUrl + 'getArticle',
  getArticleFile: baseUrl + 'getArticleFile',
  createName: baseUrl + 'createName',
  getWxArticle: baseUrl + 'getWxArticle',
  getRandArticle: baseUrl + 'getRandArticle',
  getNameList: baseUrl + 'getNameList',
  getSurnameList: baseUrl + 'getSurnameList'
}

function http(opts) {
  const { url, data, method } = opts
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: API[url],
      data,
      method: method || 'POST',
      success(res) {
        resolve(res.data)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

module.exports = {
  http
}