<template>
	<u-popup v-model="editShow" mode="right" width="90%" :closeable="true" :mask-close-able="true" class="editBox">
		<view class="headTitle">{{type === 'add' ? '维护新增' : '维护编辑'}}</view>
		<u-form :model="detail" ref="serviceRef">
			<u-form-item prop="serverTime">
				<view class="editItem">
					<view class="title">维护时间</view>
					<view class="wrap" style="margin:20rpx 0;">
						<view class="wrap_input" @click="timeShow = true">
							<text class="val" :class="detail.serverTime?'selected':''">
								{{detail.serverTime || '请选择时间'}}
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
							<u-input v-model="detail.amount" placeholder="请输入金额" type="number" />
						</view>
						<text style="margin: 26rpx 0 0 20rpx;">元</text>
					</view>
				</view>
			</u-form-item>

			<u-form-item prop="remark" :border-bottom="false">
				<view class="editItem">
					<view class="title">备注</view>
					<view class="wrap remark">
						<view class="wrap_input">
							<u-input type="textarea" v-model="detail.remark" placeholder="请输入信息" maxlength="300" />
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
	import {Decimal} from 'decimal.js'

	export default {
		data() {
			return {
				editShow: false,
				timeShow: false,
				timeParams: {
					year: true,
					month: true,
					day: true,
				},
				detail: {
					serverTime: ''
				},
				type:null,
				id:null,
			}
		},
		methods: {
			show(type, id) {
				this.editShow = true
				this.type = type;
				this.id = id;
				if(type === 'edit'){
					this.$u.api.equipmentApi.getServiceLog({parameter:{id}}).then(res => {
						this.detail = {
							amount:`${res.amount/100}`,
							remark:res.remark,
							serverTime: res.serverTime
						}
					})
				}
			},
			close() {
				this.detail = {
					serverTime: ''
				}
				this.editShow = false
			},
			timeConfirm(data) {
				this.$set(this.detail, 'serverTime', `${data.year}-${data.month}-${data.day}`)
			},
			isCheck() {
				// 校验维护时间
				if (!this.detail.serverTime) {
					uni.showToast({
						title: '请选择时间',
						icon: 'none'
					});
					return false
				}

				// 校验金额
				if (!this.detail.amount) {
					uni.showToast({
						title: '请输入金额',
						icon: 'none'
					});
					return false
				} else {

						if (!(/^[+]?\d+(.\d{0,2})?$/.test(this.detail.amount))){
							uni.showToast({
								title: '请输入正确的金额',
								icon: 'none'
							});
							return false;
						}
				}

				if (!this.detail.remark) {
					uni.showToast({
						title: '请输入说明',
						icon: 'none'
					});
					return false
				} else {
					if (this.detail.remark.length > 300) {
						uni.showToast({
							title: '说明内容不能超过300个字符',
							icon: 'none'
						});
						return false
					}
				}
				return true
			},
			handleSubmit() {
				if (this.isCheck()) {
					const newAmount = new Decimal(this.detail.amount).mul(100)
					if(this.type === 'add'){
						this.$emit('save', { ...this.detail,
                            id:this.id,
							type: '1',
							amount:newAmount.valueOf()
						})
					}
					else{
						this.$emit('update',{ ...this.detail,
                            id:this.id,
                            type: '1',
							amount: newAmount.valueOf()
						})
					}
					this.close()

				}
			},
			handleCancel() {
				this.close();
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
			background-color: #fff;
			color: #333333;

			.title {
				width: 100%;
			}

			.wrap {
				display: flex;
				align-items: center;

				&.wrap2 {
					display: block;
					margin-top: 20rpx;
				}

				&.remark {
					border: none;

					/deep/ .u-input__textarea {
						border: 2rpx solid #f5f5f5;
						padding: 16rpx;
					}
				}

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
