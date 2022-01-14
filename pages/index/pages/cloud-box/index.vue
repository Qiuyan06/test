<template>
  <view class="instrument">
    <view class="tip" v-if="isMock">
      <u-icon name="info-circle-fill" size="40" color="#2C72F9"></u-icon>
      <view class="text">此页为示例数据</view>
    </view>
    <details-info
      :record-data="recordData"
      :instru-data="instruData"
      :userId="userId"
      :instruType="'1'"
      :showWarnEntry="showWarnEntry"
      :isToCloudBoxWarn = "isToCloudBoxWarn"
      :warnLogger="warnLogger"
    ></details-info>
    <view class="charts">
      <!-- #ifndef MP-WEIXIN -->
      <!--非微信端样式-->
      <u-sticky @fixed="handleFixed" @unfixed="handleUnFixed">
        <view :class="['control',isFixed ? 'tab-fixed':'']">
          <TabBox v-if="hasRealData" :list="tabs" :current="currentTab" @handleChangeType="tabsChange"></TabBox>
          <TabBox v-else :list="tabs" :current="currentTab" @handleChangeType="tabsChange_common"></TabBox>
          <view  v-show="currentTab === tabs.length-2" class="select-time" @click="pickerTimeShow = true">
            <text class="iconfont">&#xe665;</text>
            <text style="margin-right: 6rpx">选择时间</text>
            <u-icon name="arrow-right" color="#ffffff"></u-icon>
          </view>
          <view v-show="currentTab === tabs.length-1">
            <view class="item-btn" @click="searchData">
              <text class="iconfont">&#xe644;</text>
            </view>
          </view>
        </view>
      </u-sticky>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <!--微信端样式-->
      <view class="control">
        <TabBox v-if="hasRealData" :list="tabs" :current="currentTab" @handleChangeType="tabsChange"></TabBox>
        <TabBox v-else :list="tabs" :current="currentTab" @handleChangeType="tabsChange_common"></TabBox>
        <view class="select-time" @click="pickerTimeShow = true">
          <text class="iconfont">&#xe665;</text>
          <text style="margin-right: 6rpx">选择时间</text>
          <u-icon name="arrow-right" color="#ffffff"></u-icon>
        </view>
      </view>
      <!-- #endif -->

      <!--实时监控部分-->
      <view class="charts-box" style="margin-bottom:730rpx;" v-if="hasRealData && currentTab === 0 && realData">
        <template v-if="!isMock">
          <RealDataBox :realData="realData" :showByRealData="showByRealData"></RealDataBox>
        </template>
        <view class="Long_rangeControl" v-if="hasRemote">
          <view class="control_tltlie">远程控制</view>
          <view class="control_content" v-for="item in remoteMonitoring">
            <view class="iClsState">
              <text class="iconfont">{{ item.images | formatFont }}</text>
              <span class="state">{{item.fieldName}}</span>
            </view>

            <!--远程控制按钮部分-->
              <u-switch v-if="item.isSwitch && item.isSwitch==='ON'" v-model="item.checked" active-color="#19be6b" inactive-color="#eee" @click="handleRmote(item)"></u-switch>
              <u-button v-else class="btnStyle" type="primary" shape="circle"  @click="handleRmote(item)" :disabled="item.isShow === 'close'">{{item.button}}</u-button>
              <!--远程控制按钮部分-->
          </view>
        </view>
      </view>

      <!--统计分析部分-->
      <template
        v-else-if="hasRealData && currentTab===1||(!hasRealData && currentTab===0)"
      >
        <view class="charts-box" style="margin-bottom:730rpx;">
          <view class="title">
            <text>运行时长次数分析</text>
          </view>
          <view class="charts-content">
            <view v-show="!popShow">
              <view>
                <canvas
                  v-show="isWeChat"
                  canvas-id="canvasRing"
                  id="canvasRing"
                  class="charts2"
                  @touchstart="touchRing"
                ></canvas>
                <!--  #ifdef MP-WEIXIN  -->
                <view class="canvas-img">
                  <img :src="imgRingSrc" alt />
                </view>
                <!--  #endif  -->
              </view>
              <view>
                <view class="charts-right">
                  <view
                    class="run"
                  >运行&nbsp;&nbsp;&nbsp;&nbsp;{{Number(Number(ringDetail.runTime || 0) / 3600).toFixed(2) + 'h'}}</view>
                  <view
                    class="wait"
                  >待机&nbsp;&nbsp;&nbsp;&nbsp;{{Number(Number(ringDetail.waitTime || 0) / 3600).toFixed(2) + 'h'}}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <!--学习资料部分-->
      <view
        class="study"
        v-else-if="tabs.length === 3 && currentTab===2||(tabs.length === 2 && currentTab===1)"
      >
        <Study :list="list" :loadMoreStatus="loadMoreStatus" />
      </view>
    </view>

    <view class="footer-btn">
      <view v-if="instruData && instruData.jurisdiction===1 && showOnOffEntry" class="btn-item" @click="openOrClose">
        <view class="btn">
          <text class="iconfont">&#xe63e;</text>
        </view>
        <text class="label">{{onoff}}</text>
      </view>
      <view class="btn-item" @click="toDeviceLog">
        <view class="btn">
          <text class="iconfont">&#xe640;</text>
        </view>
        <text class="label">日志</text>
      </view>
      <view
        v-if="instruData && instruData.jurisdiction!==3&&!instruData.boo"
        class="btn-item"
        @click="toShare"
      >
        <view class="btn code">
          <text class="iconfont">&#xe643;</text>
        </view>
        <text class="label">分享码</text>
      </view>
      <view class="btn-item" @click="toMember">
        <view class="btn">
          <text class="iconfont">&#xe641;</text>
        </view>
        <text class="label">共享成员</text>
      </view>
      <view class="btn-item" @click="toInfo">
        <view class="btn">
          <text class="iconfont">&#xe63f;</text>
        </view>
        <text class="label">仪器信息</text>
      </view>
    </view>

    <u-action-sheet
      :list="openOrCloseList"
      v-model="openOrCloseShow"
      border-radius="24"
      @click="openOrCloseChange"
    ></u-action-sheet>

    <u-calendar v-model="pickerTimeShow" mode="range" @change="pickerTimeConfirm"></u-calendar>

    <WechatPop ref="wechatPop" :hidePop="true" @hidePop="hidePop"></WechatPop>
  </view>
</template>
<script>
import TabBox from '../../componts/TabBox'
import DetailsInfo from './components/DetailsInfo'
import RealDataBox from './components/RealData'
import uCharts from '@/components/u-charts/u-charts.js'
import Study from '@/pages/index/componts/Study'
import { getDateArr } from '@/utils/index'
import WechatPop from '@/components/WechatPop'

export default {
  components: {
    TabBox,
    DetailsInfo,
    RealDataBox,
    WechatPop,
    Study
  },
  data() {
    return {
      canvaRing:null,//运行分析图
      canvaRadar:null,//雷达图
      hasRealData: null,
      hasRemote:null,
      isMock: false,
      title: '仪器信息',
      instruNum: '',
      equipNum: '',
      instruId: '',
      dbName: '',
      state: null,
      userId: null,
      recordData: null,//统计数据
      instruData: null,//仪器信息
      openOrCloseList: [
        { color: '#4885FF', text: '关机', disabled: true },
        { color: '#4885FF', text: '开机', disabled: true }
      ],
      openOrCloseShow: false,
      isLock: false,
      currentTab: 0,
      time: '选择时间',
      beginTime: null,
      endTime: null,
      pickerTimeShow: false,
      pickerTimeParams: {
        year: true,
        month: true,
        day: true,
        hour: false,
        minute: false,
        second: false
      },
      ringDetail: {},
      // u-charts
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      // 雷达图
      instruName: '',
      mcArray: [],
      isShowMc: false,
      avgArray: [],
      max: '',
      isFixed: false,
      popShow: false,
      isWeChat: true,
      imgRingSrc: '',
      imgRadarSrc: '',
      realData: null,
      timeout: null,
      timer: null,
      // ------------------- 学习资料
      list: [],
      page: 1,
      pageSize: 20,
      loadMoreStatus: 'loading',
      checked: '',
      logger:null,//配置相关的日志接口
      warnLogger:null,//配置相关的报警日志接口
      remoteMonitoring:null,//远程控制接口
      realTimeMonitoring:null,//实时监控接口
      showWarnEntry:true,//是否展示报警入口
      showOnOffEntry:true,//是否展示开关入口
      outTimer:null,
      specialDeal:false,//基创终止按钮是否置灰
        isToCloudBoxWarn:false,//报警入口是否跳转到云盒子报警页面
    }
  },
  filters: {
    formatFont(v) {
      if (v === null || v === '' || v === undefined) return ''
      return unescape('%u'+v.slice(3,7))
    }
  },
  computed: {
    tabs() {
      if (this.hasRealData) {
        return [
          { name: '实时监控' },
          { name: '统计分析' },
          { name: '学习资料' }
        ]
      }
      return [{ name: '统计分析' }, { name: '学习资料' }]
    },
    showByRealData() {
      //离线或关机实时监控数据接口若有数据返回时数据展示为‘--’
      return (
        this.instruData &&
        this.instruData.state !== 3 &&
        this.instruData.state !== 5
      )
    },
    onoff() {
      let data = ''
      switch (this.instruData.state) {
        case 1:
          data = '关机'
          break
        case 2:
          data = '关机'
          break
        case 3:
          data = '开机'
          break
        case 4: // 后端不再返回此字段
          data = '开关'
          break
        case 5:
          data = '开关'
          break
      }
      return data
    }
  },
  methods: {
    /*
    * 判断是否展示实时监控tab
    * 是：展示实时监控数据
    * 否：展示运行统计数据
    * */
    getTemplateEti(){
      this.$u.api.equipmentApi.getTemplateEti({
        parameter: {equipId: this.instruId}
      }).then((data) => {
      this.isToCloudBoxWarn = data ? true : false
        const apis = []
        if (data && data.length) {
          data.forEach(item => {
            if (Object.keys(JSON.parse(item))[0] !== 'logger') {
              apis.push(JSON.parse(item))
            } else {
              /*this.logger = Object.values(JSON.parse(item))
              this.warnLogger = Object.values(JSON.parse(item))*/
            }
          })
        }
        const remoteMonitoringList = apis.filter(item => Object.keys(item)[0] === 'remoteMonitoring')
        const realTimeMonitoringList = apis.filter(item => Object.keys(item)[0] === 'realTimeMonitoring')
        const remoteMonitoring = remoteMonitoringList && remoteMonitoringList[0] && remoteMonitoringList[0].remoteMonitoring
        this.realTimeMonitoring = realTimeMonitoringList && realTimeMonitoringList[0] && realTimeMonitoringList[0].realTimeMonitoring
          this.remoteMonitoring && this.remoteMonitoring.map(item => {
              if(item.fieId = 'remoteControl' && this.specialDeal){
                  item.eti = ''
                  if (item.isShow)item.isShow = 'close'
              }
              return item
          })
        this.hasRemote = remoteMonitoring && Array.isArray(remoteMonitoring) && remoteMonitoring.length > 0

        //有实时数据配置信息或者远程控制配置信息时展示实时监控模块
        if(this.realTimeMonitoring || this.hasRemote){
          this.hasRealData = true
          this.initData()
        }else{
          this.hasRealData = false
          this.initData_common()
        }
      })
    },

    // 获取日志和报警配置
    getLogAndWarnInfo(){
      return new Promise((resolve, reject) => {
        this.$u.api.equipmentApi.getSmartCloudBoxTemplateInfo({
          parameter: { equipId:this.instruId, platformType:'IOT-UU', moduleType:'4' }
        }).then((res) => {
          const data = res && res.setContent && JSON.parse(res.setContent)
          this.logger = data && data.tabs && data.tabs.filter(item=>item.isAlarmLog==='OFF')
          this.warnLogger = data && data.tabs && data.tabs.filter(item=>item.isAlarmLog==='ON')
          // console.log('日志数据：',this.logger)
          // console.log('报警数据：',this.warnLogger)

          //判断是否有报警配置
          const hasWarnLog = !this.warnLogger || (Array.isArray(this.warnLogger) && this.warnLogger.length>0)
          resolve(hasWarnLog)
        }).catch(e=>{
          reject(e)
        })
      })

    },

    // 判断是否展示报警入口和开关机
    getIsShowEntry(){
      return new Promise((resolve, reject) => {
        this.$u.api.equipmentApi.getSmartCloudBoxTemplateInfo({
          parameter: { equipId:this.instruId, platformType:'IOT-UU', moduleType:'5' }
        }).then((res) => {
          const data = res && res.setContent && JSON.parse(res.setContent)
          const warnData = data && data.titles.filter(item=>item.fieId === 'alarmInfo')[0]
          const onOffData = data && data.titles.filter(item=>item.fieId === 'smartBoxSwitch')[0]
          // this.showWarnEntry= !warnData || warnData.isShow==='ON'
            console.log('是否显示报警2：',!warnData || warnData.isShow==='ON')
          resolve(!warnData || warnData.isShow==='ON')
          this.showOnOffEntry = !onOffData || onOffData.isShow==='ON'
        }).catch(e=>{
          reject(e)
        })
      })

    },

    // 初始化加载数据（统计分析）
    initData_common() {
      if (!this.isMock) {
        this.catCountdayData()
        // 隐藏实际设备的雷达图
        // this.getServerData2()
      } else {
        this.showRing('canvasRing', {
          series: [
            {
              name: '运行',
              data: 0,
              color: '#6699FF'
            },
            {
              name: '待机',
              data: 0,
              color: '#52CCA3'
            },
            {
              name: '关机',
              data: 0,
              color: '#646986'
            }
          ],
          totalDuration: 0
        })
        this.mcArray = [0, 0, 0]
        this.avgArray = [0, 0, 0]
        this.max = 10
        // 隐藏模拟设备的雷达图
        /*this.showRadar('canvasRadar', {
          categories: ['计量数', '维护数'],
          series: [
            {
              name: this.instruName,
              data: [0, 0, 0]
            },
            {
              name: '平均值',
              data: [0, 0, 0]
            }
          ]
        })*/
      }
    },

    // 初始化加载数据（实时监控）
    initData() {
      if (!this.isMock) {
        this.clearRealTimer()
        this.getRealData()
        this.timeout = setInterval(this.getRealData, 5000)
      }
    },

    /*
    * 普通云盒子切换tab
    * tab:统计分析、学习资料
    * 备注：微信小程序不提供切换tab功能，app展示所有
    * */
    tabsChange_common(index) {
      //#ifdef MP-WEIXIN
      if (index !== 0) {
        this.showPop()
        return
      }
      //#endif

      //#ifndef MP-WEIXIN
      this.currentTab = index
      if(this.currentTab === 0){
          this.initData_common()
      }
      //#endif
    },

    /*
    * 带配置实时监控功能的云盒子切换tab
    * tab:实时监控、统计分析、学习资料
    * 备注：微信小程序不提供切换tab功能，app展示所有
    * */
    tabsChange(index) {
      //#ifdef MP-WEIXIN
      if (index !== 0) {
        this.showPop()
        return
      }
      //#endif

      //#ifndef MP-WEIXIN
      this.currentTab = index
      this.clearRealTimer()
      if (index === 0) {
        this.initData()
      } else if (index === 1) {
        this.initData_common()
      }
      //#endif
    },

    // 获取实时监控数据
    getRealData() {
      this.$u.post(this.realTimeMonitoring,{parameter: {equipId: this.instruId}}).then((data) => {
        // console.log('data:',data)
        const titles = JSON.parse(data && data.titles) || []
        const realList = titles.filter(item=>!item.button)
        const remoteList = titles.filter(item=>item.button)
        this.realData = realList.map((item) => {
          return {
            ...item,
            fieldValue:
                    data.datas && data.datas[item.fieId]
                            ? data.datas && data.datas[item.fieId]
                            : item.button,
            remoteControlInterface: item && item.remoteControlInterface,
            isShow: item && item.isShow
          }
        })
        this.remoteMonitoring = remoteList
      })
    },

    // 实时数据清除定时器
    clearRealTimer() {
        console.log('实时数据清除定时器')
        if (this.timeout){
          console.log('有数据 实时数据清除定时器')
        clearInterval(this.timeout)
        this.timeout = null
      }
    },

    // 远程控制
    handleRmote(data){
        let param = null
        if(data.isSwitch === 'ON'){
            param = data.checked ? 'on' : 'off'
        }else{
            param = data.controlsParameter ? `&${data.fieId}=${data.controlsParameter}`: ''
        }
      const url = `${data.eti}?sid=${this.instruData.equipAddress}${param}`

      // 清空获取实时数据定时器
      this.clearRealTimer()
      //重新获取页面接口来源，定时请求数据
      this.clearOutTimer()

      // 针对基创置灰终止按钮
      this.remoteMonitoring.map(item => {
        if(item.fieId = 'remoteControl'){
          item.eti = ''
          if (item.isShow)item.isShow = 'close'
          this.specialDeal = true
        }
        return item
      })
      this.$u.get(url).then(res => {
        this.outTimer = setTimeout(() => {
          this.specialDeal = false
          this.getTemplateEti()
        }, 25000)
        uni.showToast({
          title: '操作成功',
          icon: 'none'
        })
      })

    },

    clearOutTimer(){
      if (this.outTimer) {
        clearTimeout(this.outTimer)
        this.outTimer = null
      }
    },

    // 处理吸顶（固定状态）
    handleFixed(index) {
      this.isFixed = true
    },

    // 处理吸顶（非固定状态）
    handleUnFixed(index) {
      this.isFixed = false
    },

    // 右上角的反馈记录按钮,跳转到反馈记录页面
    onNavigationBarButtonTap(e) {
      uni.navigateTo({
        url: `/pages/index/pages/problemFeedback/index?instruId=${this.instruId}&instruName=${this.instruName}`
      })
    },

    // 切换日历获取统计分析运行时长统计数据和雷达数据
    pickerTimeConfirm(time) {
      let temp = time.startDate.split('-')
      temp.shift()
      let temp2 = time.endDate.split('-')
      temp2.shift()
      this.time = temp.join('-') + '~' + temp2.join('-')
      this.beginTime = time.startDate
      this.endTime = time.endDate
      this.isWeChat = true
      this.catCountdayData()
      // 隐藏实际设备的雷达图
      // this.getServerData2()
    },
    // 获取仪器详情数据
    equipInformation() {
      if (!this.instruNum) {
        return
      }

      const api = this.isMock ? 'equipInfomationMock' : 'equipInformation'
      const parameter = this.isMock ? {instruType: 1} : {instruNum: this.instruNum, type: 1}
      this.$u.api.equipmentApi[api]({
        parameter: parameter
      }).then((res) => {
        this.instruData = res ? res : {}
        this.instruName = res ? res.instruName : ''
      })
    },
    // 清除设备信息定时器
    clearEquipTimer(){
      if(this.timer){
        clearInterval(this.timer)
        this.timer = null
      }
    },

    // 获取仪器统计数据（报警，维护，计量...）
    equipRecord() {
      if (!this.instruNum || !this.instruId) {
        return
      }

      const par = {
        instruNum: this.instruNum,
        instruId: this.instruId,
        dbName: this.dbName
      }

      if (this.dbName) {
        par.dbName = this.dbName
      }

      this.$u.api.equipmentApi
        .equipRecord({
          parameter: par
        })
        .then((res) => {
          this.recordData = res || null
        })
    },

    // 开关机
    openOrClose() {

      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif

      //#ifndef MP-WEIXIN
      if (this.isLock || !this.instruId) {
        return
      }

      this.isLock = true

      this.$u.api.equipmentApi
        .getInitialState({
          parameter: {
            instruId: this.instruId
          }
        })
        .then((res) => {
          if (res) {
            if (res.runningStatus === 0 || res.runningStatus === 1) {
              // 显示关机
              this.openOrCloseList[1].disabled = true
              this.openOrCloseList[0].disabled = false
            } else if (res.runningStatus === 2) {
              // 显示开机
              this.openOrCloseList[0].disabled = true
              this.openOrCloseList[1].disabled = false
            } else if (res.runningStatus === 3) {
              uni.showToast({
                title: '该设备已离线',
                icon: 'none'
              })

              return
            }
          }

          this.openOrCloseShow = true
        })
        .finally(() => {
          this.isLock = false
        })
      //#endif
    },
    openOrCloseChange(index) {
      if (this.isLock || !this.instruId) {
        return
      }

      this.isLock = true

      this.$u.api.equipmentApi
        .operation({
          parameter: {
            instruId: this.instruId,
            status: 1,
            flag: index === 0 ? false : index === 1 ? true : ''
          }
        })
        .then(() => {
          uni.showToast({
            title: '操作成功'
          })
          setTimeout(this.equipInformation, 20000)
        })
        .finally(() => {
          this.isLock = false
        })
    },
    // 跳转到日志页面
    toDeviceLog() {
      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif
      //#ifndef MP-WEIXIN
      // uni.navigateTo({url: '/pages/index/pages/device-log/index?instruId=' + this.instruId + '&dbName=' + this.dbName + '&instruType=1'})
      this.$u.vuex(`s_bus.setList`, this.logger)
      uni.navigateTo({url: '/pages/index/pages/device-cloud-box-log/index?instruId=' + this.instruId + '&dbName=' + this.dbName + '&instruType=1'})
      //#endif
    },
    // 跳转到分享页面
    toShare() {
      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif
      //#ifndef MP-WEIXIN
      uni.navigateTo({
        url:
          '/pages/index/pages/share-page/index?permissionIds=' +
          (this.instruData ? this.instruData.equipId || '' : '')
      })
      //#endif
    },
    // 跳转到共享成员页面
    toMember() {
      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif
      //#ifndef MP-WEIXIN
      const instruId = `?instruId=${
        (this.instruData && this.instruData.equipId) || ''
      }`
      const jurisdiction = `&jurisdiction=${
        (this.instruData && this.instruData.jurisdiction) || ''
      }`
      const dbName = `&dbName=${this.dbName}`
      uni.navigateTo({
        url: `/pages/index/pages/device-member/index${instruId}${jurisdiction}${dbName}`
      })
      //#endif
    },
    // 跳转到仪器信息页面
    toInfo() {
      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif
      //#ifndef MP-WEIXIN
      const jurisdiction = `&jurisdiction=${
        (this.instruData && this.instruData.jurisdiction) || ''
      }`
      uni.navigateTo({
        url: `/pages/index/pages/cloud-box/info-page?instruNum=${this.instruNum}&instruId=${this.instruId}&dbName=${this.dbName}${jurisdiction}&isMock=${this.isMock}&equipNum=${this.equipNum}`
      })
      //#endif
    },

    // 获取并渲染统计分析运行时长统计数据
    catCountdayData() {
      // 运行时长次数分析
      this.$u.api.equipmentApi
        .getBoxEverydayData({
          parameter: {
            instruId: this.instruId,
            state: this.state,
            dbName: this.dbName,
            beginTime: this.beginTime,
            endTime: this.endTime,
            userId: this.userId
          }
        })
        .then((res) => {
          this.ringDetail = res
          const chartData = {
            series: [
              {
                name: '运行',
                data: Number(
                  Number(Number(res.runTime || 0) / 3600).toFixed(2)
                ),
                color: '#6699FF'
              },
              {
                name: '待机',
                data: Number(
                  Number(Number(res.waitTime || 0) / 3600).toFixed(2)
                ),
                color: '#52CCA3'
              }
            ],
            totalDuration: Number(
              Number(res.runTime || 0) / 3600 + Number(res.waitTime || 0) / 3600
            ).toFixed(2)
          }
          let Ring = {
            series: []
          }
          //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
          Ring.series = chartData.series
          Ring.totalDuration = chartData.totalDuration
          this.showRing('canvasRing', Ring)
        })
    },
    // 渲染统计分析运行时长统计数据
    showRing(canvasId, chartData) {
      const _self = this
      this.canvaRing = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'ring',
        fontSize: 11,
        legend: {
          show: false
          // position: 'right',
          // float: 'center',
          // itemGap: 10,
          // padding: 5,
          // lineHeight: 26,
          // margin: 5,
          // borderWidth: 1
        },
        title: {
          name: '合计',
          color: '#666666',
          fontSize: 12 * _self.pixelRatio,
          offsetY: 1 * _self.pixelRatio
        },
        subtitle: {
          name: chartData.totalDuration + 'h',
          color: '#111737',
          fontSize: 14 * _self.pixelRatio,
          offsetY: 1 * _self.pixelRatio
        },
        padding: [15, 70, 0, 20],
        extra: {
          pie: {
            offsetAngle: -45,
            ringWidth: chartData.totalDuration
              ? 20 * _self.pixelRatio
              : 10 * _self.pixelRatio,
            labelWidth: 5
          }
        },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        disablePieStroke: true,
        dataLabel: true
      })
      //#ifdef MP-WEIXIN
        this.canvaRing.addEventListener('renderComplete', () => {
        //监控图表渲染完成
        setTimeout(function () {
          //延迟一定时间执行
          uni.canvasToTempFilePath({
            //将图表转成图片
            x: 0,
            y: 0,
            width: _self.cWidth * _self.pixelRatio,
            height: _self.cHeight * _self.pixelRatio,
            fileType: 'png',
            canvasId,
            success: function (res) {
              _self.imgRingSrc = res.tempFilePath
              _self.isWeChat = false
            },
            fail: function (res) {}
          })
        }, 200)
      })
      //#endif
    },
    // 点击统计分析运行时长统计数据
    touchRing(e) {
      if (this.canvaRing) {
          this.canvaRing.showToolTip(e, {
          format: function (item) {
            return item.name + ':' + item.data
          }
        })
      }
    },
    // 获取并渲染统计分析运行时长统计数据（模拟数据）
    catCountdayDataMock(){
      this.showRing("canvasRing", {
        series:[{
          "name": "运行",
          "data": 0,
          "color": '#6699FF'
        }, {
          "name": "待机",
          "data": 0,
          "color": '#52CCA3'
        }, {
          "name": "关机",
          "data": 0,
          "color": '#646986'
        }],
        totalDuration:0
      })
    },

    // 获取雷达图数据
    getServerData2() {
      // this.isWeChat = true
      // const searchMcDetailParams = {
      // 	instruNum: this.instruNum,
      // 	instruId: this.instruId,
      // 	dbName: this.dbName,
      // 	beginTime: this.beginTime,
      // 	endTime: this.endTime,
      // 	userId: this.userId
      // }
      // const searchMcAvgDetailParams = {
      // 	dbName: this.dbName,
      // 	beginTime: this.beginTime,
      // 	endTime: this.endTime,
      // 	userId: this.userId,
      // 	instruId: this.instruId,
      // }
      // Promise.all([this.$u.api.equipmentApi.equipRecord({
      // 	parameter: searchMcDetailParams
      // }).then(res => {
      // 	let data = res
      // 	this.instruName = data.instruName
      // 	// 维修 测量 维护
      // 	// this.mcArray = [data.maintenanceRecord, data.measurementRecord, data.maintainRecord]
      // 	this.mcArray = [data.measurementRecord, data.maintainRecord]
      // }), this.$u.api.equipmentApi.equipAverage({
      // 	parameter: searchMcAvgDetailParams
      // }).then(res => {
      // 	let data = res
      // 	// this.avgArray = [data.maintenanceAvg, data.measurementAvg, data.maintainAvg]
      // 	this.avgArray = [data.measurementAvg, data.maintainAvg]
      // })]).then(() => {
      // 	this.max = Math.max([...this.avgArray, ...this.mcArray]) + 10
      // 	const chartData = {
      // 		categories: ['计量数', '维护数'],
      // 		series: [{
      // 			name: this.instruName,
      // 			// data: this.mcArray,
      // 			data:[this.recordData.measurementRecord, this.recordData.maintainRecord]
      // 		}, {
      // 			name: '平均值',
      // 			data: this.avgArray,
      // 		}]
      // 	}
      // 	let Radar = {
      // 		categories: [],
      // 		series: []
      // 	}
      // 	Radar.categories = chartData.categories
      // 	Radar.series = chartData.series
      // 	this.showRadar("canvasRadar", Radar)
      // }).catch((error) => {
      // 	console.log(error)
      // })

      this.isWeChat = true
      const searchMcAvgDetailParams = {
        dbName: this.dbName,
        beginTime: this.beginTime,
        endTime: this.endTime,
        userId: this.userId,
        instruId: this.instruId
      }
      this.$u.api.equipmentApi
        .equipAverage({
          parameter: searchMcAvgDetailParams
        })
        .then((res) => {
          let data = res
          this.avgArray = [data.measurementAvg, data.maintainAvg]
          this.mcArray = [
            this.recordData.measurementRecord,
            this.recordData.maintainRecord
          ]
          this.max = Math.max([...this.avgArray, ...this.mcArray]) + 10
          const chartData = {
            categories: ['计量数', '维护数'],
            series: [
              {
                name: this.instruName,
                data: this.mcArray
              },
              {
                name: '平均值',
                data: this.avgArray
              }
            ]
          }
          let Radar = {
            categories: [],
            series: []
          }

          Radar.categories = chartData.categories
          Radar.series = chartData.series
          this.showRadar('canvasRadar', Radar)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 渲染雷达图
    showRadar(canvasId, chartData) {
      this.isWeChat = true
      const _self = this
      this.canvaRadar = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'column',
        fontSize: 11,
        legend: {
          show: false,
          itemGap: 10
        },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        animation: true,
        dataLabel: true,
        categories: chartData.categories,
        series: chartData.series,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        padding: [15, 45, 0, 0],
        yAxis: {
          showTitle: true,
          data: [
            {
              title: '次数',

              format: (val) => {
                return val > 1 ? val : val.toFixed(2)
              }
            }
          ]
        },
        xAxis: {
          type: 'grid',
          rotateLabel: true
        },
        extra: {
          // radar: {
          // 	max: this.max ,//雷达数值的最大值
          // },
          column: {
            type: 'group',
            width: 35,
            seriesGap: 20,
            categoryGap: 3
          }
        }
      })
      //#ifdef MP-WEIXIN
      this.canvaRadar.addEventListener('renderComplete', () => {
        //监控图表渲染完成
        setTimeout(function () {
          //延迟一定时间执行
          uni.canvasToTempFilePath({
            //将图表转成图片
            x: 0,
            y: 0,
            width: _self.cWidth * _self.pixelRatio,
            height: _self.cHeight * _self.pixelRatio,
            fileType: 'png',
            canvasId,
            success: function (res) {
              _self.imgRadarSrc = res.tempFilePath
              _self.isWeChat = false
            },
            fail: function (res) {}
          })
        }, 200)
      })
      //#endif
    },

    // ------------------------------------- 学习资料开始
    // 资料搜索
    searchData() {
      const url = '/pages/index/pages/study/pages/searchData/index'
      const instruId = `instruId=${this.instruId || ''}`
      uni.navigateTo({
        url: `${url}?${instruId}`
      })
    },
    // 获取学习资料列表
    getStudyList() {
      this.loadMoreStatus = 'loading'
      const api = this.isMock ? 'queryLearningPageByDevMock' : 'queryLearningPageByDev'
      const parameter = this.isMock ? {parameter: {type: 3}} : {startRow: 0, parameter: {isVideo: null, instruId: this.instruId}, page: this.page, pageSize: this.pageSize}
      this.$u.api.studyApi[api](parameter).then((res) => {
          const rows = res.rows || []
          if (rows && Array.isArray(rows)) {
            this.list = this.list.concat(rows)
          }
          this.hasMorePage(res.total || 0, rows.length)
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.init = true
          uni.stopPullDownRefresh()
        })
    },
    // 判断是否还有下一页
    hasMorePage(total = 0, dataSize = 0) {
      if (this.page === 1 && total <= this.pageSize) {
        this.loadMoreStatus = 'nomore'
      } else if (
        this.page > 1 &&
        (dataSize < this.pageSize || total / this.pageSize === this.page)
      ) {
        this.loadMoreStatus = 'nomore'
      } else {
        this.loadMoreStatus = 'loadmore'
      }
    },
    // 重置数据
    resetData() {
      this.init = false
      this.page = 1
      this.list = []
      this.loadMoreStatus = 'loading'
    },
    // ------------------------------------- 学习资料结束

    // 微信小程序显示提示下载app弹框
    showPop() {
      this.$refs.wechatPop.showPop()
      this.popShow = true
    },
    // 微信小程序关闭提示下载app弹框
    hidePop() {
      this.popShow = false
    },
  },
  onLoad(data) {
    this.isMock = data.isMock === 'true' || false
    this.instruNum = data.instruNum || ''
    this.equipNum = data.equipNum || ''
    this.instruId = data.instruId || ''
    this.dbName = data.dbName || ''
    this.state = data.state || null
    this.userId = data.userId || null

    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)

    // 获取过去7天的时间段（包含今天）统计分析筛选条件
    const beginTime = getDateArr(7) && getDateArr(7).reverse()[0]
    const endTime = getDateArr(1) && getDateArr(1)[0]
    this.beginTime = beginTime
    this.endTime = endTime

    let temp = beginTime.split('-')
    temp.shift()
    let temp2 = endTime.split('-')
    temp2.shift()
    this.time = temp.join('-') + '~' + temp2.join('-')
  },
  onShow() {
    console.log("仪器详情 onshow")
    this.clearRealTimer()
    //仪器详情
    this.equipInformation()
    //学习资料
    this.resetData()
    this.getStudyList()
    //统计分析运行时长统计数据（模拟数据）
    if(this.isMock)this.catCountdayDataMock()

    if(!this.isMock){
      //定时查询仪器详情
      this.clearEquipTimer()
      this.timer = setInterval(this.equipInformation, 10000)
      //获取统计数据
      this.equipRecord()
      //获取日志和报警配置、判断是否展示报警入口和开关机
      Promise.all([this.getLogAndWarnInfo(),this.getIsShowEntry()]).then((res) => {
        //有报警配置并且配置了展示报警时才显示报警入口
        this.showWarnEntry = res[0]===true && res[1]===true
      }).catch((e) => {
        console.log(e);
      });
      //判断是否展示实时监控tab
      this.getTemplateEti()
    }
  },
  onPageScroll(data) {
    // 页面滚动到一定距离显示仪器名称
    uni.setNavigationBarTitle(data.scrollTop > 50 ? this.instruData && this.instruData.instruName : '仪器信息')
  },
  onBackPress(options) {
    uni.switchTab({url: '/pages/index/index'})
    return true
  },

  onReachBottom() {
    // 滚动加载学习资料
    if(this.loadMoreStatus === 'loadmore' && this.currentTab ===this.tabs.length-1){
      this.page++
      this.getStudyList()
    }
  },
  beforeDestroy() {
    console.log('仪器详情 beforeDestroy')
    this.clearRealTimer()
    this.clearEquipTimer()
    this.clearOutTimer()
  },
  onHide(){
    console.log('仪器详情 onHide')
    this.clearRealTimer()
    this.clearEquipTimer()
    this.clearOutTimer()
  }
}
</script>
<style lang="scss" scoped>
.tip {
  padding: 20rpx 24rpx;
  background-color: #f5ffff;
  font-size: 28rpx;
  color: #111111;
  display: flex;
  z-index: 9;
  align-items: flex-start;

  .text {
    margin: 0 10rpx;
    line-height: 40rpx;
    flex: 1;
  }
}

.item-btn {
  margin-right: 22rpx;

  .iconfont {
    color: #ffffff;
    font-size: 40rpx;
  }
}

.icon-text {
  margin-right: 23rpx;
  color: #fff;
  font-size: 30rpx;
}

.footer-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  overflow-x: hidden;
  // background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 1));
  background: #fff;
  z-index: 10;
  border-top: 2rpx solid rgba(0, 0, 0, 0.1);

  .btn-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88rpx;
      height: 88rpx;
      background-color: #ffffff;
      border-radius: 50%;
      box-shadow: 0 6rpx 20rpx 0 rgba(115, 120, 130, 0.18);
      margin-bottom: 17rpx;

      .iconfont {
        font-size: 46rpx;
        color: #111737;
      }

      &.code {
        background-color: #2c72f9;
        box-shadow: 0 6rpx 20rpx 0 rgba(56, 61, 71, 0.36);

        .iconfont {
          color: #ffffff;
        }
      }
    }

    .label {
      font-size: 24rpx;
      color: #111737;
    }
  }
}

.charts {
  position: relative;
  bottom: 140rpx;
  top: -240rpx;
  // padding: 0 0 50rpx;

  /deep/ .u-sticky {
    left: 0;
    width: 100%;
  }

  .charts-box {
    background-color: #ffffff;
    border-radius: 24rpx;
    padding: 24rpx 30rpx;
    margin: 0 18rpx 18rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 27rpx;
    }

    .sub-title {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 63rpx;
      background-color: #e5eeff;
      border-radius: 8px;
      margin-bottom: 27rpx;

      .txt {
        font-size: 28rpx;
        color: #111737;
        flex: 1;
        text-align: center;
      }

      .pk {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 95rpx;
        height: 100%;
        background-image: url('@/static/images/common/bg123.png');
        background-size: cover;
        font-size: 40rpx;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
  .Long_rangeControl {
    margin: 30rpx 0;
    .control_tltlie {
      color: #1e1e1e;
      font-size: 30rpx;
      font-weight: 700;
      margin-bottom: 20rpx;
    }
    .control_content {
      background-color: #f6f7fc;
      border-radius: 24rpx;
      padding: 24rpx 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .iClsState {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .state {
        color: #1e1e1e;
        font-size: 30rpx;
        font-weight: 700;
        margin-left: 10px;
      }
    }
  }
  .study {
    margin: 0 18rpx;
    border-radius: 25rpx;
    margin-bottom: 18rpx;
  }

  .charts-content {
    .canvas-img {
      img {
        width: 100%;
        height: 213px;
      }
    }

    .charts1,
    .charts2,
    .charts3,
    .charts4 {
      width: 100%;
      height: 500rpx;
      background-color: #ffffff;
    }

    .charts-right {
      font-size: 24rpx;
      display: flex;
      justify-content: center;

      .run,
      .wait,
      .shutdown {
        margin: 32rpx 32rpx 0;
        position: relative;
        padding-left: 25rpx;

        &::before {
          position: absolute;
          width: 18rpx;
          height: 18rpx;
          left: 0;
          top: 4rpx;
          border-radius: 50%;
          content: '';
        }
      }

      .run {
        &::before {
          background: #6699ff;
        }
      }

      .wait {
        &::before {
          background: #52cca3;
        }
      }

      .shutdown {
        &::before {
          background: #646986;
        }
      }
    }

    .legend {
      margin-top: 22rpx;

      /deep/ .u-col {
        text-align: center !important;
        line-height: 50rpx;
      }

      color: #111737;
      font-size: 24rpx;

      .dot {
        display: inline-block;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }

      .red {
        background: #ff6d66;
      }

      .blue {
        background: #6693ff;
      }

      .purple {
        background: #6878c1;
      }

      .green {
        background: #52cca3;
      }

      .normal {
        margin-left: 10rpx;
        margin-right: 6rpx;
      }

      .avg {
        color: #111737;
        opacity: 0.5;
      }
    }
  }
}

.control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  padding: 0 18rpx;

  .select-time {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #ffffff;

    .iconfont {
      font-size: 34rpx;
      margin-right: 4rpx;
    }
  }
}

.envinfo-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 58rpx;

  .item {
    width: 209rpx;
    height: 140rpx;
    padding: 17rpx;
    background: linear-gradient(180deg, #ffffff 0%, #f7fffd 100%);
    border-radius: 16rpx;
    border: 2rpx solid #e3e5eb;
    margin-bottom: 20rpx;
    text-align: center;

    &.warn {
      background: linear-gradient(
        180deg,
        #ffffff 0%,
        #fffafa 46%,
        #ffdbdb 100%
      );
      border: 2rpx solid #f54242;
    }

    .con {
      display: flex;
      justify-content: space-between;
      margin-bottom: 35rpx;
      font-size: 26rpx;
      font-weight: bold;
      color: #111737;

      .iconfont {
        font-size: 30rpx;
      }
    }
  }

  &::after {
    content: '';
    width: 209rpx;
  }
}

.tab-fixed {
  background: rgb(57, 120, 247);
}
  .btnStyle{
    margin: 0;
  }
</style>
