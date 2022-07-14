const calendar = require('../../lib/calendar.js')
const { YEARS, MONTHS } = require('../../utils/constant')
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    date: {
      type: String,
      default: '2022-7-13'
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    solarDate: [],
    lunarDate: [],
    pickerDate: [],
    dateIndex: [],
    isLunar: false
  },

  observers: {
    show(newValue) {
      if (newValue) {
        if (this.dateInfo) {
          const { isLunar, cYear, cMonth, cDay, lYear, lMonth, lDay } = this.dateInfo
          this.setData({ isLunar: isLunar })
          if (isLunar) {
            this.getDays(lYear, lMonth, lDay)
          } else {
            this.getDays(cYear, cMonth, cDay)
          }
        } else {
          this.setData({ isLunar: false })
          this.getDays(this.year, this.month, this.day)
        }
      }
    }
  },

  lifetimes: {
    ready: async function () {
      const arr = this.data.date.split('-')
      this.year = Number(arr[0])
      this.month = Number(arr[1])
      this.day = Number(arr[2])
      this.initDateList()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 时间选择数据
    initDateList() {
      const solarDate = []
      const lunarDate = []
      // 公历
      solarDate.push(YEARS.map(item => { return { id: item, name: item + '年' } }))
      solarDate.push(MONTHS.map(item => { return { id: item, name: item + '月' } }))
      // 农历
      lunarDate.push(YEARS.map(item => { return { id: item, name: item + '年' } }))
      lunarDate.push(MONTHS.map(item => { return { id: item, name: calendar.toChinaMonth(item) } }))
      this.setData({ solarDate, lunarDate })
      this.getDays(this.year, this.month, this.day)
    },

    // 根据年月计算天选择 
    getDays(year, month, day) {
      const { solarDate, lunarDate, dateIndex } = this.data
      let dayIndex = -1
      // 公历
      const solarDays = calendar.solarDays(year, month)
      solarDate[2] = []
      for (let i = 1; i <= solarDays; i++) {
        solarDate[2].push({ id: i, name: i + '日' })
        if (!this.data.isLunar && day === i) {
          dayIndex = i - 1
        }
      }
      // 农历
      const lunarDays = calendar.monthDays(year, month)
      lunarDate[2] = []
      for (let i = 1; i <= lunarDays; i++) {
        lunarDate[2].push({ id: i, name: calendar.toChinaDay(i) })
        if (this.data.isLunar && day === i) {
          dayIndex = i - 1
        }
      }
      // dayIndex = this.data.isLunar ? Math.min(dayIndex, lunarDays - 1) : Math.min(dayIndex, solarDays - 1)
      dateIndex[0] = YEARS.indexOf(year)
      dateIndex[1] = MONTHS.indexOf(month)
      dateIndex[2] = dayIndex
      this.setData({ solarDate, lunarDate, pickerDate: this.data.isLunar ? lunarDate : solarDate }, () => {
        this.setData({ dateIndex })
      })
    },

    // 选择的时间
    dateChange(e) {
      this.setData({ dateIndex: e.detail.value })
    },

    // 滚动选择开始
    pickStart() {
      this.scrollStart = true
    },

    // 滚动选择结束
    pickEnd() {
      this.scrollStart = false
    },

    // 切换公历农历 
    tabChange(e) {
      // 选择器未滚动完成前不可切换
      if (this.scrollStart) return
      const { pickerDate, dateIndex } = this.data
      const year = pickerDate[0][dateIndex[0]].id
      const month = pickerDate[1][dateIndex[1]].id
      const day = pickerDate[2][dateIndex[2]].id
      const tab = e.currentTarget.dataset.tab
      this.setData({ isLunar: tab === 'lunar' })
      if (tab === 'lunar') {
        const date = calendar.solar2lunar(year, month, day)
        this.getDays(date.lYear, date.lMonth, date.lDay)
      } else {
        const date = calendar.lunar2solar(year, month, day)
        this.getDays(date.cYear, date.cMonth, date.cDay)
      }
    },

    confirm() {
      this.setData({ dateIndex: this.dateIndexTemp || this.data.dateIndex })
      const { pickerDate, dateIndex, isLunar } = this.data
      const year = pickerDate[0][dateIndex[0]].id
      const month = pickerDate[1][dateIndex[1]].id
      const day = pickerDate[2][dateIndex[2]].id
      this.dateInfo = isLunar ? calendar.lunar2solar(year, month, day) : calendar.solar2lunar(year, month, day)
      this.dateInfo.isLunar = isLunar
      this.dateInfo.name = isLunar ? `(农历) ${this.dateInfo.lYear}年${this.dateInfo.IMonthCn}${this.dateInfo.IDayCn}` : `(公历) ${this.dateInfo.date}`
      this.triggerEvent('confirm', JSON.parse(JSON.stringify(this.dateInfo)))
    },

    cancel() {
      this.triggerEvent('cancel')
    }
  },
})
