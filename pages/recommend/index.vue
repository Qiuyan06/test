<template>
    <view>
        <view class="header" :style="{'position': 'fixed','left': 0,'top': 0,'z-index':99999}">
            <view class="navbar-box" :style="{'padding-top': s_statusBarHeight + 'px'}">
                <view class="navbar" :style="{'height': navBarHeight+'px','line-height':navBarHeight + 'px'}">
                    趣味阅吧
                </view>
            </view>
            <view class="tab">
                <view class="tab-item p20" @click="toHome">放映厅</view>
                <view class="tab-item current" @click="toRecommend">推荐</view>
            </view>
        </view>
        <view :style="{'padding-top':s_statusBarHeight+navBarHeight+50+'px','z-index':1}">
            <ad unit-id="adunit-c6036ec0238579ef" ad-type="video" ad-theme="white"></ad>
            <view class="image-box">
                <!-- <Video :style="{'width': '100%'}" v-for="(item,index) in list" :key="index" :com-data="item"></Video> -->
				<view class="img" v-for="(item,index) in list" :key="index">
					<u-image
						@click="handleToVideo(item.id)"
						:src="item.thumb_url"
						height="400rpx"
						:lazy-load="true"
					></u-image>
				</view>
			</view>
        </view>

    </view>
</template>

<script>
    import Video from './components/Video'
    export default {
        components:{
            Video
        },
        data(){
            return {
                page: 1,
                pageSize: 20,
                total: 0,
                list: [],
                loadMoreStatus: 'loading',
                init: false,
                screenHeight: 0 ,
                statusBarHeight: 0 ,
                navBarHeight: 0 ,
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
        methods:{
            // 获取预警记录列表
            getList() {
                this.$u.api.userApi.getRecommendList({
					page:this.page,
					appid:'wxd7ce18d61bb55e0a',
					vid:1
				}).then((res) => {
                    this.list = res && res.list
                    this.hasMorePage(res.total || 0, res.list.length)
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
            },
            toHome(){
				uni.switchTab({
				    url:'/pages/index/index'
				})
            },
			handleToVideo(vid){
				this.$u.vuex(`s_bus.vid`, vid)
				uni.switchTab({
				    url:'/pages/index/index'
				})
			}
        },
        onLoad() {
			console.log('跳转推荐页')
            // 获取系统信息
            wx.getSystemInfo({
                success: (res) => {
                    // 获取屏幕高度
                    this.screenHeight = res.screenHeight
                    // 获取状态栏高度
                    this.statusBarHeight = res.statusBarHeight
                    // 通过操作系统 确定自定义导航栏高度
                    if (res.system.substring(0, 3) == "iOS") {
                        this.navBarHeight = 42
                    } else {
                        this.navBarHeight = 40
                    }
                }
            })
            this.getList()
        },
        onPullDownRefresh() {
            this.resetData()
            this.getList()
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'loadmore') {
                this.page++
                this.getList()
            }
        },
    }
</script>

<style lang="scss" scoped>
    .header{
        width:100%;
        background: red;
        .navbar-box{
            width: 100%;
            .navbar{
                text-align: left;
                padding-left: 30rpx;
                background: red;
                font-size: 38rpx;
                color: #fff;
            }
        }
        .tab{
            width: 100%;
            display: flex;
            height:50px;
            line-height: 50px;
            background: #fff;
            .tab-item{
                line-height: 50px;
                font-weight: bold;
                font-size: 36rpx;
				&.p20{
					padding: 0 20rpx;
				}
                &.current{
                    color: #F60;
                    font-size: 40rpx;

                }
            }
        }
    }
    .image-box{
        margin-top:30rpx;
        padding: 10rpx;
        background: #fff;
		.img{
			width: 100%;
			height:400rpx;
			margin-bottom:20rpx;
		}
    }

</style>
