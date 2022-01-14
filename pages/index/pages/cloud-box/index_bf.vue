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
    ></details-info>
    <view class="charts">
      <!-- #ifndef MP-WEIXIN -->
      <!--非微信端样式-->
      <u-sticky @fixed="handleFixed" @unfixed="handleUnFixed">
        <view :class="['control',isFixed ? 'tab-fixed':'']">
          <TabBox
            v-if="cboxType==='APL'"
            :list="tabs"
            :current="currentTab"
            @handleChangeType="tabsChange"
          ></TabBox>
          <TabBox v-else :list="tabs" :current="currentTab" @handleChangeType="tabsChange_common"></TabBox>
          <view v-show="currentTab === 0" class="select-time" @click="pickerTimeShow = true">
            <text class="iconfont">&#xe665;</text>
            <text style="margin-right: 6rpx">选择时间</text>
            <u-icon name="arrow-right" color="#ffffff"></u-icon>
          </view>
          <view v-show="tabs.length === 3 && currentTab===2||(tabs.length === 2 && currentTab===1)">
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
        <TabBox
          v-if="cboxType==='APL'"
          :list="tabs"
          :current="currentTab"
          @handleChangeType="tabsChange"
        ></TabBox>
        <TabBox v-else :list="tabs" :current="currentTab" @handleChangeType="tabsChange_common"></TabBox>
        <view class="select-time" @click="pickerTimeShow = true">
          <text class="iconfont">&#xe665;</text>
          <text style="margin-right: 6rpx">选择时间</text>
          <u-icon name="arrow-right" color="#ffffff"></u-icon>
        </view>
      </view>
      <!-- #endif -->
      <view class="charts-box" v-if="cboxType==='APL' && currentTab === 0 && realData">
        <view v-if="!isMock" class="envinfo-box">
          <view class="item" v-if="realData.doorState">
            <view class="con">
              门状态
              <text class="iconfont">&#xe6d2;</text>
            </view>
            {{showApl ? realData.doorState : '--'}}
          </view>
          <view class="item" v-if="realData.turnState">
            <view class="con">
              转盘状态
              <text class="iconfont">&#xe6d5;</text>
            </view>
            {{showApl ? realData.turnState : '--'}}
          </view>
          <view class="item" v-if="realData.stage">
            <view class="con">
              消解阶段
              <text class="iconfont">&#xe6d3;</text>
            </view>
            {{showApl ? realData.stage : '--'}}
          </view>
          <view class="item" v-if="realData.heat">
            <view class="con">
              实时温度
              <text class="iconfont">&#xe6d4;</text>
            </view>
            {{showApl ? realData.heat : '--'}}℃
          </view>
          <view class="item" v-if="realData.pressure || realData.pressure===0">
            <view class="con">
              实时压力
              <text class="iconfont">&#xe6d6;</text>
            </view>
            {{showApl ? realData.pressure : '--'}}MPA
          </view>
          <view class="item" v-if="realData.pressure || realData.pressure===0">
            <view class="con">
              软件版本
              <text class="iconfont">&#xe6d2;</text>
            </view>
            {{showApl ? realData.version : '--'}}
          </view>
        </view>
        <view class="Long_rangeControl">
          <view class="control_tltlie">远程控制</view>
          <view class="control_content">
            <view class="iClsState">
              <u-image
                width="80rpx"
                height="80rpx"
                shape="circle"
                src="https://iotapp.prod.ilabeco.com/download/iot/common/avatar.jpg"
                style="margin: 0 auto;"
              ></u-image>
              <span class="state">设备状态</span>
            </view>
            <u-switch v-model="checked" active-color="#19be6b" inactive-color="#eee"></u-switch>
          </view>
        </view>
      </view>
      <template
        v-else-if="cboxType==='APL' && currentTab===1||(cboxType!=='APL' && currentTab===0)"
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

        <!-- <view class="charts-box">
          <view class="title">
            <text>数据对比</text>
          </view>
          <view class="sub-title">
            <text class="txt">{{instruName}}</text>
            <view class="pk">
              <text>PK</text>
            </view>
            <text class="txt">仪器平均值</text>
          </view>
          <view class="charts-content">
            <canvas
              v-show="!popShow && isWeChat"
              canvas-id="canvasRadar"
              id="canvasRadar"
              class="charts3"
        ></canvas>-->
        <!-- #ifdef MP-WEIXIN -->
        <!--  <view class="canvas-img">
              <img :src="imgRadarSrc" alt />
        </view>-->
        <!-- #endif -->
        <!-- <view class="legend">
              <u-row>
                <u-col span="6">
                  <span class="dot" style="background: #1890ff"></span>
                  <span style="color: #1890ff">{{recordData && recordData.instruName}}</span>
                </u-col>
                <u-col span="6">
                  <span class="dot" style="background:#2fc25b"></span>
                  <span style="color:#2fc25b">仪器平均值</span>
                </u-col>
              </u-row>
            </view>
          </view>
        </view>-->
      </template>

      <view
        class="study"
        v-else-if="tabs.length === 3 && currentTab===2||(tabs.length === 2 && currentTab===1)"
      >
        <Study :list="list" :loadMoreStatus="loadMoreStatus" />
      </view>
    </view>

    <view class="footer-btn">
      <view v-if="instruData && instruData.jurisdiction===1" class="btn-item" @click="openOrClose">
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
import uCharts from '@/components/u-charts/u-charts.js'
import Study from '@/pages/index/componts/Study'
import { getDateArr } from '@/utils/index'
import WechatPop from '@/components/WechatPop'
var _self
var canvaRing = null
var canvaRadar = null
export default {
  components: {
    TabBox,
    DetailsInfo,
    WechatPop,
    Study
  },
  data() {
    return {
      cboxType: null,
      isMock: false,
      title: '仪器信息',
      instruNum: '',
      equipNum: '',
      instruId: '',
      dbName: '',
      state: null,
      userId: null,
      recordData: null,
      instruData: null,
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
      // instruLifeCycle:{}   ,// 仪器的生命周期
      // ------------------- 学习资料
      list: [],
      page: 1,
      pageSize: 20,
      loadMoreStatus: 'loading',
      checked: ''
    }
  },
  computed: {
    tabs() {
      if (this.cboxType === 'APL') {
        return [
          { name: '实时监控' },
          { name: '统计分析' },
          { name: '学习资料' }
        ]
      }
      return [{ name: '统计分析' }, { name: '学习资料' }]
    },
    showApl() {
      //离线或关机奥普乐接口若有数据返回时数据展示为‘--’
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
    // 右上角的反馈记录按钮,跳转到反馈记录页面
    onNavigationBarButtonTap(e) {
      uni.navigateTo({
        url: `/pages/index/pages/problemFeedback/index?instruId=${this.instruId}&instruName=${this.instruName}`
      })
    },
    // 获取实时监控数据
    getRealData() {
      this.$u.api.equipmentApi
        .getIntellerBoxNowStatusInfo({
          parameter: {
            boxEquipAddress: this.instruNum //'1E002F000351373133383038'//this.instruNum
          }
        })
        .then((res) => {
          this.realData = res
        })
    },
    // 处理吸顶（固定状态）
    handleFixed(index) {
      this.isFixed = true
    },
    // 处理吸顶（非固定状态）
    handleUnFixed(index) {
      this.isFixed = false
    },
    //切换tab 普通云盒子
    tabsChange_common(index) {
      //#ifdef MP-WEIXIN
      if (index === 1) {
        this.showPop()
      }
      //#endif
      //#ifndef MP-WEIXIN
      this.currentTab = index
      //#endif
    },
    // 切换tab 奥普乐
    tabsChange(index) {
      // 微信小程序不展示分析和学习，app展示所有
      //#ifdef MP-WEIXIN
      if (index === 1 || index === 2) {
        this.showPop()
      }
      //#endif
      //#ifndef MP-WEIXIN
      if (index === 0) {
        if (!this.isMock) {
          if (this.timeout) this.handleClearInterval()
          this.getRealData()
          this.timeout = setInterval(this.getRealData, 5000)
        }
      } else if (index === 1) {
        this.catCountdayData()
        this.getServerData2()
        if (this.timeout) this.handleClearInterval()
      }
      this.currentTab = index
      //#endif
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
      this.getServerData2()
    },
    // 获取仪器详情数据
    equipInformation() {
      if (!this.instruNum) {
        return
      }

      const api = this.isMock ? 'equipInfomationMock' : 'equipInformation'
      const parameter = this.isMock
        ? {
            instruType: 1
          }
        : {
            instruNum: this.instruNum,
            type: 1
          }
      this.$u.api.equipmentApi[api]({
        parameter: parameter
      }).then((res) => {
        this.instruData = res ? res : {}
        this.instruName = res ? res.instruName : ''
      })
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
    // 微信小程序显示提示下载app弹框
    showPop() {
      this.$refs.wechatPop.showPop()
      this.popShow = true
    },
    // 微信小程序关闭提示下载app弹框
    hidePop() {
      this.popShow = false
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
          setTimeout(this.equipInformation, 10000)
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
    // 获取统计分析运行时长统计数据
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
      canvaRing = new uCharts({
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
      canvaRing.addEventListener('renderComplete', () => {
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
      if (canvaRing) {
        canvaRing.showToolTip(e, {
          format: function (item) {
            return item.name + ':' + item.data
          }
        })
      }
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

      canvaRadar = new uCharts({
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
      canvaRadar.addEventListener('renderComplete', () => {
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
    toStudy() {
      const url = '/pages/index/pages/study/index'
      uni.navigateTo({
        url: `${url}?instruId=${this.instruData.instruId}&isMock=${this.isMock}`
      })
    },
    handleClearInterval() {
      clearInterval(this.timeout)
      this.timeout = null
    },
    // 初始化加载数据 普通云盒子
    initData_common() {
      if (!this.isMock) {
        this.catCountdayData()
        this.getServerData2()
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
        this.showRadar('canvasRadar', {
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
        })
      }
    },
    // 初始化加载数据 奥普乐
    initData() {
      if (!this.isMock) {
        if (this.timeout) {
          this.handleClearInterval()
        }
        this.getRealData()
        this.timeout = setInterval(this.getRealData, 5000)
      }
    },
    // ------------------------------------- 学习资料
    // 资料搜索
    searchData() {
      const url = '/pages/index/pages/study/pages/searchData/index'
      const instruId = `instruId=${this.instruId || ''}`
      uni.navigateTo({
        url: `${url}?${instruId}`
      })
    },
    // 获取学习资料列表
    getStudyList(isReset) {
      this.loadMoreStatus = 'loading'

      const api = this.isMock
        ? 'queryLearningPageByDevMock'
        : 'queryLearningPageByDev'
      const parameter = this.isMock
        ? {
            parameter: {
              type: 3
            }
          }
        : {
            startRow: 0,
            parameter: {
              isVideo: null,
              instruId: this.instruId
            },
            page: this.page,
            pageSize: this.pageSize
          }
      this.$u.api.studyApi[api](parameter)
        .then((res) => {
          const rows = res.rows || []
          if (rows && Array.isArray(rows) && !isReset) {
            this.list = this.list.concat(rows)
          } else if (rows && Array.isArray(rows) && isReset) {
            this.list = rows
          }
          this.hasMorePage(res.total || 0, rows.length)
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          // this.init = true
          uni.stopPullDownRefresh()
          // this.loadMoreStatus = 'nomore'
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
    }
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
    this.getStudyList(true)
    if (!this.isMock) {
      this.timer = setInterval(this.equipInformation, 10000)
    }
  },
  onShow() {
    this.equipInformation()
    if (!this.isMock) this.equipRecord()

    // 判断是否时奥普乐初始化数据
    Promise.all([this.$u.api.equipmentApi.queryType({parameter: {boxEquipAddress: this.instruNum}}).then((res) => {this.cboxType = res})]).then(() => {
        if (this.cboxType === 'APL') {
          this.initData()
        } else {
          this.initData_common()
        }
      }).catch((error) => {console.log(error)})
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
  onUnload() {
    if (this.timeout) this.handleClearInterval()
    if(this.timer){
      clearInterval(this.timer)
      this.timer = null
    }
  },
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
</style>
