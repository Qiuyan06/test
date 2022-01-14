<template>
    <view class="info-page">
        <u-navbar title="仪器信息" :background="{ background: '#3978f7' }" back-icon-color="#fff" title-color="#fff" :border-bottom="false">
            <view v-if="!isMock" slot="right">
                <text v-if="jurisdiction && Number(jurisdiction)!==3" class="icon-text iconfont" @click="handleEdit">&#xe63b;</text>
            </view>
        </u-navbar>
        <view class="tip" v-if="isMock">
            <u-icon name="info-circle-fill" size="40" color="#2C72F9"></u-icon>
            <view class="text">此页为示例数据</view>
        </view>
        <view class="content">
            <device-info :instru-data="instruData"></device-info>
            <status-box :record-data="recordData" :instru-data="instruData" :showWarnEntry="showWarnEntry"></status-box>
            <home-info :room-data="roomData"></home-info>
            <view class="footer-box">
                <text>已经到页面底部啦~</text>
            </view>
        </view>

    </view>
</template>
<script>
    import DeviceInfo from './components/DeviceInfo'
    import StatusBox from './components/StatusBox'
    import HomeInfo from './components/HomeInfo'

    export default {
        components: {
            DeviceInfo,
            StatusBox,
            HomeInfo
        },
        data() {
            return {
                isMock:false,//是否是模拟数据
                jurisdiction:null,
                instruNum: '',
                equipNum: '',
                instruId: '',
                dbName: '',
                instruData: null,
                recordData: null,
                roomData: null,
                showWarnEntry:true,//是否展示报警入口
            }
        },
        methods: {
            equipInformation() {
                if (!this.instruNum ) {
                    return
                }

                const api = this.isMock ? 'equipInfomationMock': 'equipInformation'
                const parameter = this.isMock ? {instruType:2} :{
                    instruNum: this.instruNum,
                    type: 1
                }

                this.$u.api.equipmentApi[api]({
                    parameter: parameter
                }).then((res) => {
                    this.instruData = res || null
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

                this.$u.api.equipmentApi.equipRecord({
                    parameter: par
                }).then((res) => {
                    this.recordData = res || null
                })
            },
            queryRoomByInstruId() {
                if (!this.instruId) {
                    return
                }

                this.$u.api.equipmentApi.queryRoomByInstruId({
                    parameter: {
                        instruId: this.instruId
                    }
                }).then((res) => {
                    this.roomData = res
                })
            },
            handleEdit(){
                uni.navigateTo({
                    url: '/pages/index/pages/device-edit/index?equipNum=' + this.instruNum + '&instruType=1' + '&realEquipNum=' + this.equipNum
                });
            },
            // 获取日志和报警配置
            getLogAndWarnInfo(){
                return new Promise((resolve, reject) => {
                    this.$u.api.equipmentApi.getSmartCloudBoxTemplateInfo({
                        parameter: { equipId:this.instruId, platformType:'IOT-UU', moduleType:'4' }
                    }).then((res) => {
                        const data = res && res.setContent && JSON.parse(res.setContent)
                        const warnLogger = data && data.tabs && data.tabs.filter(item=>item.isAlarmLog==='ON')
                        // console.log('报警数据：',this.warnLogger)

                        //判断是否有报警配置
                        const hasWarnLog = !this.warnLogger || (Array.isArray(warnLogger) && warnLogger.length>0)
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
                        const warnData = data && data.titles.filter(item=>item.fieId = 'smartBoxSwitch')[0]
                        resolve(!warnData || warnData.isShow==='ON')
                    }).catch(e=>{
                        reject(e)
                    })
                })

            },
        },
        onLoad(data) {
            this.isMock = data.isMock==='true'||false
            this.instruNum = data.instruNum
            this.equipNum = data.equipNum
            this.instruId = data.instruId
            this.dbName = data.dbName
            this.jurisdiction = data.jurisdiction
        },
        onShow() {
            this.equipInformation()
            if(!this.isMock){
                this.queryRoomByInstruId()
                //获取统计数据
                this.equipRecord()
                //获取日志和报警配置、判断是否展示报警入口和开关机
                Promise.all([this.getLogAndWarnInfo(),this.getIsShowEntry()]).then((res) => {
                    //有报警配置并且配置了展示报警时才显示报警入口
                    this.showWarnEntry = res[0]===true && res[1]===true
                }).catch((e) => {
                    console.log(e);
                });

            }
        },
        onBackPress(options) {
            let url = `/pages/index/pages/cloud-box/index?instruNum=${this.instruNum}&instruId=${this.instruId}&dbName=${this.dbName}&userId=${this.instruData.userId}&isMock=${this.isMock}&equipNum=${this.equipNum}`
            uni.redirectTo({url:url})
            return true
        }
    }
</script>
<style>
    page {
        background-color: #3978F7;
    }
</style>
<style lang="scss" scoped>
    .tip {
        padding: 20rpx 24rpx;
        background-color: #F5FFFF;
        font-size: 28rpx;
        color: #111111;
        display: flex;
        z-index: 9;
        align-items:flex-start;
        .text{
            margin:0 10rpx;
            line-height: 40rpx;
            flex: 1;
        }
    }
    .info-page {
        .icon-text{
            margin-right: 23rpx;
            color:#fff;
            font-size:40rpx;
        }
        .content{
            padding: 35rpx 18rpx;
        }
    }

    .footer-box {
        text-align: center;
        font-size: 28rpx;
        color: #FFFFFF;
        opacity: 0.5;
    }
</style>
