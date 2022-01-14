<template>
    <view class="add-home">
        <view class="form-box">
            <view class="form-item">
                <text class="label">实验室</text>
                <view class="mian" @click="selectLaboratory">
                    <text class="val" :class="{full: laboratory}">{{laboratory ? (laboratory.name || '') : '请选择'}}</text>
                    <u-icon name="arrow-right" color="#CCCCCC"></u-icon>
                </view>
            </view>
            <view class="form-item">
                <text class="label">房间名称</text>
                <view class="mian">
                    <u-input v-model="name" input-align="right" placeholder="请输入" height="94" style="width: 100%" placeholder-style="color: '#999999'" :custom-style="{fontSize: '32rpx'}"/>
                </view>
            </view>
        </view>
        <view class="home-mc">
            <view class="home-mc-title">
                绑定设备仪器
            </view>
            <u-checkbox-group v-if="!isEmpty" @change="checkboxChange">
                <device v-for="item in list" :key="item.instruId" :com-data="item"></device>
            </u-checkbox-group>
            <u-loadmore :status="loadMoreStatus" bg-color="#fff" margin-top="20" />
        </view>
        <view class="footer-btn">
            <u-button type="primary" shape="circle" :custom-style="{width: '714rpx', height: '88rpx', fontSize: '34rpx'}" @click="save">确定</u-button>
        </view>
        <!-- 多设备提示弹框 -->
        <u-modal v-model="equipShow" :show-title="false" :show-cancel-button="true" @confirm="handleInfo" @cancel="cancelInfo">
            <view class="slot-content">
                <view class="popuper">
                    <view class="popuper_title">
                        <view>
                            <view>{{ msg }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </u-modal>
    </view>
</template>
<script>
    import device from './components/Device'
    export default {
        components: {
            device
        },
        data() {
            return {
                laboratory: null, // 实验室
                name: '', // 房间名字
                isLock: false,
                page: 1,
                pageSize: 10,
                list: [],
                loadMoreStatus: 'loading',
                init: false,
                selectedIds: [],
                equipShow: false,
                msg: '',
                equipIds: []
            }
        },
        computed: {
            isEmpty() {
                return this.list.length < 1 && this.init
            }
        },
        methods: {
            selectLaboratory() {
                uni.navigateTo({
                    url: '/pages/select-page/pages/laboratory/index?key=laboratory'
                })
            },
            initData() {
                if (this.s_bus.laboratory) {
                    this.laboratory = this.s_bus.laboratory
                    this.$u.vuex('s_bus.laboratory', null)
                }
            },
            isCheck() {
                if (!this.laboratory) {
                    uni.showToast({
                        title: '请选择实验室',
                        icon: 'none'
                    });

                    return false
                }

                if (!this.name) {
                    uni.showToast({
                        title: '请输入房间名',
                        icon: 'none'
                    });

                    return false
                }

                return true
            },
            handleInfo() {
                this.$u.api.equipmentApi.save({
                    parameter: {
                        labId: this.laboratory.id,
                        name: this.name,
                        equipIds: this.equipIds.toString()
                    }
                }).then(() => {
                    uni.showToast({
                        title: '保存成功'
                    });

                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/index/pages/room-manage/index'
                        })
                    }, 500)
                }).finally(() => {
                    this.isLock = false
                })
            },
            cancelInfo() {
                this.isLock = false
            },
            save() {
                if (this.isLock || !this.isCheck()) {
                    return
                }
                this.isLock = true
                const selectedInstruIds = this.selectedIds.map(item => item.instruId)
                const instruIds = [...new Set(selectedInstruIds)]
                this.$u.api.roomApi.queryEquipIdsByInstruIds({ parameter: { instruIds } }).then(res => {
                    this.equipIds = res.equipIds
                    if (res.msg) {
                        this.equipShow = true
                        this.msg = res.msg
                    } else {
                        this.handleInfo()
                    }
                })

            },
            selRoomBandEquip() {
                this.loadMoreStatus = 'loading'
                const pageParams = {
                    page: this.page,
                    pageSize: this.pageSize
                }
                this.$u.api.roomApi.selRoomBandEquip({ parameter: {}, ...pageParams }).then(res => {
                    const rows = res.rows || []
                    if (rows && Array.isArray(rows)) {
                        this.list = this.list.concat(rows)
                    }
                    this.hasMorePage(res.total || 0, rows.length)
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh()
                })
            },
            hasMorePage(total = 0, dataSize = 0) { // 判断是否还有下一页
                if (this.page === 1 && total <= this.pageSize) {
                    this.loadMoreStatus = 'nomore'
                } else if (this.page > 1 && (dataSize < this.pageSize || total / this.pageSize === this.page)) {
                    this.loadMoreStatus = 'nomore'
                } else {
                    this.loadMoreStatus = 'loadmore'
                }
            },
            resetData() {
                this.init = false
                this.page = 1
                this.list = []
                this.loadMoreStatus = 'loadmore'
                this.selectedIds = []
            },
            // 单选按钮
            checkboxChange(e) {
                console.log(e)
                this.selectedIds = e
            },
        },
        onShow() {
            this.initData()
        },
        onLoad() {
            this.selRoomBandEquip()
        },
        onPullDownRefresh() {
            this.resetData()
            this.selRoomBandEquip()
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'loadmore') {
                this.page++
                this.selRoomBandEquip()
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

        .form-item {
            display: flex;
            align-items: center;
            height: 96rpx;
            border-bottom: 2rpx solid #F5F5F5;

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
        }
    }
    .home-mc{
        background-color: #FFFFFF;
        margin: 18rpx;
        /*padding: 10rpx 30rpx;*/
        border-radius: 24rpx;
        margin-bottom: 200rpx;
        padding-bottom: 30rpx;
        /deep/.u-checkbox-group {
            display: block;
        }
        .home-mc-title{
            font-size: 32rpx;
            font-weight: bold;
            color: #333333;
            padding: 30rpx;
        }
    }

    .footer-btn {
        position: fixed;
        width: 100%;
        bottom: 68rpx;
        z-index: 666;
    }
    .popuper {
        text-align: center;
        .warn {

            color: #FFA033;
            padding: 60rpx 0 20rpx 0;
        }
        .popuper_title{
            color: #333333;
            font-size: 32rpx;
            font-weight: 600;
            view{
                padding: 10rpx 30rpx;
                line-height: 48rpx;
            }
        }
        .tishi{
            color: #999999;
            font-size: 28rpx;
            padding: 40rpx 0 60rpx 0;
        }
    }
</style>
