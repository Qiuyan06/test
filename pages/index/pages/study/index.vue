<template>
    <view>
        <u-navbar title="学习资料" :background="{ background: '#3978f7' }" back-icon-color="#fff" title-color="#fff" :border-bottom="false">
            <view slot="right">
                <view class="item-btn" @click="searchData">
                    <text class="iconfont">&#xe644;</text>
                </view>
            </view>
        </u-navbar>
        <view class="tip" v-if="isMock">
            <u-icon name="info-circle-fill" size="40" color="#2C72F9"></u-icon>
            <view class="text">此页为示例数据</view>
        </view>
        <view>
            <view class="studyBox" v-if="!isEmpty">
                <view
                    class="book_box"
                    v-for="item in list"
                    :key="item.id"
                >
                    <VideoBox v-if="item.typeId===1" :item="item" :instruId="instruId"></VideoBox>
                    <OtherMenus v-else :item="item"></OtherMenus>
                </view>
            </view>
            <view :style="{'padding-top': s_statusBarHeight+10 + 'px'}">
                <u-loadmore v-if="!isEmpty" :status="loadMoreStatus"   bg-color="#F6F7FC"/>
            </view>
        </view>
        <view class="empty-box" v-if="isEmpty">
            <u-image width="360rpx" height="309rpx" src="https://iotapp.prod.ilabeco.com/download/iot/common/empty-list.png">
                <view slot="loading"></view>
            </u-image>
            <text style="margin-bottom: 32rpx">抱歉，暂时还没有资料</text>
        </view>
    </view>
</template>

<script>
    import VideoBox from './components/Video.vue'
    import OtherMenus from './components/OtherMenus.vue'
    import Mixin from '@/mixins/listenToPage'
    export default {
        mixins: [Mixin],
        components: {
            VideoBox,
            OtherMenus
        },
        data() {
            return {
                isMock:false,
                instruId:'',
                list: [],
                page: 1,
                pageSize: 20,
                isUpdate: 1, // 通知子组件更新
                init: false,
                loadMoreStatus: 'loading',
            }
        },
        computed: {
            isEmpty() { // 列表是否为空
                if (this.list.length < 1 && this.init) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            // 资料搜索
            searchData() {
                const url ='/pages/index/pages/study/pages/searchData/index'
                const instruId = `instruId=${this.instruId || ''}`
                uni.navigateTo({url: `${url}?${instruId}`})
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

            // 其他接口
            getStudyList() {
                this.loadMoreStatus = 'loading'

                const api = this.isMock ?'queryLearningPageByDevMock':'queryLearningPageByDev'
                const parameter = this.isMock ? {
                    parameter:{type:3}
                } :{
                    startRow: 0,
                    parameter: {
                        isVideo: null,
                        instruId:this.instruId
                    },
                    page: this.page,
                    pageSize: this.pageSize
                }
                this.$u.api.studyApi[api](parameter).then(res => {
                    const rows = res.rows || []
                    if (rows && Array.isArray(rows)) {

                        this.list = this.list.concat(rows)
                        console.log(this.list)
                    }
                    this.hasMorePage(res.total || 0, rows.length)

                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh()
                })
            },

            // 重置数据
            resetData() {
                this.init = false
                this.page = 1
                this.list = []
                this.loadMoreStatus = 'loading'
            },
        },

        onLoad(data) {
            this.isMock = data.isMock==='true' || false
            this.instruId = data.instruId || ''
            // this.getStudyList()

        },
        onShow() {
            this.resetData()
            this.getStudyList()
        },

        onPullDownRefresh() {
            this.resetData()
            this.getStudyList()
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'loadmore') {
                this.page++
                this.getStudyList()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tip {
        padding: 20rpx 24rpx;
        background-color: #F5FFFF;
        font-size: 28rpx;
        color: #111111;
        display: flex;
        z-index: 9;
        align-items:flex-start;
        .text{
            margin:0 10rpx;
            line-height: 40rpx;
            flex: 1;
        }
    }

    .item-btn {
        margin-right: 22rpx;

        .iconfont {
            color: #FFFFFF;
            font-size: 40rpx;
        }
    }
    .empty-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 440rpx 0 20rpx 0;
        font-size: 24rpx;
        color: #999999;
    }
    .studyBox {
        position: relative;
        z-index: 66;
        width: 100vw;
        .book_box {
            /*width: 96%;*/
            /*border-radius: 24 rpx;*/
            /*display: flex;*/
            /*align-items: center;*/
            /*background-color: #fff;*/
            /*margin: 24 rpx auto;*/
            /*padding: 20 rpx;*/
            /*overflow: hidden;*/
            /*z-index: 2222;*/

            /*/deep/ .u-checkbox__label {*/
            /*    margin: 0;*/
            /*}*/

        }
    }
</style>
