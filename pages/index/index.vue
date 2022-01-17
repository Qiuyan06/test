<template>
    <view>
        <view class="header" :style="{'position': 'fixed','left': 0,'top': 0,'z-index':99999}">
            <view class="navbar-box" :style="{'padding-top': s_statusBarHeight + 'px'}">
                <view class="navbar" :style="{'height': navBarHeight+'px','line-height':navBarHeight + 'px'}">
                    {{title}}
                </view>
            </view>
            <view class="tab">
                <view class="tab-item p20 current">放映厅</view>
                <view class="tab-item" @click="toRecommend">推荐</view>
            </view>
        </view>
        <view class="swiper-con" :style="{'padding-top':s_statusBarHeight+navBarHeight+50+'px','z-index':1,height: windowHeight +'px'}">
            <!--swiper实现划动播放视频-->
            <swiper vertical duration="200" @change="changed" class="swiper-box">
                <view v-for="(item,index) in videoData" :key="index" class="swiper-item">
                    <swiper-item >
                        <view>
                            <view class="video-box">
                                <video
                                        :style="{'width': '100%','height': windowHeight-navBarHeight-245 +'px'}"
                                        v-if="index==changeIndex"
                                        :src="item.url"
                                        unit-id="adunit-d07f412dcb5e14d3"
                                        @binderror="adError"
                                        autoplay="true"
                                        controls="true"
                                        custom-cache="false"
                                        loop="false"
                                       enable-play-gesture="true"
                                        enable-progress-gesture="true"
                                        show-center-play-btn="true" >
                                </video>
                            </view>
                            <!--<view style="height: 45px;"></view>-->

                            <view class="bottom">
                                <view class="share" style="width: 100%;height:50px;justify-content: space-between;background:#6a0305;display:flex;">
									<view class="label">↑↑向上滑动加载更多</view>
									<view style="width:170px;display:flex;justify-content: space-between;">
										<button style="width:80px;margin:10px 0 0 0;font-size: 12px;line-height: 30px;height: 30px;" type="primary" @click="jump">更多精彩</button>
										<button style="width:80px;margin:10px 0 0 0;font-size: 12px;line-height: 30px;height: 30px;" type="primary" open-type="share">微信分享</button>
									</view>
								</view>
								<view class=banner>
									<ad unit-id="adunit-57ea7a39204b383f"></ad>
								</view>
                            </view>
                        </view>
                    </swiper-item>
                </view>
            </swiper>
        </view>

    </view>
</template>

<script>
    export default {
        data() {
            return {
				// title:'趣味阅吧',
				page: 1,
				pageSize: 20,
				total: 0,
                videoData: [],  //视频数据
				loadMoreStatus: 'loading',
                changeIndex: 0 , //控制video是否渲染
                pageIndex: 1 ,  //第几页
                screenHeight: 0 ,
                statusBarHeight: 0 ,
                navBarHeight: 0 ,
				windowHeight:0,
				vid:1,
				jump_app:null
            }
        },
		computed:{
			title(){
				return this.videoData[this.changeIndex].title || '趣味阅吧'
			}
		},
        methods: {
            //划动切换
            changed(e) {
                let current = e.detail.current  //当前滑块的索引
                console.log('当前索引',current)
                this.changeIndex = current

                if(this.videoData.length == current + 1) {  //当还有1个视频没有看的时候开始加载数据
                    if (this.loadMoreStatus === 'loadmore') {  //后台还有更多数据的时候
                        this.page++
						this.getData()  //调用函数加载数据
                    } else {
						console.log('没有更多数据了！')
                    }
                }
            },
            //加载数据
            getData() {
                this.$u.api.userApi.getHomeList({
					page:this.page,
					appid:'wxd7ce18d61bb55e0a',
					vid:this.vid
				}).then((res) => {
                    console.log('视频数据：',res)
					if(res.examine_status===2){
						const url = 'https://c4eee.cn/'
						const title = '博客'
						uni.reLaunch({
							url:`/pages/forum/index?url=${url}&title=${title}`
						})
						return
					}
					this.jump_app = res.jump_app
                    this.videoData = res && res.video_src
                    this.hasMorePage(res.total || 0, res.video_src.length)
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
			adError(e){
                console.log(e)
            },
			// 分享微信好友
			wechatFirend() {
			    let that = this
				const data = this.videoData[this.changeIndex]
			    uni.share({
			        provider: "weixin",
			        scene: "WXSceneSession",
			        type: 1,
			        href: "https://iotapp.prod.ilabeco.com/iot.html",
			        title: data.title,
			        imageUrl: data.thumb_url,
			        success: function (res) {
			            console.log("success:" + JSON.stringify(res))
			            uni.showToast({
			                title: '分享成功'
			            })
			            that.shareShow = false
			        },
			        fail: function (err) {
						console.log('分享失敗',err)
			            uni.showToast({
			                title: err.errMsg,
			                icon:'none'
			            })
			        },
			        complete: function () {
			            that.shareShow = false
			        }
			    });
			},
			share(){

			},
            toRecommend(){
				// uni.navigateBack();
                uni.switchTab({
                    url:'/pages/recommend/index'
                })
            },
			jump(){
				if(!this.jump_app)return
				wx.navigateToMiniProgram({
				    appId: this.jump_app,
				    path: '',
				    envVersion: 'release',// 打开正式版
				    success(res) {
				         // 打开成功
				    },
				    fail: function (err) {
				      console.log(err);
				    }
				 })
			}
        },
		onShareAppMessage: function () {
			const data = this.videoData[this.changeIndex]
			return {
			        title:  data.title,
			        desc: '感动',
			        path: '/pages/index/index?vid='+data.id // 路径，传递参数到指定页面。
			    }
		    // return custom share data when user share.
		  },
		onShow(){
			if(this.s_bus.vid){
				this.vid = this.s_bus.vid
				this.resetData()
				this.getData()
				this.$u.vuex(`s_bus.vid`, null)
			}
		},
        onLoad(data) {
			console.log('跳转首页',data)
            // 获取系统信息
            wx.getSystemInfo({
                success: (res) => {
					console.log('搞得',res)
                    // 获取屏幕高度
                    this.screenHeight = res.screenHeight
                    // 获取状态栏高度
                    this.statusBarHeight = res.statusBarHeight
					this.windowHeight = res.windowHeight
                    // 通过操作系统 确定自定义导航栏高度
                    if (res.system.substring(0, 3) == "iOS") {
                        this.navBarHeight = 42
                    } else {
                        this.navBarHeight = 40
                    }
                }
            })
			if(data.vid)this.vid=data.vid
            //调用函数加载数据
            this.getData()

            // 在页面中定义插屏广告
            let interstitialAd = null

            // 在页面onLoad回调事件中创建插屏广告实例
            if (wx.createInterstitialAd) {
                interstitialAd = wx.createInterstitialAd({
                    adUnitId: 'adunit-b48ad21a40b82b24'
                })
                interstitialAd.onLoad(() => {
                    interstitialAd.show().catch((err) => {
                        console.error(err)
                    })
                })
                interstitialAd.onError((err) => {})
                interstitialAd.onClose(() => {})
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

    .swiper-con{
        width: 100%;
        height: calc(100vh - 220rpx);
    }
    .swiper-box{
        width: 100%;
        height: 100%;
        background: #940000;
    }
    .video-box{
        width: 100%;
        /*height: 600rpx;*/
    }
    .bottom{
        width: 100%;
        height:160px;
        position: fixed;
        left: 0;
        bottom: 0;
		.share{
			.label{
				font-size:30rpx;
				color:#fff;
				line-height: 50px;
			}

		}
		.banner{
			height:110px
		}
	}

    swiper{
        width:100%;
        background:#000
    }
    swiper-item{
        height:100%;
        width:100%
    }
    video{
        /*height:98%;*/
        /*width:100%*/
    }
</style>
