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
        <u-time-line v-if="!isEmpty">
            <u-time-line-item v-for="(item, index) in list" :key="index">
                <template v-slot:content>
                    <view class="date">{{currentTab===0?item.createTime:item.createDate}}</view>
                    <view class="log-box" v-if="currentTab === 0">
                        <Log-item v-for="sub in item.list" :key="sub.id" :com-data="sub"></Log-item>
                    </view>
                    <view class="log-box" v-if="currentTab === 1">
                        <cmd-log v-for="sub in item.list" :key="sub.id" :com-data="sub"></cmd-log>
                    </view>
                </template>
            </u-time-line-item>
        </u-time-line>
        <u-empty text="暂无数据" mode="list" :show="isEmpty" margin-top="100"></u-empty>
        <u-calendar v-model="pickerTimeShow" mode="range" @change="pickerTimeConfirm"></u-calendar>
    </view>
</template>
<script>
    import LogItem from './components/LogItem'
    import CmdLog from './components/CmdLog'
    import { getDateArr } from '@/utils/index'
    export default {
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
                instruType:null,
                instruId: '',
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
                powersCount:0,
                runTime:0
            }
        },
        computed: {
            isEmpty() {
                if (this.init && this.list.length < 1) {
                    return true
                }

                return false
            },
            week(){
                const days = getDateArr(7)//过去一周的日期（包含今天）
                return {startDate:days[days.length-1], endDate:days[0]}
            }
        },
        methods: {
            // 选择时间段筛选日志
            pickerTimeConfirm(time) {
                this.time = `${time.startDate}至${time.endDate}`
                const startTimeStamp=new Date(time.startDate).getTime(),endTimeStamp=new Date(time.endDate).getTime()
                if(endTimeStamp-startTimeStamp>2592000000){
                    uni.showToast({
                        title: '最多支持查询31天的数据',
                        icon: 'none'
                    });
                    this.pickerTimeShow = true
                    return false
                }
                this.getApi()
            },
            // 切换tab
            tabChange(index) {
                this.currentTab = index;
                this.time = `${this.week.startDate}至${this.week.endDate}`
                this.getApi()
            },
            // 获取操作日志
            queryOperationLogList() {
                if (!this.instruId) {
                    return
                }
                const par = {
                    instruId: this.instruId
                }
                if(this.time){
                    par.beginTime=this.time.split('至')[0]
                    par.endTime=this.time.split('至')[1]
                }
                this.$u.api.equipmentApi.queryOperationLogList({
                    parameter: par
                }).then((res) => {
                    if (res && Array.isArray(res)) {
                        let list = res

                        /*if (this.time) {
                            list = list.filter((item) => {
                                if (item.createTime === this.time) {
                                    return true
                                }
                            })
                        }*/

                        this.list = list
                    }
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh();
                })
            },
            // 获取状态日志--非云盒子
            getEquipCmdlogList() {
                if (!this.instruId) {
                    return
                }

                const par = {
                    instruId: this.instruId
                }
                if(this.time){
                    par.beginTime=this.time.split('至')[0]
                    par.endTime=this.time.split('至')[1]
                }
                if (this.dbName) {
                    par.dbName = this.dbName
                }

                this.$u.api.equipmentApi.getEquipCmdlogList({
                    parameter: par
                }).then((res) => {
                    if (res && res.rows&& Array.isArray(res.rows)) {
                        let list = res.rows.map(item=>{
                            if(item.createDate && item.createDate.includes(' ')) item.createDate=item.createDate.split(' ')[0]
                            return item
                        })
                        /*if (this.time) {
                            list = list.filter((item) => {
                                if (item.createDate === this.time) {
                                    return true
                                }
                            })
                        }*/

                        this.list = list
                    }
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh();
                })
            },
            // 获取统计数据--非云盒子
            getEquipCmdlogTotal(){
                const par = {
                    instruId: this.instruId
                }
                if(this.time){
                    par.beginTime=this.time.split('至')[0]
                    par.endTime=this.time.split('至')[1]
                }
                if (this.dbName) {
                    par.dbName = this.dbName
                }
                this.$u.api.equipmentApi.getEquipCmdlogTotal({parameter: par}).then((res) => {
                    this.powersCount=res&&res.powersCount ||0
                    this.runTime=Number(Number(res&&res.runTime ||0)/3600).toFixed(2)
                })
            },

            // 获取状态日志--云盒子
            getBoxEquipCmdlogList() {
                if (!this.instruId) {
                    return
                }

                const par = {
                    instruId: this.instruId
                }
                if(this.time){
                    par.beginTime=this.time.split('至')[0]
                    par.endTime=this.time.split('至')[1]
                }
                if (this.dbName) {
                    par.dbName = this.dbName
                }

                this.$u.api.equipmentApi.getBoxEquipCmdlogList({
                    parameter: par
                }).then((res) => {
                    if (res && res.rows&& Array.isArray(res.rows)) {
                        let list = res.rows.map(item=>{
                            if(item.createDate && item.createDate.includes(' ')) item.createDate=item.createDate.split(' ')[0]
                            return item
                        })
                        /*if (this.time) {
                            list = list.filter((item) => {
                                if (item.createDate === this.time) {
                                    return true
                                }
                            })
                        }*/

                        this.list = list
                    }
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh();
                })
            },
            // 获取统计数据--云盒子
            getBoxEquipCmdlogTotal(){
                const par = {
                    instruId: this.instruId
                }
                if(this.time){
                    par.beginTime=this.time.split('至')[0]
                    par.endTime=this.time.split('至')[1]
                }
                if (this.dbName) {
                    par.dbName = this.dbName
                }
                this.$u.api.equipmentApi.getBoxEquipCmdlogTotal({parameter: par}).then((res) => {
                    this.powersCount=res&&res.powersCount ||0
                    this.runTime=Number(Number(res&&res.runTime ||0)/3600).toFixed(2)
                })
            },

            getApi() {
                this.list = []
                this.init = false
                if (this.currentTab === 0) {
                    this.queryOperationLogList()
                } else if (this.currentTab === 1) {
                    if(this.instruType===1){
                        this.getBoxEquipCmdlogList()
                        this.getBoxEquipCmdlogTotal()
                    }else{
                        this.getEquipCmdlogList()
                        this.getEquipCmdlogTotal()
                    }
                }
            },
        },
        onLoad(data) {
            this.instruId = data.instruId || ''
            this.dbName = data.dbName || ''
            this.time = `${this.week.startDate}至${this.week.endDate}`
            this.instruType=Number(data.instruType || 0)
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
        padding: 130rpx 33rpx 100rpx 24rpx;

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
                top: 62rpx
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
    }
</style>
