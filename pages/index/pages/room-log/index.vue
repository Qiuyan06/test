<template>
    <view class="device-log">
        <view class="control">
            <u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="tabChange" bg-color="transparent" style="width: 300rpx"></u-tabs>
            <view class="select-time" @click="pickerTimeShow = true">
                <text class="iconfont">&#xe665;</text>
                <text>{{time || '选择时间'}}</text>
                <u-icon name="arrow-right" color="#111737"></u-icon>
            </view>
        </view>
        <view v-if="currentTab === 0 && !isEmpty">
            <u-time-line style="margin-top: 50rpx;">
                <u-time-line-item v-for="(item, index) in list" :key="index">
                    <template v-slot:content>
                        <view class="date">{{item.createTime}}</view>
                        <view class="log-box" v-if="currentTab === 0">
                            <Log-item v-for="sub in item.list" :key="sub.id" :com-data="sub"></Log-item>
                        </view>
                    </template>
                </u-time-line-item>
            </u-time-line>
        </view>
        <view class="log-box1" v-if="currentTab === 1">
            <view v-for="(item, index) in list" :key="index" class="log-box-item">
                <u-collapse v-if="item">
                    <u-collapse-item :title="item | typeFilter">
                        <u-empty v-if="!item.list || !item.list.length" text="抱歉，暂无数据" mode="list"></u-empty>
                        <cmd-log v-else v-for="(sub, _index) in item.list" :key="_index" :com-data="sub"></cmd-log>
                    </u-collapse-item>
                </u-collapse>
            </view>
        </view>
        <u-empty text="暂无数据" mode="list" :show="isEmpty" margin-top="100"></u-empty>
        <!--<view class="footer-box" v-if="currentTab === 1">
            <view class="label">
                <text>合计</text>
            </view>
            <view class="info">
                <view class="info-item">
                    <text class="iconfont">&#xe64a;</text>
                    <text>40次</text>
                </view>
                <view class="info-item">
                    <text class="iconfont">&#xe649;</text>
                    <text>2600h</text>
                </view>
            </view>
        </view>-->
        <u-calendar v-model="pickerTimeShow" mode="range" @change="pickerTimeConfirm"></u-calendar>
    </view>
</template>
<script>
    import LogItem from './components/LogItem'
    import CmdLog from './components/CmdLog'
    import { getDateArr } from '@/utils/index'
    export default {
        filters: {
            typeFilter(val) {
                if (!val.instruType || val.instruType === 4) return val.instruName
                return `${val.instruName}（${['云盒子', '仪器猫', '仪器猫伴侣'][val.instruType - 1]}）`
            },
        },
        components: {
            LogItem,
            CmdLog
        },
        data() {
            return {
                tabs: [{
                    name: '操作记录'
                }, {
                    name: '状态记录'
                }],
                currentTab: 0,
                roomId: '',
                dbName: '',
                list: [],
                init: false,
                time: '',
                pickerTimeShow: false,
                pickerTimeParams: {
                    year: true,
                    month: true,
                    day: true,
                    hour: false,
                    minute: false,
                    second: false
                },
            }
        },
        computed: {
            isEmpty() {
                return this.init && this.list.length < 1
            },
            week(){
                const days = getDateArr(7)//过去一周的日期（包含今天）
                return {startDate:days[days.length-1], endDate:days[0]}
            }
        },
        methods: {
            pickerTimeConfirm(time) {
                this.time = `${time.startDate}至${time.endDate}`
                this.getApi()
            },
            tabChange(index) {
                this.currentTab = index;
                this.time = `${this.week.startDate}至${this.week.endDate}`
                this.getApi()
            },
            queryOperationLogList() {
                if (!this.roomId) {
                    return
                }
                const par = {
                    roomId: this.roomId
                }
                if(this.time){
                    par.beginTime=this.time.split('至')[0]
                    par.endTime=this.time.split('至')[1]
                }
                this.$u.api.roomApi.queryOperationLogList({
                    parameter: par
                }).then((res) => {
                    if (res && Array.isArray(res)) {

                        this.list = res || []
                    }
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh();
                })
            },
            getCmdlogList() {
                if (!this.roomId) {
                    return
                }
                const par = {
                    roomId: this.roomId
                }
                if(this.time){
                    par.beginTime=this.time.split('至')[0]
                    par.endTime=this.time.split('至')[1]
                }
                if (this.dbName) {
                    par.dbName = this.dbName
                }

                this.$u.api.roomApi.getCmdlogList({
                    parameter: par
                }).then((res) => {
                    if (res && Array.isArray(res.rows)) {
                        this.list = res.rows
                    }
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh();
                })
            },
            getApi() {
                this.list = []
                this.init = false

                if (this.currentTab === 0) {
                    this.queryOperationLogList()
                } else if (this.currentTab === 1) {
                    this.getCmdlogList()
                }
            }
        },
        onLoad(data) {
            this.roomId = data.roomId || ''
            this.dbName = data.dbName || ''
            this.time = `${this.week.startDate}至${this.week.endDate}`
            this.getApi()
        },
        onPullDownRefresh() {
            this.time = `${this.week.startDate}至${this.week.endDate}`
          this.getApi()
        }
    }
</script>
<style lang="scss" scoped>
    .device-log {
        padding: 80rpx 33rpx 100rpx 24rpx;

        .control {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #FFFFFF;
            display: flex;
            justify-content: space-between;
            padding: 19rpx 24rpx 0;
            z-index: 99;

            .select-time {
                display: flex;
                align-items: center;
                font-size: 26rpx;
                color: #111737;

                .iconfont {
                    font-size: 34rpx;
                    margin-right: 4rpx;
                }
            }
        }

        /*  #ifdef  H5  */
            .control {
                top: 44rpx
            }
        /*  #endif  */

        .footer-box {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24rpx 32rpx 24rpx 24rpx;

            .label {
                font-size: 34rpx;
                font-weight: blod;
                color: #000000;
            }

            .info {
                display: flex;
                align-items: center;

                .info-item {
                    display: flex;
                    align-items: center;
                    font-size: 30rpx;
                    color: #111737;
                    margin-left: 32rpx;

                    .iconfont {
                        font-size: 40rpx;
                        margin-right: 12rpx;
                    }
                }
            }
        }

        .date {
            font-size: 28rpx;
            font-weight: bold;
            color: #000000;
            margin-bottom: 25rpx;
        }

        .log-box {
            background-color: #FFFFFF;
            border-radius: 24rpx;
            padding-left: 30rpx;
            overflow: hidden;
        }
        .log-box1 {
            margin-top: 50rpx;
            .log-box-item{
                background: white;
                border-radius: 24rpx;
                margin-bottom: 20rpx;
                padding-left: 30rpx;
            }
        }
    }
</style>
