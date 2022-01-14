<template>
    <view class="StatusBox">
        <view class="mian">
            <view class="title">
                <text>仪器状态</text>
            </view>
            <view class="statistics">
                <view class="statistics-item">
                    <text class="val">{{recordData ? recordData.maintainRecord || 0 : 0}}</text>
                    <text class="label">维护</text>
                </view>
                <view class="statistics-item">
                    <text class="val">{{recordData ? recordData.measurementRecord || 0 : 0}}</text>
                    <text class="label">计量</text>
                </view>
               <!-- <view class="statistics-item">
                    <text class="val">{{recordData ? recordData.maintenanceRecord || 0 : 0}}</text>
                    <text class="label">保养</text>
                </view> -->
            </view>
            <view class="status" :class="[`state${state.val}`]">
                <text>{{state.txt}}</text>
            </view>
        </view>
        <!--<view class="bottom">
            <text class="iconfont">&#xe66b;</text>
            <text class="txt">【保养提醒】2020/9/28（30天后）色谱仪需要保养</text>
        </view>-->
    </view>
</template>
<script>
    export default {
        props: {
            recordData: {
                type: [Object, null],
                default: null
            },
            instruData: {
                type: [Object, null],
                default: null
            }
        },
        computed: {
            state() {
                let state = {
                    val: 0,
                    txt: ''
                }

                if (this.instruData && this.instruData.state) {
                    switch (this.instruData.state) {
                        case 1:
                            state.txt = '运行'
                            state.val = 1
                            break
                        case 2:
                            state.txt = '待机'
                            state.val = 2
                            break
                        case 3:
                            state.txt = '关机'
                            state.val = 3
                            break
                        case 4:
                            state.txt = '报警'
                            state.val = 4
                            break
                        case 5:
                            state.txt = '离线'
                            state.val = 5
                            break
                    }
                }

                return state
            }
        }
    }
</script>
<style lang="scss" scoped>
    .StatusBox {
        border-radius: 24rpx;
        overflow: hidden;
        background-color: #FFE7B4;
        margin-bottom: 18rpx;

        .mian {
            position: relative;
            border-radius: 24rpx;
            background-color: #FFFFFF;
            padding: 22rpx 30rpx 52rpx;

            .title {
                padding-bottom: 23rpx;
                border-bottom: 1rpx solid #EEEEEE;
                font-size: 32rpx;
                color: #333333;
                font-weight: bold;
                margin-bottom: 41rpx;
            }

            .statistics {
                display: flex;
                align-items: center;
                justify-content: space-around;

                .statistics-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0 20rpx;

                    .val {
                        color: #111737;
                        font-size: 40rpx;
                        font-weight: bold;
                        margin-bottom: 17rpx;
                    }

                    .label {
                        color: #111737;
                        font-size: 26rpx;
                        opacity: 0.6;
                    }
                }
            }

            .status {
                position: absolute;
                top: 0;
                right: 0;
                border-radius: 0 24rpx 0 100rpx;
                font-size: 24rpx;
                padding: 12rpx 24rpx 12rpx 38rpx;

                &.state1 {
                    color: #2C72F9;
                    background-color: #E1EBFF;
                }

                &.state2 {
                    color: #13CA83;
                    background-color: #DEFAED;
                }

                &.state3 {
                    color: #646986;
                    background-color: #D2D4DA;
                }

                &.state4 {
                    color: rgb(255, 61, 61);
                    background-color: rgb(255, 230, 232);
                }

                &.state5 {
                    color: #F0A232;
                    background-color: #FAF2DE;
                }
            }
        }

        .bottom {
            padding: 35rpx 30rpx 55rpx;
            display: flex;
            align-items: center;
            color: #333333;

            .iconfont {
                position: relative;
                top: 4rpx;
                font-size: 48rpx;
                margin-right: 10rpx;
            }

            .txt {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 26rpx;
            }
        }
    }
</style>
