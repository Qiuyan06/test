<template>
	<u-popup v-model="editShow" mode="right" width="90%" :closeable="true" :mask-close-able="true" class="editBox">
		<view class="headTitle">{{type==='add' ? '计量新增' :'计量编辑'}}</view>
		<u-form :model="meteringForm" ref="meteringRef">
			<u-form-item prop="measureTime">
				<view class="editItem">
					<view class="title">计量时间</view>
					<view class="wrap" style="margin:20rpx 0;">
						<view class="wrap_input" @click="timeShow = true">
							<text class="val" :class="meteringForm.measureTime?'selected':''">
								{{meteringForm.measureTime || '请选择时间'}}
							</text>
						</view>
						<text class="iconfont icon" style="margin-top: 20rpx;" @click="timeShow = true">&#xe642;</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="amount">
				<view class="editItem">
					<view class="title">金额费用</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input v-model="meteringForm.amount" placeholder="请输入金额" type="number" />
						</view>
						<text style="margin: 26rpx 0 0 20rpx;">元</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="indate">
				<view class="editItem">
					<view class="title">有效期</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input type="number" v-model="meteringForm.indate" placeholder="请输入有效期" />
						</view>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="measureUnit">
				<view class="editItem">
					<view class="title">计量单位</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input v-model="meteringForm.measureUnit" placeholder="请输入计量单位" />
						</view>
					</view>
				</view>
			</u-form-item>
		</u-form>
		<view class="footer-wrap">
			<view class="footer-btn">
				<u-button shape="circle" class="reset-btn" @click="handleCancel">取消</u-button>
				<u-button type="primary" shape="circle" class="search-btn" @click="handleSubmit">确认</u-button>
			</view>
		</view>
		<u-picker v-model="timeShow" mode="time" :safe-area-inset-bottom="true" :params="timeParams" @confirm="timeConfirm"></u-picker>
	</u-popup>
</template>

<script>
	import  {Decimal} from 'decimal.js'
	export default {
		data() {
			return {
				type: null,
				editShow: false,
				timeShow: false,
				id: null,
				timeParams: {
					year: true,
					month: true,
					day: true,
				},
				meteringForm: {
					measureTime: '',
					indate: null
				},
			}
		},
		methods: {
			show(type, id = null) {
				this.editShow = true
				this.type = type
				this.id = id
				if (type === 'edit') {
					this.$u.api.equipmentApi.getMeasure({
						parameter: {
							id
						}
					}).then(res => {
						this.meteringForm = {
							measureTime: res.measureTime,
							indate: `${res.indate}`,
							amount: `${res.amount/100}`,
							measureUnit: res.measureUnit
						}
					})
				}
			},
			close() {
				this.meteringForm = {
					measureTime: '',
				}
				this.editShow = false
			},
			timeConfirm(data) {
				this.$set(this.meteringForm, 'measureTime', `${data.year}-${data.month}-${data.day}`);
			},
			handleCancel() {
				this.close()
			},
			isCheck() {
				// 校验计量时间
				if (!this.meteringForm.measureTime) {
					uni.showToast({
						title: '请选择时间',
						icon: 'none'
					});
					return false
				}

				// 校验金额
				if (!this.meteringForm.amount) {
					uni.showToast({
						title: '请输入金额',
						icon: 'none'
					});
					return false
				} else {
						if (!(/^[+]?\d+(.\d{0,2})?$/.test(this.meteringForm.amount))){
							uni.showToast({
								title: '请输入正确的金额',
								icon: 'none'
							});
							return false;
						}

				}


				if (!this.meteringForm.indate) {
					uni.showToast({
						title: '请输入有效期',
						icon: 'none'
					});
					return false
				} else {
					if (Number.isNaN(Number(this.meteringForm.indate))) {
						uni.showToast({
							title: '有效期格式错误',
							icon: 'none'
						});
						return false;
					} else {
						if (Number(this.meteringForm.indate) < 0) {
							uni.showToast({
								title: '有效期应大于等于0',
								icon: 'none'
							});
							return false;
						}
					}
				}

				if (!this.meteringForm.measureUnit) {
					uni.showToast({
						title: '请输入计量单位',
						icon: 'none'
					});
					return false
				}
				return true
			},
			handleSubmit() {
				if (this.isCheck()) {
					const newAmount = new Decimal(this.meteringForm.amount).mul(100)
					if (this.type === 'add') {
						this.$emit('save', { ...this.meteringForm,
							amount: newAmount.valueOf()
						})
					} else {
						this.$emit('update', { ...this.meteringForm,
							amount: newAmount.valueOf(),
							id: this.id
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.editBox {
		/deep/ .u-close--top-right {
			top: 70rpx;
			right: 30rpx;

			.u-iconfont {
				color: #111111 !important;
			}
		}

		/deep/ .u-form-item {
			margin-bottom: 48rpx;
		}

		/deep/ .u-form-item__message {
			padding-left: 20rpx !important;
			margin-top: 0;
		}

		.headTitle {
			text-align: center;
			margin: 56rpx 0 56rpx 0;
			height: 48rpx;
			font-size: 34rpx;
			font-weight: 500;
			color: #111111;
			line-height: 48rpx;
		}

		.editItem {
			width: 100%;
			font-size: 32rpx;
			font-weight: 400;
			padding: 0rpx 20rpx;
			// margin-bottom: 48rpx;
			background-color: #fff;
			color: #333333;

			.title {
				width: 100%;
			}

			.wrap {
				display: flex;
				align-items: center;
				// border-bottom: 2rpx solid #f5f5f5;

				&.remark {
					border: none;

					/deep/ .u-input__textarea {
						border: 2rpx solid #f5f5f5;
						padding: 16rpx;
					}
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

		.footer-wrap {
			position: fixed;
			width: 100%;
			bottom: 80rpx;

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

	}
</style>
