<template>
  <view class="instrument">
    <view class="tip" v-if="isMock">
      <u-icon name="info-circle-fill" size="40" color="#2C72F9"></u-icon>
      <view class="text">此页为示例数据</view>
    </view>
    <DetailsInfo
      :recordData="recordData"
      :instruData="instruData"
      :userId="userId"
      :instruType="'2'"
      :outvoltage="Number(outvoltage)"
      :outcurrent="Number(outcurrent)"
    ></DetailsInfo>
    <view class="charts">
      <!-- #ifndef MP-WEIXIN -->
      <u-sticky @fixed="handleFixed" @unfixed="handleUnFixed" :enable="enable">
        <view :class="['control',isFixed ? 'tab-fixed':'']">
          <view style="width: 480rpx;">
            <TabBox :list="tabs" :current="currentTab" @handleChangeType="tabsChange"></TabBox>
          </view>
          <view v-show="currentTab === 1" class="select-time" @click="pickerTimeShow = true">
            <text class="iconfont">&#xe665;</text>
            <text style="margin-right: 6rpx">选择时间</text>
            <u-icon name="arrow-right" color="#ffffff"></u-icon>
          </view>
          <view v-show="currentTab===2">
            <view class="item-btn" @click="searchData">
              <text class="iconfont">&#xe644;</text>
            </view>
          </view>
        </view>
      </u-sticky>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <view class="control">
        <view style="width: 400rpx;">
          <TabBox :list="tabs" :current="currentTab" @handleChangeType="tabsChange"></TabBox>
        </view>
        <view v-show="currentTab === 1" class="select-time" @click="pickerTimeShow = true">
          <text class="iconfont">&#xe665;</text>
          <text style="margin-right: 6rpx">{{time}}</text>
          <u-icon name="arrow-right" color="#ffffff"></u-icon>
        </view>
      </view>
      <!-- #endif -->
      <view class="charts-box" v-if="currentTab === 0" style="margin-bottom: 770rpx">
        <view class="title">
          <text>实时电流电压</text>
        </view>
        <view class="charts-content">
          <canvas
            v-show="!popShow && isWeChat"
            canvas-id="canvasLineA"
            id="canvasLineA"
            class="charts1"
            @touchstart="touchLineA"
          ></canvas>
          <!--					<canvas v-if="!popShow && isWeChat" canvas-id="canvasLineA" id="canvasLineA" class="charts1" @touchstart="touchLineA"></canvas>-->
          <!--  #ifdef MP-WEIXIN  -->
          <view class="canvas-img">
            <img :src="imgSrc" alt />
          </view>
          <!--  #endif  -->
        </view>
      </view>
      <template v-else-if="currentTab === 1">
        <view class="charts-box">
          <view class="title">
            <text>运行时长次数分析</text>
          </view>
          <view class="charts-content">
            <view>
              <canvas
                v-show="!popShow"
                canvas-id="canvasRing"
                id="canvasRing"
                class="charts2"
                @touchstart="touchRing"
              ></canvas>
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
            <canvas v-show="!popShow" canvas-id="canvasRadar" id="canvasRadar" class="charts3"></canvas>
            <view class="legend">
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
        </view> -->
				
        <view class="charts-box">
          <view class="title">
            <text>能耗</text>
          </view>
          <view class="charts-content" v-show="!popShow">
            <canvas
              canvas-id="canvasLineB"
              id="canvasLineB"
              class="charts4"
              disable-scroll="true"
              @touchstart="touchLineB"
              @touchmove="moveLineB"
              @touchend="touchEndLineB"
            ></canvas>
          </view>
        </view>
      </template>
      <view class="study" v-else-if="currentTab===2">
        <Study :list="list" :loadMoreStatus="loadMoreStatus" />
      </view>
    </view>
    <view class="footer-btn">
      <view v-if="instruData&&instruData.jurisdiction===1" class="btn-item" @click="openOrClose">
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
        v-if="instruData&&instruData.jurisdiction!==3&&!instruData.boo"
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
var canvaLineA = null
var canvaLineB = null
var canvaRing = null
var canvaRadar = null
export default {
  components: {
    TabBox,
    DetailsInfo,
    WechatPop,
    Study,
  },
  data() {
    return {
      // 吸顶组件
      enable: true,
      isMock: false,
      title: '仪器信息',
      instruNum: '',
      instruId: '',
      dbName: '',
      state: null,
      userId: null,
      recordData: null,
      instruData: null,
      openOrCloseList: [
        {
          color: '#4885FF',
          text: '关机',
          disabled: true,
        },
        {
          color: '#4885FF',
          text: '开机',
          disabled: true,
        },
      ],
      openOrCloseShow: false,
      isLock: false,
      tabs: [
        {
          name: '实时监控',
        },
        {
          name: '统计分析',
        },
        {
          name: '学习资料',
        },
      ],
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
        second: false,
      },
      timeout: null,
      timer: null,
      outVoltage: [],
      outCurrent: [],
      msgTime: [],
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
      outvoltage: 0, // 电压
      outcurrent: 0, // 电流
      popShow: false,
      isWeChat: true,
      imgSrc: '',
      // ------------------- 学习资料
      list: [],
      page: 1,
      pageSize: 20,
      loadMoreStatus: 'loading',
    }
  },
  computed: {
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
    },
  },
  methods: {
    // 右上角的反馈记录按钮
    onNavigationBarButtonTap(e) {
      uni.navigateTo({
        url: `/pages/index/pages/problemFeedback/index?instruId=${this.instruId}&instruName=${this.instruName}`,
      })
    },

    handleFixed(index) {
      this.isFixed = true
    },
    handleUnFixed(index) {
      this.isFixed = false
    },
    tabsChange(index) {
      //#ifdef MP-WEIXIN
      if (index === 1 || index === 2) {
        this.showPop()
      }
      //#endif
      //#ifndef MP-WEIXIN
      if (index === 2) {
        // this.toStudy()
        // index = this.currentTab
      }
      this.currentTab = index
      if (index === 0) {
        // if (Number(this.state) !== 5) { // 不是离线状态才请求电流电压接口
        if (!this.isMock) {
          this.queryRealTime()
          this.timeout = setInterval(this.getRealTimeToRedis, 10000)
        } else {
          this.getMockData(0)
        }

        // }
      } else if (index === 1) {
        if (!this.isMock) {
          this.catCountdayData()
          this.getServerData2()
          this.getUseKWH()
          this.handleClearInterval()
        } else {
          this.getMockData(1)
        }
      }
      //#endif
    },
    pickerTimeConfirm(time) {
      let temp = time.startDate.split('-')
      temp.shift()
      let temp2 = time.endDate.split('-')
      temp2.shift()
      this.time = temp.join('-') + '~' + temp2.join('-')

      this.beginTime = time.startDate
      this.endTime = time.endDate
      this.catCountdayData()
      this.getServerData2()
    },
    equipInformation() {
      if (!this.instruNum) {
        return
      }

      const api = this.isMock ? 'equipInfomationMock' : 'equipInformation'
      const parameter = this.isMock
        ? {
            instruType: 2,
          }
        : {
            instruNum: this.instruNum,
            type: 2,
          }

      this.$u.api.equipmentApi[api]({
        parameter: parameter,
      }).then((res) => {
        this.instruData = res || null
        this.instruName = res.instruName
      })
    },
    equipRecord() {
      if (!this.instruNum || !this.instruId) {
        return
      }

      const par = {
        instruNum: this.instruNum,
        instruId: this.instruId,
        dbName: this.dbName,
      }

      if (this.dbName) {
        par.dbName = this.dbName
      }

      this.$u.api.equipmentApi
        .equipRecord({
          parameter: par,
        })
        .then((res) => {
          this.recordData = res || null
        })
    },
    showPop() {
      this.$refs.wechatPop.showPop()
      this.popShow = true
    },
    hidePop() {
      this.popShow = false
      console.log(this.popShow)
    },
    openOrClose() {
      // 开关机
      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif
      //#ifndef MP-WEIXIN
      if (this.isLock || !this.instruId) {
        return
      }

      this.isLock = true

      this.$u.api.equipmentApi
        .getInitialState_cat({
          parameter: {
            instruId: this.instruId,
            instruNum: this.instruNum,
          },
        })
        .then((res) => {
          if (res) {
            if (res.data.onlineStatus === 1) {
              if (res.data.powerStatus === 'ON') {
                this.openOrCloseList[0].disabled = false
                this.openOrCloseList[1].disabled = true
              } else {
                this.openOrCloseList[0].disabled = true
                this.openOrCloseList[1].disabled = false
              }
            } else if (res.data.onlineStatus === 0) {
              uni.showToast({
                title: '该设备已离线',
                icon: 'none',
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
        .operation_cat({
          parameter: {
            instruId: this.instruId,
            status: 1,
            flag: index === 0 ? false : index === 1 ? true : '',
          },
        })
        .then(() => {
          uni.showToast({
            title: '操作成功',
          })
          setTimeout(this.equipInformation, 10000)
          setTimeout(this.equipInformation, 20000)
        })
        .finally(() => {
          this.isLock = false
        })
    },
    toDeviceLog() {
      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif
      //#ifndef MP-WEIXIN
      uni.navigateTo({
        url:
          '/pages/index/pages/device-log/index?instruId=' +
          this.instruId +
          '&dbName=' +
          this.dbName +
          '&instruType=2',
      })
      //#endif
    },
    toShare() {
      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif
      //#ifndef MP-WEIXIN
      uni.navigateTo({
        url:
          '/pages/index/pages/share-page/index?permissionIds=' +
          (this.instruData ? this.instruData.equipId || '' : ''),
      })
      //#endif
    },
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
        url: `/pages/index/pages/device-member/index${instruId}${jurisdiction}${dbName}`,
      })
      //#endif
    },
    toInfo() {
      //#ifdef MP-WEIXIN
      this.showPop()
      //#endif
      //#ifndef MP-WEIXIN
      const jurisdiction = `&jurisdiction=${
        (this.instruData && this.instruData.jurisdiction) || ''
      }`
      uni.navigateTo({
        url: `/pages/index/pages/instrument-cat/info-page?instruNum=${this.instruNum}&instruId=${this.instruId}&dbName=${this.dbName}${jurisdiction}&isMock=${this.isMock}`,
      })
      //#endif
    },
    queryRealTime() {
      this.$u.api.equipmentApi
        .queryRealTime({
          parameter: {
            instruId: this.instruId,
            instruNum: this.instruNum,
            dbName: this.dbName,
          },
        })
        .then((res) => {
          if (!(JSON.stringify(res) === '{}')) {
            this.outCurrent = res.currentlist.reverse()
            this.outVoltage = res.voltagelist.reverse()
            this.msgTime = res.createTimelist
              .map((item) => this.format(Number(item)))
              .reverse()
            const chartData = {
              categories: this.msgTime,
              series: [
                {
                  name: '电流',
                  data: this.outCurrent,
                  color: '#74D6B5',
                },
                {
                  name: '电压',
                  data: this.outVoltage,
                  color: '#7BA5FB',
                },
              ],
            }
            let LineA = {
              categories: [],
              series: [],
            }
            //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
            LineA.categories = chartData.categories
            LineA.series = chartData.series
            this.showLineA('canvasLineA', LineA)

            if (
              res.currentlist &&
              Array.isArray(res.currentlist) &&
              res.currentlist.length > 0
            ) {
              this.outcurrent = res.currentlist[res.currentlist.length - 1]
            }

            if (
              res.voltagelist &&
              Array.isArray(res.voltagelist) &&
              res.voltagelist.length > 0
            ) {
              this.outvoltage = res.voltagelist[res.voltagelist.length - 1]
            }
          } else {
            const chartData = {
              categories: [],
              series: [
                {
                  name: '电流',
                  data: [],
                  color: '#74D6B5',
                },
                {
                  name: '电压',
                  data: [],
                  color: '#7BA5FB',
                },
              ],
            }
            let LineA = {
              categories: [],
              series: [],
            }
            //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
            LineA.categories = chartData.categories
            LineA.series = chartData.series
            this.showLineA('canvasLineA', LineA)
          }
        })
    },
    add0(m) {
      return m < 10 ? '0' + m : m
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
    },
    getRealTimeToRedis() {
      this.$u.api.equipmentApi
        .getRealTimeToRedis({
          parameter: {
            instruId: this.instruId,
            instruNum: this.instruNum,
            dbName: this.dbName,
          },
        })
        .then((res) => {
          const data = res.data || {}
          if (!(JSON.stringify(data) === '{}')) {
            this.outCurrent.push(data.outCurrent || 0)
            this.outVoltage.push(data.outVoltage || 0)
            this.outvoltage = data.outVoltage
            this.outcurrent = data.outCurrent
            this.msgTime.push(this.format(Number(data.msgTime)))
            if (this.outVoltage.length > 10) {
              this.outCurrent.shift()
              this.outVoltage.shift()
              this.msgTime.shift()
            }
            const chartData = {
              categories: this.msgTime,
              series: [
                {
                  name: '电流',
                  data: this.outCurrent,
                  color: '#74D6B5',
                },
                {
                  name: '电压',
                  data: this.outVoltage,
                  color: '#7BA5FB',
                },
              ],
            }
            let LineA = {
              categories: [],
              series: [],
            }
            //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
            LineA.categories = chartData.categories
            LineA.series = chartData.series
            this.showLineA('canvasLineA', LineA)
          }
        })
    },
    showLineA(canvasId, chartData) {
      canvaLineA = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'line',
        fontSize: 11,
        legend: {
          show: true,
        },
        dataLabel: false,
        dataPointShape: true,
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        padding: [15, 50, 0, 10],
        xAxis: {
          type: 'grid',
          rotateLabel: true,
        },
        yAxis: {
          showTitle: true,
          data: [
            {
              title: '电压（V）',
              position: 'left',
            },
            {
              title: '电流（A）',
              position: 'right',
            },
          ],
        },
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          line: {
            type: 'curve',
          },
        },
      })
      //#ifdef MP-WEIXIN
      canvaLineA.addEventListener('renderComplete', () => {
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
              _self.imgSrc = res.tempFilePath
              _self.isWeChat = false
            },
            fail: function (res) {},
          })
        }, 200)
      })
      //#endif
    },
    touchLineA(e) {
      canvaLineA.showToolTip(e, {
        format: function (item, category) {
          return category + ' ' + item.name + ':' + item.data
        },
      })
    },
    catCountdayData() {
      // 运行时长次数分析
      this.$u.api.equipmentApi
        .catCountdayData({
          parameter: {
            instruId: this.instruId,
            state: this.state,
            dbName: this.dbName,
            beginTime: this.beginTime,
            endTime: this.endTime,
            userId: this.userId,
          },
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
                color: '#6699FF',
              },
              {
                name: '待机',
                data: Number(
                  Number(Number(res.waitTime || 0) / 3600).toFixed(2)
                ),
                color: '#52CCA3',
              },
            ],
            totalDuration: Number(
              Number(res.runTime || 0) / 3600 + Number(res.waitTime || 0) / 3600
            ).toFixed(2),
          }
          let Ring = {
            series: [],
          }
          //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
          Ring.series = chartData.series
          Ring.totalDuration = chartData.totalDuration
          this.showRing('canvasRing', Ring)
        })
    },
    showRing(canvasId, chartData) {
      canvaRing = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'ring',
        fontSize: 11,
        legend: {
          show: false,
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
          offsetY: 1 * _self.pixelRatio,
        },
        subtitle: {
          name: chartData.totalDuration + 'h',
          color: '#111737',
          fontSize: 14 * _self.pixelRatio,
          offsetY: 1 * _self.pixelRatio,
        },
        padding: [15, 70, 0, 20],
        extra: {
          pie: {
            offsetAngle: -45,
            ringWidth: chartData.totalDuration
              ? 20 * _self.pixelRatio
              : 10 * _self.pixelRatio,
            labelWidth: 5,
          },
        },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        disablePieStroke: true,
        dataLabel: true,
      })
    },
    touchRing(e) {
      if (canvaRing) {
        canvaRing.showToolTip(e, {
          format: function (item) {
            return item.name + ':' + item.data
          },
        })
      }
    },
    getServerData2() {
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
      // 	instruId: this.instruId
      // }
      // Promise.all([this.$u.api.equipmentApi.equipRecord({
      // 	parameter: searchMcDetailParams
      // }).then(res => {
      // 	let data = res
      // 	this.instruName = data.instruName
      // 	this.mcArray = [data.maintenanceRecord, data.measurementRecord, data.maintainRecord]
      // }), this.$u.api.equipmentApi.equipAverage({
      // 	parameter: searchMcAvgDetailParams
      // }).then(res => {
      // 	let data = res
      // 	this.avgArray = [data.maintenanceAvg, data.measurementAvg, data.maintainAvg]
      // })]).then(() => {
      // 	this.max = Math.max([...this.avgArray, ...this.mcArray]) + 10
      // 	const chartData = {
      // 		categories: ['计量数', '维护数'],
      // 		series: [{
      // 			name: this.instruName,
      // 			data: this.mcArray,
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

      const searchMcAvgDetailParams = {
        dbName: this.dbName,
        beginTime: this.beginTime,
        endTime: this.endTime,
        userId: this.userId,
        instruId: this.instruId,
      }
      this.$u.api.equipmentApi
        .equipAverage({
          parameter: searchMcAvgDetailParams,
        })
        .then((res) => {
          let data = res
          this.avgArray = [data.measurementAvg, data.maintainAvg]
          this.mcArray = [
            this.recordData.measurementRecord,
            this.recordData.maintainRecord,
          ]
          this.max = Math.max([...this.avgArray, ...this.mcArray]) + 10
          const chartData = {
            categories: ['计量数', '维护数'],
            series: [
              {
                name: this.instruName,
                data: this.mcArray,
              },
              {
                name: '平均值',
                data: this.avgArray,
              },
            ],
          }
          let Radar = {
            categories: [],
            series: [],
          }
          Radar.categories = chartData.categories
          Radar.series = chartData.series
          this.showRadar('canvasRadar', Radar)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    showRadar(canvasId, chartData) {
      canvaRadar = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'column',
        fontSize: 11,
        legend: {
          show: false,
          itemGap: 10,
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
              },
            },
          ],
        },
        xAxis: {
          type: 'grid',
          rotateLabel: true,
        },
        extra: {
          // radar: {
          // 	max: that.max //雷达数值的最大值
          // },
          column: {
            type: 'group',
            width: 35,
            seriesGap: 20,
            categoryGap: 3,
          },
        },
      })
    },
    getUseKWH() {
      this.$u.api.equipmentApi
        .getUseKWH({
          parameter: {
            instruId: this.instruId,
            dbName: this.dbName,
          },
        })
        .then((res) => {
          if (res && JSON.stringify(res) !== '{}') {
            const chartData = {
              categories: res.dayList || [],
              series: [
                {
                  name: '能耗',
                  data: res.electricPowerList || [],
                  color: '#74D6B5',
                },
              ],
            }
            let LineB = {
              categories: [],
              series: [],
            }
            //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
            LineB.categories = chartData.categories
            LineB.series = chartData.series
            this.showLineB('canvasLineB', LineB)
          } else {
            const chartData = {
              categories: [],
              series: [
                {
                  name: '能耗',
                  data: [],
                  color: '#74D6B5',
                },
              ],
            }
            let LineB = {
              categories: [],
              series: [],
            }
            //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
            LineB.categories = chartData.categories
            LineB.series = chartData.series
            this.showLineB('canvasLineB', LineB)
          }
        })
    },
    showLineB(canvasId, chartData) {
      canvaLineB = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'line',
        fontSize: 11,
        legend: {
          show: false,
        },
        dataLabel: false,
        dataPointShape: true,
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        padding: [15, 50, 10, 10],
        enableScroll: true,
        xAxis: {
          type: 'grid',
          rotateLabel: true,
          gridType: 'dash',
          itemCount: 5, //x轴单屏显示数据的数量，默认为5个
          scrollShow: true, //新增是否显示滚动条，默认false
          scrollAlign: 'left', //滚动条初始位置
          scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
          scrollColor: '#DEE7F7', //默认为 #A6A6A6
        },
        yAxis: {
          showTitle: true,
          data: [
            {
              title: 'kW·h',
              position: 'left',
              format: (val) => {
                return val.toFixed(3)
              },
            },
          ],
        },
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          line: {
            type: 'curve',
          },
        },
      })
    },
    touchLineB(e) {
      canvaLineB.scrollStart(e)
    },
    moveLineB(e) {
      canvaLineB.scroll(e)
    },
    touchEndLineB(e) {
      canvaLineB.scrollEnd(e)
      //下面是toolTip事件，如果滚动后不需要显示，可不填写
      canvaLineB.showToolTip(e, {
        format: function (item, category) {
          return category + ' ' + item.name + ':' + item.data
        },
      })
    },
    // 清除计时器
    handleClearInterval() {
      clearInterval(this.timeout)
      this.timeout = null
    },
    handleEdit() {
      uni.navigateTo({
        url:
          '/pages/index/pages/device-edit/index?equipNum=' +
          (this.instruData ? this.instruData.instruNum || '' : '') +
          '&instruType=2',
      })
    },
    toStudy() {
      const url = '/pages/index/pages/study/index'
      uni.navigateTo({
        url: `${url}?instruId=${this.instruData.instruId}&isMock=${this.isMock}`,
      })
    },
    getMockData(index) {
      this.isWeChat = true
      if (index === 0) {
        const date = new Date()
        const hour = date.getHours()
        const minute =
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        const seconds =
          date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        this.showLineA('canvasLineA', {
          categories: [`${hour}:${minute}:${seconds}`],
          series: [
            {
              name: '电流',
              data: [1],
              color: '#74D6B5',
            },
            {
              name: '电压',
              data: [2],
              color: '#7BA5FB',
            },
          ],
        })
      } else if (index === 1) {
        this.showRing('canvasRing', {
          series: [
            {
              name: '运行',
              data: 0,
              color: '#6699FF',
            },
            {
              name: '待机',
              data: 0,
              color: '#52CCA3',
            },
            {
              name: '关机',
              data: 0,
              color: '#646986',
            },
          ],
          totalDuration: 0,
        })
        this.mcArray = [0, 0, 0]
        this.avgArray = [0, 0, 0]
        this.max = 10
        this.showRadar('canvasRadar', {
          categories: ['计量数', '维护数'],
          series: [
            {
              name: this.instruName,
              data: [0, 0],
            },
            {
              name: '平均值',
              data: [0, 0],
            },
          ],
        })
        this.showLineB('canvasLineB', {
          categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          series: [
            {
              name: '能耗',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              color: '#74D6B5',
            },
          ],
        })
      }
    },
    // ------------------------------------- 学习资料
    // 资料搜索
    searchData() {
      const url = '/pages/index/pages/study/pages/searchData/index'
      const instruId = `instruId=${this.instruId || ''}`
      uni.navigateTo({
        url: `${url}?${instruId}`,
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
              type: 3,
            },
          }
        : {
            startRow: 0,
            parameter: {
              isVideo: null,
              instruId: this.instruId,
            },
            page: this.page,
            pageSize: this.pageSize,
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
          conosle.log(e)
        })
        .finally(() => {
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
      this.page = 1
      this.list = []
      this.loadMoreStatus = 'loading'
    },
  },
  onLoad(data) {
    this.isMock = data.isMock === 'true' || false
    this.instruNum = data.instruNum || ''
    this.instruId = data.instruId || ''
    this.dbName = data.dbName || ''
    this.state = data.state || null
    this.userId = data.userId || null

    _self = this
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)

    // if (Number(this.state) !== 5) { // 不是离线状态才请求电流电压接口
    if (!this.isMock) {
      this.queryRealTime()
      this.timeout = setInterval(this.getRealTimeToRedis, 10000)
      this.timer = setInterval(this.equipInformation, 10000)
    } else {
      this.getMockData(0)
    }

    // }
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
  },
  beforeDestroy() {
    this.handleClearInterval()
  },
  onShow() {
    this.equipInformation()
    if (!this.isMock) this.equipRecord()
    this.enable = true
  },
  onPageScroll(data) {
    uni.setNavigationBarTitle(
      data.scrollTop > 50 ? this.instruData.instruName : '仪器信息'
    )
  },
  onUnload() {
    clearInterval(this.timeout)
    this.timeout = null
    clearInterval(this.timer)
    this.timer = null
  },
  onBackPress(options) {
    uni.switchTab({
      url: `/pages/index/index`,
    })
    return true
  },
  onReachBottom() {
    if (this.loadMoreStatus === 'loadmore' && this.currentTab === 2) {
      this.page++
      this.getStudyList()
    }
  },
  onHide() {
    this.enable = false
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
  // background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 1));
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  overflow-x: hidden;
  background: #fff;
	border-top: 2rpx solid rgba(0,0,0,.1);

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
        background-image: url('https://iotapp.prod.ilabeco.com/download/iot/common/bg123.png');
        background-size: cover;
        font-size: 40rpx;
        font-weight: bold;
        color: #ffffff;
      }
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
        height: 500upx;
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

  .study {
    // background-color: #fff;
    margin: 0 18rpx;
    border-radius: 25rpx;
    margin-bottom: 18rpx;
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

.tab-fixed {
  background: rgb(57, 120, 247);
}
</style>
