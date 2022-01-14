<template>
    <u-popup v-model="searchShow" mode="right" width="90%" :closeable="true" :mask-close-able="true" class="searchBox">
        <view class="headTitle">筛选搜索</view>
        <u-form-item prop="time">
            <view class="searchItem">
                <view class="title">故障时间</view>
                <view class="wrap">
                    <view class="wrap_input" @click="timeShow = true">
                        <text class="val" :class="time?'selected':''">
                            {{time || '请选择时间'}}
                        </text>
                    </view>
                    <text class="iconfont icon" @click="timeShow = true">&#xe642;</text>
                </view>
            </view>
        </u-form-item>
        <u-form-item prop="keyword">
            <view class="searchItem">
                <view class="title">故障内容</view>
                <view class="wrap">
                    <view class="wrap_input">
                        <u-input v-model="keyword" placeholder="输入预警内容" />
                    </view>
                </view>
            </view>
        </u-form-item>
        <u-form-item prop="status">
            <view class="searchItem">
                <view class="title">状态</view>
                <view class="wrap wrap2">
                    <u-tag
                            v-for="item in serviceStatus"
                            :text="item.name"
                            shape="square"
                            :closeable="false"
                            :mode="status === item.value ? 'dark' : 'plain'" @click="handleTypeClick(item.value)"
                    />
                </view>
            </view>

        </u-form-item>
        <u-picker v-model="timeShow" mode="time" :safe-area-inset-bottom="true" :params="timeParams" @confirm="timeConfirm"></u-picker>
        <view class="footer-wrap">
            <view class="footer-btn">
                <u-button shape="circle" class="reset-btn" @click="handleReset">重置</u-button>
                <u-button type="primary" shape="circle" class="search-btn"  @click="handleSearch">筛选搜索</u-button>
            </view>
        </view>

    </u-popup>
</template>

<script>
    import {serviceStatus} from '@/utils/const'
    export default {
        data(){
            return {
                serviceStatus,
                searchShow:false,
                timeShow: false,
                timeParams: {
                    year: true,
                    month: true,
                    day: true,
                    hour: true,
                    minute: true,
                    second: false
                },
                status:null,
                keyword:null,
                time:null
            }
        },
        methods:{
            show(){
                this.searchShow = true
            },
            close(){
                this.searchShow = false
            },
            timeConfirm(data) {
                this.time = `${data.year}-${data.month}-${data.day} ${data.hour}:${data.minute}:00`
            },
            handleTypeClick(type) {
                this.status = type
            },
            resetData(){
                this.status=null
                this.keyword=null
                this.time=null
            },
            // 筛选搜索
            handleSearch(){
                this.$emit('change',{
                    status:this.status,
                    keyword:this.keyword,
                    time:this.time
                })
                this.close()
            },
            // 重置搜索
            handleReset(){
                this.resetData()
                this.$emit('change',{
                    status:this.status,
                    keyword:this.keyword,
                    time:this.time
                })
                this.close()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .searchBox{
        /deep/ .u-close--top-right{
            top: 70rpx;
            right: 30rpx;
            .u-iconfont{
                color: #111111 !important;
            }
        }
        .headTitle{
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
                &.wrap2{
                    display: block;
                    margin-top: 20rpx;
                }
                .u-tag {
                    width: 23%;
                    margin-top: 26rpx;
                    margin-right: 2%;
                    text-align: center;
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

        .footer-wrap{
            position: fixed;
            width: 100%;
            bottom: 80rpx;
        }
        .footer-btn{
            padding:0 25rpx;
            font-size: 32rpx;
            .search-btn{
                float: right;
                width: 45%;
                height: 88rpx;
            }
            .reset-btn{
                float: left;
                width: 45%;
                height: 88rpx;
            }
        }
    }
</style>
