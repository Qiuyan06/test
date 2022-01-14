<template>
    <u-popup v-model="searchShow" mode="right" width="90%" :closeable="true" :mask-close-able="true" class="searchBox">
        <view class="headTitle">筛选搜索</view>
        <u-form-item prop="time">
            <view class="searchItem">
                <view class="title">时间</view>
                <view class="wrap">
                    <view class="wrap_input" @click="pickerTimeShow = true">
                        <text class="val" :class="time?'selected':''">
                            {{time || '请选择时间'}}
                        </text>
                    </view>
                    <text class="iconfont icon" @click="pickerTimeShow = true">&#xe642;</text>
                </view>
            </view>
        </u-form-item>
        <u-calendar v-model="pickerTimeShow" mode="range" @change="pickerTimeConfirm"></u-calendar>
        <view class="footer-wrap">
            <view class="footer-btn">
                <u-button shape="circle" class="reset-btn" @click="handleReset">重置</u-button>
                <u-button type="primary" shape="circle" class="search-btn" @click="handleSearch">筛选搜索</u-button>
            </view>
        </view>
    </u-popup>
</template>

<script>
    export default {
        data() {
            return {
                searchShow: false,
                pickerTimeShow: false,
                timeParams: {
                    year: true,
                    month: true,
                    day: true,
                    hour: true,
                    minute: true,
                    second: false
                },
                time: null,
            }
        },
        methods: {
            // 显示弹框
            show(time) {
                this.searchShow = true
                // console.log(time)
                this.time = time
            },
            // 关闭弹框
            close() {
                this.searchShow = false
            },
            // 选择预警时间
            pickerTimeConfirm(time) {
                this.time = `${time.startDate}至${time.endDate}`
                const startTimeStamp=new Date(time.startDate).getTime(),endTimeStamp=new Date(time.endDate).getTime()
                if(endTimeStamp-startTimeStamp>2592000000){
                    uni.showToast({
                        title: '最多支持查询31天的数据',
                        icon: 'none'
                    });
                    this.pickerTimeShow = true
                    return false
                }
                this.$emit('change', this.time)
            },

            // 重置数据
            resetData() {
                this.time = null
            },
            // 筛选搜索
            handleSearch() {
                this.$emit('change', this.time)
                this.close()
            },
            // 重置搜索
            handleReset() {
                this.resetData()
                this.$emit('change', null)
                this.close()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .searchBox {
        /deep/ .u-close--top-right {
            top: 70rpx;
            right: 30rpx;

            .u-iconfont {
                color: #111111 !important;
            }
        }

        /deep/ .u-form-item {
            margin-bottom: 48rpx;
        }

        /deep/ .u-form-item__message {
            padding-left: 20rpx !important;
        }

        .headTitle {
            text-align: center;
            margin: 56rpx 0 56rpx 0;
            height: 48rpx;
            font-size: 34rpx;
            font-weight: 500;
            color: #111111;
            line-height: 48rpx;
        }

        .searchItem {
            width: 100%;
            font-size: 32rpx;
            font-weight: 400;
            padding: 0rpx 20rpx;
            background-color: #fff;
            color: #333333;

            .title {
                width: 100%;
            }

            .wrap {
                display: flex;
                align-items: center;

                &.wrap2 {
                    display: block;
                    margin-top: 20rpx;
                }

                .u-tag {
                    margin-right: 20rpx;
                    margin-bottom: 10rpx;
                }

                .unit {
                    margin: 26rpx 0 0 20rpx;
                }

                .u-radio-group {
                    padding: 28rpx 0 25rpx 0;
                }

                .wrap_input {
                    flex: 1;
                    padding-top: 26rpx;

                    .val {
                        font-size: 30rpx;
                        color: #c0c4cc;
                        margin-right: 14rpx;

                        &.selected {
                            color: #333;
                        }
                    }
                }

                .icon {
                    color: #CCCCCC;
                    margin-left: 10rpx;
                }
            }
        }

        /*.searchItem {
            font-size: 32rpx;
            font-weight: 400;
            padding: 0rpx 20rpx;
            margin-bottom: 48rpx;
            background-color: #fff;
            color: #333333;
            border-bottom: 2rpx solid #f5f5f5;
            .title{
                width: 100%;
            }
            .wrap {
                display: flex;
                align-items: center;
                .u-radio-group{
                    padding: 28rpx 0 25rpx 0;
                }
                .wrap_input {
                    flex: 1;
                    padding: 26rpx 0 23rpx 0;
                    .val {
                        font-size: 30rpx;
                        color: #c0c4cc;
                        margin-right: 14rpx;
                        &.selected{
                            color:#333;
                        }
                    }
                }
                .icon {
                    color: #CCCCCC;
                    margin-left: 10rpx;
                }
            }
        }*/
        .footer-wrap {
            position: fixed;
            width: 100%;
            bottom: 80rpx;
        }

        .footer-btn {
            padding: 0 25rpx;
            font-size: 32rpx;

            .search-btn {
                float: right;
                width: 45%;
                height: 88rpx;
            }

            .reset-btn {
                float: left;
                width: 45%;
                height: 88rpx;
            }
        }
    }
</style>
