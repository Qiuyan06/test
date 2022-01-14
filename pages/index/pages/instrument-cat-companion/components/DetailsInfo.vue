<template>
	<view class="DetailsInfo">
		<view class="content">
			<view class="basic">
				<view class="name" @click="toInfo">
					<text>{{instruData ? instruData.instruName || '' : ''}}</text>
					<u-icon name="arrow-right" color="#111737" size="24"
						style="position: relative;top: 2rpx;left: 4rpx;"></u-icon>
				</view>
				<view class="basic-item">
					<text style="margin-right: 100rpx">编号：{{instruData ? instruData.instruNo || '' : ''}}</text>
					<text>负责人：{{userName}}</text>
				</view>
				<view class="status" :class="[`state${state.val}`]">
					<text>{{state.txt}}</text>
				</view>
			</view>

			<view class="statistics">
				<view class="statistics-item" @click="toRecord(0)">
					<view class="num">
						<u-badge :count="(recordData ? recordData.notAlarmRecord || 0 : 0)" :is-center="true"></u-badge>
						<text>{{recordData ? recordData.alarmRecord || 0 : 0}}</text>
					</view>
					<text class="label">报警</text>
				</view>
				<!-- <view class="statistics-item">
					<view class="num">
						<text>{{recordData ? recordData.repairRecord || 0 : 0}}</text>
					</view>
					<text class="label">维修</text>
				</view> -->
				<view class="statistics-item" @click="toRecord(1)">
					<view class="num">
						<text>{{recordData ? recordData.maintainRecord || 0 : instruData&&instruData.maintainRecord}}</text>
					</view>
					<text class="label">维护</text>
				</view>
				<view class="statistics-item" @click="toRecord(2)">
					<view class="num">
						<text>{{recordData ? recordData.measurementRecord || 0 : instruData&&instruData.measurementRecord}}</text>
					</view>
					<text class="label">计量</text>
				</view>
				<!-- <view class="statistics-item">
					<view class="num">
						<text>{{recordData ? recordData.maintenanceRecord || 0 : 0}}</text>
					</view>
					<text class="label">保养</text>
				</view>
				<view class="statistics-item">
					<view class="num">
						<text>0</text>
					</view>
					<text class="label">截屏</text>
				</view>
				<view class="statistics-item">
					<view class="num">
						<text>0</text>
					</view>
					<text class="label">录屏</text>
				</view> -->
			</view>


			<view class="line">
				<view class="circular"></view>
				<view class="sub-line"></view>
				<view class="circular end"></view>
			</view>

			<!-- 生命周期 -->
			<view class="cycle" v-if="instruData && instruData.purchaseTime">
				<view class='title'>生命周期管理</view>

				<view class="time-line">
					<view class="line">
						<view class="shadow-line" :style="{transform: `translateX(${620 * (instruData.percent >=1 ? 1 : instruData.percent)}rpx )`}">
						</view>

					</view>
					<view class="warranty-line"></view>
					<view class="unit">年</view>
				</view>

				<view class="scale">
					<view class="year">
						<view class="item-time" v-for="index in 7">
							<text class="vertical-line">|</text>
							<text>{{index !== 7 ? index - 1 : '6+'}}</text>
						</view>
					</view>
				</view>
				<view class="time">
					<view>
						<view style="margin-bottom: 10rpx;">采购时间</view>
						<view>{{instruData.purchaseTime.slice(0,10)}}</view>
					</view>
					<view>
						<view style="margin-bottom: 10rpx;">质保期</view>
						<view>60个月</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>
<script>
	export default {
		props: {
			recordData: {
				type: [Object, null],
				default: null
			},
			instruData: {
				type: [Object, null],
				default: null
			},
			userId: {
				type: String,
				default: ''
			},
			instruType: {
				type: String,
				default: ''
			},
		},
		computed: {
			userName() {
				let userName = ''

				if (this.instruData && this.instruData.userName) {
					const userNameArr = this.instruData.userName.split(',')

					userName = userNameArr[0]
				}

				return userName
			},
			state() {
				let state = {
					val: 0,
					txt: ''
				}

				if (this.instruData && this.instruData.state) {
					switch (this.instruData.state) {
						case 1:
							state.txt = '运行'
							state.val = 1
							break
						case 2:
							state.txt = '待机'
							state.val = 2
							break
						case 3:
							state.txt = '关机'
							state.val = 3
							break
						case 4:
							state.txt = '报警'
							state.val = 4
							break
						case 5:
							state.txt = '离线'
							state.val = 5
							break
					}
				}

				return state
			},
		},
		methods: {
			toInfo() {
				const instruNum = `?instruNum=${this.instruData&&this.instruData.instruNum||''}`
				const instruId = `&instruId=${this.instruData&&this.instruData.instruId||''}`
				const dbName = `&dbName=${this.instruData&&this.instruData.dbName||''}`
				const jurisdiction = `&jurisdiction=${this.instruData&&this.instruData.jurisdiction||''}`
				uni.navigateTo({
					url: `/pages/index/pages/instrument-cat-companion/info-page${instruNum}${instruId}${dbName}${jurisdiction}`
				});
			},
			toRecord(tabsCurrent) {
				const instruNum = `?instruNum=${this.instruData&&this.instruData.instruNum||''}`
				const instruId = `&instruId=${this.instruData&&this.instruData.instruId||''}`
				const dbName = `&dbName=${this.instruData&&this.instruData.dbName||''}`
				const jurisdiction = `&jurisdiction=${this.instruData&&this.instruData.jurisdiction||''}`
				const current = `&tabsCurrent=${tabsCurrent}`
				uni.navigateTo({
					url: `/pages/index/pages/device-record/index${instruNum}${instruId}${dbName}${jurisdiction}${current}&instruType=${this.instruType}`
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	.DetailsInfo {
		padding: 28rpx 18rpx 188rpx;
		background-color: #3978F7;
		border-bottom-left-radius: 24px;
		border-bottom-right-radius: 24px;

		.content {
			background-color: #FFFFFF;
			border-radius: 24rpx;
			// overflow: hidden;
			margin-bottom: 80rpx;

			.basic {
				position: relative;
				padding: 30rpx 30rpx 0rpx;

				.name {
					display: flex;
					align-items: center;
					font-size: 32rpx;
					font-weight: bold;
					color: #111737;
					margin-bottom: 26rpx;
					padding-right: 110rpx;
				}

				.basic-item {
					font-size: 24rpx;
					color: #77787D;
				}

				.status {
					position: absolute;
					top: 0;
					right: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 110rpx;
					height: 56rpx;
					padding-left: 18rpx;
					font-size: 24rpx;
					border-radius: 0 24rpx 0 100rpx;

					&.state1 {
						color: #2C72F9;
						background-color: #E1EBFF;
					}

					&.state2 {
						color: #13CA83;
						background-color: #DEFAED;
					}

					&.state3 {
						color: #646986;
						background-color: #D2D4DA;
					}

					&.state4 {
						color: rgb(255, 61, 61);
						background-color: rgb(255, 230, 232);
					}

					&.state5 {
						color: #F0A232;
						background-color: #FAF2DE;
					}
				}
			}

			.statistics {
				padding: 49rpx 0 11rpx;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: space-around;

				.statistics-item {
					width: 25%;
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-bottom: 36rpx;

					.num {
						position: relative;
						font-size: 40rpx;
						font-weight: bold;
						color: #111737;
						margin-bottom: 14rpx;

						/deep/ .u-badge {
							width: 48rpx;
							height: 48rpx;
							border-radius: 50%;
							right: -24rpx !important;
						}
					}

					.label {
						font-size: 26rpx;
						color: #111737;
						opacity: 0.6;
					}
				}
			}

			.line {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				// height: 30rpx;

				.sub-line {
					width: 643rpx;
					height: 1rpx;
					border-bottom: 1rpx dashed #979797;
				}

				.circular {
					position: absolute;
					top: 0;
					bottom: 0;
					left: -15rpx;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					background-color: #3978F7;
					margin: auto;

					&.end {
						left: auto;
						right: -15rpx;
					}
				}
			}


			.cycle {
				height: 336rpx;
				border-bottom-left-radius: 24rpx;
				border-bottom-right-radius: 24rpx;

				.title {
					padding: 38rpx 0 36rpx 30rpx;
					color: #111737;
					font-weight: bold;

				}

				.time-line {
					display: flex;
					align-items: center;
					padding-left: 30rpx;

					.line {
						height: 46rpx;
						width: 654rpx;
						overflow: hidden;
						border-radius: 15rpx;
						background: linear-gradient(to right, #2AE147 20%, #EDD85C, 81%, #F31A1D);

						.shadow-line {
							height: 46rpx;
							width: 660rpx;
							background-color: #d4caca;
							z-index: 12;
						}

					}

					.warranty-line {
						position: relative;
						left: -142rpx;
						height: 71rpx;
						width: 2rpx;
						border-right: 2rpx dashed #E62525;
						z-index: 33;
					}

					.unit {
						position: absolute;
						right: 22rpx;
						font-size: 22rpx;
					}
				}

				.scale {
					padding: 6rpx 58rpx 8rpx 26rpx;

					.year {
						display: flex;
						font-size: 24rpx;
						justify-content: space-between;

						.item-time {
							display: flex;
							flex-direction: column;
							align-items: center;

							.vertical-line {
								font-size: 12rpx;
								margin-bottom: 12rpx
							}
						}
					}
				}

				.time {
					display: flex;
					justify-content: space-between;
					color: #111737;
					font-size: 24rpx;
					padding: 20rpx 35rpx 19rpx 24rpx;
				}


				.period {
					padding: 0 36rpx 0 29rpx;
					display: flex;
					margin-top: 20rpx;
					justify-content: space-between;
					font-size: 24rpx;

					.warranty,
					.scrap {
						display: flex;
						align-items: center;
						flex-direction: column;
						height: 78rpx;
						width: 114rpx;
						border: 2rpx dashed #C0C0C0;
						border-top-color: transparent;
					}
				}
			}




		}
	}
</style>
