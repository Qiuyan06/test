<template>
    <view class="search-data">

        <u-search placeholder="搜索" :clearabled="false" :show-action="false" v-model="keyword" @search="ChangeValue"></u-search>

        <view class="lists" v-for="item in list" @click="fileData(item)" v-if="!isEmpty">
            <view v-if="item.typeId===1" :class="item.typeId===1?'btn red':'btn blue'">视频</view>
            <view v-if="item.typeId===2" :class="item.typeId===1?'btn red':'btn blue'">图片</view>
            <view v-if="item.typeId===3" :class="item.typeId===1?'btn red':'btn blue'">压缩包</view>
            <view v-if="item.typeId===4" :class="item.typeId===1?'btn red':'btn blue'">pdf</view>
            <view v-if="item.typeId===5" :class="item.typeId===1?'btn red':'btn blue'">office</view>
            <view v-if="item.typeId===null" :class="item.typeId===1?'btn red':'btn blue'">文本</view>
						<view class="title">
                <!-- <text class="chemicals">新版化学品</text> -->
                <text>{{item.learnName}}</text>
            </view>
        </view>

        <u-loadmore v-if="!isEmpty" :status="loadMoreStatus" bg-color="#fff" style="margin-top: 20rpx;" @loadmore='loadMore' />
        <u-empty text="暂无数据" mode="list" :show="isEmpty" margin-top="100"></u-empty>
    </view>
</template>

<script>
    // #ifdef APP-PLUS
    var testModule = uni.requireNativePlugin("ass-docpreview")
    // #endif

    export default {
        data() {
            return {
                instruId:'',
                keyword: '',
                list: [],
                page: 1,
                pageSize: 10,
                init: false,
                loadMoreStatus: 'loading',
                id: null
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
            // 检查安卓存储权限
            requestPermission() {
                const _this = this
                plus.android.requestPermissions(
                    ["android.permission.READ_EXTERNAL_STORAGE","android.permission.WRITE_EXTERNAL_STORAGE"],
                    function(resultObj){
                        for (var i = 0; i < resultObj.granted.length; i++) {
                            var grantedPermission = resultObj.granted[i];
                        }

                        if(resultObj.granted.length===2){
                            uni.showLoading()
                            testModule.init(res=>{
                                uni.hideLoading()
                                if(res.code==='success'){
                                    _this.$u.api.studyApi.getLearnById({
                                        id: _this.id
                                    }).then(res => {
                                        testModule.gotoNativePage({
                                            'url': res.uploadFile,
                                            'title': res.learnName
                                        },res=>{
                                        });
                                    })
                                }
                            })
                        }

                        for (var i = 0; i < resultObj.deniedPresent.length; i++) {
                            var deniedPresentPermission = resultObj.deniedPresent[i];
                            console.log('拒绝本次申请的权限：'+ deniedPresentPermission );
                        }
                        for (var i = 0; i < resultObj.deniedAlways.length; i++) {
                            var deniedAlwaysPermission = resultObj.deniedAlways[i];
                            console.log('永久拒绝申请的权限：'+ deniedAlwaysPermission);
                        }
                        // 若所需权限被永久拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
                        /*if (resultObj.deniedAlways.length > 0) {
                            var Intent = plus.android.importClass("android.content.Intent");
                            var Settings = plus.android.importClass("android.provider.Settings");
                            var Uri = plus.android.importClass("android.net.Uri");
                            var mainActivity = plus.android.runtimeMainActivity();
                            var intent = new Intent();
                            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                            var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
                            intent.setData(uri);
                            mainActivity.startActivity(intent);
                        }*/
                    },
                    function(error){
                        console.log('申请权限错误：'+ error.code+ " = "+ error.message);
                    });
            },
            getLearnById() {
                const platform = uni.getSystemInfoSync().platform;
                if(platform == "android"){
                    this.requestPermission()
                }else{
                    this.$u.api.studyApi.getLearnById({
                        id: this.id
                    }).then(res => {
                        console.log(res)
                        testModule.gotoNativePage({
                            'url': res.uploadFile,
                            'title': res.learnName
                        });
                    })
                }

            },
            // 文档资料
            fileData(item) {
                const type = item.typeId
                if (!type) {
                    // 内容来自富文本
                    uni.navigateTo({
                        url: '/pages/study/pages/DecodeDetail/index?id=' + item.id
                    })
                    this.id = item.id
                    this.$u.api.studyApi.updateClickOnNumById({
                        id:item.id,
                        clickOn: 1
                    }).then(res => {
                        console.log(res)
                    })
                } else {
                    if (item.typeId === 1) {
                        // 视频资料
                        const brandId = `brandId=${item.brandId||''}`
                        const cateId = `cateId=${item.cateId||''}`
                        const modelId = `modelId=${item.modelId||''}`
                        uni.navigateTo({
                            url: `/pages/index/pages/study/pages/videoDetails/index?id=${item.id}&${brandId}&${cateId}&${modelId}&instruId=${this.instruId}`
                        })
                    } else {
                        // 其它文档资料
                        this.id = item.id
                        this.$u.api.studyApi.updateClickOnNumById({
                            id:item.id,
                            clickOn: 1
                        }).then(res => {
                            console.log(res)
                        })
                        this.getLearnById()
                    }
                }
            },
            ChangeValue() {
                this.page = 1;
                this.handleSearch()
            },
            handleSearch() {
                let api=''

                // #ifdef MP-WEIXIN
                api='queryLearningPageByDev'
                // #endif


                // #ifndef MP-WEIXIN
                api='queryLearningPageByDev'
                console.log('app')
                // #endif

                this.$u.api.studyApi[api]({
                    startRow: 0,
                    parameter: {
                        instruId:this.instruId,
                        learnName: this.keyword || ''
                    },
                    pageSize: this.pageSize,
                    page: this.page
                }).then(res => {
                    const rows = res.rows || []
                    if (rows && Array.isArray(rows)) {
                        if (this.page === 1) {
                            this.list = rows
                        } else {
                            this.list = this.list.concat(rows)
                        }
                        console.log(this.list)
                    }
                    this.hasMorePage(res.total || 0, rows.length)

                }).finally(() => {
                    this.init = true
                    uni.stopPullDownRefresh()
                })
            },
            loadMore() {
                console.log('进入了')
                if (this.loadMoreStatus === 'loadmore') {
                    this.page++
                    this.handleSearch()
                }
            },
            hasMorePage(total = 0, dataSize = 0) { // 判断是否还有下一页
                console.log('dataSize:', dataSize)
                console.log('pageSize:', this.pageSize)
                console.log('total:', total)
                console.log('page:', this.page)
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
                this.loadMoreStatus = 'loading'
            },
            screenChange(v) {
                // console.log(v)
                this.resetData()
                this.handleSearch()
            }
        },
        onLoad(data) {
            this.instruId = data.instruId || ''
            this.resetData()
            this.handleSearch()
        },
        onPullDownRefresh() {
            this.resetData()
            this.handleSearch()
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'loadmore') {
                this.page++
                this.handleSearch()
            }
        },
        beforeDestroy() {
            uni.hideLoading()
        },
    }
</script>

<style scoped lang="scss">
    page {
        background-color: #fff;
    }

    .search-data {
        padding: 20rpx;

        .lists {
            height: 90rpx;
            display: flex;
            align-items: center;
            border-bottom: 2rpx solid #E3E5EB;

            .title {
                flex: 1;

                // text-align: right;
                .chemicals {
                    color: #2C72F9;
                }
            }

            .btn {
                font-size: 24rpx;
                padding: 10rpx 20rpx;
                border-radius: 20rpx;
                margin-right: 10rpx;

                &.blue {
                    color: #2C72F9;
                    background-color: #F3F8FF;
                }

                &.red {
                    color: #F97A2C;
                    background-color: #FFF6F3;
                }
            }
        }
    }
</style>
