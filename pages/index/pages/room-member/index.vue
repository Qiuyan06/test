<template>
    <view class="device-member">
        <view class="member-list" v-if="!isEmpty">
            <view v-for="item in list" :key="item.equipId" class="log-box-item">
                <u-collapse>
                    <u-collapse-item :title="item | typeFilter">
                        <u-empty v-if="!item.appUserResList || !item.appUserResList.length" text="暂无共享人员" mode="list"></u-empty>
                        <member-item v-else v-for="(sub, index) in (item.appUserResList || [])" :key="sub.userId" :com-data="sub" :is-edit="isEdit" :ref="`member${index}`" @selectMemberChange="selectMemberChange"></member-item>
                    </u-collapse-item>
                </u-collapse>
            </view>
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
        filters: {
            typeFilter(val) {
                if (!val.instruType || val.instruType === 4) return val.instruName
                return `${val.instruName}（${['云盒子', '仪器猫', '仪器猫伴侣'][val.instruType - 1]}）`
            },
        },
        components: {
            MemberItem
        },
        data() {
            return {
                roomId: '',
                page: 1,
                pageSize: 20,
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
                return this.list.length < 1 && this.init
            }
        },
        methods: {
            isSelectAllFun() {
                this.selectIds = [] // 点击全选先清空原来选中数组，不然后面数据会重复
                let refList = []
                const refLists = Object.values(this.$refs)
                if (refLists && Array.isArray(refLists)) {
                    for (let i = 0;i < refLists.length;i++) {
                        refList = refList.concat(refLists[i])
                    }
                }
                if (refList && Array.isArray(refList)) {
                    refList.forEach((item) => {
                        item.isSelect = !this.isSelectAll
                        this.$nextTick(() => {
                            this.selectMemberChange({
                                isSelect: item.isSelect,
                                userId: item.comData.userId,
                                instruId: item.comData.instruId
                            })
                        })
                    })
                }
            },
            selectMemberChange(data) {
                // if (data && data.isSelect && data.userId && data.instruId && !this.selectIds.map(item => item.userId).includes(data.userId)) {
                if (data && data.isSelect) {
                    this.selectIds.push(
                        {
                            userId: data.userId,
                            instruId: data.instruId
                        }
                    )
                // } else if (data && !data.isSelect && data.userId && data.instruId && (this.selectIds.map(item => item.userId).indexOf(data.userId) !== -1)) {
                } else if (data && !data.isSelect) {
                    this.selectIds = this.selectIds.filter(item => !(item.userId === data.userId && item.instruId === data.instruId))
                }
                this.isSelectAll = this.selectIds.length === this.total
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
            roomEquipShareMembers() {
                this.$u.api.roomApi.roomEquipShareMembers({
                    parameter:{
                        roomId: this.roomId
                    },
                    page: this.page,
                    pageSize: this.pageSize
                }).then((res) => {
                    if (!res) {
                        return
                    }

                    const rows = res.rows || []

                    this.total = res.rows && res.rows[0] && res.rows[0].sharAllEquipCount || 0

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
                this.selectIds = []
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
                this.$u.api.roomApi.roomEquipSharDelete({
                    parameter: {
                        roomEquipSonDelReqList: this.selectIds
                    }
                }).then(() => {
                    uni.showToast({
                        title: '删除成功'
                    });

                    this.resetData()
                    this.roomEquipShareMembers()
                }).finally(() => {
                    this.isLock = false
                })
            }
        },
        onLoad(data) {
            this.roomId = data.roomId || ''
            this.roomEquipShareMembers()
        },
        onPullDownRefresh() {
            this.resetData()
            this.roomEquipShareMembers()
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'loadmore') {
                this.page++
                this.roomEquipShareMembers()
            }
        },
        onNavigationBarButtonTap() {
            this.isEdit = !this.isEdit
            if (!this.isEdit) {
                this.isSelectAll = false
                this.selectIds = []
            }
        }
    }
</script>
<style lang="scss" scoped>
    .device-member {
        padding: 18rpx 18rpx 160rpx 18rpx;
        .log-box-item{
            background: white;
            border-radius: 24rpx;
            margin-bottom: 20rpx;
            padding-left: 32rpx;
        }
        .member-list {
            /*background-color: #FFFFFF;
            border-radius: 24rpx;
            overflow: hidden;
            padding-left: 32rpx;*/
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
