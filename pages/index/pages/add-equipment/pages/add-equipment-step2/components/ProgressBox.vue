<template>
    <view class="ProgressBox">
        <view class="item">
            <view class="top">
                <view class="sub-line" style="background-color: #FFFFFF"></view>
                <view class="num">
                    <text>1</text>
                </view>
                <view class="sub-line"></view>
            </view>
            <view class="label">
                <text>添加设备</text>
            </view>
        </view>
        <view class="line">
            <view class="line-line"></view>
        </view>
        <view class="item active">
            <view class="top">
                <view class="sub-line"></view>
                <view class="num">
                    <text>2</text>
                </view>
                <view class="sub-line"></view>
            </view>
            <view class="label">
                <text>添加仪器</text>
            </view>
        </view>
        <view class="line">
            <view class="line-line"></view>
        </view>
        <view class="item">
            <view class="top">
                <view class="sub-line"></view>
                <view class="num">
                    <text>1</text>
                </view>
                <view class="sub-line" style="background-color: #FFFFFF"></view>
            </view>
            <view class="label">
                <text>完成</text>
            </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
    .ProgressBox {
        display: flex;
        justify-content: center;
        padding: 22rpx 38rpx 30rpx;
        background-color: #FFFFFF;

        .item {
            width: 100rpx;

            .top {
                display: flex;
                align-items: center;

                .sub-line {
                    flex: 1;
                    height: 2rpx;
                    background-color: #D8D8D8;
                }

                .num {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 59rpx;
                    height: 59rpx;
                    border-radius: 50%;
                    font-size: 28rpx;
                    color: #D8D8D8;
                    border: 2rpx solid #D8D8D8;
                }
            }

            .label {
                margin-top: 14rpx;
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.65);
                text-align: center;
            }

            &.active {
                .num {
                    color: #FFFFFF;
                    border: 2rpx solid #2C72F9;
                    background-color: #2C72F9;
                }

                .label {
                    font-weight: bold;
                    color: rgba(0, 0, 0, 0.85);
                }
            }
        }

        .line {
            flex: 1;
            display: flex;
            align-items: center;
            height: 59rpx;

            .line-line {
                width: 100%;
                height: 2rpx;
                background-color: #D8D8D8;
            }
        }
    }
</style>
