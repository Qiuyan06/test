<template>
    <view class="HomeInfo">
        <template v-if="roomData">
            <view class="title">
                <text>{{roomData ? roomData.name || '' : ''}}</text>
            </view>
            <view class="sub-title">
                <text>{{roomData ? roomData.deptName || '' : ''}}·{{roomData ? roomData.tlaName || '' : ''}}</text>
            </view>
        </template>
        <template v-else>
            <view class="nodata">未绑定实验室房间</view>
        </template>
    </view>
</template>
<script>
    export default {
        props: {
            roomData: {
                type: [Object, null],
                default: null
            }
        }
    }
</script>
<style lang="scss" scoped>
    .HomeInfo {
        background-color: #FFFFFF;
        border-radius: 24rpx;
        padding: 35rpx 28rpx 35rpx;
        margin-bottom: 48rpx;
        .nodata{
            text-align: center;
            color:#999;
        }
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333333;
            margin-bottom: 16rpx;
        }

        .sub-title {
            font-size: 28rpx;
            color: #77787D;
            margin-bottom: 24rpx;
        }

        .details {
            background-color: #F6F7FC;
            border-radius: 20px;
            padding: 32rpx 22rpx 1rpx;
        }

        .details-item {
            display: flex;
            align-items: center;
            color: #333333;
            font-size: 28rpx;
            margin-bottom: 44rpx;

            .iconfont {
                font-size: 40rpx;
                margin-right: 20rpx;
            }

            .label {
                margin-right: 30rpx;
            }

            .line {
                flex: 1;
                height: 1rpx;
                border-bottom: 2rpx dashed #111737;
                margin-right: 20rpx;
            }
        }
    }
</style>
