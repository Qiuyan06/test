<template>
	<view class="problemFeedback">
		<u-form :model="form" ref="uForm">
			<view class="des">
				<view>
					<u-icon name="info" class="iconfont" height="12rpx" width="12rpx" color="#fff" size="20" />
				</view>
				<view style="line-height: 32rpx">专业为您提供专业、高效、高品质的仪器设备管系统，欢迎您反馈使用中的意见与建议！</view>
			</view>
			<view class="feedbackType">
				<view class="title">反馈类型</view>
				<view class="content">
					<view class="itemType" :class="{active: currTypeIndex === index}"
						v-for="(item, index) in feedbackType" ref="items" :key="index"
						@click="selectFeedbackType(index)">{{item}}</view>
				</view>
			</view>
			<view class="remarks">
				<view class="title">备注说明</view>
				<u-form-item :border-bottom="false">
					<u-input type="textarea" v-model="form.content" placeholder="请说明" :height="170" :auto-height="false"
						:custom-style="{fontSize:'30rpx'}" :maxlength="300"/>
				</u-form-item>
			</view>
			<view class="contactType">
				<view class='title'>联系方式</view>
				<u-form-item label="姓名" label-width="140" class="name">
					<u-input type="text" v-model="form.contactName" placeholder="未填写" :height="96" input-align="right"
						maxlength="20" />
				</u-form-item>
				<u-form-item label="联系电话" label-width="140" class="phone">
					<u-input v-model="form.contactPhone" type="number" placeholder="未填写" :height="96"
						input-align="right" maxlength="20" />
				</u-form-item>
			</view>
		</u-form>

		<u-button class="submit" type="primary" shape="circle"
			:custom-style="{width: '708rpx', height: '88rpx', fontSize: '34rpx'}" @click="submitForm">提交反馈</u-button>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				form: {
					contentType: '',
				},
				instruId: "",
				instruName: "",
				feedbackType: ['设备故障', '系统页面问题', '暂时性故障', '无法开机', '设备外形故障', '设备死机', '其他异常'],
				currTypeIndex: null,
			}
		},

		methods: {
			onNavigationBarButtonTap(e) {
				uni.navigateTo({
					url: `/pages/index/pages/problemFeedback/pages/feedbackRecord/index?instruId=${this.instruId}&instruName=${this.instruName}`
				})
			},

			isCheck() {
				if (!this.form.contentType) {
					uni.showToast({
						title: '请输入反馈类型',
						icon: 'none'
					});
					return false
				}
				if (!this.form.content) {
					uni.showToast({
						title: '请输入备注说明',
						icon: 'none'
					});
					return false
				}
				return true
			},
			
			// 提交反馈
			submitForm() {
				if (!this.isCheck()) return
				
				let payload = {
					parameter: {
						...this.form,
						instruId: this.instruId,
						instruName: this.instruName,
					}
				}
				this.$u.api.equipmentApi.subInstruFeedback(payload).then(res => {
					uni.showToast({
					  title: '添加成功',
					});
					setTimeout( () => {
						uni.navigateBack()
					}, 500)
				}).catch(err => {
					console.log(err)
				})
			},
			
			// 获取选种类型
			selectFeedbackType(index, e) {
				this.currTypeIndex = index;
				this.form.contentType = this.feedbackType[index]
			},
			
			// 获取可选的设备问题反馈类型
			getFeedbackType () {
				const payload = {	parameter: { dictType: 'instru_feedback' },	page: 1, pageSize: 10}
				this.$u.api.equipmentApi.getFeedbackTypes(payload).then(res=> {
					this.feedbackType = res.rows.map(item => item.dictLabel)
				}).catch(err => {
					console.log(err)
				})
			}
		},
		onLoad(data) {
			this.instruId = data.instruId;
			this.instruName = data.instruName;
			
		},
		
		onShow() {
			this.getFeedbackType();
		},
		
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss" scoped>
	.problemFeedback {
		.des {
			display: flex;
			padding: 20rpx 18rpx;
			box-sizing: border-box;

			.iconfont {
				background-color: #3386F1;
				padding: 6rpx;

				border-radius: 50%;
				margin-right: 10rpx;
			}
		}

		.feedbackType,
		.remarks,
		.contactType {
			padding: 24rpx;
			background-color: #fff;

			.title {
				color: #35353D;
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 36rpx;
			}
		}

		.feedbackType {

			.content {
				display: flex;
				flex-wrap: wrap;
				color: #333333;

				.itemType {
					padding: 22rpx 24rpx;
					margin-right: 24rpx;
					margin-bottom: 24rpx;
					border: 2rpx solid #C9CED4;
					border-radius: 6rpx;

					&.active {
						background-color: #3D7FFF;
						color: #fff;
						border: 2rpx solid #fff;
					}
				}
			}
		}

		.remarks {
			margin-top: 30rpx;
			height: 337rpx;

			/deep/ .u-form-item {
				padding: 0;
			}

			/deep/ uni-textarea {
				height: 0;
			}
		}

		.contactType {
			padding-bottom: 42rpx;
			margin-top: 30rpx;

			.title {
				margin-bottom: 24rpx;
			}

			.name,
			.phone {
				color: #333333;
				font-size: 32rpx;
			}

			/deep/ .u-form-item {
				padding: 0rpx;
			}
		}

		.submit {
			margin-top: 94rpx;
			color: #fff;
			background-color: #2C72F9;
		}
	}
</style>
