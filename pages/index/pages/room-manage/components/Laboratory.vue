<template>
    <view class="Laboratory" :class="{noBool: !bool.val}">
        <view class="state" :class="{bool: bool.val}">
            <text>{{bool.name}}</text>
        </view>
        <view class="lab-checkbox">
            <u-checkbox v-if="flag" v-model="comData.checked" :name="comData.id" label-size="0" shape="circle"></u-checkbox>
        </view>
        <view class="content" @click="toRoom">
            <view class="title">
                <text class="name">{{comData.name || ''}}</text>
                <text class="sub-name" v-if="comData.labName">{{comData.labName || ''}}</text>
            </view>
            <view class="statistics">
                <view class="statistics-item">
                    <text class="statistics-label">全部仪器</text>
                    <text>{{comData.allEquipCount || 0}}</text>
                </view>
                <view class="statistics-item">
                    <view class="dian"></view>
                    <text class="statistics-label">运行</text>
                    <text>{{comData.runEquipCount || 0}}</text>
                </view>
                <view class="statistics-item">
                    <view class="dian" style="background-color: #52CCA3"></view>
                    <text class="statistics-label">待机</text>
                    <text>{{comData.waitEquipCount || 0}}</text>
                </view>
<!--                <template v-if="bool.val">-->
                    <view class="statistics-item">
                        <view class="dian" style="background-color: #F0A232"></view>
                        <text class="statistics-label">离线</text>
                        <text>{{comData.offlineCount || 0}}</text>
                    </view>
                    <view class="statistics-item">
                        <view class="dian" style="background-color: #646986"></view>
                        <text class="statistics-label">关机</text>
                        <text>{{comData.offEquipCount || 0}}</text>
                    </view>
<!--                </template>-->
<!--                <template v-else>-->
                    <view class="statistics-item">
                        <view class="dian" style="background-color: #EA1141"></view>
                        <text class="statistics-label">报警</text>
                        <text>{{comData.warningEquipCount || 0}}</text>
                    </view>
<!--                </template>-->
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
            flag: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            bool() {
                const bool = {
                    name: '异常',
                    val: false
                }

                if (this.comData.bool) {
                    bool.name = '正常'
                    bool.val = true
                }

                return bool
            }
        },
        methods: {
            toRoom() {
                uni.navigateTo({
                    url: '/pages/index/pages/room/index?roomId=' + this.comData.id
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .Laboratory {
        position: relative;
        padding: 30rpx 0 24rpx;
        background-color: #FFFFFF;
        border-radius: 24rpx;
        overflow: hidden;
        margin-bottom: 18rpx;
        display: flex;

        .lab-checkbox{
            /deep/ .u-checkbox{
                margin: 20rpx 0 0 30rpx;
                max-width: 40rpx;
            }
        }

        .content{
            flex: 1;
            /*margin-left: 18rpx;*/
        }

        &.noBool {
            border: 2rpx solid #EA1141;
        }

        .state {
            position: absolute;
            top: 0;
            right: 0;
            background-color: #FBE7E7;
            font-size: 24rpx;
            color: #EA1141;
            border-radius: 0 22rpx 0 100rpx;
            padding: 11rpx 22rpx 11rpx 30rpx;

            &.bool {
                background-color: #E7FBED;
                color: #2EC33D;
            }
        }

        .title {
            display: flex;
            align-items: center;
            padding-right: 110rpx;
            padding-left: 22rpx;
            font-size: 28rpx;
            color: #111737;
            margin-bottom: 34rpx;

            .sub-name {
                padding: 4rpx 6rpx;
                font-size: 20rpx;
                color: #3D7FFF;
                border-radius: 6rpx;
                background-color: rgba(61, 127, 255, 0.1);
                margin-left: 8rpx;
            }
        }

        .label {
            display: flex;
            flex-wrap: wrap;
            padding-left: 22rpx;

            .label-item {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                background-color: rgba(44, 114, 249, 0.1);
                border-radius: 24rpx;
                padding: 15rpx 12rpx;
                color: #0474EF;
                font-size: 16rpx;
                margin-right: 16rpx;
                margin-bottom: 24rpx;

                &.label-item0 {
                    color: #EA1141;
                    background-color: rgba(221, 15, 15, 0.1);
                }

                &.label-item1 {
                    color: #646986;
                    background-color: rgba(100, 105, 134, 0.21);
                }

                .icon-font {
                    font-size: 18rpx;
                    margin-right: 8rpx;
                }
            }
        }

        .statistics {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;

            .statistics-item {
                display: flex;
                align-items: center;
                flex-shrink: 0;
                font-size: 24rpx;
                color: rgba(17, 23, 55, 0.8);
                padding: 0 10rpx;

                .dian {
                    width: 8rpx;
                    height: 8rpx;
                    border-radius: 50%;
                    background-color: #2C72F9;
                    margin-right: 5rpx;
                    opacity: 0.8;
                }

                .statistics-label {
                    margin-right: 8rpx;
                }
            }
        }
    }
</style>
