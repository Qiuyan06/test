<template>
    <view class="device-log">
        <view class="control">
            <u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="tabChange" bg-color="transparent" style="width: 700rpx"></u-tabs>
        </view>
        <!--<view v-if="currentTab === tabs.length-1 || currentTab===tabs.length-2" class="select-time" @click="pickerTimeShow = true">
            <text class="iconfont">&#xe665;</text>
            <text>{{time || '选择时间'}}</text>
            <u-icon name="arrow-right" color="#111737"></u-icon>
        </view>-->

        <template v-if="!isEmpty">
            <u-time-line v-if="currentTab===tabs.length-2 || currentTab===tabs.length-1">
                <u-time-line-item v-for="(item, index) in list" :key="index">
                    <template v-slot:content>
                        <view class="date">{{currentTab===tabs.length-2?item.createTime:item.createDate}}</view>
                        <view class="log-box" v-if="currentTab === tabs.length-2">
                            <Log-item v-for="sub in item.list" :key="sub.id" :com-data="sub"></Log-item>
                        </view>
                        <view class="log-box" v-else-if="currentTab === tabs.length-1">
                            <cmd-log v-for="sub in item.list" :key="sub.id" :com-data="sub"></cmd-log>
                        </view>
                    </template>
                </u-time-line-item>
            </u-time-line>
            <view v-else>
                <SetItem v-for="item in list" :titleList="titleList[currentTab]" :com-data="item"></SetItem>
            </view>
        </template>

        <u-empty text="暂无数据" mode="list" :show="isEmpty" margin-top="100"></u-empty>
        <LogSearch ref="LogSearch" @change="handleSearch"></LogSearch>
        <SetSearch ref="SetSearch"  @change="handleSetSearch"></SetSearch>
        <!--操作日志、状态记录筛选按钮-->
        <view v-if="currentTab === tabs.length-2 || currentTab === tabs.length-1" class="control-box">
            <text class="iconfont" @click="showSearch">&#xe645;</text>
        </view>

        <template v-for="(item,index) in parameterList">
            <view v-if="index === currentTab && item && item.length" class="control-box">
                <text class="iconfont" @click="showSetSearch">&#xe645;</text>
            </view>
        </template>
    </view>
</template>
<script>
    import SetItem from './components/SetItem'
    import LogItem from './components/LogItem'
    import CmdLog from './components/CmdLog'
    import { getDateArr } from '@/utils/index'
    import LogSearch from './components/LogSearch'
    import SetSearch from './components/SetSearch'
    export default {
        components: {
            SetItem,
            LogItem,
            CmdLog,
            LogSearch,
            SetSearch
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
                powersCount:0,
                runTime:0,
                logfacesList:null,//日志接口集合（自定义配置相关）
                titleList:null,//日志接口对应字段集合（自定义配置相关）
                page:1,
                pageSize:10,
                parameterList:[],
                setSearchParams:[],//筛选参数
                loadMoreStatus: 'loading'
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
            // 显示搜索（普通日志）
            showSearch(){
                this.$refs.LogSearch.show(this.time)
            },

            // 搜索（普通日志）
            handleSearch(data){
                this.time = data
                this.getApi()
            },

            // 切换tab时重置时间
            tabChange(index) {
                this.currentTab = index;
                this.time = `${this.week.startDate}至${this.week.endDate}`
                this.resetData()
                if(this.$refs.SetSearch)this.$refs.SetSearch.resetData()
                this.getApi()
            },

            // 显示搜索（自定义配置相关）
            showSetSearch(){
                this.$refs.SetSearch.show(this.parameterList[this.currentTab])
            },

            // 搜索（自定义配置相关）
            handleSetSearch(parameter){
                this.resetData()
                this.setSearchParams = parameter
                this.getLogList()
            },

            // 获取配置日志列表（自定义配置相关）
            getLogList(){
                const api = this.logfacesList[this.currentTab]
                // console.log(this.logfacesList,this.currentTab)
                if (!this.instruId) {
                    return
                }
                const par = {
                    page: this.page,
                    pageSize: this.pageSize,
                    equipId: this.instruId,
                    ...this.setSearchParams
                }

                this.$u.post(api, {
                    parameter: par,
                }).then((res) => {
                    const data = res && res.datas
                    if (data && data.rows && Array.isArray(data.rows)) {
                        this.list = this.list.concat(data.rows)
                    }
                    // 是否需要分页
                    this.hasMorePage(data && data.total || 0, data && data.rows && data.rows.length)
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh()
                })
            },

            hasMorePage(total = 0, dataSize = 0) { // 判断是否还有下一页
                if (this.page === 1 && total <= this.pageSize) {
                    this.loadMoreStatus = 'nomore'
                } else if (this.page > 1 && (dataSize < this.pageSize || total / this.pageSize === this.page)) {
                    this.loadMoreStatus = 'nomore'
                } else {
                    this.loadMoreStatus = 'loadmore'
                }
            },
            resetData() {
                this.init = false
                this.page = 1
                this.setSearchParams = null
                this.list = []
                this.loadMoreStatus = 'loadmore'
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
                        this.list = res
                    }
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh();
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
                if (this.currentTab === this.tabs.length-2) {
                    this.queryOperationLogList()
                } else if (this.currentTab === this.tabs.length-1) {
                    this.getBoxEquipCmdlogList()
                    this.getBoxEquipCmdlogTotal()
                }else {
                    this.getLogList()
                }
            },
        },
        onLoad(data) {
            if(this.s_bus.setList){
                const setList = this.s_bus.setList
                const logTabs = setList.map(item=>({name:item.tabName}))
                this.tabs = [...logTabs,...this.tabs]
                this.logfacesList = setList.map(item=>item.eti)
                this.titleList = setList.map(item=>item.titles)
                this.parameterList = setList.map(item=>item.parameterFieIds)
            }

            this.instruId = data.instruId || ''
            this.dbName = data.dbName || ''
            this.time = `${this.week.startDate}至${this.week.endDate}`
            this.instruType=Number(data.instruType || 0)
            this.getApi()
        },
        onPullDownRefresh() {
            this.resetData()
            // 下拉刷新时重置时间
            this.time = `${this.week.startDate}至${this.week.endDate}`
            this.getApi()
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'loadmore') {
                this.page++
                this.getLogList()
            }
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


        }
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

        .control-box {
            position: fixed;
            bottom: 140rpx;
            right: 38rpx;
            z-index: 98;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 72rpx;
            height: 72rpx;
            border-radius: 50%;
            background-color: #4885FF;
            box-shadow: 0 5rpx 9rpx 0 #CFD7E7;

            .iconfont {
                color: #FFFFFF;
                font-size: 40rpx;
            }
        }
    }
</style>
