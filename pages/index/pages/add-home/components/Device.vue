<template>
	<view class="Device">
		<view class="content">
			<view class="image">
				<u-image width="180rpx" height="180rpx" border-radius="12" :src="comData.img">
					<u-loading slot="loading"></u-loading>
				</u-image>
			</view>
			<view class="contents">
				<view class="title">
					<text>{{comData | typeFilter }}</text>
				</view>
				<view class="info">
					<text>仪器编号 {{comData.instruNo||''}}</text>
				</view>
				<view class="info">
					<text>添加日期 {{comData.createTime||''}}</text>
				</view>
			</view>
		</view>
<!--		<u-checkbox v-model="comData.checked" :name="comData.instruForRoomId" label-size="0" shape="circle"></u-checkbox>-->
		<u-checkbox v-model="comData.checked" :name="comData" label-size="0" shape="circle"></u-checkbox>
	</view>
</template>
<script>
	export default {
		filters: {
			typeFilter(val) {
				if (!val.equipType || val.equipType === 4) return val.instruName
				return `${val.instruName}（${['云盒子', '仪器猫', '仪器猫伴侣'][val.equipType - 1]}）`
			},
		},
		props: {
			comData: {
				type: Object,
				required: true
			},
			flag: {
				type: Boolean,
				default: false
			}
		},
		methods: {

		}
	}
</script>
<style lang="scss" scoped>
		.Device {
			position: relative;
			display: flex;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			padding: 24rpx 0;
			overflow: hidden;
			margin-bottom: 18rpx;


			.content {
				flex: 1;
				margin: 0 30rpx 0 30rpx;
				display: flex;
				.image {
					padding-right: 30rpx;
				}
				.contents{
					flex: 1;
				}
				.title {
					padding-right: 120rpx;
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
					margin-bottom: 16rpx;

					.info-text {
						width: 0;
						flex: 1;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;

						&.instru-num {
							margin-right: 20rpx;
						}
					}

				}
			}
		}
</style>
