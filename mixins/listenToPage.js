const calcRouteList = ['/','/pages/index/index','/pages/tools/index','/pages/study/index','/pages/me/index']
let mixinListenToPage = {
  data() {
    return {
      timeStr: new Date().getTime(), // 初始值
      pageStayTimes: 0, // 页面停留时长
      indexTimes: 0, // 设备页停留时长
      toolsTimes: 0, // 工具页停留时长
      studyTimes: 0, // 学习页停留时长
      meTimes: 0, // 我的页停留时长
      indexCount: 0, // 设备页停留次数
      toolsCount: 0, // 工具页停留次数
      studyCount: 0, // 学习页停留次数
      meCount: 0, // 我的页停留次数
      currentRoute: '/pages/index/index'
    }
  },
  methods: {
    savePageStayTimes(path) {
      let payload = {}
      switch (path) {
        case '/': case '/pages/index/index' :
          this.indexTimes = this.pageStayTimes
          this.indexCount = this.indexCount + 1
          payload.runTime = Number(Number(Math.round(this.indexTimes/1000)/3600).toFixed(2))
          payload.times = this.indexCount
          payload.type = 1
          payload.typeContent = '设备'
          break
        case '/pages/tools/index' :
          this.toolsTimes = this.pageStayTimes
          this.toolsCount = this.toolsCount + 1
          payload.runTime = Number(Number(Math.round(this.toolsTimes/1000)/3600).toFixed(2))
          payload.times = this.toolsCount
          payload.type = 2
          payload.typeContent = '工具'
          break
        case '/pages/study/index' :
          this.studyTimes = this.pageStayTimes
          this.studyCount = this.studyCount + 1
          payload.runTime = Number(Number(Math.round(this.studyTimes/1000)/3600).toFixed(2))
          payload.times = this.studyCount
          payload.type = 3
          payload.typeContent = '学习'
          break
        case '/pages/me/index' :
          this.meTimes = this.pageStayTimes
          this.meCount = this.meCount + 1
          payload.runTime = Number(Number(Math.round(this.meTimes/1000)/3600).toFixed(2))
          payload.times = this.meCount
          payload.type = 4
          payload.typeContent = '我的'
          break
      }
      console.log(payload)
      if(this.s_token)this.$u.api.userApi.appUserBarChartSave({ parameter: payload }).then(res => {
        this.reset()
      })
    },
    getCurrentRoute() { // 获取当前路由
      const page = getCurrentPages()
      let currPage = null
      let route = ''
      let options = null
      if (page && Array.isArray(page) && page.length > 0) {
        const pageSize = page.length
        currPage = page[pageSize - 1]
        route = currPage.route
        options = currPage.options
      }

      return {
        route,
        options
      }
    },
    reset() {
      this.pageStayTimes = 0 // 页面停留时长
      this.indexTimes = 0 // 设备页停留时长
      this.toolsTimes = 0 // 工具页停留时长
      this.studyTimes = 0 // 学习页停留时长
      this.meTimes = 0 // 我的页停留时长
      this.indexCount = 0 // 设备页停留次数
      this.toolsCount = 0 // 工具页停留次数
      this.studyCount = 0 // 学习页停留次数
      this.meCount = 0 // 我的页停留次数
      this.currentRoute = '/pages/index/index'
    }
  },
  onShow() {
    this.reset()
    this.timeStr = new Date().getTime()
    this.currentRoute = '/' + this.getCurrentRoute().route
  },
  onHide() {
    let t = new Date().getTime() - this.timeStr // 页面离开时间-页面进来时间
    this.timeStr = new Date().getTime()
    this.pageStayTimes = t
    const to = '/' + this.getCurrentRoute().route
    if (calcRouteList.includes(to)) { // 跳转到非统计页不统计时长和次数
      console.log('页面停留时长：'+ (this.pageStayTimes/1000) + '秒')
      if (this.pageStayTimes <= 2000) {
        console.log('切换时间小于2秒太频繁了，不计入统计')
        return
      }
      this.savePageStayTimes(this.currentRoute)
      this.currentRoute = to
    }
  }
}
export default mixinListenToPage
