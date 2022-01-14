<template>
	<view class="feedbackRecord">
		<view class="item" v-if="!isEmpty" v-for="(item, index) in list" :key="index">
			<view class="title">{{item.contentType}}</view>
			<view class="content">
				<view class="content_item">
					<view class="item_title">
						<text class="iconfont">&#xe649;</text>
						<text>提交时间</text>
					</view>
					<view class="item_box">{{item.createTime}}</view>
				</view>
				<view class="content_item">
					<view class="item_title">
						<text class="iconfont">&#xe64d;</text>
						<text>备注说明</text>
					</view>
					<view class="item_box" style="margin-bottom: 26rpx;">{{item.content}}</view>
				</view>
				<view v-if="item.feedback" class="content_item" style="padding-top: 31rpx; border-top:2rpx solid #eeeeee;">
					<view class="item_title">
						<text class="iconfont">&#xe641;</text>
						<text>管理员回复</text>
					</view>
					<text class="item_box" style="margin-left: 16rpx;">{{item.feedback}}</text>
				</view>
				<view v-if="item.processTime" class="content_item">
					<view class="item_title">
						<text class="iconfont">&#xe649;</text>
						<text>处理时间</text>
					</view>
					<view class="item_box">{{item.processTime}}</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="loadMoreStatus" bg-color="#F6F7FC" margin-top="10" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				instruId: "",
				instruName: "",
				page: 1,
				pageSize: 10,
				loadMoreStatus: 'loading',
				init: false
			}
		},
		computed: {
			isEmpty() {
				if (this.list.length < 1 && this.init) {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			getFeedbackList() {
				this.loadMoreStatus = 'loading'
				const payload = {
					parameter: {
						instruId: this.instruId,
						instruName: this.instruName,
					},
					page: this.page,
					pageSize: this.pageSize
				}
				this.$u.api.equipmentApi.instruFeedbackList(payload).then(res => {
					const rows = res.rows || []
					if (rows && Array.isArray(rows)) {
						this.list = this.list.concat(rows)
					}
					this.hasMorePage(res.total || 0, rows.length)
				}).catch(err => {
					console.log(err);

					this.loadMoreStatus = 'nomore'
				}).finally(() => {
					this.init = true
					uni.stopPullDownRefresh()
				})
			},

			// 判断是否还有下一页
			hasMorePage(total = 0, dataSize = 0) {
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
			}
		},
		
		onLoad(data) {
			this.instruId = data.instruId;
			this.instruName = data.instruName;
		},
		
		onShow() {
			this.getFeedbackList()
		},
	

		onPullDownRefresh() {
			this.resetData()
			this.getFeedbackList()
		},

		onReachBottom() {
			if (this.loadMoreStatus === 'loadmore') {
				this.page++
				this.getFeedbackList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.feedbackRecord {
		padding: 18rpx;

		.item {
			background-color: #fff;
			border-radius: 16rpx;
			margin-bottom: 18rpx;

			.title {
				display: flex;
				align-items: center;
				// height: 90rpx;
				line-height: 40rpx;
				color: #333333;
				font-size: 30rpx;
				font-weight: bold;
				padding: 28rpx 24rpx;
				border-bottom: 2rpx solid #EEEEEE;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// white-space: nowrap;
			}

			.content {
				font-size: 26rpx;
				color: #666666;

				.content_item {
					display: flex;
					padding: 0 24rpx;

					.item_title {
						line-height: 64rpx;
						min-width: 160rpx;

						.iconfont {
							margin-right: 8rpx;
						}
					}

					.item_box {
						line-height: 64rpx;
						flex: 1;
						overflow: hidden;
						// text-overflow: ellipsis;
						// display: -webkit-box;
						// -webkit-line-clamp: 2;
						// -webkit-box-orient: vertical;
						word-break:break-all;
					}
				}
			}
		}
	}
</style>
