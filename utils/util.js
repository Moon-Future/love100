// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
// }
const formatTime = (date, format = 'yyyy-MM-dd') => {
  date = typeof date === 'number' ? new Date(date) : date
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const setNavBar = (globalData) => {
  if (globalData.CustomWidth) return
  const systemInfo = wx.getSystemInfoSync()
  const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
  globalData.StatusBar = systemInfo.statusBarHeight
  globalData.Custom = menuButtonInfo;
  globalData.CustomBar = menuButtonInfo.bottom + menuButtonInfo.top - systemInfo.statusBarHeight
  globalData.Android = systemInfo.system.includes('Android') ? true : false
  globalData.CustomWidth = menuButtonInfo.width
}

module.exports = {
  formatTime,
  setNavBar
}
