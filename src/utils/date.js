export default {
  shortcuts: [
    {
      text: '今天',
      value: () => {
        const start = new Date()
        return [start, start]
      }
    },
    {
      text: '昨天',
      value: () => {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        return [start, start]
      }
    },
    {
      text: '前天',
      value: () => {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
        return [start, start]
      }
    },
    {
      text: '最近一周',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      }
    },
    {
      text: '最近一月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      }
    }
  ]
}
