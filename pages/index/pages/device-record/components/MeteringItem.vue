<template>
	<view class="MeteringItem">
		<view class="title">
			<text class="name">计量</text>
			<view v-if="Number(jurisdiction)!==3" class="more" @click="showOptions">
				<view class="dian"></view>
				<view class="bigDian"></view>
				<view class="dian"></view>
			</view>
		</view>
		<view class="info">
			<view class="item">
				<text class="iconfont">&#xe649;</text>
				<text class="label">操作人</text>
				<text class="val">{{comData.userName || ''}}</text>
			</view>
			<view class="item">
				<text class="iconfont">&#xe649;</text>
				<text class="label">计量时间</text>
				<text class="val">{{comData.measureTime || ''}}</text>
			</view>
			<view class="item">
				<text class="iconfont">&#xe64d;</text>
				<text class="label">金额费用</text>
				<text class="val">{{amount}}元</text>
			</view>
			<view class="item">
				<text class="iconfont">&#xe64d;</text>
				<text class="label">有效期</text>
				<text class="val">{{comData.indate}}年</text>
			</view>
			<view class="item">
				<text class="iconfont">&#xe64d;</text>
				<text class="label">计量单位</text>
				<text class="val">{{comData.measureUnit || ''}}</text>
			</view>
		</view>
		<u-action-sheet :list="optionList" v-model="isShowOptions" border-radius="24" @click="confirm"></u-action-sheet>
		<!-- 确定删除弹框 -->
		<u-modal v-model="delShow" :show-title="false" :show-cancel-button="true" @confirm="handleDel">
			<view class="slot-content">
				<view class="popuper">
					<view class="warn">
						<text class="iconfont">&#xe64d;</text>
					</view>
					<view class="popuper_title">
						<view>是否确定删除记录</view>
					</view>
					<view class="tishi">
						请谨慎操作
					</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>
<script>
	import {
		setStringNumber,
		centToYuan
	} from '@/utils/index'
	export default {
		props: {
			comData: {
				type: Object,
				required: true
			},
			instruId: {
				type: String,
				required: true
			},
			jurisdiction: {
				type: [String, Number],
				required: true
			},
		},
		data() {
			return {
				isShowOptions: false,
				optionList: [{
						text: '编辑',
					},
					{
						text: '删除',
					}
				],
				delShow: false,
			}
		},
		computed: {
			amount() {
				if (!this.comData.amount || Number.isNaN(Number(this.comData.amount))) {
					return '--'
				}

				return setStringNumber(centToYuan(this, Number(this.comData.amount)))
			},
		},
		methods: {
			// 显示操作
			showOptions() {
				this.isShowOptions = true
			},
			// 操作
			confirm(index) {
				console.log(this.comData)
				switch (index) {
					case 0:
						/* 编辑 */
						this.$emit('showDetail', 'edit', this.comData.id)
						break;
					case 1:
						/* 删除 */
						this.confirmDel()
						break;
					default:
						/* 编辑 */
						this.$emit('showDetail', 'edit')
						break;
				}
			},
			/* 取消操作 */
			cancel() {
				this.isShowOptions = false
			},
			// 是否删除确认框
			confirmDel() {
				this.delShow = true
			},
			// 删除
			handleDel() {
				const params = {
					id: this.comData.id,
					instruId: this.instruId
				}
				this.$u.api.equipmentApi.deleteMeasure({
					parameter: params
				}).then((res) => {
					this.$emit('handleSuccess', 'delete')
				})

			},
		}
	}
</script>
<style lang="scss" scoped>
	.MeteringItem {
		background-color: #ffffff;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 18rpx;

		.title {
			padding: 24rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #EEEEEE;

			.name {
				flex: 1;
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-right: 24rpx;
			}

			.more {
				display: flex;
				align-items: center;
				opacity: 0.5;

				.dian {
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					background-color: #000000;
				}

				.bigDian {
					width: 11rpx;
					height: 11rpx;
					border-radius: 50%;
					background-color: #000000;
					margin: 0 8rpx;
				}
			}
		}

		.info {
			padding: 18rpx 24rpx;

			.item {
				display: flex;
				font-size: 26rpx;
				color: #666666;
				margin-bottom: 32rpx;

				&:last-of-type {
					margin-bottom: 0;
				}

				.iconfont {
					font-size: 32rpx;
					margin-right: 8rpx;
					line-height: 43rpx;
				}

				.label {
					margin-right: 8rpx;
					line-height: 43rpx;
				}

				.val {
					flex: 1;
					line-height: 43rpx;
					word-break: break-all;
				}
			}
		}
	}

	.popuper {
		text-align: center;

		.warn {

			color: #FFA033;
			padding: 60rpx 0 20rpx 0;
		}

		.popuper_title {
			color: #333333;
			font-size: 32rpx;
			font-weight: 600;

			view {
				padding: 10rpx;
			}
		}

		.tishi {
			color: #999999;
			font-size: 28rpx;
			padding: 40rpx 0 60rpx 0;
		}
	}
</style>
