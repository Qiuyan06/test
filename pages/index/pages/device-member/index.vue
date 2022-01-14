<template>
    <view class="device-member">
        <u-navbar title="共享成员">
            <view slot="right">
                <text v-if="jurisdiction && Number(jurisdiction)!==3" class="icon-text" @click="handleManage">管理</text>
            </view>
        </u-navbar>
        <view class="member-list" v-if="!isEmpty">
            <member-item v-for="(item, index) in list" :key="item.userId" :com-data="item" :is-edit="isEdit" :ref="`member${index}`" @selectMemberChange="selectMemberChange"></member-item>
        </view>
        <u-loadmore :status="loadMoreStatus" bg-color="#F6F7FC" marginTop="24" v-if="!isEmpty" />
        <u-empty text="暂无数据" mode="list" :show="isEmpty" margin-top="100"></u-empty>
        <view class="footer-box" v-if="!isEdit">
            <text class="label">合计</text>
            <view class="info">
                <text class="iconfont">&#xe64b;</text>
                <text>{{total}}</text>
            </view>
        </view>
        <view class="footer-box" v-else>
            <view class="select" @click="isSelectAllFun">
                <view class="select-box" :class="{active: isSelectAll}">
                    <u-icon name="checkmark" size="18" color="#ffffff"></u-icon>
                </view>
                <text>全选</text>
            </view>
            <u-button type="primary" shape="circle" :custom-style="{width: 'auto', height: '72rpx', fontSize: '28rpx', marginRight: '0'}" @click="modalShow = true">确定删除（{{selectIds.length}}）</u-button>
        </view>
        <u-modal v-model="modalShow" content="是否删除共享成员？" :show-cancel-button="true" :show-title="false" @confirm="delEquipShareInfo"></u-modal>
    </view>
</template>
<script>
    import MemberItem from './components/MemberItem'

    export default {
        components: {
            MemberItem
        },
        data() {
            return {
                jurisdiction:null,
                instruId: '',
                page: 1,
                pageSize: 50,
                list: [],
                loadMoreStatus: 'loading',
                init: false,
                isEdit: false, // 是否编辑状态
                total: 0, // 总人数
                isSelectAll: false, // 是否全选
                selectIds: [], // 选中的用户id
                isLock: false,
                modalShow: false
            }
        },
        computed: {
            isEmpty() {
                if (this.list.length < 1 && this.init) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            isSelectAllFun() {
                const refList = Object.values(this.$refs)
                if (refList && Array.isArray(refList)) {
                    refList.forEach((item) => {
                        if (this.isSelectAll) {
                            item[0].isSelect = false
                        } else {
                            item[0].isSelect = true
                        }
                        this.$nextTick(() => {
                            this.selectMemberChange({
                                isSelect: item[0].isSelect,
                                userId: item[0].comData.userId
                            })
                        })
                    })
                }
            },
            selectMemberChange(data) {
                if (data && data.isSelect && data.userId && !this.selectIds.includes(data.userId)) {
                    this.selectIds.push(data.userId)
                } else if (data && !data.isSelect && data.userId && (this.selectIds.indexOf(data.userId) !== -1)) {
                    this.selectIds.splice(this.selectIds.indexOf(data.userId), 1)
                }

                if (this.selectIds.length >= this.list.length) {
                    this.isSelectAll = true
                } else {
                    this.isSelectAll = false
                }
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
            equipOneShareInfo() {
                this.$u.api.equipmentApi.equipOneShareInfo({
                    parameter:{
                        instruId: this.instruId
                    },
                    page: this.page,
                    pageSize: this.pageSize
                }).then((res) => {
                    if (!res) {
                        return
                    }

                    const rows = res.rows || []

                    this.total = res.total || 0

                    if (rows && Array.isArray(rows)) {
                        this.list = this.list.concat(rows)
                    }

                    this.hasMorePage(res.total || 0, rows.length)
                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh();
                })
            },
            resetData() {
                this.isEdit = false
                this.isSelectAll = false
                this.page = 1
                this.list = []
                this.total = 0
                this.loadMoreStatus = 'loadmore'
            },
            delEquipShareInfo() {
                if (this.isLock) {
                    return;
                }

                if (this.selectIds.length < 1) {
                    uni.showToast({
                        title: '请选择删除对象',
                        icon: 'none'
                    });

                    return
                }

                this.$u.api.equipmentApi.delEquipShareInfo({
                    parameter: {
                        instruId: this.instruId,
                        sharIds: this.selectIds.join(',')
                    }
                }).then(() => {
                    uni.showToast({
                        title: '删除成功'
                    });

                    this.resetData()
                    this.equipOneShareInfo()
                }).finally(() => {
                    this.isLock = false
                })
            },
            handleManage() {
                this.isEdit = !this.isEdit
            }
        },
        onLoad(data) {
            this.instruId = data.instruId || ''
            this.jurisdiction = data.jurisdiction
            this.equipOneShareInfo()
        },
        onPullDownRefresh() {
            this.resetData()
            this.equipOneShareInfo()
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'loadmore') {
                this.page++
                this.equipOneShareInfo()
            }
        },
        /*onNavigationBarButtonTap() {
            this.isEdit = !this.isEdit
        }*/
    }
</script>
<style lang="scss" scoped>
    .device-member {
        padding: 18rpx 18rpx 160rpx 18rpx;
        .icon-text{
            margin-right: 23rpx;
            color:#111737;
            font-size:30rpx;
        }
        .member-list {
            background-color: #FFFFFF;
            border-radius: 24rpx;
            overflow: hidden;
            padding-left: 32rpx;
        }

        .footer-box {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #FFFFFF;
            padding: 24rpx 32rpx;
            z-index: 99;

            .label {
                font-size: 34rpx;
                font-weight: blod;
                color: #000000;
                margin-right: 32rpx;
            }

            .info {
                display: flex;
                align-items: center;
                font-size: 30rpx;
                color: #111737;

                .iconfont {
                    font-size: 40rpx;
                    margin: 2rpx 12rpx 0;
                }
            }

            .select {
                display: flex;
                align-items: center;
                font-size: 32rpx;
                color: #333333;

                .select-box {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 37rpx;
                    height: 37rpx;
                    border-radius: 50%;
                    border: 1rpx solid #C9CED4;
                    margin-right: 12rpx;

                    &.active {
                        background-color: #2C72F9;
                        border: none;
                    }
                }
            }
        }
    }
</style>
