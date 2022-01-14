<template>
    <view class="add-equipment-step2">
        <view class="form-box">
            <view class="form-title">仪器信息</view>
            <view class="form-item">
                <text class="label">名称</text>
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
            <view class="form-item">
                <text class="label">仪器编号</text>
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
            <view class="form-item">
                <text class="label">品牌</text>
                <view class="mian" @click="toSelectPage('brand', 'brand', 'model')">
                    <text class="val" :class="{full: brand}">{{brand ? (brand.name || '') : '请选择'}}</text>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">型号</text>
                <view class="mian" @click="toSelectPage('model', 'model')">
                    <text class="val" :class="{full: model}">{{model ? (model.modelName || '') : '请选择'}}</text>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">分类</text>
                <view class="mian" @click="toSelectPage('classify', 'classify')">
                    <text class="val" :class="{full: classify}">{{classify ? (classify.cname || '') : '请选择'}}</text>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">金额</text>
                <view class="mian">
                    <u-input
                            v-model="purchaseAmount"
                            type="number"
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
                <text class="label">采购时间</text>
                <view class="mian" @click="showTime">
                    <text class="val" :class="{full: purchaseTime}">{{purchaseTime || '(非必填) 请选择'}}</text>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">放置地点</text>
                <view class="mian">
                    <u-input
                        v-model="address"
                        input-align="right"
                        placeholder="请输入"
                        height="94" style="width: 100%"
                        placeholder-style="color: '#999999'"
                        :custom-style="{fontSize: '32rpx'}"
                    />
                </view>
            </view>
            <view class="form-item">
                <text class="label">实验室名称</text>
                <view class="mian" @click="toSelectPage('laboratory', 'laboratory')">
                    <text class="val" :class="{full: laboratory}">{{laboratory ? (laboratory.name || '') : '(非必选) 请选择'}}</text>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">房间名称</text>
                <view class="mian" @click="SelectRoom">
                    <text class="val" :class="{full: room}">{{room ? (room.name || '') : '(非必选) 请选择'}}</text>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">所属机构</text>
                <view class="mian">
                    <text class="val" :class="{full: laboratory}">{{laboratory ? (laboratory.deptName || '') : '未选择实验室'}}</text>
                </view>
            </view>
            <view class="form-item">
                <text class="label">负责人</text>
                <view class="mian">
                    <u-input
                        v-model="devEquipUser"
                        input-align="right"
                        placeholder="请输入"
                        height="94" style="width: 100%"
                        placeholder-style="color: '#999999'"
                        :custom-style="{fontSize: '32rpx'}"
                    />
                </view>
            </view>
        </view>
        <view class="form-box">
            <view class="form-item  form-item2">
                <text class="label">添加图片</text>
                <view class="mian" @click="chooseImage">
                    <template v-if="img||tempFilePath">
                        <u-image width="180rpx" height="180rpx" border-radius="12" :src="img||tempFilePath">
                            <u-loading slot="loading"></u-loading>
                        </u-image>
                    </template>
                    <template v-else>
                        <text class="val">未上传</text>
                        <u-icon name="photo" color="#3D7FFF" size="38"></u-icon>
                    </template>
                </view>
            </view>
        </view>
        <view class="footer-btn">
            <u-button type="primary" shape="circle" :custom-style="{width: '90%', height: '88rpx', fontSize: '34rpx'}" @click="navigateToLastStep">保存</u-button>
        </view>
        <u-picker v-model="pickerTimeShow" mode="time" :safe-area-inset-bottom="true" :params="pickerTimeParams" @confirm="pickerTimeConfirm"></u-picker>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                pickerTimeShow: false,
                pickerTimeParams: {
                    year: true,
                    month: true,
                    day: true,
                },
                equipId:null,
                instruName: '', // 仪器名称
                instruNum: '', // 仪器编号
                purchaseAmount: '', // 金额
                purchaseTime: '', // 采购时间
                address: '', // 放置地点
                devEquipUser: '', // 负责人
                brand: null, // 品牌
                model: null, // 型号
                classify: null, // 分类
                laboratory: null, // 实验室
                room: null, // 房间
                tempFilePath: null, // 图片
                img:null,
            }
        },
        methods: {
            showTime(){
                this.pickerTimeShow = true
            },
            pickerTimeConfirm(data) {
                this.purchaseTime = `${data.year}-${data.month}-${data.day}`// ${data.hour}:${data.minute}:00`
            },
             // 完成新增仪器
            navigateToLastStep() {
                if (this.isLock)return
                if(!this.isCheck())return

                this.uploadImage()
            },
            // 上传图片
            uploadImage() {
                this.isLock = true
                if(this.tempFilePath){
                    this.$uploadFile(this.tempFilePath).then((res) => {
                        this.addEquip(res.data)
                    }).catch(() => {
                        this.isLock = false
                    })
                }else{
                    this.addEquip(this.img)
                }
            },
            // 新增仪器
            addEquip(img = '') {
                const par = {}
                par.parameter = {
                    userId:this.s_userInfo.appUserInfo.userId,
                    userName:this.s_userInfo.appUserInfo.userName,
                    dbName:'iot',
                    instruName: this.instruName,
                    instruNum: this.instruNum,
                    bid: this.brand.id,
                    modelId: this.model.modelId,
                    cid: this.classify.id,
                    address: this.address,
                    devEquipUser: this.devEquipUser,
                    equipId:this.equipId,
                    img
                }
                par.parameter.equipAmount = {}
                if (this.purchaseAmount && this.$u.test.amount(this.purchaseAmount)) {
                    par.parameter.equipAmount = {
                        ...par.parameter.equipAmount,
                        purchaseAmount: this.purchaseAmount*100
                    }
                }
                if (this.purchaseTime) {
                    par.parameter.equipAmount = {
                        ...par.parameter.equipAmount,
                        purchaseTime: this.purchaseTime
                    }
                }


                if (this.room) {
                    par.parameter.roomId = this.room.id
                }

                console.log(par)

                this.$u.api.equipmentApi.addEquipWND(par).then((res) => {
                    const url = '/pages/index/pages/add-equipment/pages/add-equipment-no-iot-success/index'
                    const params = `?equipNum=${res.instruNo}&instruImg=${res.img}`
                    uni.redirectTo({
                        url: `${url}${params}`
                    })
                }).finally(() => {
                    this.isLock = false
                })
            },
            // 校验表单
            isCheck() {
                if (!this.instruName) {
                    uni.showToast({
                        title: '请输入仪器名称',
                        icon: 'none'
                    });

                    return  false
                }

                if (!this.instruNum) {
                    uni.showToast({
                        title: '请输入仪器编号',
                        icon: 'none'
                    });

                    return  false
                }

                if (!this.brand) {
                    uni.showToast({
                        title: '请选择品牌',
                        icon: 'none'
                    });

                    return  false
                }

                if (!this.model || !this.model.modelId) {
                    uni.showToast({
                        title: '请选择型号',
                        icon: 'none'
                    });

                    return  false
                }

                if (!this.classify) {
                    uni.showToast({
                        title: '请选择分类',
                        icon: 'none'
                    });

                    return  false
                }

                if (this.purchaseAmount && !this.$u.test.amount(this.purchaseAmount)) {
                    uni.showToast({
                        title: '请输入正确的金额',
                        icon: 'none'
                    });

                    return  false
                }

                if (!this.address) {
                    uni.showToast({
                        title: '请输入放置地点',
                        icon: 'none'
                    });

                    return  false
                }

                if (!this.devEquipUser) {
                    uni.showToast({
                        title: '请输入负责人',
                        icon: 'none'
                    });

                    return  false
                }

                if (!this.tempFilePath&&!this.img) {
                    uni.showToast({
                        title: '请选择图片',
                        icon: 'none'
                    });

                    return  false
                }


                return true
            },
            // 跳转至列表页面选择房间
            SelectRoom() {
                if (!this.laboratory) {
                    uni.showToast({
                        title: '请先选择实验室',
                        icon: 'none'
                    });

                    return
                }

                this.toSelectPage('room', 'room&labId=' + this.laboratory.id)
            },
            // 跳转至列表页面选择品牌、分类、型号、实验室
            toSelectPage(type = '', key = '',key2='') {
                let url = `/pages/select-page/pages/${type}/index`
                let params = `?key=${key}`
                if(key2)params=`${params}&key2=${key2}`
                if(type==='model'){
                    const brand = this.brand
                    params=`${params}&brand=${brand?brand.id:''}`
                }
                uni.navigateTo({url: `${url}${params}`})
            },
            chooseImage() {
                uni.chooseImage({
                    count: 1,
                    success: (res) => {
                        const tempFilePaths = res.tempFilePaths

                        if (tempFilePaths && Array.isArray(tempFilePaths) && tempFilePaths.length > 0) {
                            this.tempFilePath = tempFilePaths[0]
                            this.img = null
                        }
                    }
                });
            },
            // 选择仪器、仪器品牌、选择仪器型号、选择仪器分类、选择实验室、选择房间
            initData() {
                if (this.s_bus.brand) {
                    this.brand = this.s_bus.brand
                    this.$u.vuex('s_bus.brand', null)
                }
                if (this.s_bus.model) {
                    this.model = this.s_bus.model
                    this.$u.vuex('s_bus.model', null)
                }
                if (this.s_bus.classify) {
                    this.classify = this.s_bus.classify
                    this.$u.vuex('s_bus.classify', null)
                }
                if (this.s_bus.laboratory) {
                    this.laboratory = this.s_bus.laboratory
                    this.$u.vuex('s_bus.laboratory', null)
                }
                if (this.s_bus.room) {
                    this.room = this.s_bus.room
                    this.$u.vuex('s_bus.room', null)
                }
            }
        },
        onShow() {
            this.initData()
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

    .footer-btn {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        padding: 30rpx 0 68rpx 0;
    }
</style>
