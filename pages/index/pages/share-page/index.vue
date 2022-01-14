<template>
    <view class="share-page">
        <view class="share-item" :class="{active: type === 0}" @click="changeType(0)">
            <view class="icon type1">
                <text class="iconfont">&#xe654;</text>
            </view>
            <view class="mian">
                <view class="title">
                    <text>管理员</text>
                </view>
                <view class="desc">
                    <text>新增、删除、修改、查看 | 控制开关</text>
                </view>
            </view>
            <view class="select-box" :class="{active: type === 0}">
                <u-icon name="checkmark" color="#ffffff" size="24"></u-icon>
            </view>
        </view>
        <view class="share-item" :class="{active: type === 1}" @click="changeType(1)">
            <view class="icon type2">
                <text class="iconfont">&#xe652;</text>
            </view>
            <view class="mian">
                <view class="title">
                    <text>编辑者</text>
                </view>
                <view class="desc">
                    <text>新增、删除、修改、查看</text>
                </view>
            </view>
            <view class="select-box" :class="{active: type === 1}">
                <u-icon name="checkmark" color="#ffffff" size="24"></u-icon>
            </view>
        </view>
        <view class="share-item" :class="{active: type === 2}" @click="changeType(2)">
            <view class="icon type3">
                <text class="iconfont">&#xe653;</text>
            </view>
            <view class="mian">
                <view class="title">
                    <text>查看者</text>
                </view>
                <view class="desc">
                    <text>仅查看权限</text>
                </view>
            </view>
            <view class="select-box" :class="{active: type === 2}">
                <u-icon name="checkmark" color="#ffffff" size="24"></u-icon>
            </view>
        </view>
        <view class="footer-btn">
            <u-button type="primary" shape="circle" :plain="true" :custom-style="{width: '336rpx', height: '88rpx', fontSize: '34rpx'}" @click="toShareCode(1)">单人邀请</u-button>
            <u-button type="primary" shape="circle" :custom-style="{width: '336rpx', height: '88rpx', fontSize: '34rpx'}" @click="toShareCode(2)">多人邀请</u-button>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                type: 0, // 权限 0：管理员 1：编辑者 2：查看者
                permissionIds: '', // 分享设备的id ，号分割
            }
        },
        methods: {
            changeType(type) {
                this.type = type
            },
            toShareCode(sel = 1) {
                uni.navigateTo({
                    url: `/pages/index/pages/share-page/pages/share-code/index?permissionIds=${this.permissionIds}&roleId=${this.type + 1}&sel=${sel}`
                });
            }
        },
        onLoad(data) {
            this.permissionIds = data.permissionIds || ''
        }
    }
</script>
<style lang="scss" scoped>
    .share-page {
        padding: 18rpx;

        .share-item {
            display: flex;
            align-items: center;
            background-color: #FFFFFF;
            box-shadow: 0 4rpx 12rpx 0 rgba(220, 220, 220, 0.5);
            border-radius: 24rpx;
            padding: 40rpx 30rpx;
            margin-bottom: 26rpx;

            &.active {
                border: 1rpx solid #2C72F9;
            }

            .icon {
                width: 80rpx;
                height: 80rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 32rpx;
                border-radius: 50%;

                .iconfont {
                    font-size: 70rpx;
                }

                &.type1 {
                    background-color: #FFE6E8;

                    .iconfont {
                        color: #FF3D3D;
                    }
                }

                &.type2 {
                    background-color: #E6EDFA;

                    .iconfont {
                        color: #2C72F9;
                    }
                }

                &.type3 {
                    background-color: #E6FFE6;

                    .iconfont {
                        color: #31CC31;
                    }
                }
            }

            .mian {
                flex: 1;

                .title {
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #000000;
                    margin-bottom: 16rpx;
                }

                .desc {
                    font-size: 24rpx;
                    color: #111737;
                    opacity: 0.5;
                }
            }

            .select-box {
                width: 37rpx;
                height: 37rpx;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 32rpx;
                border: 1px solid #BDC3CF;

                &.active {
                    border: none;
                    background-color: #2C72F9;
                }
            }
        }

        .footer-btn {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 34rpx 0;
        }
    }
</style>
