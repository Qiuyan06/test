<template>
    <view class="LogItem">
        <view class="status" :class="[`status${operation.val}`]">
            <text>{{operation.name}}</text>
        </view>
        <text class="mian">{{comData.content}}</text>
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
            operation() {
                const operation = {
                    name: '',
                    val: ''
                }

                if (this.comData && this.comData.operationType) {
                    switch (this.comData.operationType) {
                        case 1:
                            operation.val = 1
                            operation.name = '维修'
                            break
                        case 2:
                            operation.val = 2
                            operation.name = '保养'
                            break
                        case 3:
                            operation.val = 3
                            operation.name = '维护'
                            break
                        case 4:
                            operation.val = 4
                            operation.name = '计量'
                            break
                        case 5:
                            operation.val = 5
                            operation.name = '分享'
                            break
                        case 6:
                            operation.val = 6
                            operation.name = '开机'
                            break
                        case 7:
                            operation.val = 7
                            operation.name = '关机'
                            break
                    }
                }

                return operation
            }
        }
    }
</script>
<style lang="scss" scoped>
    .LogItem {
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
                background-color: #FFEBD8;
                color: #EFA91D;
            }

            &.status2 {
                background-color: #EEE6FF;
                color: #A13AFF;
            }

            &.status3 {
                background-color: #E6FFE6;
                color: #31CC31;
            }

            &.status4 {
                background-color: #E7FAFF;
                color: #3DC8FF;
            }

            &.status5 {
                background-color: #FFE6E8;
                color: #FF3D3D;
            }

            &.status6 {
                background-color: #E5EEFF;
                color: #2C72F9;
            }

            &.status7 {
                background-color: #E2E3E4;
                color: #596781;
            }
        }

        .mian {
            flex: 1;
            /*overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;*/
            word-break: break-all;
            line-height: 36rpx;
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
