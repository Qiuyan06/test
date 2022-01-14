<template>
	<view class="book_box" @click="videoInfo(item)">
		<view class="content">
			<view class="title">
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
		<view class="img">
			<u-image
					width="280rpx"
					height="200rpx"
					border-radius="12"
					:src="item.uploadIcon"
					:show-error="true"
					:error-icon="require('@/static/images/common/default-img.png')"
			>
				<u-loading slot="loading"></u-loading>
			</u-image>
		</view>
		<WechatPop ref="wechatPop"></WechatPop>
	</view>
</template>

<script>
	import WechatPop from '@/components/WechatPop'
	export default {
		options: {
			styleIsolation: 'shared'
		},
		components: {
			WechatPop
		},
		props: {
			item: {
				type: Object,
				default: {}
			},
			instruId:{
				type: String,
				default:''
			}
		},
		data() {
			return {

			}
		},
		methods: {
			showPop(){
				this.$refs.wechatPop.showPop()
			},
			videoInfo(data) {
				//#ifdef MP-WEIXIN
				this.showPop()
				//#endif
				//#ifndef MP-WEIXIN
				const brandId = `brandId=${data.brandId||''}`
				const cateId = `cateId=${data.cateId||''}`
				const modelId = `modelId=${data.modelId||''}`
				uni.navigateTo({
					url: `/pages/index/pages/study/pages/videoDetails/index?id=${data.id}&${brandId}&${cateId}&${modelId}&instruId=${this.instruId}`
				})
				//#endif
			}
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
				// width: 320rpx;
				flex-wrap: wrap;
				padding-right: 10rpx;
				min-height: 66rpx;
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
						margin-right: 10rpx;
					}

					.look {
						margin-right: 6rpx;
					}
				}
			}
		}
	}

</style>
