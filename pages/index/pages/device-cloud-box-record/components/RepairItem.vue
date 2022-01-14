<template>
    <view class="RepairItem">
        <view class="title">
            <text class="name">第11次维修</text>
            <text class="status">已处理</text>
        </view>
        <view class="info">
            <view class="item">
                <text class="iconfont">&#xe649;</text>
                <text class="label">预警时间</text>
                <text class="val">2020-10-10 18:00:11</text>
            </view>
            <view class="item">
                <text class="iconfont">&#xe64d;</text>
                <text class="label">预警内容</text>
                <text class="val">电机温度过高</text>
            </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
    .RepairItem {
        background-color: #ffffff;
        border-radius: 16rpx;
        overflow: hidden;
        margin-bottom: 18rpx;

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
                color: #2EC33D;
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
                }
            }
        }
    }
</style>
