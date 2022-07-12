// components/month/month.js
const calendar = require('../../lib/calendar.js');
const { YEARS, MONTHS, WEEKS } = require('../../utils/constant')
const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    festivalMap: {
      type: Object,
      default: {} // 卡片完成对象
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    todayInfo: {},
    activeDayInfo: {},
    weeks: WEEKS,
    dates: [],
    yearList: YEARS,
    yearSelect: '',
    monthList: MONTHS,
    monthSelect: '',
  },

  lifetimes: {
    attached: async function() {
      const nowInfo = this.getTimeInfo()
      this.setData({ todayInfo: this.getDayInfo(nowInfo.year, nowInfo.month, nowInfo.day) })
      this.initCalendar()
    },
    ready: async function() {
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initCalendar(time) {
      // 今天日期
      const nowTimeInfo = this.getTimeInfo(time)
      // 当前月第一天
      const firstDay = this.getTimeInfo(`${nowTimeInfo.year}-${nowTimeInfo.month}-1`)
      // 当前月总天数
      const monthDays = this.getMonthDays(nowTimeInfo.year, nowTimeInfo.month)
      this.getDates(firstDay, monthDays)
      this.setData({
        activeDayInfo: this.getDayInfo(nowTimeInfo.year, nowTimeInfo.month, nowTimeInfo.day),
        yearSelect: this.data.yearList.indexOf(nowTimeInfo.year),
        monthSelect: this.data.monthList.indexOf(nowTimeInfo.month),
      })
      this.triggerEvent('selectDay', this.data.activeDayInfo)
    },

    // 上个月
    prevMonth() {
      let year = this.data.activeDayInfo.cYear
      let month = this.data.activeDayInfo.cMonth
      let day = this.data.activeDayInfo.cDay
      year = month === 1 ? year - 1 : year
      month = month === 1 ? 12 : month - 1
      const monthDays = this.getMonthDays(year, month)
      this.initCalendar(`${year}-${month}-${Math.min(monthDays, day)}`)
    },

    // 下个月
    nextMonth() {
      let year = this.data.activeDayInfo.cYear
      let month = this.data.activeDayInfo.cMonth
      let day = this.data.activeDayInfo.cDay
      year = month === 12 ? year + 1 : year
      month = month === 12 ? 1 : month + 1
      const monthDays = this.getMonthDays(year, month)
      this.initCalendar(`${year}-${month}-${Math.min(monthDays, day)}`)
    },

    // 选择天
    selectDay(e) {
      const dateInfo = e.currentTarget.dataset.date
      if (dateInfo.date === this.data.activeDayInfo.date) return
      this.setData({ activeDayInfo: this.getDayInfo(dateInfo.cYear, dateInfo.cMonth, dateInfo.cDay) })
      this.triggerEvent('selectDay', this.data.activeDayInfo)
    },

    // 回到今天
    backToToday() {
      const { activeDayInfo, todayInfo } = this.data
      if (activeDayInfo.date === todayInfo.date) return
      this.initCalendar(`${todayInfo.cYear}-${todayInfo.cMonth}-${todayInfo.cDay}`)
    },

    // 获取时间年月日
    getTimeInfo(time) {
      let date
      if (time) {
        const arr = time.split('-')
        date = new Date(`${arr[0]}-${this.doubleStr(arr[1])}-${this.doubleStr(arr[2])}`)
      } else {
        date = new Date()
      }
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        week: date.getDay() === 0 ? 7 : date.getDay()
      }
    },

    doubleStr: function (val) {
      val = (val + '').length == 1 ? ('0' + val) : val
      return val
    },

    // 获取某天数据，包含公历和农历
    getDayInfo(year, month, day) {
      return calendar.solar2lunar(year, month, day)
    },

    // 获取公历月天数
    getMonthDays(year, month) {
      return calendar.solarDays(year, month)
    },

    // 处理当前月日历数据
    getDates(firstDay, monthDays) {
      const { year, month, day, week } = firstDay
      const dates = []
      for (let i = 1, len = monthDays + week - 1; i <= len; i++) {
        if (i % 7 === 1) {
          dates.push([])
        }
        let index = dates.length - 1
        if (i < week) {
          // 从星期一开始，小于第一天都为空
          dates[index].push('')
        } else {
          dates[index].push(this.getDayInfo(year, month, i - week + 1))
        }
      }
      let index = dates.length - 1
      if (dates[index].length === 0) {
        dates.splice(index, 1)
      } else if (dates[index].length < 7) {
        dates[index].push(...(new Array(7 - dates[index].length).fill('')))
      }
      this.setData({ dates })
    },

    // 选择年
    yearChange(e) {
      const index = e.detail.value
      const year = this.data.yearList[index]
      if (year === this.data.activeDayInfo.cYear) return
      const month = this.data.activeDayInfo.cMonth
      const day = this.data.activeDayInfo.cDay
      const monthDays = this.getMonthDays(year, month)
      this.initCalendar(`${year}-${month}-${Math.min(monthDays, day)}`)
    },

    // 选择月
    monthChange(e) {
      const index = e.detail.value
      const month = this.data.monthList[index]
      if (month === this.data.activeDayInfo.cMonth) return
      const year = this.data.activeDayInfo.cYear
      const day = this.data.activeDayInfo.cDay
      const monthDays = this.getMonthDays(year, month)
      this.initCalendar(`${year}-${month}-${Math.min(monthDays, day)}`)
    }
  }
})