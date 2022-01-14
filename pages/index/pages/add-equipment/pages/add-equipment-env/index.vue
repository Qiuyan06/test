<template>
    <view class="form-box">
        <!--只能修改设备名-->

        <view class="form-item">
            <text class="label">设备编号</text>
            <view class="mian">
                <u-input
                        v-model="instruNum"
                        input-align="right"
                        placeholder="请输入"
                        height="94"
                        style="width: 100%"
                        placeholder-style="color: '#999999'"
                        :custom-style="{fontSize: '32rpx'}"
                />
            </view>
        </view>
        <!--扫一扫才显示-->
        <view class="form-item" v-if="instruType">
            <text class="label">设备类型</text>
            <view class="mian">
                <u-input
                        v-model="instruType"
                        input-align="right"
                        placeholder="请输入"
                        height="94"
                        style="width: 100%"
                        placeholder-style="color: '#999999'"
                        :custom-style="{fontSize: '32rpx'}"
                />
            </view>
        </view>
        <view class="form-item">
            <text class="label">设备名称</text>
            <view class="mian">
                <u-input
                        v-model="instruName"
                        input-align="right"
                        placeholder="请输入"
                        height="94"
                        style="width: 100%"
                        placeholder-style="color: '#999999'"
                        :custom-style="{fontSize: '32rpx'}"
                />
            </view>
        </view>
        <!--扫一扫才显示-->
        <view class="form-item" v-if="brand">
            <text class="label">品牌</text>
            <view class="mian">
                <text class="val" :class="{full: brand}">{{brand ? (brand.name || '') : '请选择'}}</text>
                <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
            </view>
        </view>
        <!--扫一扫才显示-->
        <view class="form-item" v-if="model">
            <text class="label">型号</text>
            <view class="mian">
                <text class="val" :class="{full: model}">{{model ? (model.modelName || '') : '请选择'}}</text>
                <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
            </view>
        </view>
        <view class="form-item">
            <text class="label">校验方式</text>
            <view class="mian">
                <u-subsection
                        :key="uselist.length"
                        class="rightbtn"
                        :list="uselist"
                        mode="subsection"
                        :current="current"
                        active-color="#3D7FFF"
                        height="60"
                        inactive-color="#3D7FFF"
                        button-color="#3D7FFF"
                        @change="changeValidType"
                ></u-subsection>
            </view>
        </view>
        <template v-if="current === 0">
            <view class="form-item">
                <text class="label">随机码</text>
                <view class="mian">
                    <u-input v-model="authCode" input-align="right" placeholder="请输入随机码" height="94" style="width: 100%" placeholder-style="color: '#999999'" :custom-style="{fontSize: '32rpx'}"/>
                </view>
            </view>
        </template>
        <template v-else>
            <view class="form-item">
                <text class="label">手机号</text>
                <view class="mian">
                    <text class="val">{{phone|phoneFilter}}</text>
                </view>
            </view>
            <view class="form-item">
                <text class="label">验证码</text>
                <view class="mian">
                    <u-input v-model="authCode" input-align="right" placeholder="请输入验证码" height="94" style="width: 100%" placeholder-style="color: '#999999'" :custom-style="{fontSize: '32rpx'}"/>
                    <text style="padding: 0 10rpx;">|</text><text style="color: #2C72F9" @click="sendCode">获取验证码</text>
                </view>
            </view>
        </template>
    </view>
</template>
<script>
    export default {
        data(){
            return {
                instruNum: '', // 仪器编号
                instruName: '', // 仪器名称
                instruType: null, // 仪器类型
                brand: null, // 品牌
                model: null, // 型号
                uselist: [
                    {
                        name: '随机码',
                        value: 1
                    }
                ],// 校验方式列表
                current: 0,// 当前校验方式
                phone: '', // 手机号
                authCode: '', // 验证码
                codeTips: '获取验证码',
            }
        },
        methods:{
            getDataByScan(param){
                const data = {}
                this.instruNum = data.instruNum
                this.instruType = data.instruType
                this.brand = data.brand
                this.model = data.model
                this.getPhone()
            },
            // 切换手机方式
            changeValidType(v) {
                this.current = v
            },
            // 获取是否有有效的手机号
            getPhone(){
                /*this.$u.api.equipmentApi.getPhone({ parameter:{instruNum:this.equipNum,type:this.instruType} }).then(res => {
                    this.phone = res
                    this.uselist=[{
                        name: '随机码',
                        value: 1
                    },{
                        name: '手机号',
                        value: 2
                    }]
                }).catch((e) => {
                    this.current = 0
                    this.uselist=[{
                        name: '随机码',
                        value: 1
                    }]
                })*/
            },
            // 发送手机验证码
            sendCode(){
                this.$u.api.userApi.sendEquipSms({parameter:{phone:this.phone}}).then(res => {
                    uni.showToast({
                        title: '发送成功，请留意短信',
                        icon: 'none'
                    })
                })
            },
            // 表单校验
            isCheck(){},
            // 处理提交
            handleNext(){
                if (this.isCheck()) {
                    // 校验随机码、手机验证码
                    const api = this.current===0? 'validRandomCode' : 'validPhoneCode'
                    let parmas = {}
                    if(this.current===0){
                        parmas = {/*instruNum:this.equipNum,type:this.instruType,randomCode:this.authCode*/}
                    }else{
                        parmas = {/*tellphone:this.phone,authCode:this.authCode*/}
                    }
                    this.$u.api.equipmentApi[api]({parameter:parmas}).then(res=>{
                        // 校验通过提交表单
                        this.handleSubmit()
                    }).catch(e=>{
                        console.log(e)
                    })

                }
            },
            // 提交表单
            handleSubmit(){

            }
        },
        onShow(data){
            if(data.instruNum){
                this.instruNum = data.instruNum
                this.getPhone()
            }
            if(data.qrCodeParameter)this.getDataByScan(data.qrCodeParameter)
        }
    }
</script>

<style lang="scss" scoped>
    .form-box {
        background-color: #FFFFFF;
        margin: 18rpx;
        padding: 10rpx 30rpx;
        border-radius: 24rpx;
        .form-title{
            font-size: 32rpx;
            font-weight: 600;
            color: #333333;
            line-height: 45rpx;
            padding: 24rpx 0 8rpx;
        }
        .form-item {
            display: flex;
            align-items: center;
            height: 96rpx;
            border-bottom: 2rpx solid #F5F5F5;
            &.form-item2{
                height: auto;
            }
            &:last-of-type {
                border-bottom: none;
            }

            .label {
                font-size: 32rpx;
                color: #333333;
                margin-right: 24rpx;
            }

            .mian {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .val {
                    font-size: 32rpx;
                    color: #999999;
                    margin-right: 14rpx;

                    &.full {
                        color: inherit;
                    }
                }
            }
            .u-mode-dark-primary{
                border: 1px solid #2979ff;
            }
            .u-size-default{
                border-radius: 0;
            }
        }
    }
</style>
