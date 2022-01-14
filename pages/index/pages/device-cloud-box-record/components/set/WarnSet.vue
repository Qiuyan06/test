<template>
	<u-popup v-model="setShow" mode="right" width="90%" :closeable="false" :mask-close-able="true" class="setBox">
		<view class="headTitle">
			预警设置
			<u-icon name="close" size="40" @click="close"></u-icon>
		</view>
		<u-form :model="detail" ref="detailRef">
			<u-form-item prop="minOutvoltage" :label-width="0">
				<view class="setItem">
					<view class="title">电压最小值</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input
								type="number"
								v-model="detail.minOutvoltage"
								placeholder="输入电压最小值"
								maxlength="6"
							/>
						</view>
						<text class="unit">V</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="maxOutvoltage">
				<view class="setItem">
					<view class="title">电压最大值</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input
								type="number"
								v-model="detail.maxOutvoltage"
								placeholder="输入电压最大值"
								maxlength="6"
							/>
						</view>
						<text class="unit">V</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="type">
				<view class="setItem">
					<view class="title">类型</view>
					<view class="wrap" style="margin-top: 20rpx;">
						<u-tag text="按电流" shape="square" :closeable="false" :mode="detail.type === 0 ? 'dark' : 'plain'" @click="handleTypeClick(0)" />
						<u-tag text="按功率" shape="square" :closeable="false" :mode="detail.type === 1 ? 'dark' : 'plain'" @click="handleTypeClick(1)" />
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="maxOutcurrent" v-if="detail.type === 0">
				<view class="setItem">
					<view class="title">电流最大值</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input
								type="number"
								v-model="detail.maxOutcurrent"
								placeholder="输入电流最大值"
							 	maxlength="6"
							/>
						</view>
						<text class="unit">A</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="maxOutcurrent" v-if="detail.type === 1">
				<view class="setItem">
					<view class="title">功率最大值</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input
									type="number"
									v-model="detail.power"
									placeholder="输入功率最大值"
									maxlength="6"
							/>
						</view>
						<text class="unit">W</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="thresholdDistance">
				<view class="setItem">
					<view class="title">最远移动距离</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input
								type="number"
								v-model="detail.thresholdDistance"
								placeholder="输入最远移动距离"
								maxlength="6"
							/>
						</view>
						<text class="unit">KM</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="warnTime">
				<view class="setItem">
					<view class="title">连续预警阈值</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input
								type="number"
								v-model="detail.warnTime"
								placeholder="输入连续预警阈值"
								maxlength="6"
							/>
						</view>
						<text class="unit">S</text>
					</view>
				</view>
			</u-form-item>
		</u-form>
		<view class="footer-btn">
			<u-button shape="circle" class="reset-btn" @click="close">取消</u-button>
			<u-button type="primary" shape="circle" class="search-btn" @click="handleSubmit">确认</u-button>

		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			instruId: {
				type: String,
				required: true
			},
			instruNum: {
				type: String,
				required: true
			},
			dbName: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				setShow: false,
				detail: {
					minOutvoltage: null,
					maxOutvoltage: null,
					type: null,
					maxOutcurrent: null,
					thresholdDistance: null,
					warnTime: null,
				}
			}
		},
		methods: {
			// 显示预警设置弹框
			show() {
				this.setShow = true
				this.getWarnSetData()

			},
			// 关闭预警设置弹框
			close() {
				this.detail = {
					minOutvoltage: null,
					maxOutvoltage: null,
					type: null,
					maxOutcurrent: null,
					thresholdDistance: null,
					warnTime: null
				}
				this.setShow = false
			},
			// 获取预警设置数据
			getWarnSetData() {
				this.$u.api.equipmentApi.selectIcInstruCountById({
					parameter: {
						instruId: this.instruId,
						dbName: this.dbName
					}
				}).then(res => {
					const {minOutvoltage,maxOutvoltage,type,maxOutcurrent,thresholdDistance,warnTime,power} = res
					this.detail = {minOutvoltage, maxOutvoltage, type, maxOutcurrent, thresholdDistance, warnTime,power}
				})
			},
			// 选择类型
			handleTypeClick(type) {
				this.detail.type = type
			},
			// 提交预警设置表单
			handleSubmit() {
				if (this.isLock || !this.isCheck()) {
					return
				}
				this.isLock = true
				this.$u.api.equipmentApi.addAlarmSettings({
					parameter: { ...this.detail,
						instruId: this.instruId,
						instruNum: this.instruNum,
						dbName: this.dbName
					}
				}).then(res => {
					this.close()
					this.$emit('handleSuccess')
				}).finally(() => {
					this.isLock = false
				})
			},
			// 校验表单
			isCheck(){
				if(!this.detail.minOutvoltage){
					uni.showToast({
						title: '请输入电压最小值',
						icon: 'none'
					});

					return  false
				}
				if(!this.detail.maxOutvoltage){
					uni.showToast({
						title: '请输入电压最大值',
						icon: 'none'
					});

					return  false
				}
				if(!this.detail.type && this.detail.type !==0){
					uni.showToast({
						title: '请选择类型',
						icon: 'none'
					});

					return  false
				}
				if(this.detail.type===0 && !this.detail.maxOutcurrent){
					uni.showToast({
						title: '请输入电流最大值',
						icon: 'none'
					});

					return  false
				}
				if(this.detail.type===1 && !this.detail.power){
					uni.showToast({
						title: '请输入功率最大值',
						icon: 'none'
					});

					return  false
				}
				if(!this.detail.thresholdDistance){
					uni.showToast({
						title: '请输入最远移动距离',
						icon: 'none'
					});

					return  false
				}
				if(!this.detail.warnTime){
					uni.showToast({
						title: '请输入连续预警阈值',
						icon: 'none'
					});

					return  false
				}
				return true
			}
		},

	}
</script>

<style scoped lang="scss">
	.setBox {

		/deep/ .u-form-item {
			margin-bottom: 48rpx;
		}

		/deep/ .u-form-item__message {
			padding-left: 20rpx !important;
		}

		.headTitle {
			text-align: center;
			margin: 56rpx 0 56rpx 0;
			height: 48rpx;
			font-size: 34rpx;
			font-weight: 500;
			color: #111111;
			line-height: 48rpx;
			.u-icon{
				position: absolute;
				top: 60rpx;
				right: 30rpx;
			}
		}

		.setItem {
			width: 100%;
			font-size: 32rpx;
			font-weight: 400;
			padding: 0rpx 20rpx;
			// margin-bottom: 48rpx;
			background-color: #fff;
			color: #333333;
			// border-bottom: 2rpx solid #f5f5f5;

			.title {
				width: 100%;
			}

			.wrap {
				display: flex;
				align-items: center;

				.u-tag {
					margin-right: 20rpx;
				}

				.unit {
					margin: 26rpx 0 0 20rpx;
				}

				.u-radio-group {
					padding: 28rpx 0 25rpx 0;
				}

				.wrap_input {
					flex: 1;
					padding-top: 26rpx;

					.val {
						font-size: 30rpx;
						color: #c0c4cc;
						margin-right: 14rpx;

						&.selected {
							color: #333;
						}
					}
				}

				.icon {
					color: #CCCCCC;
					margin-left: 10rpx;
				}
			}
		}

		.footer-btn {
			padding: 0 25rpx;
			margin-bottom: 25rpx;
			font-size: 32rpx;

			uni-button {
				margin-bottom: 45rpx;
			}

			.search-btn {
				float: right;
				width: 45%;
				height: 88rpx;
			}

			.reset-btn {
				float: left;
				width: 45%;
				height: 88rpx;
			}
		}
	}
</style>
