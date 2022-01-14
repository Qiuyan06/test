<template>
  <view class="instrument">
    <details-info :record-data="recordData" :instru-data="instruData" :userId="userId"></details-info>
    <view class="charts">
      <u-sticky @fixed="handleFixed" @unfixed="handleUnFixed" :enable="enable">
        <view class="control">
          <TabBox :list="tabs" :current="currentTab" @handleChangeType="tabsChange"></TabBox>
          <!-- <view v-show="currentTab === 0" class="select-time" @click="pickerTimeShow = true">
            <text class="iconfont">&#xe665;</text>
            <text style="margin-right: 6rpx">选择时间</text>
            <u-icon name="arrow-right" color="#ffffff" />
          </view> -->
					
					<!-- 数据对比图解开使用 -->
          <!-- <view v-show="tabs.length === 3 && currentTab===2||(tabs.length === 2 && currentTab===1)"> -->
					<view>
            <view class="item-btn" @click="searchData">
              <text class="iconfont">&#xe644;</text>
            </view>
          </view>
        </view>
      </u-sticky>
     <!-- <view class="charts-box" v-if="currentTab === 0" style="margin-bottom: 615rpx">
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

		 <!-- 数据对比图解开使用 -->
     <!-- <view
        class="study"
        v-else-if="tabs.length === 3 && currentTab===2||(tabs.length === 2 && currentTab===1)"
      > -->
			<view class="study">
        <Study :list="list" :loadMoreStatus="loadMoreStatus" />
      </view>
    </view>
    <view class="footer-btn">
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
      title: '仪器信息',
      instruNum: '',
      instruId: '',
      dbName: '',
      state: null,
      userId: null,
      recordData: null,
      instruData: {},
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
        // {
        //   name: '统计分析',
        // },
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
      popShow: false,
      timer: null,
      // ------------------- 学习资料
      list: [],
      page: 1,
      pageSize: 20,
      loadMoreStatus: 'loading',
    }
  },
  methods: {
    // 右上角的反馈记录按钮
    onNavigationBarButtonTap(e) {
      uni.navigateTo({
        url: `/pages/index/pages/problemFeedback/index?instruId=${this.instruId}&instruName=${this.instruName}`,
      })
    },

    pickerTimeConfirm(time) {
      console.log('time == ', time)
      this.time = `${time.startDate}~${time.endDate}`
      this.beginTime = time.startDate
      this.endTime = time.endDate
      this.getServerData2()
    },

    handleFixed(index) {
      this.isFixed = true
    },
    handleUnFixed(index) {
      this.isFixed = false
    },

    tabsChange(index) {
      //#ifdef MP-WEIXIN
      if (index === 1) {
        this.showPop()
      }
      //#endif
      //#ifndef MP-WEIXIN
      if (index === 1) {
        // this.toStudy()
        // index = this.currentTab
      }
      this.currentTab = index
      //#endif
    },
    getEquipInfoById() {
      if (!this.instruId) {
        return
      }
      const parameter = {
        instruId: this.instruId,
        instruNum: this.instruNum,
        type: 4,
      }
      this.$u.api.equipmentApi
        .getEquipInfoById({
          parameter,
        })
        .then((res) => {
          this.instruData = res ? res : {}
          this.instruName = res ? res.instruName : ''
        })
        .catch((er) => {})
    },

    equipRecord() {
      const par = {
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
    openOrClose() {
      // 开关机
      if (this.isLock || !this.instruId) {
        return
      }

      this.isLock = true

      this.$u.api.equipmentApi
        .getInitialState({
          parameter: {
            instruId: this.instruId,
          },
        })
        .then((res) => {
          if (res) {
            if (res.runningStatus === 0 || res.runningStatus === 1) {
              this.openOrCloseList[0].disabled = true
              this.openOrCloseList[1].disabled = false
            } else if (res.runningStatus === 2) {
              this.openOrCloseList[1].disabled = true
              this.openOrCloseList[0].disabled = false
            } else if (res.runningStatus === 3) {
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
            flag: index === 0 ? false : index === 1 ? true : '',
          },
        })
        .then(() => {
          uni.showToast({
            title: '操作成功',
          })
        })
        .finally(() => {
          this.isLock = false
        })
    },
    showPop() {
      this.$refs.wechatPop.showPop()
      this.popShow = true
    },
    hidePop() {
      this.popShow = false
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
          this.dbName,
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
        url: `/pages/index/pages/instrument-no-iot/info-page?instruId=${this.instruId}&dbName=${this.dbName}${jurisdiction}&instruNum=${this.instruNum}`,
      })
      //#endif
    },
    getServerData2() {
      // const searchMcDetailParams = {
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
      // 			color: '#9CE8CA'
      // 		}, {
      // 			name: '平均值',
      // 			data: this.avgArray,
      // 			color: '#9DBCFB'
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
          // 	max: this.max //雷达数值的最大值
          // }
          column: {
            type: 'group',
            width: 35,
            seriesGap: 20,
            categoryGap: 3,
          },
        },
      })
    },
    toStudy() {
      const url = '/pages/index/pages/study/index'
      uni.navigateTo({
        url: `${url}?instruId=${this.instruData.instruId}`,
      })
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
    },
  },
  onLoad(data) {
    this.instruId = data.instruId || ''
    this.dbName = data.dbName || ''
    this.state = data.state || null
    this.userId = data.userId || null
    this.instruNum = data.instruNum || null

    _self = this
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)

    const beginTime = getDateArr(7) && getDateArr(7).reverse()[0]
    const endTime = getDateArr(1) && getDateArr(1)[0]
    this.beginTime = beginTime
    this.endTime = endTime

    // this.time = beginTime + '~' + endTime

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
    this.getEquipInfoById()
    this.equipRecord()
    this.getServerData2()
    this.enable = true
  },
  onPageScroll(data) {
    uni.setNavigationBarTitle(
      data.scrollTop > 50 ? this.instruData.instruName : '仪器信息'
    )
  },
  onBackPress(options) {
    uni.switchTab({
      url: '/pages/index/index',
    })
    return true
  },
  onReachBottom() {
		// 解开数据对比图使用
    // if (
    //   this.loadMoreStatus === 'loadmore' &&
    //   ((this.tabs.length === 3 && this.currentTab === 2) ||
    //     (this.tabs.length === 2 && this.currentTab === 1))
    // ) 
		if( this.loadMoreStatus === 'loadmore' && this.tabs.length === 1 && this.currentTab === 0)
		{
      this.page++
      // this.otherMenusFlag ? this.getStudyList() : this.getVideoList()
      this.getStudyList()
    }
  },
  onHide() {
    this.enable = false
  },
  onUnload() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>
<style lang="scss" scoped>
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
  // padding: 0 0 50rpx;

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
  }

  .study {
    border-radius: 25rpx;
		margin: 0 18rpx;
    // margin-bottom: 320rpx;
  }

  .charts-content {
    .charts1,
    .charts2,
    .charts3,
    .charts4 {
      width: 100%;
      height: 500upx;
      background-color: #ffffff;
    }

    .charts-right {
      height: 500rpx;
      font-size: 24rpx;

      .run {
        padding-top: 184rpx;
      }

      .wait,
      .shutdown {
        padding-top: 28rpx;
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
  background-color: #3978f7;
  width: 100%;
  .select-time {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #ffffff;
    margin-right: 24rpx;

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
