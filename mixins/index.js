const calcRouteList = ['/','/pages/tools/index','/pages/study/index','/pages/me/index']
let mixin = {
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
      meCount: 0 // 我的页停留次数
    }
  },
  created() {
    /*window.addEventListener('hashchange',()=>{
      let t = new Date().getTime() - this.pageStayTimes
      this.pageStayTimes = new Date().getTime()
      console.log('hash待了时长：'+ t)
    })*/

    let rewriteHis = function(type){
      let origin = window.history[type]
      return function(){
        let rs = origin.apply(this, arguments)
        let e = new Event(type.toLocaleLowerCase())
        e.arguments = arguments
        window.dispatchEvent(e)
        return rs
      }
    }

    window.history.pushState = rewriteHis('pushState')

    window.history.replaceState = rewriteHis('replaceState')

    /*window.addEventListener('onload',(e)=>{
      this.timeStr = new Date().getTime()
      console.log(this.timeStr)
    })*/

    window.addEventListener('popstate',()=>{
      let t = new Date().getTime() - this.timeStr
      this.timeStr = new Date().getTime()
      // console.log('待了时长popstate：'+ t)
      this.pageStayTimes = t
    })

    window.addEventListener('pushstate',()=>{
      let t = new Date().getTime() - this.timeStr
      this.timeStr = new Date().getTime()
      // console.log('待了时长pushstate：'+ t)
      this.pageStayTimes = t
    })

    window.addEventListener('replacestate',()=>{
      let t = new Date().getTime() - this.timeStr
      this.timeStr = new Date().getTime()
      // console.log('待了时长replacestate：'+ t)
      this.pageStayTimes = t
    })
  },
  methods: {
    savePageStayTimes(path) {
      let payload = {}
      switch (path) {
        case '/' :
          this.indexTimes += this.pageStayTimes
          this.indexCount = this.indexCount + 1
          payload.runTime = Number(Number(Math.round(this.indexTimes/1000)/3600).toFixed(2))
          payload.times = this.indexCount
          payload.type = 1
          payload.typeContent = '设备'
          break
        case '/pages/tools/index' :
          this.toolsTimes += this.pageStayTimes
          this.toolsCount = this.toolsCount + 1
          payload.runTime = Number(Number(Math.round(this.toolsTimes/1000)/3600).toFixed(2))
          payload.times = this.toolsCount
          payload.type = 2
          payload.typeContent = '工具'
          break
      }
      if(this.s_token)this.$u.api.userApi.appUserBarChartSave({ parameter: payload })
    }
  },
  watch: {
    $route(to,from) {
      if (calcRouteList.includes(to.path)) { // 跳转到非统计页不统计时长和次数
        if (this.pageStayTimes <= 2000) {
          console.log('切换时间小于2秒太频繁了，不计入统计')
          return
        }
        this.savePageStayTimes(from.path)
      }
    }
  }
}
export default mixin
