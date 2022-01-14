<template>
    <view class="DeviceInfo">
        <view class="title">
            <text>仪器信息</text>
        </view>
        <view class="item">
            <text class="label">名称</text>
            <text class="val">{{instruData ? instruData.instruName || '' : ''}}</text>
        </view>
        <view class="item">
            <text class="label">编号</text>
            <text class="val">{{instruData ? instruData.instruNo || '' : ''}}</text>
        </view>
        <view class="item">
            <text class="label">仪器猫</text>
            <text class="val">{{instruData ? instruData.code || '' : ''}}</text>
        </view>
        <view class="item">
            <text class="label">负责人</text>
            <text class="val">{{userName}}</text>
        </view>
        <view class="item">
            <text class="label">机构</text>
            <text class="val">{{instruData ? instruData.deptName || '' : ''}}</text>
        </view>
        <view class="item">
            <text class="label">品牌</text>
            <text class="val">{{instruData ? instruData.brandName || '' : ''}}</text>
        </view>
        <view class="item">
            <text class="label">型号</text>
            <text class="val">{{instruData ? instruData.modelName || '' : ''}}</text>
        </view>
        <view class="item">
            <text class="label">分类</text>
            <text class="val">{{instruData ? instruData.cateName || '' : ''}}</text>
        </view>
        <view class="item">
            <text class="label">金额</text>
            <text class="val">{{instruData&&instruData.purchaseAmount ?`￥${instruData.purchaseAmount/100}`:''}}</text>
        </view>
        <view class="item">
            <text class="label">采购时间</text>
            <text class="val">{{instruData ? instruData.purchaseTime || '' : ''}}</text>
        </view>
        <view class="item">
            <text class="label">放置地址</text>
            <text class="val">{{instruData ? instruData.address || '' : ''}}</text>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            instruData: {
                type: [Object, null],
                default: null
            }
        },
        computed: {
            userName() {
                let userName = ''

                if (this.instruData && this.instruData.userName) {
                    const userNameArr = this.instruData.userName.split(',')

                    userName = userNameArr[0]
                }

                return userName
            }
        },
    }
</script>
<style lang="scss" scoped>
    .DeviceInfo {
        background-color: #FFFFFF;
        border-radius: 24rpx;
        padding: 22rpx 30rpx;
        margin-bottom: 18rpx;

        .title {
            color: #333333;
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 43rpx;
        }

        .item {
            display: flex;
            align-items: center;
            color: #333333;
            font-size: 32rpx;
            margin-bottom: 36rpx;

            .val {
                /*width: 820rpx;*/
                flex: 1;
                text-align: right;
                word-break: break-all;
                margin-left: 20rpx;
            }
        }
    }
</style>
