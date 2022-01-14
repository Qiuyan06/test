<template>
	<u-popup v-model="searchShow" mode="right" width="90%" :closeable="true" :mask-close-able="true" class="searchBox">

		<view class="headTitle">筛选搜索</view>
		<u-form-item>
			<view class="searchItem">
				<view class="title">状态</view>
				<view class="wrap">
					<u-radio-group v-model="parameter.handleStatus">
						<u-radio v-for="(item, index) in cloudBoxWarnTypeList" :key="index" :name="item.value">
							{{ item.name }}
						</u-radio>
					</u-radio-group>
				</view>
			</view>
		</u-form-item>

		<view v-for="(item,index) in setList" :key="index">
			<!--下拉和单选-->
			<u-form-item v-if="item.fieldType===1 || item.fieldType===5">
				<view class="searchItem">
					<view class="title">{{item.fieldName}}</view>
					<view class="wrap wrap2">
						<u-tag v-for="(ele,key) in item.fieDetail" :key="key" :text="ele.value" shape="square" :closeable="false" :mode="parameter[item.fieId] === ele.value ? 'dark' : 'plain'"
							   @click="handleTypeClick(item.fieId,ele.value)" />
					</view>
				</view>
			</u-form-item>
			<!--2 文本框-->
			<u-form-item v-if="item.fieldType===2">
				<view class="searchItem">
					<view class="title">{{item.fieldName}}</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input v-model="parameter[item.fieId]" :placeholder="'输入'+item.fieldName" />
						</view>
					</view>
				</view>
			</u-form-item>
			<!--3 数字框-->
			<u-form-item v-if="item.fieldType===3" :prop="item.fieId">
				<view class="searchItem">
					<view class="title">{{item.fieldName}}</view>
					<view class="wrap">
						<view class="wrap_input">
							<u-input type="number" v-model="parameter[item.fieId]"></u-input>
						</view>
					</view>
				</view>
			</u-form-item>
			<!--6 多选框-->
			<u-form-item v-if="item.fieldType===6">
				<view class="searchItem">
					<view class="title">{{item.fieldName}}</view>
					<view class="wrap wrap2">
						<u-checkbox-group @change="(v)=>checkboxGroupChange(item.fieId,v)">
							<view class="ancheckd" v-for="(ele, key) in item.fieDetail" :key="key">
								<u-checkbox shape="circle" v-model="ele.checked" :name="ele.value">{{ele.value}}</u-checkbox>
							</view>
						</u-checkbox-group>
					</view>
				</view>
			</u-form-item>
			<!--日期-->
			<u-form-item v-if="item.fieldType===7">
				<view class="searchItem">
					<view class="title">{{item.fieldName}}</view>
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
		</view>
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
	import {cloudBoxWarnTypeList} from '@/utils/const'
	export default {
		data(){
			return {
				cloudBoxWarnTypeList,
				setList:[],
				searchShow: false,
				timeShow: false,
				pickerTimeShow: false,
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				parameter: {handleStatus:null},
				time:null
			}
		},
		methods:{
			// 显示弹框
			show(data,parameter) {
				this.searchShow = true
				this.setList = data
			},
			// 关闭弹框
			close() {
				this.searchShow = false
			},
			// 选择状态
			handleCheckeWarnType(item) {

				/*if (item.fileTypeId === 1) {
					this.$set(this.fileTypeList[0], 'checked', true)
					this.$set(this.fileTypeList[1], 'checked', false)
				} else {
					this.$set(this.fileTypeList[1], 'checked', true)
					this.$set(this.fileTypeList[0], 'checked', false)
				}*/
			},
			// 选择时间
			timeConfirm(time) {
				this.time = `${time.startDate} 至 ${time.endDate}`
				this.parameter.bTime = time.startDate+' 00:00:00'
				this.parameter.eTime = time.endDate+' 23:59:59'
			},
			// 下拉单选
			handleTypeClick(fieId,v){
				this.$set(this.parameter,`${fieId}`,v)
			},
			// 多选
			checkboxGroupChange(fieId,v){
				console.log(v)
				this.$set(this.parameter,`${fieId}`,v)
			},
			// 筛选搜索
			handleSearch() {
				this.$emit('change', this.parameter)
				this.close()
			},
			resetData(){
				console.log('重置配置筛选')
				this.time = null
				this.setList.map(item=>{
					if(item.fieldType===6){
						item.fieDetail.map(ele=>delete ele.checked)
					}
					return item
				})
				this.parameter = {handleStatus:null}
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
	.headTitle {
		text-align: center;
		margin: 56rpx 0 56rpx 0;
		height: 48rpx;
		font-size: 34rpx;
		font-weight: 500;
		color: #111111;
		line-height: 48rpx;
	}
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
