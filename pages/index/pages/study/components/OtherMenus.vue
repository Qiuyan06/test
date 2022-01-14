<template>
	<view class="book_box" @click="wordInfo(item.id,item.typeId)">
		<view class="content">
			<view class="title">
				<text v-if="item.typeId===2" class="iconfont photo">&#xe68e;</text>
				<text v-if="item.typeId===3">
					<u-image src="@/static/images/study/compress.png" mode="widthFix" style="width: 36rpx; margin-right: 10rpx;"></u-image>
				</text>
				<text v-if="item.typeId===4">
					<u-image src="@/static/images/study/pdf.png" mode="widthFix" style="width: 36rpx; margin-right: 10rpx;"></u-image>
				</text>

				<text v-if="item.typeId===5" class="iconfont word">&#xe67d;</text>
				<text>{{item.learnName}}</text>
			</view>
			<view class="info">
				<template v-if="item.labelType">
					<u-tag
							class="tag"
							type="warning"
							size="mini"
							v-for="(tag,index) in JSON.parse(item.labelType)"
							:text="tag"
							:key="Math.random()"
							:class="tag === '故障类' || tag === '维修类' ? 'orange': ''"
					/>
				</template>
				<template v-if="item.label">
					<u-tag class="tag" v-for="(tag,index) in item.label.split(',')" type="primary" :key="index" :text="tag" size="mini"></u-tag>
				</template>
			</view>
			<view class="info-list">
				<view class="info-item">
					<text class="iconfont">&#xe673;</text>
					<text class="look">浏览</text>
					<text>{{item.clickOn}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	var testModule = uni.requireNativePlugin("ass-docpreview")
	// #endif

	export default {
		options: {
			styleIsolation: 'shared'
		},
		props: {
			item: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				id: null
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
			wordInfo(id, type) {
				console.log(type)
				if (!type) {
					uni.navigateTo({
						url: '/pages/study/pages/DecodeDetail/index?id=' + id
					})
					if(this.s_token){
						this.id = id
						this.$u.api.studyApi.updateClickOnNumById({
							id,
							clickOn: 1
						}).then(res => {
							console.log(res)
						})
					}

				} else {
					if(this.s_token){
						this.id = id
						this.$u.api.studyApi.updateClickOnNumById({
							id,
							clickOn: 1
						}).then(res => {
							console.log(res)
						})
					}
					this.getLearnById()
				}
			}
		},

		onShow(){

		}
	}
</script>

<style scoped lang="scss">
	.book_box {
		width: 96%;
		border-radius: 24rpx;
		/*min-height: 250rpx;*/
		display: flex;
		align-items: center;
		background-color: #fff;
		margin: 24rpx auto;
		padding: 20rpx;
		overflow: hidden;
		z-index: 2222;

		/deep/ .u-checkbox__label {
			margin: 0;
		}
		.content {
			flex: 1;
			display: inline-block;

			.title {
				padding-right: 20rpx;
				font-size: 30rpx;
				color: #111737;
				line-height: 44rpx;
				margin-bottom: 24rpx;
				display: flex;

				text{
					line-height: 38rpx;
				}

				.iconfont {
					font-size: 40rpx;
					margin-right: 10rpx;

					&.photo {
						color: #c44a5b;
					}

					&.ppt {
						color: #A33639;
					}

					&.word {
						color: #3157BE;
					}

					&.exlsx {
						color: #39A961;
					}
				}
			}

			.info {
				display: flex;
				align-items: center;
				color: #77787D;
				font-size: 24rpx;
				margin-bottom: 25rpx;
				// width: 320rpx;
				flex-wrap: wrap;
				.tag{
					margin-right: 10rpx;
					margin-bottom: 10rpx;
				}
				/deep/ .u-tag {
					/*margin-right: 10rpx;*/
					/*margin-bottom: 10rpx;*/
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
				.btn {
					font-size: 24rpx;
					padding: 10rpx 20rpx;
					border-radius: 20rpx;
					margin-right: 10rpx;

					&.blue {
						color: #2C72F9;
						background-color: #F3F8FF;
					}
				}

			}

			.info-list {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.info-item {
					color: #979797;
					font-size: 24rpx;

					.iconfont {
						margin: 10rpx;
					}

					.look {
						margin-right: 6rpx;
					}
				}
			}
		}
	}

</style>
