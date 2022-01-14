<template>
    <view class="LogBox">
        <view class="info">
            <view class="item" v-for="item in titleList">
                <text class="val">{{item.fieldName}}： {{comData[item.fieId]}}</text>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            titleList:{
                type:Array,
                default:()=>[]
            },
            comData: {
                type: Object,
                required: true
            }
        },
        computed: {

        },
        methods:{

        }
    }
</script>
<style lang="scss" scoped>
    .LogBox {
        height:auto;
        min-height: 235rpx;
        background-color: #ffffff;
        border-radius: 16rpx;
        overflow: hidden;
        margin:18rpx auto 0;

        /*.title {
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
        }*/

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
