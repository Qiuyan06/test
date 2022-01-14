<template>
    <view class="Device" @click="toDetails">
        <u-image width="180rpx" height="180rpx" border-radius="12" :src="comData.img">
            <u-loading slot="loading"></u-loading>
        </u-image>
        <view class="content">
            <view class="title">
                <text>{{comData.instruName || ''}}</text>
            </view>
            <view class="info">
                <text>{{comData.instruNo||''}}</text>
            </view>
            <view class="info" v-if="comData.instruType !== 4">
                <text class="info-text instru-num">设备编号：{{comData.instruType|typeFilter}} {{comData.code||''}}</text>
            </view>
            <view class="info">
                <text class="info-text instru-brand">品牌型号：{{comData.brandName||''}} {{comData.modelName||''}}</text>
            </view>
        </view>
        <view class="status" :class="['status',`state${comData.status}`]">
            <text>{{comData.status | stateFilter}}</text>
        </view>
    </view>
</template>
<script>
    export default {
        filters: {
            typeFilter(val = 0) {
                return ['云盒子', '仪器猫', '仪器猫伴侣'][val - 1]
            },
            stateFilter(val) {
                if (!val) return '无'
                return ['运行', '待机', '关机', '报警', '离线'][val - 1]
            }
        },
        props: {
            comData: {
                type: Object,
                required: true
            }
        },
        computed: {
            status() {
                const status = {
                    name: '',
                    val: ''
                }

                switch (this.comData.status) {
                    case 1:
                        status.name = '运行'
                        status.val = 1
                        break
                    case 2:
                        status.name = '待机'
                        status.val = 2
                        break
                    case 3:
                        status.name = '关机'
                        status.val = 3
                        break
                    case 4:
                        status.name = '警报'
                        status.val = 4
                        break
                    case 5:
                        status.name = '离线'
                        status.val = 5
                        break
                }

                console.log('status == ', this.comData.statu)
                return status
            }
        },
        methods: {
            toDetails() {
                console.log('this.comData.dbName == ', this.comData.dbName)
                if (this.comData.instruType === 1) { // 云盒子
                    uni.navigateTo({
                        url: '/pages/index/pages/cloud-box/index?instruNum=' + this.comData.num + '&instruId=' + this.comData.instruId + '&dbName=' + (this.comData.dbName || '') + '&state=' + this.comData.status + '&userId=' + this.comData.userId
                        + '&equipNum=' + this.comData.code
                    });
                } else if (this.comData.instruType === 2) { // 仪器猫
                    uni.navigateTo({
                        url: '/pages/index/pages/instrument-cat/index?instruNum=' + this.comData.num + '&instruId=' + this.comData.instruId + '&dbName=' + (this.comData.dbName || '') + '&state=' + this.comData.status + '&userId=' + this.comData.userId
                            + '&equipNum=' + this.comData.code
                    });
                } else if (this.comData.instruType === 3) { // 仪器猫伴侣
                    uni.navigateTo({
                        url: '/pages/index/pages/instrument-cat-companion/index?instruNum=' + this.comData.num + '&instruId=' + this.comData.instruId + '&dbName=' + (this.comData.dbName || '') + '&state=' + this.comData.status + '&userId=' + this.comData.userId
                            + '&equipNum=' + this.comData.code
                    });
                } else { // 无物联设备
                    uni.navigateTo({
                        url: '/pages/index/pages/instrument-no-iot/index?instruNum=' + this.comData.num + '&instruId=' +
                            this.comData.instruId + '&dbName=' + (this.comData.dbName || '') + '&state=' + this.comData.status + '&userId=' + this.comData
                                .userId
                    });
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .Device {
        position: relative;
        display: flex;
        background-color: #FFFFFF;
        border-radius: 24rpx;
        padding: 24rpx;
        overflow: hidden;
        margin-bottom: 18rpx;
        .content {
            flex: 1;
            margin-left: 18rpx;

            .title {
                padding-right: 120rpx;
                font-size: 28rpx;
                color: #111737;
                line-height: 44rpx;
                margin-bottom: 24rpx;
            }

            .info {
                display: flex;
                align-items: center;
                color: #77787D;
                font-size: 24rpx;
                margin-bottom: 25rpx;

                .info-text {
                    width: 0;
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    &.instru-num {
                        margin-right: 20rpx;
                    }
                }
            }

            .info-list {
                display: flex;
                align-items: center;
                flex-wrap: wrap;

                .info-item {
                    color: #77787D;
                    font-size: 24rpx;
                    margin-right: 25rpx;
                    line-height: 34rpx;

                    &:last-child{
                        margin-right: 0;
                    }

                    .iconfont {
                        margin-right: 8rpx;
                    }
                }
            }
        }
        .status {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 0 0 0 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24rpx;
            width: 110rpx;
            height: 52rpx;
            background-color: #E1E3E5;
            color: #9C9DA4;
            &.state1 {
                background-color: #E1EBFF;
                color: #2C72F9;
            }

            &.state2 {
                background-color: #DEFAED;
                color: #13CA83;
            }

            &.state3 {
                background-color: #D2D4DA;
                color: #646986;
            }

            &.state4 {
                background-color: #FADEDE;
                color: #EB1746;
            }

            &.state5 {
                background-color: #FAF2DE;
                color: #F0A232;
            }
        }
    }
</style>
