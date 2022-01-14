<template>
	<u-popup v-model="searchShow" mode="right" width="90%" :closeable="true" :mask-close-able="true" class="searchBox">
		<view class="headTitle">筛选搜索</view>
		<u-form-item prop="time">
			<view class="searchItem">
				<view class="title">预警时间</view>
				<view class="wrap">
					<view class="wrap_input" @click="timeShow = true">
						<text class="val" :class="time?'selected':''">
							{{time || '请选择时间'}}
						</text>
					</view>
					<text class="iconfont icon" @click="timeShow = true">&#xe642;</text>
				</view>
			</view>
		</u-form-item>
		<u-form-item prop="keyword">
			<view class="searchItem">
				<view class="title">预警内容</view>
				<view class="wrap" v-if="instruType !== 2">
					<view class="wrap_input">
						<u-input v-model="parameter.content" placeholder="输入预警内容" />
					</view>
				</view>

				<view class="wrap wrap2" v-else>
					<u-tag v-for="item in warnContent" :text="item.name" shape="square" :closeable="false" :mode="warnContentId === item.id ? 'dark' : 'plain'"
					 @click="hanleWarnContentChange(item.id,item.value)" />
				</view>
			</view>
		</u-form-item>
		<u-form-item prop="status">
			<view class="searchItem">
				<view class="title">状态</view>
				<view class="wrap wrap2">
					<u-tag v-for="item in warnStatus" :text="item.name" shape="square" :closeable="false" :mode="parameter.status === item.value ? 'dark' : 'plain'"
					 @click="handleTypeClick(item.value)" />
				</view>
			</view>
		</u-form-item>
		<!-- <u-picker v-model="timeShow" mode="time" :safe-area-inset-bottom="true" :params="timeParams" @confirm="timeConfirm"></u-picker> -->
		<u-calendar v-model="timeShow" mode="range" @change="timeConfirm"></u-calendar>
		<view class="footer-wrap">
			<view class="footer-btn">
				<u-button shape="circle" class="reset-btn" @click="handleReset">重置</u-button>
				<u-button type="primary" shape="circle" class="search-btn" @click="handleSearch">筛选搜索</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import {
		warnStatus
	} from '@/utils/const'
	export default {
		props: ['instruType'],
		data() {
			return {
				warnStatus,
				searchShow: false,
				timeShow: false,
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				parameter: {
					beginTime: null,
					endTime: null,
					status: null,
					content: null,
					type: null
				},
				time: null,
				warnContentId: 0,
				warnContent: [{
					id: 0,
					name: '全部',
					value: null,
				}, {
					id: 1,
					name: '电压过低',
					value: 1,
				}, {
					id: 2,
					name: '电压过高',
					value: 2,
				}, {
					id: 3,
					name: '电流过高',
					value: 3,
				}, {
					id: 4,
					name: '设备移动',
					value: 4,
				}]
				// status: null,
				// keyword: null,
			}
		},
		methods: {
			// 显示弹框
			show() {
				this.searchShow = true
			},
			// 关闭弹框
			close() {
				this.searchShow = false
			},
			// 选择预警时间
			timeConfirm(time) {
				this.time = `${time.startDate} 至 ${time.endDate}`
				this.parameter.beginTime = time.startDate
				this.parameter.endTime = time.endDate
			},
			// 选择预警状态
			handleTypeClick(type) {
				this.parameter.status = type
			},
			hanleWarnContentChange(id, value) {
				this.warnContentId = id;
				this.parameter.type = value
			},
			// 重置数据
			resetData() {
				this.parameter = {
					beginTime: null,
					endTime: null,
					status: null,
					content: null,
					type:null
				};
				this.warnContentId = 0
				this.time = null
			},
			// 筛选搜索
			handleSearch() {
				this.$emit('change', this.parameter)
				this.close()
			},
			// 重置搜索
			handleReset() {
				this.resetData()
				this.$emit('change', null)
				this.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchBox {
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

		.searchItem {
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

				.u-tag {
					margin-right: 20rpx;
					margin-bottom: 10rpx;
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

		/*.searchItem {
            font-size: 32rpx;
            font-weight: 400;
            padding: 0rpx 20rpx;
            margin-bottom: 48rpx;
            background-color: #fff;
            color: #333333;
            border-bottom: 2rpx solid #f5f5f5;
            .title{
                width: 100%;
            }
            .wrap {
                display: flex;
                align-items: center;
                .u-radio-group{
                    padding: 28rpx 0 25rpx 0;
                }
                .wrap_input {
                    flex: 1;
                    padding: 26rpx 0 23rpx 0;
                    .val {
                        font-size: 30rpx;
                        color: #c0c4cc;
                        margin-right: 14rpx;
                        &.selected{
                            color:#333;
                        }
                    }
                }
                .icon {
                    color: #CCCCCC;
                    margin-left: 10rpx;
                }
            }
        }*/
		.footer-wrap {
			position: fixed;
			width: 100%;
			bottom: 80rpx;
		}

		.footer-btn {
			padding: 0 25rpx;
			font-size: 32rpx;

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
