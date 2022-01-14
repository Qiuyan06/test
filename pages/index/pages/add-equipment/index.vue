<template>
    <view class="add-equipment">
        <view class="form-box">
            <view class="form-title">{{ instruType | instruTypeFilter }}信息</view>
            <view class="form-item">
                <text class="label">设备编号</text>
                <view class="mian" @click="selectEquip">
                    <text class="val">{{equipNum || '请选择'}}</text>
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
        <AddEquipmentStep2 ref="AddEquipmentStep2" :equip-num="equipNum" :instru-type="instruType" :parent-is-check="parentIsCheck" @handleValidateCode="next" @isCheck="isCheck" />
        <!--<view class="footer-btn">
            <u-button type="primary" shape="circle" :custom-style="{width: '714rpx', height: '88rpx', fontSize: '34rpx'}" @click="next">下一步</u-button>
        </view>-->
        <!--<u-action-sheet :list="instruTypeList" v-model="instruTypeShow" :safe-area-inset-bottom="true" :cancel-btn="false" border-radius="16" @click="instruTypeChange"></u-action-sheet>-->
        <u-verification-code change-text="Xs" end-text="获取验证码" ref="uCode" @change="codeChange"></u-verification-code>
    </view>
</template>
<script>
    import AddEquipmentStep2 from './pages/add-equipment-step2/index'
    const instruTypeDefaultList = [
        { value: 1, name: '云盒子' },
        { value: 2, name: '仪器猫' },
        { value: 3, name: '仪器猫伴侣' }
    ]
    export default {
        components: {
            AddEquipmentStep2
        },
        filters: {
            phoneFilter(v) {
                if (!v) return
                return v.slice(0,4)+'****'+v.slice(8,11)
            },
            instruTypeFilter(v) {
                if (!v) return
                return instruTypeDefaultList.filter(item => item.value === v)[0].name
            }
        },
        data() {
            return {
                instruType: 0, // 仪器类型
                instruTypeList: [
                    { // 仪器类型列表
                    text: '云盒子'
                },{
                    text: '仪器猫'
                },{
                    text: '仪器猫伴侣'
                }
                ],
                current: 0,
                uselist: [
                    {
                        name: '随机码',
                        value: 1
                    }
                ],
                equipNum: '', // 设备号
                phone: '', // 手机号
                authCode: '', // 验证码
                // instruTypeShow: false,
                codeTips: '获取验证码',
                parentIsCheck: false
            }
        },
        computed: {
            instruTypeName() {
                let instruTypeName = '请选择'

                switch (this.instruType) {
                    case 1:
                        instruTypeName = '云盒子'
                        break
                    case 2:
                        instruTypeName = '仪器猫'
                        break
                    case 3:
                        instruTypeName = '仪器猫伴侣'
                        break
                }

                return instruTypeName
            },
        },
        watch: {
            instruType() {
                this.equipNum = ''
            }
        },
        methods: {
            isCheck() {
                if (!this.instruType) {
                    uni.showToast({
                        title: '请选择设备类型',
                        icon: 'none'
                    });
                    this.parentIsCheck = false
                    return false
                }

                if (!this.equipNum) {
                    uni.showToast({
                        title: '请选择设备编号',
                        icon: 'none'
                    });
                    this.parentIsCheck = false
                    return false
                }

                if (!this.authCode) {
                    uni.showToast({
                        title: this.current===0?'请输入随机码':'请输入验证码',
                        icon: 'none'
                    });
                    this.parentIsCheck = false
                    return false
                }
                this.parentIsCheck = true
                return true
            },
            // 根据仪器类型和设备编号获取有效的手机号
            getPhone(){
                this.$u.api.equipmentApi.getPhone({ parameter:{instruNum:this.equipNum,type:this.instruType} }).then(res => {
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
                })
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
            changeValidType(v) {
                this.current = v
                // const value = this.uselist.filter((item, index) => index === v)[0].value
                // console.log(typeof v)
            },
            next(cb) {
                if (this.isCheck()) {
                    // 校验随机码、手机验证码
                    const api = this.current===0? 'validRandomCode' : 'validPhoneCode'
                    let parmas = {}
                    if(this.current===0){
                        parmas = {instruNum:this.equipNum,type:this.instruType,randomCode:this.authCode}
                    }else{
                        parmas = {tellphone:this.phone,authCode:this.authCode}
                    }
                    this.$u.api.equipmentApi[api]({parameter:parmas}).then(res=>{
                        this.$u.vuex('s_addEquip', {
                            instruType: this.instruType,
                            equipNum: this.equipNum
                        })
                        if(cb)cb()
                    }).catch(e=>{
                        console.log(e)
                    })

                }
            },
            instruTypeChange (index) {
                this.instruType = index + 1
            },
            getCode() { // 获取验证码
                if(this.$refs.uCode.canGetCode) {
                    this.$refs.uCode.start();
                }
            },
            codeChange(text) {
                this.codeTips = text
            },
            // 选择设备编号
            selectEquip() {
                if (!this.instruType) {
                    uni.showToast({
                        title: '请选择仪器类型',
                        icon: 'none'
                    });

                    return
                }

                uni.navigateTo({
                    url: '/pages/select-page/pages/equip/index?key=equipNum&equipType=' + this.instruType
                })
            }
        },
        onShow() {
            if (this.s_bus && this.s_bus.equipNum) {
                this.equipNum = this.s_bus.equipNum
                this.$u.vuex('s_bus.equipNum', null)
                this.getPhone()
                this.$refs.AddEquipmentStep2 && this.$refs.AddEquipmentStep2.getDefaultDevice(this.equipNum)
            }
            this.$refs.AddEquipmentStep2 && this.$refs.AddEquipmentStep2.initData()
        },
        onLoad(data) {
            this.instruType = data && Number(data.instruType)
        }
    }
</script>
<style lang="scss" scoped>
    .form-box {
        margin: 22rpx 18rpx 22rpx;
        background-color: #FFFFFF;
        border-radius: 24rpx;
        padding: 0 24rpx;
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

            .label {
                font-size: 32rpx;
                color: #333333;
                margin-right: 24rpx;
            }

            .mian {
                /*width: 510rpx;*/
                width: 75%;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                .rightbtn {
                    width: 250rpx;
                    text-align: right;
                }
                .val {
                    text-align: right;
                    width: 500rpx;
                    word-break: break-all;
                    font-size: 32rpx;
                    color: #999999;
                    margin-right: 16rpx;

                    &.full {
                        color: #333333;
                    }
                }

                .get-code {
                    width: 200rpx;
                    text-align: center;
                    color: #2C72F9;
                    font-size: 32rpx;
                    border-left: 2rpx solid #999999;
                    margin-left: 16rpx;
                }
            }
        }
    }
</style>
