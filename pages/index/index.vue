<template>
    <view>
        <view class="header" :style="{'position': 'fixed','left': 0,'top': 0,'z-index':99999}">
            <view class="navbar-box" :style="{'padding-top': s_statusBarHeight + 'px'}">
                <view class="navbar" :style="{'height': navBarHeight+'px','line-height':navBarHeight + 'px'}">
                    趣味阅吧
                </view>
            </view>
            <view class="tab">
                <view class="tab-item current">放歌厅</view>
                <view class="tab-item" @click="toRecommend">推荐</view>
            </view>
        </view>
        <view class="swiper-con" :style="{'padding-top':s_statusBarHeight+navBarHeight+50+'px','z-index':1,height: screenHeight-navBarHeight-50 +'px'}">
            <!--swiper实现划动播放视频-->
            <swiper vertical duration="200" @change="changed" class="swiper-box">
                <view v-for="(item,index) in videoData" :key="index" class="swiper-item">
                    <swiper-item >
                        <view>
                            <view class="video-box">
                                <video
                                        :style="{'width': '100%','height': screenHeight-navBarHeight-240 +'px'}"
                                        v-if="index==changeIndex"
                                        :src="item"
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
                            <view style="height: 45px;"></view>
                            <view style="height:50px;line-height: 45px;color:#fff;font-size:36rpx;background:#6a0305;">↑↑向上滑动加载更多</view>
                            <view  style="height:100px;" class="banner">
                                <ad unit-id="adunit-57ea7a39204b383f" style="width:100%;height:100px"></ad>
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
                videoData: [],  //视频数据
                changeIndex: 0 , //控制video是否渲染
                hasMore:false , //是否有更多数据
                pageIndex: 1 ,  //第几页
                screenHeight: 0 ,
                statusBarHeight: 0 ,
                navBarHeight: 0 ,
            }
        },
        methods: {
            //划动切换
            changed(e) {
                let current = e.detail.current  //当前滑块的索引
                console.log('当前索引',current)
                this.changeIndex = current

                if(this.videoData.length == current + 1) {  //当还有1个视频没有看的时候开始加载数据
                    if (this.hasMore) {  //后台还有更多数据的时候
                        this.getData()  //调用函数加载数据
                    } else {
                        uni.showToast({
                            title: '没有更多数据了！',
                            icon:'none'
                        })
                    }
                }
            },
            //加载数据
            getData() {
                this.$u.api.userApi.getList({page:1}).then((res) => {
                    console.log('视频数据：',res)

                    this.videoData = res && res.video_src

                    // this.hasMorePage(res.total || 0, res.rows.length)
                })
                /*this.videoData = [
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/280443.mp4',
                        "like": false, "like_num": 0 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276982.mp4',
                        "like": false, "like_num": 1 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276986.mp4',
                        "like": false, "like_num": 2 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276984.mp4',
                        "like": false, "like_num": 3 },
                    { "video_path": 'https://v-cdn.zjol.com.cn/276985.mp4',
                        "like": false, "like_num": 4 },
                ]*/
                /*wx.cloud.callFunction({  //调用云函数
                    name:'selectVideo',  //云函数名称
                    data:{  //以下是云函数需要传入的参数
                        filter:{},          //筛选条件
                        pageIndex: this.pageIndex,  //第几页
                        pageSize: 6        //每次加载的记录数量
                    },
                    success: (res) => {
                        console.log(res)
                        // concat返回追加后的副本，并不会修改原有数组,多次追加后会产生许多副本，浪费内存
                        // this.videoData = this.videoData.concat(res.result.data)

                        // 云端返回的查询数据,追加到数组  push改变原数组,节约内存
                        this.videoData.push(...res.result.data)

                        // 云端返回的是否有更多数据
                        this.hasMore = res.result.hasMore
                        if (this.hasMore) {
                            this.pageIndex = this.pageIndex + 1
                        }
                    },
                    fail:(e) => {
                        console.log(e)
                    }
                })*/
            },
            adError(e){
                console.log(e)
            },
            toRecommend(){

                uni.navigateTo({
                    url:'/pages/recommend/index'
                })
            }
        },
        onLoad() {
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
                &.current{
                    color: #F60;
                    padding: 0 20rpx;
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
    .banner{
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
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
