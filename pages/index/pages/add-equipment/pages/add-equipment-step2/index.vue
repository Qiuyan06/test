<template>
    <view class="add-equipment-step2">
        <view class="form-box">
            <view class="form-title">仪器信息</view>
            <view class="form-item">
                <text class="label">添加方式</text>
                <view class="mian">
                    <u-tag
                        v-for="item in typelist"
                        :text="item.name"
                        shape="square"
                        :closeable="false"
                        :mode="current === item.value ? 'dark' : 'plain'"
                        @click="changeAddType(item.value)"
                        :disabled="isDisabled&&current===0"
                    />
                </view>
            </view>
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
                        :disabled="isDisabled"
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
                        :disabled="isDisabled"
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
                <view class="mian" @click="toModelPage">
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
                            :disabled="isDisabled"
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
                        :disabled="isDisabled"
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
                        :disabled="isDisabled"
                    />
                </view>
            </view>
        </view>
        <view class="form-box" v-if="current===0&&!isDisabled">
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
        <view class="form-box" v-if="isDisabled">
            <view class="form-item form-item2">
                <text class="label">图片</text>
                <view class="mian">
                    <u-image width="180rpx" height="180rpx" border-radius="12" :src="img">
                        <u-loading slot="loading"></u-loading>
                    </u-image>
                </view>
            </view>
        </view>
        <view class="footer-btn">
<!--            <u-button type="primary" shape="circle" :custom-style="{width: '336rpx', height: '88rpx', fontSize: '34rpx'}" :plain="true" @click="navigateBack">上一步</u-button>-->
            <u-button type="primary" shape="circle" :custom-style="{width: '336rpx', height: '88rpx', fontSize: '34rpx'}" @click="navigateToStep3">确定</u-button>
        </view>
        <u-picker v-model="pickerTimeShow" mode="time" :safe-area-inset-bottom="true" :params="pickerTimeParams" @confirm="pickerTimeConfirm"></u-picker>
    </view>
</template>
<script>
    export default {
        props: {
            instruType: {
                type: [String, Number],
                default: null
            },
            equipNum: {
                type: [String, Number],
                default: null
            },
            parentIsCheck: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                pickerTimeShow: false,
                pickerTimeParams: {
                    year: true,
                    month: true,
                    day: true,
                },
                current:0,
                typelist:[
                    {
                        name: '新增仪器',
                        value: 0
                    },
                    {
                        name: '选择仪器',
                        value: 1
                    }
                ],
                instruId:null,
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
                isDisabled:false//是否禁止修改设备信息
            }
        },
        methods: {
            isCheckParent(){
                this.$emit('isCheck')
            },
            showTime(){
                if(this.isDisabled)return
                this.pickerTimeShow = true
            },
            pickerTimeConfirm(data) {
                this.purchaseTime = `${data.year}-${data.month}-${data.day}`// ${data.hour}:${data.minute}:00`
            },
            // 更改仪器新增方式
            changeAddType(v){
                this.current = v
                this.instruId = null
                this.instruName = ''
                this.instruNum = ''
                this.brand = null
                this.model = null
                this.classify = null
                this.purchaseAmount = ''
                this.purchaseTime = ''
                this.address = ''
                this.devEquipUser = ''
                this.img = null
                this.isDisabled=false
                if(v===1){
                    if (!this.equipNum) {
                        uni.showToast({
                            title: '请先选择设备编号',
                            icon: 'none'
                        })
                        this.current = 0
                        return
                    }
                    this.isDisabled=true
                    this.toSelectPage('unbindEquip','equipId')
                }
            },
            // 根据设备编号查询仪器信息
            getDefaultDevice(equipNum){
                if(!equipNum)return
                const params = {type:this.instruType,instruNum:equipNum}
                this.$u.api.equipmentApi.getDeviceByInstruNum({parameter:params}).then((res) => {
                    if(res){
                        this.instruName = res.instruName
                        this.instruNum = res.instruNo
                        this.brand = {name:res.brandName, id:res.brandCode}
                        this.model = {modelName:res.modelName, modelId:res.modelId}
                        this.classify = {cname:res.cateName, id:res.cateCode}
                        this.purchaseAmount = res.purchaseAmount/100
                        this.purchaseTime = res.purchaseTime
                        this.address = res.address
                        this.devEquipUser = res.deuUserName
                        this.img = res.img
                        this.instruId = res.instruId
                        this.isDisabled=true
                    }else{
                        this.getDefaultDevicaData()
                    }
                }).catch(e=>{
                    console.log(e)
                    this.getDefaultDevicaData()
                })
            },
            getDefaultDevicaData(){
                this.isDisabled=false
                this.instruName = ''
                this.instruNum = ''
                this.brand = null
                this.model = null
                this.classify = null
                this.purchaseAmount = ''
                this.purchaseTime = ''
                this.address = ''
                this.devEquipUser = ''
                this.img = null
                this.instruId = null
            },
             // 完成新增仪器
            navigateToStep3() {
                if (this.isLock)return
                this.isCheckParent()
                this.$nextTick(() => {
                  if (!this.parentIsCheck) return
                  if(this.current===0&&!this.isCheck())return
                  this.uploadImage()
                })
            },
            // 上传图片
            uploadImage() {
                if(this.current===0){
                    if(this.tempFilePath){
                        this.$uploadFile(this.tempFilePath).then((res) => {
                            this.addEquip(res.data)
                        })
                    }else{
                        this.addEquip(this.img)
                    }

                }else{
                    this.addEquip()
                }
            },
            // 新增仪器
            addEquip(img = '') {
                this.$emit('handleValidateCode',()=>{
                    this.isLock = true
                    const par = {}
                    par.parameter = !this.isDisabled ? {
                        instruType: this.instruType,
                        equipNum: this.equipNum,
                        instruName: this.instruName,
                        instruNum: this.instruNum,
                        bid: this.brand.id,
                        modelId: this.model.modelId,
                        cid: this.classify.id,
                        address: this.address,
                        devEquipUser: this.devEquipUser,
                        equipId:this.instruId,
                        img
                    }:{
                        instruType: this.instruType,
                        equipNum: this.equipNum,
                        equipId:this.instruId,
                        instruNum:this.instruNum,
                        img:this.img,
                        equipId:this.instruId,
                    }
                    par.parameter.equipAmount = {}
                    if (this.current===0 && this.purchaseAmount && this.$u.test.amount(this.purchaseAmount)) {
                        par.parameter.equipAmount = {
                            ...par.parameter.equipAmount,
                            purchaseAmount: this.purchaseAmount*100
                        }
                    }
                    if (this.current===0 && this.purchaseTime) {
                        par.parameter.equipAmount = {
                            ...par.parameter.equipAmount,
                            purchaseTime: this.purchaseTime
                        }
                    }


                    if (this.room) {
                        par.parameter.roomId = this.room.id
                    }

                    this.$u.api.equipmentApi.addEquip(par).then((res) => {
                        // this.$u.vuex('s_addEquip', null)
                        const url = '/pages/index/pages/add-equipment/pages/add-equipment-step3/index'
                        const params = `?instruType=${res.instruType}&equipNum=${res.instruNo}&instruNum=${res.instruNum}&equipImg=${res.equipImg}&instruImg=${res.img}`
                        uni.redirectTo({
                            url: `${url}${params}`
                        })
                    }).finally(() => {
                        this.isLock = false
                    })
                })

            },
            // 校验表单
            isCheck() {
                if(this.current===0&&!this.isDisabled){
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

                    if (!this.model||!this.model.modelId) {
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
                }else{
                    if(!this.instruName){
                        uni.showToast({
                            title: '请选择仪器',
                            icon: 'none'
                        });

                        return  false
                    }
                }


                return true
            },
            // 上一步
            navigateBack() {
                uni.navigateBack();
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
            // 跳转至列表页面选择仪器、品牌、分类、型号、实验室
            toSelectPage(type = '', key = '',key2='') {
                if(this.isDisabled && (type==='brand'||type==='model'||type==='classify'))return
                let url = `/pages/select-page/pages/${type}/index`
                let params = `?key=${key}`
                if(key2)params=`${params}&key2=${key2}`
                if(type==='model'){
                    const brand = this.brand
                    params=`${params}&brand=${brand?brand.id:''}`
                }
                if(type==='unbindEquip'){
                    params=`${params}&equipType=${this.instruType}&instruNum=${this.equipNum}`
                }
                uni.navigateTo({url: `${url}${params}`})
            },
            toModelPage(){
                if(this.isDisabled)return
                const param = this.brand && this.brand.id ?`&brand=${this.brand.id}`:''
                uni.navigateTo({
                    url: '/pages/select-page/pages/model/index?key=model'+param
                })
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
                if(this.s_bus.equipId){ // 选择仪器--回显仪器信息
                    uni.showLoading()
                    this.$u.api.equipmentApi.getUnbindDeviceInfo({"parameter":{instruId:this.s_bus.equipId}}).then((res) => {
                        uni.hideLoading()
                        this.instruId = res.data.instruId
                        this.instruName = res.data.instruName
                        this.instruNum = res.data.instruNo
                        this.brand = {name:res.data.brandName, id:res.data.brandCode}
                        this.model = {modelName:res.data.modelName, modelId:res.data.modelId}
                        this.classify = {cname:res.data.cateName, id:res.data.cateCode}
                        this.purchaseAmount = res.data.purchaseAmount/100
                        this.purchaseTime = res.data.purchaseTime
                        this.address = res.data.address
                        this.devEquipUser = res.data.deuUserName
                        this.img = res.data.img
                        // console.log('选择仪器--回显仪器信息',this.instruName,res.data)
                        this.$forceUpdate();
                    }).finally(()=>{
                        this.$u.vuex('s_bus.equipId', null)
                    })
                }
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
        onLoad(){
        },
        onShow() {
            /*if (!this.s_addEquip) {
                uni.redirectTo({
                    url: '/pages/index/pages/add-equipment/index'
                });
            }*/
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
