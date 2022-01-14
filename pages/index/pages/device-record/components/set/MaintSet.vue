<template>
    <u-popup v-model="setShow" mode="right" width="90%" :closeable="false" :mask-close-able="true" class="setBox">
        <view class="headTitle">
            设置
            <u-icon name="close" size="40" @click="close"></u-icon>
        </view>

        <u-form-item prop="type">
            <view class="setItem">
                <view class="title">选择类型</view>
                <view class="wrap wrap2">
                    <u-radio-group v-model="detail.type" @change="typeChange" >
                        <u-radio
                            v-for="(item,index) in typeList"
                            :name="item.value"
                        >
                            <view :class="[`icon${index+1}`]" v-html='item.icon'></view>
                            {{item.name}}
                        </u-radio>
                    </u-radio-group>
                </view>
            </view>
        </u-form-item>
        <u-form-item prop="remindType">
            <view class="setItem">
            <view class="title">提醒方式</view>
            <view class="wrap wrap2">
                <u-tag
                        v-for="item in remindTypes"
                        :text="item.name"
                        shape="square"
                        :closeable="false"
                        :mode="detail.remindType === item.value ? 'dark' : 'plain'" @click="handleTypeClick(item.value)"
                />
            </view>
        </view>
        </u-form-item>
        <u-form-item prop="remindPeriod">
            <view class="setItem">
            <view class="title">提醒周期</view>
            <view class="wrap">
                <view class="wrap_input">
                    <u-input type="number" v-model="detail.remindPeriod" placeholder="请输入数字" />
                </view>
                <text style="padding-top: 26rpx;">{{this.detail.remindType|typeFilter}}</text>
            </view>
        </view>
        </u-form-item>
        <u-form-item prop="startValue">
            <view class="setItem">
            <view class="title">起步值</view>
            <view class="wrap">
                <view class="wrap_input">
                    <u-input type="number" v-model="detail.startValue" placeholder="请输入数字" />
                </view>
                <text style="padding-top: 26rpx;">{{this.detail.remindType|typeFilter}}</text>
            </view>
        </view>
        </u-form-item>
        <view class="footer-wrap">
            <view class="footer-btn">
                <u-button shape="circle" class="reset-btn" @click="close">取消</u-button>
                <u-button type="primary" shape="circle" class="search-btn"  @click="handleSet">确认</u-button>
            </view>
        </view>
    </u-popup>
</template>

<script>
    import {remindTypes} from '@/utils/const'
    export default {
        props:{
            instruId:{
                type: String,
                required: true
            }
        },
        data(){
            return {
                isLock:false,
                setShow:false,
                detail:{
                    type:null,
                    remindType:1,
                    remindPeriod:null,
                    startValue:null
                },
                remindTypes,
                typeList:[
                    { name: '维护', value: 1,icon:'<text class="iconfont">&#xe64f;</text>' },
                    { name: '计量', value: 2,icon:'<text class="iconfont">&#xe651;</text>' },
                    // { name: '保养', value: 3,icon:'<text class="iconfont">&#xe650;</text>' },
                ]
            }
        },
        filters: {
            typeFilter(v) {
                if (v === null || v === '' || v === undefined) return ''
                return remindTypes.filter(item => item.value === Number(v))[0].unit
            }
        },
        methods:{
            show(type){
                this.setShow = true
                this.showSet(Number(type))
                this.$set(this.detail,'type',type)
            },
            close(){
                this.resetData()
                this.setShow = false
            },
            resetData(){
                this.detail={
                    type:null,
                    remindType:1,
                    remindPeriod:null,
                    startValue:null
                }
            },
            typeChange(type){
                this.resetData()
                this.showSet(type)
                this.$set(this.detail,'type',type)
            },
            handleTypeClick(type) {
                this.detail.remindType = type
            },
            isCheck(){
                if(!this.detail.type){
                    uni.showToast({
                        title: '请选择类型',
                        icon: 'none'
                    });

                    return  false
                }
                if(!this.detail.remindType){
                    uni.showToast({
                        title: '请选择提醒方式',
                        icon: 'none'
                    });

                    return  false
                }
                if(!this.detail.remindPeriod){
                    uni.showToast({
                        title: '请输入提醒周期',
                        icon: 'none'
                    });

                    return  false
                }
                if(!this.detail.startValue){
                    uni.showToast({
                        title: '请输入起步值',
                        icon: 'none'
                    });

                    return  false
                }
                return true
            },
            // 设置
            handleSet(){
                if (this.isLock || !this.isCheck()) {
                    return
                }
                this.isLock = true
                const params = {
                    instruId:this.instruId,
                    type:this.detail.type,
                    remindType:this.detail.remindType,
                    remindPeriod:this.detail.remindPeriod,
                    startValue:this.detail.startValue,
                }
                if(this.detail.id){
                    params.id = this.detail.id
                }
                this.$u.api.equipmentApi.setMaint({parameter:params}).then((res) => {
                    this.close()
                }).finally(() => {
                    this.isLock = false
                })
            },
            // 回显设置
            showSet(type){
                const params = {instruId:this.instruId, type}
                this.$u.api.equipmentApi.showMaintSet({parameter:params}).then((res) => {
                    if(res)this.detail = Object.assign({},res,{type})
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .setBox{
        .headTitle {
            text-align: center;
            margin: 56rpx 0 56rpx 0;
            height: 48rpx;
            font-size: 34rpx;
            font-weight: 500;
            color: #111111;
            line-height: 48rpx;
            .u-icon{
                position: absolute;
                top: 60rpx;
                right: 30rpx;
            }
        }
        .setItem {
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
                    width: 100%;

                    padding: 28rpx 0 25rpx 0;
                    .u-radio{
                        width: 31% !important;
                        height: 214rpx;
                        background: #FFFFFF;
                        box-shadow: 0rpx 4rpx 8rpx 0px #ADB5C4;
                        border-radius: 16rpx;
                        margin-right: 3%;
                        position: relative;
                        &:last-child{
                            margin-right: 0;
                        }
                        /deep/ .u-radio__icon-wrap--circle{
                            position: absolute;
                            width: 36rpx !important;
                            height: 36rpx !important;
                            bottom: 20rpx;
                            left: 50%;
                            margin-left: -18rpx;
                        }
                        /deep/ .u-radio__label {
                            position: absolute;
                            top: 28rpx;
                            width: 100%;
                            margin: 0;
                            text-align: center;
                            font-size: 24rpx;
                            .icon1,.icon2,.icon3{
                                font-size: 70rpx;
                                margin-bottom: 10rpx;
                            }
                            .icon1{
                                color: #2cc67b;
                            }
                            .icon2{
                                color: #2b72da;
                            }
                            .icon3{
                                color: #eba63c;
                            }
                        }
                    }
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
            .footer-btn{
                padding:0 25rpx;
                margin-bottom: 25rpx;
                font-size: 32rpx;
                uni-button{
                    margin-bottom: 45rpx;
                }
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

    }
</style>
