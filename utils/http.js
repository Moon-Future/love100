// const HOST = 'http://192.168.31.44:5555'
// const HOST = 'http://192.168.31.157:5555' // apple
const HOST = 'http://172.17.215.225:5555' // xunFei
// const HOST = 'http://localhost:5555'
// const HOST = 'https://wxproject.cl8023.com'
const baseUrl = `${HOST}/api/wxLove100/`

const API = {
  login: baseUrl + 'login',
  updateUserInfo: baseUrl + 'updateUserInfo',
  toBeLover: baseUrl + 'toBeLover',
  breakup: baseUrl + 'breakup',
  getCardList: baseUrl + 'getCardList',
  cardFinished: baseUrl + 'cardFinished',
  cardEdit: baseUrl + 'cardEdit',
  cardAdd: baseUrl + 'cardAdd',
  cardDelete: baseUrl + 'cardDelete',
  getSentence: baseUrl + 'getSentence',
  getMessage: baseUrl + 'getMessage',
  readMessage: baseUrl + 'readMessage',
  getControl: baseUrl + 'getControl',
  refuse: baseUrl + 'refuse',
  suggest: baseUrl + 'suggest',
  getFestival: baseUrl + 'getFestival',
  addMemory: baseUrl + 'addMemory',
  getMemory: baseUrl + 'getMemory'
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
  http,
  HOST
}