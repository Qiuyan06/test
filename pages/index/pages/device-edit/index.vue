<template>
    <view class="add-equipment-step2">
        <view class="form-box">
            <view class="form-title">设备信息</view>
            <view class="form-item">
                <text class="label">设备类型</text>
                <view class="mian" @click="showEquipType">
                    <text class="val" :class="{full: instruType !== 0}">{{instruTypeName}}</text>
                    <u-icon name="arrow-down" color="#999999"></u-icon>
                </view>
            </view>
            <template v-if="instruType && instruType !== 4">
                <view class="form-item">
                    <text class="label">设备编号</text>
                    <view class="mian" @click="selectEquip">
                        <text class="val">{{realEquipNum || '请选择'}}</text>
                        <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                    </view>
                </view>
                <template v-if="equipNumChange">
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
                </template>
            </template>
        </view>

        <view class="form-box">
            <view class="form-title">仪器信息</view>
            <view class="form-item">
                <text class="label">名称</text>
                <view class="mian">
                    <u-input v-model="instruName" input-align="right" placeholder="请输入" height="94" style="width: 100%" placeholder-style="color: '#999999'" :custom-style="{fontSize: '32rpx'}"/>
                </view>
            </view>
            <view class="form-item">
                <text class="label">仪器编号</text>
                <view class="mian">
                    <u-input v-model="instruNo" input-align="right" placeholder="请输入" height="94" style="width: 100%" placeholder-style="color: '#999999'" :custom-style="{fontSize: '32rpx'}"/>
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
                    <u-input v-model="purchaseAmount" type="number" input-align="right" placeholder="请输入" height="94" style="width: 100%" placeholder-style="color: '#999999'" :custom-style="{fontSize: '32rpx'}"/>
                </view>
            </view>
            <view class="form-item">
                <text class="label">采购时间</text>
                <view class="mian" @click="pickerTimeShow = true">
                    <text class="val" :class="{full: purchaseTime}">{{purchaseTime || '(非必填) 请选择'}}</text>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">放置地点</text>
                <view class="mian">
                    <u-input v-model="address" input-align="right" placeholder="请输入" height="94" style="width: 100%" placeholder-style="color: '#999999'" :custom-style="{fontSize: '32rpx'}"/>
                </view>
            </view>
            <view class="form-item">
                <text class="label">实验室名称</text>
                <view class="mian" :class="boo ? 'no-edit' : ''" @click="toSelectPage('laboratory', 'laboratory')">
                    <text class="val" :class="{full: laboratory}">{{laboratory ? (laboratory.name || '') : '(非必选) 请选择'}}</text>
                    <u-icon v-if="laboratory" name="close" color="#CCCCCC" @click.native.stop="handleClearLab"></u-icon>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">房间名称</text>
                <view class="mian" :class="boo ? 'no-edit' : ''" @click="SelectRoom">
                    <text class="val" :class="{full: room}">{{room ? (room.name || '') : '(非必选) 请选择'}}</text>
                    <u-icon v-if="room" name="close" color="#CCCCCC" @click.native.stop="handleClearRoom"></u-icon>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">所属机构</text>
                <view class="mian" :class="boo ? 'no-edit' : ''">
                    <text class="val" :class="{full: laboratory}">{{laboratory ? (laboratory.deptName || '') : '未选择实验室'}}</text>
                </view>
            </view>
            <view class="form-item">
                <text class="label">负责人</text>
                <view class="mian">
                    <u-input v-model="devEquipUser" input-align="right" placeholder="请输入" height="94" style="width: 100%" placeholder-style="color: '#999999'" :custom-style="{fontSize: '32rpx'}"/>
                </view>
            </view>
        </view>
        <view class="form-box">
            <view class="form-item form-item2">
                <text class="label">添加图片</text>
                <view class="mian" @click="chooseImage">
                    <template v-if="img||tempFilePath">
                        <u-image
                            width="180rpx"
                            height="180rpx"
                            border-radius="12"
                            :src="img||tempFilePath"
                            :show-error="true"
                            :error-icon="require('@/static/images/common/default-img.png')"
                        >
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
            <u-button type="primary" shape="circle" :custom-style="{width: '714rpx', height: '88rpx', fontSize: '34rpx'}" @click="navigateToStep3">保存</u-button>
        </view>
        <u-picker v-model="pickerTimeShow" mode="time" :safe-area-inset-bottom="true" :params="pickerTimeParams" @confirm="pickerTimeConfirm"></u-picker>
        <u-action-sheet :list="instruTypeList" v-model="instruTypeShow" :safe-area-inset-bottom="true" :cancel-btn="false" border-radius="16" @click="instruTypeChange"></u-action-sheet>
    </view>
</template>
<script>
    const instruTypeDefaultList = [
        { value: 1, name: '云盒子' },
        { value: 2, name: '仪器猫' },
        { value: 3, name: '仪器猫伴侣' },
        { value: 4, name: '无物联设备仪器' }
    ]
    export default {
        filters: {
            phoneFilter(v) {
                if (!v) return
                return v.slice(0,4)+'****'+v.slice(8,11)
            },
            instruTypeFilter(v) {
                if (!v) return
                return instruTypeDefaultList.filter(item => item.value == v)[0].name
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
                    default:
                        instruTypeName = '无物联设备仪器'
                        break
                }

                return instruTypeName
            },
        },
        /*watch: {
            equipNum() {
                if (this.equipNumChange) {
                    uni.showToast({
                        title: '设备编号变了',
                        icon: 'none'
                    })
                }
            }
        },*/
        data() {
            return {
                equipNumChange: false, // 设备编号是否改变
                pickerTimeShow: false,
                pickerTimeParams: {
                    year: true,
                    month: true,
                    day: true,
                    // hour: true,
                    // minute: true,
                    // second: false
                },
                dbName:'',
                jurisdiction:'',
                boo: false, // 是否是共享仪器
                instruName: '', // 仪器名称
                instruNo: '', // 仪器编号
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
                init: {
                    num:null,
                    isChanged:false,
                },
                instruType: null, // 仪器类型 1：云盒子 2：仪器猫 3：仪器猫伴侣
                equipNum: '', // 设备编号
                realEquipNum: '', // 设备编号
                equipId: '', // 设备id
                instruId: '', // 仪器id
                img: '', // 图片
                instruTypeList: [
                    { // 仪器类型列表
                        text: '云盒子', value: 1
                    },{
                        text: '仪器猫', value: 2
                    },{
                        text: '仪器猫伴侣', value: 3
                    },{
                        text: '无物联设备仪器', value: 4
                    }
                ],
                current: 0,
                uselist: [
                    {
                        name: '随机码',
                        value: 1
                    }
                ],
                phone: '', // 手机号
                authCode: '', // 验证码
                instruTypeShow: false,
                codeTips: '获取验证码',
                types: [], // 仪器包含的设备类型
                oldInstruType: null, // 未切换之前的设备类型
                instruNum: ''
            }
        },
        methods: {
            showEquipType() {
                this.instruTypeShow = true
                const types = this.types
                const instruType = this.oldInstruType
                if (types.length > 1) {
                    if (types.length === 3) { // 绑定了3种设备
                        if (instruType === 1) {
                            this.instruTypeList = [
                                {text: '云盒子', value: 1}
                            ]
                        } else if (instruType === 2) {
                            this.instruTypeList = [
                                {text: '仪器猫', value: 2}
                            ]
                        } else if (instruType === 3) {
                            this.instruTypeList = [
                                {text: '仪器猫伴侣', value: 3}
                            ]
                        }
                    } else if (types.length === 2) {
                        const type = types.filter(item => item !== instruType)[0] // 非本身的设备
                        const instruTypeList = [
                            {text: '云盒子', value: 1},
                            {text: '仪器猫', value: 2},
                            {text: '仪器猫伴侣', value: 3}
                        ]
                        this.instruTypeList = instruTypeList.filter(item => item.value !== type)
                    }
                } else {
                    this.instruTypeList = [
                        {text: '云盒子', value: 1},
                        {text: '仪器猫', value: 2},
                        {text: '仪器猫伴侣', value: 3},
                        {text: '无物联设备仪器', value: 4}
                    ]
                }
            },
            instruTypeChange (index) {
                const selectedItem = this.instruTypeList[index]
                if (selectedItem.value !== this.instruType) {
                    this.realEquipNum = null
                    this.instruType = selectedItem.value
                }
                if (selectedItem.value === 4) {
                    this.equipNumChange = false
                }
            },
            // 根据仪器类型和设备编号获取有效的手机号
            getPhone(){
                this.$u.api.equipmentApi.getPhone({ parameter:{instruNum:this.realEquipNum,type:this.instruType} }).then(res => {
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
            selectEquip() {
                if (!this.instruType) {
                    uni.showToast({
                        title: '请选择仪器类型',
                        icon: 'none'
                    });

                    return
                }

                uni.navigateTo({
                    url: '/pages/select-page/pages/editEquip/index?key=realEquipNum&equipType=' + this.instruType
                })
            },
            pickerTimeConfirm(data) {
                this.purchaseTime = `${data.year}-${data.month}-${data.day}`// ${data.hour}:${data.minute}:00`
            },

            next(img) {
                if (this.realEquipNum) {
                    if (this.equipNumChange) {
                        // 校验随机码、手机验证码
                        const api = this.current===0? 'validRandomCode' : 'validPhoneCode'
                        let parmas = {}
                        if(this.current===0){
                            parmas = {instruNum:this.realEquipNum,type:this.instruType,randomCode:this.authCode}
                        }else{
                            parmas = {tellphone:this.phone,authCode:this.authCode}
                        }
                        this.$u.api.equipmentApi[api]({parameter:parmas}).then(res=>{
                            this.editEquip(img)

                        }).catch(e=>{
                            console.log(e)
                        })
                    } else {
                        this.editEquip(img)
                    }
                }else{
                    this.editEquip(img)
                }
            },

            navigateToStep3() {
                if (this.isLock || !this.isCheck()) {
                    return
                }

                if (this.tempFilePath) {
                    this.uploadImage()
                } else {
                    this.next()
                }
            },
            uploadImage() {
                this.isLock = true

                this.$uploadFile(this.tempFilePath).then((res) => {
                    this.next(res.data)
                }).catch(() => {
                    this.isLock = false
                })
            },
            editEquip(img = this.img) {
                const par = {
                    parameter: {
                        instruId: this.instruId,
                        equipId: this.equipId,
                        instruNo: this.instruNo,
                        cid: this.classify.id,
                        bid: this.brand.id,
                        instruName: this.instruName,
                        address: this.address,
                        devEquipUser: this.devEquipUser,
                        purchaseTime:this.purchaseTime,
                        modelId: this.model && this.model.modelId,
                        img,
                        type: this.instruType ? this.instruType : 4,
                        jurisdiction: this.jurisdiction
                    }
                }
                if(this.instruType===1){
                    par.parameter.equipNum = this.realEquipNum
                }
                if(this.instruType===2){
                    par.parameter.instrumentCatNum = this.realEquipNum
                }
                if(this.instruType===3){
                    par.parameter.instrumentCatPartnerNum = this.realEquipNum
                }

                if (this.purchaseAmount && this.$u.test.amount(this.purchaseAmount)) {
                    par.parameter.equipAmount = {
                        purchaseAmount: this.purchaseAmount*100
                    }
                }

                if (this.room) {
                    par.parameter.roomId = this.room.id
                }

                console.log(par)
                this.$u.api.equipmentApi.editMyEquip(par).then((res) => {
                    if(this.init.num!==this.realEquipNum)this.$set(this.init,'isChanged',true)
                    let that = this
                    uni.showToast({
                        title: '保存成功',
                        success: function () {
                            setTimeout(() => {
                                that.back(res)
                            }, 500)
                        }
                    });
                }).finally(() => {
                    this.isLock = false
                })
            },
            back(res) {
                const instruType = Number(res.type)
                if (instruType === 1) { // 云盒子

                    uni.navigateTo({
                        url: '/pages/index/pages/cloud-box/info-page?instruNum=' + res.equipAddress + '&instruId=' + this.instruId +
                            '&dbName=' + (res.dbName || '') + '&userId=' + res.userId + '&equipNum=' + res.equipNum + '&jurisdiction=' + res.jurisdiction
                    });
                } else if (instruType === 2) { // 仪器猫
                    uni.navigateTo({
                        url: '/pages/index/pages/instrument-cat/info-page?instruNum=' + res.equipNum + '&instruId=' + this.instruId +
                            '&dbName=' + (res.dbName || '') + '&userId=' + res.userId + '&equipNum=' + res.equipNum + '&jurisdiction=' + res.jurisdiction
                    });
                } else if (instruType === 3) { // 仪器猫伴侣
                    uni.navigateTo({
                        url: '/pages/index/pages/instrument-cat-companion/info-page?instruNum=' + res.equipNum + '&instruId=' + this.instruId +
                            '&dbName=' + (res.dbName || '') + '&userId=' + res.userId + '&equipNum=' + res.equipNum + '&jurisdiction=' + res.jurisdiction
                    });
                } else { // 无物联设备
                    uni.navigateTo({
                        url: '/pages/index/pages/instrument-no-iot/info-page?instruNum=' + res.equipNum + '&instruId=' + this.instruId +
                            '&dbName=' + (res.dbName || '') + '&jurisdiction=' + res.jurisdiction
                    });
                }
            },
            isCheck() {
                // if (!this.instruType) {
                //     uni.showToast({
                //         title: '请选择设备类型',
                //         icon: 'none'
                //     });

                //     return false
                // }

                if (this.instruType && this.instruType !== 4) {
                    console.log("this.instruType",this.instruType);
                    if (!this.realEquipNum) {
                        uni.showToast({
                            title: '请选择设备编号',
                            icon: 'none'
                        });

                        return false
                    }
                    if (this.equipNumChange) {
                        if (!this.authCode) {
                            uni.showToast({
                                title: this.current===0?'请输入随机码':'请输入验证码',
                                icon: 'none'
                            });

                            return false
                        }
                    }
                }

                if (!this.instruName) {
                    uni.showToast({
                        title: '请输入仪器名称',
                        icon: 'none'
                    });

                    return  false
                }

                if (!this.instruNo) {
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

                if (!this.model) {
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

                if (!this.tempFilePath && !this.img) {
                    uni.showToast({
                        title: '请选择图片',
                        icon: 'none'
                    });

                    return  false
                }

                return true
            },
            navigateBack() {
                uni.navigateBack();
            },
            SelectRoom() {
              if (this.boo) return
                if (!this.laboratory) {
                    uni.showToast({
                        title: '请先选择实验室',
                        icon: 'none'
                    });

                    return
                }

                this.toSelectPage('room', 'room&labId=' + this.laboratory.id)
            },
            toSelectPage(type = '', key = '',key2='') {
              if (type === 'laboratory' && this.boo) return
                let params = `?key=${key}`
                if(key2)params=`${params}&key2=${key2}`
                uni.navigateTo({
                    url: '/pages/select-page/pages/' + type + '/index' + params
                })
            },
            toModelPage(){
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
                    this.room = null
                }
                if (this.s_bus.room) {
                    this.room = this.s_bus.room
                    this.$u.vuex('s_bus.room', null)
                }
            },
            getEquipInfoById() { // 回显仪器信息
                const api=this.equipNum?"loadEquip":"getEquipInfoById"
                const parameter=this.equipNum?{equipNum: this.equipNum, type: this.instruType}:{ instruId: this.instruId, type: 4, instruNum: this.instruNum}
                this.$u.api.equipmentApi[api]({
                    parameter: parameter
                }).then((res) => {
                    if (!res) {
                        return
                    }

                    this.dbName = res.dbName||''
                    this.jurisdiction = res.jurisdiction||''
                    this.instruId = res.instruId || ''
                    this.equipId = res.equipId || ''
                    this.instruName = res.instruName || ''
                    this.instruNo = res.instruNo || ''
                    this.purchaseAmount = res.purchaseAmount && res.purchaseAmount/100 || ''
                    this.purchaseTime = res.purchaseTime || ''
                    this.address = res.address || ''
                    this.devEquipUser = res.devEquipUser || ''
                    this.img = res.img || ''
                    this.types = res.types || []
                    this.boo = res.boo

                    if (res.cid && res.cateName) {
                        this.classify = {
                            id: res.cid,
                            cname: res.cateName
                        }
                    }

                    if (res.bid && res.brandName) {
                        this.brand = {
                            id: res.bid,
                            name: res.brandName
                        }
                    }

                    if (res.modelId && res.modelName) {
                        this.model = {
                            modelId: res.modelId,
                            modelName: res.modelName
                        }
                    }

                    if (res.roomId && res.roomName) {
                        this.room = {
                            id: res.roomId,
                            name: res.roomName
                        }
                    }

                    if (res.labId && res.labName) {
                        this.laboratory = {
                            id: res.labId,
                            name: res.labName,
                            deptName: res.deptName || ''
                        }
                    }
                })
            },
            // 清空实验室
            handleClearLab(){
              if (this.boo) return
                this.laboratory = null
                this.room = null
            },
            // 清空房间
            handleClearRoom(){
              if (this.boo) return
                this.room = null
            },
            getBackUrl(){
                let url = '',params=''
                switch (this.instruType) {
                    case 1:
                        params = `?instruNum=${this.equipNum}&instruId=${this.instruId}&dbName=${this.dbName}&jurisdiction=${this.jurisdiction}&isMock=false&equipNum=${this.realEquipNum}`
                        url = `/pages/index/pages/cloud-box/info-page${params}`
                        break;
                    case 2:
                        params = `?instruNum=${this.equipNum}&instruId=${this.instruId}&dbName=${this.dbName}&jurisdiction=${this.jurisdiction}&isMock=false&equipNum=${this.realEquipNum}`
                        url = `/pages/index/pages/instrument-cat/info-page${params}`
                        break;
                    case 3:
                        params = `?instruNum=${this.equipNum}&instruId=${this.instruId}&dbName=${this.dbName}&jurisdiction=${this.jurisdiction}&isMock=false&equipNum=${this.realEquipNum}`
                        url = `/pages/index/pages/instrument-cat-companion/info-page${params}`
                        break;
                    default:
                        params=`?instruId=${this.instruId}&dbName=${this.dbName}&jurisdiction=${this.jurisdiction}`
                        url = `/pages/index/pages/instrument-no-iot/info-page${params}`
                        break;
                }
                return url
            }
        },
        onLoad(data) {
            this.equipNum = data.equipNum
            this.realEquipNum = data.realEquipNum
            this.instruType = data.instruType && Number(data.instruType)
            this.oldInstruType = data.instruType && Number(data.instruType)
            this.$set(this.init,'num',data.realEquipNum)

            this.instruId = data.instruId
            this.instruNum = data.instruNum
            this.getEquipInfoById()
        },
        onShow() {
            this.initData()
            if (this.s_bus && this.s_bus.realEquipNum) {
                if (this.s_bus.realEquipNum !== this.realEquipNum) {
                    this.equipNumChange = true
                }
                this.realEquipNum = this.s_bus.realEquipNum
                this.$u.vuex('s_bus.realEquipNum', null)
                this.getPhone()
            }
        },
        onBackPress(options) {
            if(this.init.isChanged){
                uni.redirectTo({url:this.getBackUrl()})
                return true
            }
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
                    word-break: break-all;
                    &.full {
                        color: inherit;
                    }
                }
            }
            .no-edit{
                color: #8a7e7e;
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
