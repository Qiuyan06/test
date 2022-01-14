<template>
	<view class="message">
		<view class="box" v-for="(item, index) in list" :key="index">
			<view class="box_title">
				<u-image v-if="item.msgType === 1" width="56rpx" height="56rpx"
					src="~@/static/images/message/warning.png" />
				<u-image v-else-if="item.msgType === 2" width="56rpx" height="56rpx"
					src="~@/static/images/message/authentication.png" />
				<u-image v-else-if="item.msgType === 3" width="56rpx" height="56rpx"
					src="~@/static/images/message/study.png" />
				<u-image v-else-if="item.msgType === 4" width="56rpx" height="56rpx"
					src="~@/static/images/message/feedback.png" />
				<u-image v-else-if="item.msgType === 5" width="56rpx" height="56rpx"
					src="~@/static/images/message/share.png" />


				<view class="title">
					<!-- 1设备报警详情页、2实名认证页、3我的学习资料、4意见反馈详情页、5设备共享成员页 -->
					<text style="position: relative;">{{ item.title }}
						<u-badge :is-dot="!item.flag" :offset="[16, -30]" :count="item.flag ? 0 : 1" color="#F04848" />
					</text>
				</view>
				<text class="time">{{ item.createTime }}</text>
			</view>
			<u-gap height="2" bg-color="#eee"></u-gap>
			<view class="content">
				{{ item.content }}
			</view>
			<view class="watch" @click="getMessageDetail(item)">查看详情</view>
		</view>
		<u-loadmore :status="loadMoreStatus" bg-color="#F6F7FC" margin-top="20" margin-bottom="20"/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messageNum: 2,
				page: 1,
				pageSize: 10,
				list: [],
				loadMoreStatus: 'loading',
				init: false,
				total:''
			}
		},
		computed: {
			isEmpty() {
				return this.list.length < 1 && this.init
			},
		},
		methods: {
			// 一键已读按钮
			onNavigationBarButtonTap(e) {
				const payload = {
					page: this.page,
					pageSize: this.total
				}
				this.$u.api.userApi.pushSystemMsgList(payload).then(res => {
					const rows = res.rows || []
					let arr = rows.filter(item => item.flag === 0).map(item => item.id);
					const payload = {
						ids: arr.join(',')
					}
					this.$u.api.userApi.readSystemMsg(payload).then(res => {
						this.getData(true)
					}).catch(e => {
						console.log(e)
					})
				}).catch(e => {
					console.log(e);
				})
			},

			getData(isUpdate) {
				this.loadMoreStatus = 'loading'
				const payload = {
					page: this.page,
					pageSize: this.pageSize
				}
				this.$u.api.userApi.pushSystemMsgList(payload).then(res => {
					const rows = res.rows || []
					this.total = res.total
					// isUpdate 用于更新页面的数据
					if (rows && Array.isArray(rows) && !isUpdate) {
						this.list = this.list.concat(rows)
					}else	{
						this.list = rows
					}
					this.hasMorePage(res.total || 0, rows.length)
				}).catch(e => {
					console.log(e);
					this.loadMoreStatus = 'nomore'
				}).finally(() => {
					this.init = true
					uni.stopPullDownRefresh()
				})
			},
			hasMorePage(total = 0, dataSize = 0) { // 判断是否还有下一页
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
				this.loadMoreStatus = 'loadmore'
				this.flag = false
				this.isAllSelected = false
				this.checkedList = []
				this.allcheckarr = []
				this.lengthData = 0
			},

			// 查看详情   1设备报警详情页、2实名认证页、3我的学习资料、4意见反馈详情页、5设备共享成员页
			getMessageDetail(data) {
				this.$u.api.userApi.readSystemMsg({
					ids: String(data.id)
				}).then(res => {
					switch (Number(data.msgType)) {
						// 设备报警详情
						case 1:
							uni.navigateTo({
								url: '/pages/me/pages/device-record/pages/warning/index?type=1',
							})
							break;

							// 实名认证详情
						case 2:
							uni.navigateTo({
								url: `/pagesMine/pages/personalData/pages/certification/index?status=${data.linkId}`,
							})
							break;

							// 学习资料详情
						case 3:
							uni.navigateTo({
								url: '/pages/me/pages/my-study/index',
							})
							break;

							// 意见反馈详情
						case 4:
							uni.navigateTo({
								url: '/pagesMine/pages/feedback/pages/feedbackRecord/index',
							})
							break;

							// 分享仪器
						case 5:
							uni.navigateTo({
								url: `/pages/index/pages/device-member/index?instruId=${data.linkId || 0}&jurisdiction=1&dbName=`,
							})
							break;
			
					}
					this.getData()
				}).catch(e => {
					console.log(e)
				})
			}
		},
		onShow() {
			this.list = []
			this.page = 1
			this.getData()
		},
		onPullDownRefresh() {
			this.resetData()
			this.getData()
		},
		onReachBottom() {
			if (this.loadMoreStatus === 'loadmore') {
				this.page++
				this.getData()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.message {
		padding: 0 24rpx;

		.box {
			background-color: #fff;
			margin-top: 24rpx;
			border-radius: 16rpx;
			font-size: 30rpx;

			.box_title {
				height: 96rpx;
				display: flex;
				align-items: center;
				padding: 0rpx 24rpx 0rpx 18rpx;

				.title {
					position: relative;
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-weight: bold;
					margin-left: 10rpx;
				}

				.time {
					color: #999999;
					font-size: 26rpx;
				}
			}

			.content {
				height: 128rpx;
				padding: 20rpx 24rpx;
				line-height: 48rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.watch {
				color: #2C72F9;
				font-size: 30rpx;
				padding-bottom: 23rpx;
				padding-left: 24rpx;
			}

		}
	}

	/deep/ .u-mode-light-error {
		margin-right: 10px;
	}

	/deep/ .u-mode-light-success {
		margin-right: 10px;
	}
</style>
