const YEARS = []
for (let i = 1900, len = 2100; i <= len; i++) {
  YEARS.push(i)
}

module.exports = {
  YEARS,
  MONTHS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  WEEKS: [
    { id: 1, name: '一' },
    { id: 2, name: '二' },
    { id: 3, name: '三' },
    { id: 4, name: '四' },
    { id: 5, name: '五' },
    { id: 6, name: '六' },
    { id: 7, name: '日' },
  ]
}