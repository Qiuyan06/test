<template>
    <view class="WarningItem" @click="toWarningDetails">
        <view class="title">
            <text class="name">预警</text>
            <text class="status" :class="[`status${statusData.val}`]">{{statusData.name}}</text>
        </view>
        <view class="info">
            <view class="item">
                <text class="iconfont">&#xe649;</text>
                <text class="val">预警时间 {{comData.warnDate || ''}}</text>
            </view>
            <view class="item">
                <text class="iconfont">&#xe64d;</text>
                <text class="val">预警内容 {{comData.content || ''}}</text>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            comData: {
                type: Object,
                required: true
            },
            dbName: {
                type: String,
                default: ''
            },
            instruType: {
                type: Number,
                required: true
            },
            jurisdiction: {
                type: Number,
                required: true
            }
        },
        computed: {
            statusData() {
                const statusData = {
                    name: '',
                    val: ''
                }
                if(this.comData.status === null)return statusData
                switch (Number(this.comData.status)) {
                    case -1:
                        statusData.name = '忽略'
                        statusData.val = '-1'
                        break
                    case 0:
                        statusData.name = '待处理'
                        statusData.val = '0'
                        break
                    case 1:
                        statusData.name = '已处理'
                        statusData.val = '1'
                        break
                }

                return statusData
            }
        },
        methods: {
            toWarningDetails() {
                const params = '?uuid=' + this.comData.uuid + '&dbName=' + this.dbName+'&instruType='+this.instruType+'&jurisdiction='+this.jurisdiction
                uni.navigateTo({
                    url: '/pages/index/pages/device-warning/pages/warning-details/index'+params
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .WarningItem {
        height:auto;
        min-height: 235rpx;
        background-color: #ffffff;
        border-radius: 16rpx;
        overflow: hidden;
        margin:18rpx auto 0;

        .title {
            padding: 24rpx;
            display: flex;
            align-items: center;
            border-bottom: 1rpx solid #EEEEEE;

            .name {
                flex: 1;
                font-size: 30rpx;
                font-weight: bold;
                color: #333333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-right: 24rpx;
            }

            .status {
                font-size: 30rpx;
                font-weight: bold;

                &.status-1 {
                    color: #77787D;
                }

                &.status0 {
                    color: #F04848;
                }

                &.status1 {
                    color: #2EC33D;
                }
            }
        }

        .info {
            padding: 18rpx 24rpx;

            .item {
                display: flex;
                font-size: 26rpx;
                color: #666666;
                margin-bottom: 32rpx;

                &:last-of-type {
                    margin-bottom: 0;
                }

                .iconfont {
                    font-size: 32rpx;
                    margin-right: 8rpx;
                    line-height: 43rpx;
                }

                .label {
                    margin-right: 8rpx;
                    line-height: 43rpx;
                }

                .val {
                    flex: 1;
                    line-height: 43rpx;
                    word-break: break-all;
                }
            }
        }
    }
</style>
