<template>
    <view class="videoInfo">
        <view class="top">
            <video id="myVideo" :src="uploadFile" @error="videoErrorCallback" controls @timeupdate="timeupdate" :initial-time="initTime"
                   v-if="videoExist"></video>
        </view>

        <view class="book_box">
            <view class="content">
                <view class="title">
                    <text>{{learnName}}</text>
                </view>
                <view class="info">
                    <template v-if="labelType">
                        <u-tag
                            type="warning"
                            size="mini"
                            v-for="(tag,index) in JSON.parse(labelType)"
                            :text="tag"
                            :key="Math.random()"
                            :class="tag === '故障类' || tag === '维修类' ? 'orange': ''"
                        />
                    </template>
                    <template v-if="label">
                        <u-tag :text="tag" type="primary" size="mini" v-for="(tag,index) in label.split(',')" :key="index" />
                    </template>
                </view>
                <view class="info-list">
                    <view class="info-item">
                        <text class="iconfont">&#xe673;</text>
                        <text>浏览{{clickOn}}</text>
                    </view>
                    <text class="time">{{createTime}}</text>
                </view>
            </view>

        </view>


        <view class="play">
            <view class="play_list">
                相关视频
            </view>
            <view class="book_box" v-for="item in videoLists" @click="videoInfo(item.id)">
                <view class="content">
                    <view class="title">
                        <text>{{item.learnName}}</text>
                    </view>
                    <view class="info">
                        <template v-if="item.labelType">
                            <u-tag
                                type="warning"
                                size="mini"
                                v-for="(tag,index) in JSON.parse(item.labelType)"
                                :text="tag"
                                :key="Math.random()"
                                :class="tag === '故障类' || tag === '维修类' ? 'orange': ''"
                            />
                        </template>
                        <template v-if="item.label">
                            <u-tag :text="tag" type="primary" size="mini" v-for="(tag,index) in item.label.split(',')" :key="index" />
                        </template>
                    </view>
                    <view class="info-list">
                        <view class="info-item">
                            <text class="iconfont">&#xe673;</text>
                            <text>浏览{{item.clickOn}}</text>
                        </view>
                    </view>
                </view>
                <view class="img">
                    <u-image width="280rpx" height="200rpx" border-radius="12" :src="item.uploadIcon">
                        <u-loading slot="loading"></u-loading>
                    </u-image>
                </view>

            </view>

        </view>
        <view class="footer">

            <view :class="star===true?'able light':'able content'" @click="collect">
                <u-icon size="64" v-if="!star" name="heart"></u-icon>
                <u-icon size="64" v-if="star" name="heart-fill"></u-icon>
                <!-- <text class="iconfont">{{star==true?'&#xe687;':'&#xe685;'}}</text> -->
                <text class="content">收藏 {{favorites || 0}}</text>

            </view>
            <view :class="praise===true?'able light':'able content'" @click="handlePraise">
                <u-icon size="64" v-if="!praise" name="thumb-up"></u-icon>
                <u-icon size="64" v-if="praise" name="thumb-up-fill"></u-icon> <text class="content">点赞 {{likes || 0}}</text>
            </view>
            <view class="able" @click="share">

                <u-icon size="64" name="zhuanfa"></u-icon>
                <!-- <text class="iconfont">&#xe686;</text> -->
                <text class="content">分享</text>
            </view>
        </view>

        <u-popup v-model="shareShow" mode="bottom" width="100%" border-radius="24">
            <view class="share_top">
                分享方式
            </view>
            <view class="share_content">
                <view class="share_type" @click="wechatFirend">
                    <text class="iconfont share_icon weChat">&#xe679;</text>
                    <text>微信好友</text>
                </view>
                <view class="share_type" @click="wechatCircle">
                    <text class="iconfont share_icon friend">&#xe67a;</text>
                    <text>微信朋友圈</text>
                </view>
                <!--<view class="share_type">
                    <text class="iconfont share_icon qq">&#xe678;</text>
                    <text>QQ</text>
                </view>
                <view class="share_type">
                    <text class="iconfont share_icon weibo">&#xe677;</text>
                    <text>新浪微博</text>
                </view>-->
            </view>
            <u-gap height="2" bg-color="#E6E9ED" margin-top="60" margin-bottom="36"></u-gap>
            <view class="share_footer" @click="shareShow = false">
                取消
            </view>
        </u-popup>

    </view>
</template>

<script>
    export default {
        data() {
            return {
                instruId:'',
                objData: {},
                id: '',
                brandId:'',
                cateId:'',
                modelId:'',
                typeName: '',
                learnName: '',
                clickOn: '',
                forward: '',
                favorites: '',
                likes: '',
                uploadFile: '',
                createTime: '',
                uploadIcon: '',
                videoLists: [],
                isFavorites: '',
                isLikes: '',
                loadMoreStatus: 'loading',
                starFlag: false,
                star: false,
                praise: false,
                shareShow: false,
                label: '',
                labelType: null,
                currentTime: null,
                // 等待视频数据请求完成后再渲染video组件
                videoExist: false
            }
        },
        methods: {
            videoErrorCallback(v) {
                // console.log(v)
            },
            videoInfo(id) {
                /*uni.navigateTo({
                    url: `/pages/index/pages/study/pages/videoDetails/index?id=${id}&brandId=${this.brandId}&cateId=${this.cateId}&modelId=${this.modelId}&instruId=${this.instruId}`

                })*/
                this.$u.api.studyApi.updateProgress({
                    materId: this.id,
                    progress: this.currentTime
                }).then(res => {
                    console.log(res)
                })

                this.id = id
                this.getVideoList()
                this.getLearnById()
                // 浏览量
                this.$u.api.studyApi.updateClickOnNumById({
                    id: this.id,
                    clickOn: 1
                }).then(res => {
                    console.log(res)
                    this.clickOn++
                })



            },
            // 收藏
            collect() {
                this.star = !this.star
                if (this.star) {
                    this.isFavorites = true

                    this.favorites++
                    this.$u.api.studyApi.updateFavoritesNumById({
                        id: this.id,
                        favorites: 1
                    }).then(res => {
                        // console.log(res)
                        this.getLearnById()
                    })
                } else {
                    this.isFavorites = false
                    this.favorites--
                    this.$u.api.studyApi.updateFavoritesNumById({
                        id: this.id,
                        favorites: -1
                    }).then(res => {
                        // console.log(res)
                        this.getLearnById()
                    })
                }

            },
            // 点赞
            handlePraise() {
                this.praise = !this.praise
                if (this.praise) {
                    this.likes++
                    this.$u.api.studyApi.updateLikeNumById({
                        id: this.id,
                        likes: 1
                    }).then(res => {
                        // console.log(res)
                        this.getLearnById()
                    })
                } else {
                    this.likes--
                    this.$u.api.studyApi.updateLikeNumById({
                        id: this.id,
                        likes: -1
                    }).then(res => {
                        // console.log(res)
                        this.getLearnById()
                    })
                }


            },
            // 分享
            share() {
                this.shareShow = true
            },
            getLearnById() {
                this.$u.api.studyApi.getLearnById({
                    id: this.id
                }).then(res => {
                    console.log(res)
                    this.objData = res
                    this.$u.vuex('s_bus', this.objData)
                    this.isLikes = res.isLikes
                    this.isFavorites = res.isFavorites
                    // console.log(this.isLikes)
                    // console.log(this.isFavorites)
                    if (this.isFavorites === true) {
                        this.star = true
                    } else {
                        this.star = false
                    }
                    if (this.isLikes === true) {
                        this.praise = true
                    } else {
                        this.praise = false
                    }
                    this.createTime = res.createTime
                    this.typeName = res.typeName
                    this.learnName = res.learnName
                    this.clickOn = res.clickOn
                    this.forward = res.forward
                    this.favorites = res.favorites
                    this.likes = res.likes
                    this.uploadFile = res.uploadFile
                    this.uploadIcon = res.uploadIcon || ''
                    this.label = res.label
                    this.labelType = res.labelType
                    // console.log(this.label)
                    this.initTime = parseInt(res.progress)
                    this.videoExist = true;
                })
            },
            getVideoList() {
                // console.log(this.isVideo)
                this.loadMoreStatus = 'loading'
                const par = {
                    parameter: {
                        id: this.id,
                        brandId:this.brandId,
                        cateId:this.cateId,
                        modelId:this.modelId
                    }
                }
                this.$u.api.studyApi.getBroadcastList(par).then(res => {
                    this.videoLists = res
                })
            },
            starhandle(v) {
                console.log(v)

            },
            timeupdate(detail) {
                this.currentTime = detail.target.currentTime
            },
            praisehandle(v) {

            },
            // 分享到微信好友
            wechatFirend() {
                let that = this
                uni.share({
                    provider: "weixin",
                    scene: "WXSceneSession",
                    type: 0,
                    href: "https://iotapp.prod.ilabeco.com/iot.html",
                    title: that.learnName || "铀铀分享",
                    summary: "我正在使用铀铀APP，赶紧跟我一起来体验吧！",
                    imageUrl: 'https://iotapp.prod.ilabeco.com/download/iot/common/share-logo.png',
                    success: function (res) {
                        console.log("success:" + JSON.stringify(res))
                        uni.showToast({
                            title: '分享成功'
                        })
                        that.shareShow = false
                    },
                    fail: function (err) {
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
            // 分享到微信朋友圈
            wechatCircle() {
                let that = this
                uni.share({
                    provider: "weixin",
                    scene: "WXSenceTimeline",
                    type: 0,
                    href: "https://iotapp.prod.ilabeco.com/iot.html",
                    title: that.learnName || "铀铀分享",
                    summary: "我正在使用铀铀APP，赶紧跟我一起来体验吧！",
                    imageUrl: 'https://iotapp.prod.ilabeco.com/download/iot/common/share-logo.png',
                    success: function(res) {
                        console.log("success:" + JSON.stringify(res));
                        uni.showToast({
                            title: '分享成功'
                        })
                        that.shareShow = false
                    },
                    fail: function(err) {
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

        },
        onLoad(data) {
            this.id = data.id
            this.instruId = data.instruId
            this.brandId = data.brandId
            this.cateId = data.cateId
            this.modelId = data.modelId

            this.getVideoList()

            // 浏览量
            this.$u.api.studyApi.updateClickOnNumById({
                id: this.id,
                clickOn: 1
            }).then(res => {
                console.log(res)
                this.clickOn++
                this.getLearnById()
            })

        },
        beforeDestroy() {
            console.log('beforeDestroy')
            this.$u.api.studyApi.updateProgress({
                materId: this.id,
                progress: this.currentTime
            }).then(res => {
                console.log(res)
            })
        },
        onShow() {

        },
    }
</script>

<style scoped lang="scss">
    .top {
        width: 100vw;

        video {
            width: 100%;
        }
    }

    .book_box {
        min-height: 250rpx;
        display: flex;
        align-items: center;
        background-color: #fff;
        border-bottom: 2rpx solid #D8D8D8;
        padding: 20rpx;
        overflow: hidden;
        z-index: 2222;

        /deep/.u-checkbox__label {
            margin: 0;
        }

        .content {
            flex: 1;
            display: inline-block;

            .title {
                padding-right: 20rpx;
                font-size: 28rpx;
                color: #111737;
                line-height: 44rpx;
                margin-bottom: 24rpx;
            }

            .info {
                display: flex;
                align-items: center;
                color: #77787D;
                font-size: 24rpx;
                margin-bottom: 25rpx;
                flex-wrap: wrap;
                padding-right: 10rpx;

                // width: 320rpx;
                .u-tag {
                    margin-right: 10rpx;
                    margin-bottom: 10rpx;

                    min-width: 124rpx;
                    height: 56rpx;
                    line-height: 44rpx;
                    background: #F3F8FF;
                    border-radius: 28rpx;
                    text-align: center;
                    font-size: 24rpx;
                    font-weight: 400;
                    color: #2C72F9;
                    border: none;

                    &.orange{
                        background-color: #fdf6ec;
                        color: #ff9900;
                    }
                }
            }

            .info-list {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                color: #979797;
                font-size: 24rpx;

                .info-item {
                    .iconfont {
                        margin: 10rpx;
                    }
                }

                .time {
                    flex: 1;
                    text-align: right;
                }
            }
        }
    }

    .play {
        padding-bottom: 220rpx;

        .play_list {
            background-color: #fff;
            padding: 20rpx;
            color: #333333;
            font-size: 32rpx;
            font-weight: 500;
            margin-top: 24rpx;
        }
    }

    .footer {
        position: fixed;
        bottom: 0;
        height: 220rpx;
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        z-index: 20;
        padding-top: 44rpx;

        .able {
            display: flex;
            align-items: center;
            flex-flow: column;
            margin-top: 20rpx;

            .iconfont {
                font-size: 64rpx;
                padding: 20rpx 0;
            }

            &.content {
                margin-top: 16rpx;
                color: #77787D;
                font-size: 24rpx;
            }

            &.light {
                margin-top: 16rpx;
                color: #2C72F9;
                font-size: 24rpx;
            }
        }
    }

    .share_top {
        color: #333333;
        font-size: 34rpx;
        padding: 30rpx;
        text-align: center;
    }

    .share_content {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .share_type {

        display: flex;
        flex-flow: column;
        align-items: center;

        .share_icon {
            font-size: 88rpx;
            margin-bottom: 20rpx;

            &.weChat {
                color: #07bd13;
            }

            &.friend {
                color: #2dc886;
            }

            &.qq {
                color: #4885ff;
            }

            &.weibo {
                color: #f04848;
            }
        }
    }

    .share_footer {
        height: 120rpx;
        color: #9B9CA1;
        font-size: 32rpx;
        text-align: center;
    }
</style>
