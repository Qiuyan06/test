<template>
    <view class="instrument">
        <details-info :room-data="roomData"></details-info>
        <view class="content">
            <view class="title">
                <text>仪器列表</text>
            </view>
            <view class="list" v-if="!isEmpty">
                <instrument-item v-for="item in list" :key="item.instruId" :com-data="item"></instrument-item>
                <u-loadmore :status="loadMoreStatus" bg-color="transparent" />
            </view>
        </view>
        <u-empty text="暂无数据" mode="list" :show="isEmpty" margin-top="100"></u-empty>
        <view class="footer-btn">
            <view class="btn-item" @click="openOrCloseShow=true">
                <view class="btn">
                    <text class="iconfont">&#xe63e;</text>
                </view>
                <text class="label">开关</text>
            </view>
            <view class="btn-item" @click="toRoomLog">
                <view class="btn">
                    <text class="iconfont">&#xe640;</text>
                </view>
                <text class="label">日志</text>
            </view>
            <view class="btn-item" @click="toShareCode">
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
            <view class="btn-item" @click="toRoomInfo">
                <view class="btn">
                    <text class="iconfont">&#xe63f;</text>
                </view>
                <text class="label">房间信息</text>
            </view>
        </view>
        <u-action-sheet :list="openOrCloseList" v-model="openOrCloseShow" border-radius="24" @click="openOrCloseChange"></u-action-sheet>
        <u-modal v-model="modalShow" :content="modalContent" :show-cancel-button="true" @confirm="roomOneKeyOpenClose"></u-modal>
    </view>
</template>
<script>
    import DetailsInfo from './components/DetailsInfo'
    import InstrumentItem from './components/InstrumentItem'

    export default {
        components: {
            DetailsInfo,
            InstrumentItem
        },
        data() {
            return {
                openOrCloseList: [{
                    color: '#4885FF',
                    text: '开启所有设备',
                    // disabled: true
                }, {
                    text: '关闭所有设备',
                    // disabled: true
                }],
                openOrCloseShow: false,
                roomId: '',
                roomData: null,
                page: 1, // 列表当前页
                pageSize: 10, // 每页显示数据数
                list: [], // 列表数据
                loadMoreStatus: 'loading',
                init: false,
                modalShow: false,
                modalContent: '',
                switchs: '', // 1关机 2开机
                isLock: false
            }
        },
        computed: {
            isEmpty() { // 列表是否为空
                if (this.list.length < 1 && this.init) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            roomOneKeyOpenClose() {
                if (!this.switchs) {
                    return
                }

                this.isLock = true

                this.$u.api.roomApi.roomOneKeyOpenClose({
                    parameter: {
                        switchs: this.switchs,
                        roomId: this.roomId
                    }
                }).then(() => {
                    uni.showToast({
                        title: '操作成功'
                    });
                    setTimeout(() => {
                        this.resetData()
                        this.equipStatisticInfo()
                        this.equipStatisticInfos()
                    }, 10000)
                    setTimeout(() => {
                        this.resetData()
                        this.equipStatisticInfo()
                        this.equipStatisticInfos()
                    }, 20000)
                }).finally(() => {
                    this.isLock = false
                })
            },
            openOrCloseChange(index) {
                if (this.isLock) {
                    return
                }
                if (index === 0) {
                    this.switchs = 2
                    this.modalContent = '是否确认开启所有设备？'
                    this.modalShow = true
                } else if (index === 1) {
                    this.switchs = 1
                    this.modalContent = '是否确认关闭所有设备？'
                    this.modalShow = true
                }
            },
            equipStatisticInfo() {
                this.$u.api.roomApi.equipStatisticInfo({
                    parameter: {
                        roomId: this.roomId
                    }
                }).then((res) => {
                    if (res) {
                        this.roomData = res
                    }
                })
            },
            equipStatisticInfos() {
                this.loadMoreStatus = 'loading'

                this.$u.api.roomApi.equipStatisticInfos({
                    parameter: {
                        roomId: this.roomId
                    },
                    page: this.page,
                    pageSize: this.pageSize
                }).then((res) => {
                    const rows = res.rows || []

                    if (rows && Array.isArray(rows)) {
                        this.list = this.list.concat(rows)
                    }

                    this.hasMorePage(res.total || 0, rows.length)
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
            resetData() { // 重置数据
                this.init = false
                this.page = 1
                this.list = []
                this.loadMoreStatus = 'loadmore'
            },
            toRoomInfo() {
                uni.navigateTo({
                    url: '/pages/index/pages/room/pages/room-info/index?roomId=' + this.roomId
                });
            },
            toRoomLog() {
                uni.navigateTo({
                    url: '/pages/index/pages/room-log/index?roomId=' + this.roomId
                });
            },
            toMember() {
                uni.navigateTo({
                    url: '/pages/index/pages/room-member/index?roomId=' + this.roomId
                });
            },
            toShareCode() {
                uni.navigateTo({
                    url: '/pages/index/pages/room-select-instrument/index?roomId=' + this.roomId
                });
            },
        },
        onLoad(data) {
            this.roomId = data.roomId || ''
            this.equipStatisticInfo()
            this.equipStatisticInfos()
        },
        onPullDownRefresh() {
            this.resetData()
            this.equipStatisticInfos()
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'loadmore') {
                this.page++
                this.equipStatisticInfos()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .footer-btn {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99;
        padding: 40rpx 0;
        display: flex;
        align-items: center;
        justify-content: space-around;
        overflow-x: hidden;

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
                background-color: #FFFFFF;
                border-radius: 50%;
                box-shadow: 0 6rpx 20rpx 0 rgba(115, 120, 130, 0.18);
                margin-bottom: 17rpx;

                .iconfont {
                    font-size: 46rpx;
                    color: #111737;
                }

                &.code {
                    background-color: #2C72F9;
                    box-shadow: 0 6rpx 20rpx 0 rgba(56, 61, 71, 0.36);

                    .iconfont {
                        color: #FFFFFF;
                    }
                }
            }

            .label {
                font-size: 24rpx;
                color: #111737;
            }
        }
    }

    .content {
        position: relative;
        bottom: 120rpx;
        padding: 0 18rpx 100rpx;

        .title {
            display: inline-block;
            padding-bottom: 16rpx;
            border-bottom: 4rpx solid #FFFFFF;
            color: #FFFFFF;
            font-size: 28rpx;
            margin-bottom: 24rpx;
        }
    }
</style>
