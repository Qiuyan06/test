<template>
    <view class="add-equipment-step3">
        <view class="top">
            <u-image width="347rpx" height="295rpx" src="https://iotapp.prod.ilabeco.com/download/iot/common/success.png">
                <u-loading slot="loading"></u-loading>
            </u-image>
            <view class="info">
                <view class="content">
                    <view class="info-item">
                        <text class="label">设备类型</text>
                        <text class="val">{{instruType|typeFilter}}</text>
                    </view>
                    <view class="info-item">
                        <text class="label">设备编号</text>
                        <text class="val">{{instruNum}}</text>
                    </view>
                    <view class="info-item">
                        <text class="label">仪器编号</text>
                        <text class="val">{{equipNum}}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="imagesShow">
            <view class="image-box">
                <u-image width="198rpx" height="198rpx" :src="instruType | imgFilter">
                    <u-loading slot="loading"></u-loading>
                </u-image>
            </view>
            <text class="iconfont">&#xe664;</text>
            <view class="image-box">
                <u-image width="198rpx" height="198rpx" :src="instruImg">
                    <u-loading slot="loading"></u-loading>
                </u-image>
            </view>
        </view>
        <view class="footer-btn">
            <u-button type="primary" shape="circle" :custom-style="{width: '336rpx', height: '88rpx', fontSize: '34rpx'}" :plain="true" @click="goHome">返回首页</u-button>
            <u-button type="primary" shape="circle" :custom-style="{width: '336rpx', height: '88rpx', fontSize: '34rpx'}" @click="add">继续添加</u-button>
        </view>
    </view>
</template>
<script>
    export default {
        data(){
            return {
                instruType:null,
                equipNum:'',
                instruNum:'',
                equipImg:'',
                instruImg:''
            }
        },
        filters: {
            typeFilter(val = 0) {
                return ['云盒子', '仪器猫', '仪器猫伴侣'][val - 1]
            },
            imgFilter(val = 1) {
                return [
                    'https://iotapp.prod.ilabeco.com/download/intelligent-terminal/detail/goodsDetailImg/yhz.png',
                    'https://iotapp.prod.ilabeco.com/download/intelligent-terminal/detail/goodsDetailImg/zndyglzzed.png',
                    'https://iotapp.prod.ilabeco.com/download/intelligent-terminal/detail/goodsDetailImg/znsjglzd.jpg'][val - 1]
            },
        },
        methods: {
            goHome() {
                this.$u.vuex(`s_bus.refresh`, true)
                uni.switchTab({
                    url: '/pages/index/index'
                });
            },
            add() {
                uni.navigateTo({
                    url: '/pages/index/pages/select-equip/index'
                })
            }
        },
        onLoad(data){
            this.instruType = data.instruType
            this.equipNum = data.equipNum
            this.instruNum = data.instruNum
            this.equipImg = data.equipImg
            this.instruImg = data.instruImg
        }
    }
</script>
<style lang="scss" scoped>
    .top {
        background-color: #3978F7;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 57rpx;

        .info {
            width: 714rpx;
            margin: 40rpx auto 0;
            background-color: #FFFFFF;
            border-top-left-radius: 24rpx;
            border-top-right-radius: 24rpx;
            padding: 37rpx 30rpx 0;

            .content {
                border-bottom: 1rpx solid #D8D8D8;
                padding-bottom: 10rpx;

                .info-item {
                    display: flex;
                    align-items: center;
                    font-size: 32rpx;
                    color: #111737;
                    margin-bottom: 20rpx;

                    .label {
                        margin-right: 20rpx;
                    }

                    .val {
                        /*width: 820rpx;*/
                        flex: 1;
                        text-align: right;
                        word-break: break-all;
                        width: 75%;
                    }
                }
            }
        }
    }

    .imagesShow {
        width: 714rpx;
        background-color: #FFFFFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 65rpx;
        border-bottom-left-radius: 24rpx;
        border-bottom-right-radius: 24rpx;
        margin: auto;

        .image-box {
            width: 198rpx;
            height: 198rpx;
            border-radius: 8rpx;
            border: 1rpx solid #E3E5EB;
            overflow: hidden;
        }

        .iconfont {
            color: #646986;
            font-size: 60rpx;
        }
    }

    .footer-btn {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        padding: 56rpx 0;
    }
</style>
