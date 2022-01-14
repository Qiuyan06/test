<template>
    <view class="CmdLog">
        <view class="status" :class="[`status${stateData.val}`]">
            <text>{{stateData.name}}</text>
        </view>
        <text class="mian"></text>
        <text class="time">{{comData.time}}</text>
    </view>
</template>
<script>
    export default {
        props: {
            comData: {
                type: Object,
                required: true
            }
        },
        computed: {
            stateData() {
                const stateData = {
                    name: '',
                    val: ''
                }

                if (this.comData && this.comData.state) {
                    switch (this.comData.state) {
                        case 1:
                            stateData.val = 1
                            stateData.name = '待机'
                            break
                        case 2:
                            stateData.val = 2
                            stateData.name = '关机'
                            break
                        case 3:
                            stateData.val = 3
                            stateData.name = '离线'
                            break
                        case 4:
                            stateData.val = 4
                            stateData.name = '运行'
                            break
                        /*case 5:
                            stateData.val = 5
                            stateData.name = '待机'
                            break*/
                    }
                }

                return stateData
            }
        }
    }
</script>
<style lang="scss" scoped>
    .CmdLog {
        display: flex;
        align-items: center;
        padding-right: 24rpx;
        padding-top: 34rpx;
        padding-bottom: 34rpx;
        border-bottom: 1rpx solid #E3E5EB;

        &:last-of-type {
            border-bottom: none;
        }

        .status {
            border-radius: 6rpx;
            font-size: 20rpx;
            padding: 4rpx 4rpx 4rpx 6rpx;
            margin-right: 16rpx;

            &.status1 {
                background-color: #E5EEFF;
                color: #2C72F9;
            }

            &.status2 {
                background-color: #E2E3E4;
                color: #596781;
            }

            &.status3 {
                background-color: #FFEBD8;
                color: #EFA91D;
            }

            &.status4 {
                background-color: #E6FFE6;
                color: #31CC31;
            }

            &.status5 {
                background-color: #DFF8F5;
                color: #3BCCF4;
            }
        }

        .mian {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
            color: #000000;
        }

        .time {
            font-size: 28rpx;
            color: #000000;
            margin-left: 16rpx;
        }
    }
</style>
