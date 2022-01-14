<template>
	<view class="warning-details">
		<view class="content">
			<view class="item">
				<text class="label">名称</text>
				<text class="val">{{warningData.instruName || ''}}</text>
			</view>
			<view class="item">
				<text class="label">编号</text>
				<text class="val">{{warningData.instruNo || ''}}</text>
			</view>
			<view class="item">
				<text class="label">预警时间</text>
				<text class="val">{{warningData.warnDate || ''}}</text>
			</view>
			<view class="item">
				<text class="label">预警内容</text>
				<text class="val">{{warningData.content || ''}}</text>
			</view>
			<view class="item">
				<text class="label">预警值</text>
				<text class="val">{{ (warningData.outVoltage || '') | warningValueFilter(warningData.type)}}</text>
			</view>
			<view class="item">
				<text class="label">处理状态</text>
				<view class="status" :class="[`status${statusData.val}`]">
					<text>{{statusData.name}}</text>
				</view>
			</view>
			<view class="item" @click="setRemarks">
				<text class="label">备注</text>
				<template v-if="Number(statusData.val) !== 0">
					<text class="val">{{warningData.remarks}}</text>
				</template>
				<template v-else>
					<text class="val" v-if="remarks">{{remarks}}</text>
					<view class="remark" v-else-if="jurisdiction && Number(jurisdiction)!==3"><text>添加备注</text></view>
				</template>
				<!--<view class="remark" v-if="statusData.val === '0' && remarks === ''">
                    <text>添加备注</text>
                </view>
                <text class="val" v-if="statusData.val !== '0'">{{warningData.comment || ''}}</text>
                <text class="val" v-if="statusData.val === '0' && remarks">{{remarks}}</text>-->
			</view>
			<template v-if="Number(statusData.val) !== 0">
				<view class="item">
					<text class="label">处理人</text>
					<text class="val">{{warningData.userName || ''}}</text>
				</view>
				<view class="item">
					<text class="label">处理时间</text>
					<text class="val">{{warningData.handleTime || ''}}</text>
				</view>
			</template>
		</view>
		<view class="footer-box" v-if="jurisdiction && Number(jurisdiction)!==3 && statusData.val === '0'">
			<u-button type="primary" shape="circle"
				:custom-style="{width: '336rpx', height: '88rpx', fontSize: '34rpx'}" :plain="true"
				@click="modalshow1=true">忽略</u-button>
			<u-button type="primary" shape="circle"
				:custom-style="{width: '336rpx', height: '88rpx', fontSize: '34rpx'}" @click="modalshow2=true">确认
			</u-button>
		</view>
		<u-modal v-model="modalshow1" content="是否忽略该预警？" :show-cancel-button="true" @confirm="updateCatLogStatus(-1)">
		</u-modal>
		<u-modal v-model="modalshow2" content="是否已处理该预警？" :show-cancel-button="true" @confirm="updateCatLogStatus(1)">
		</u-modal>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				uuid: '',
				dbName: '',
				instruType: '',
				jurisdiction: '',
				remarks: '',
				warningData: {},
				isLock: false,
				modalshow1: false,
				modalshow2: false
			}
		},
		filters: {
			warningValueFilter(value, type) {
				if (value) {
					if (type === 1 || type === 2) {
						return value + 'V'
					} else if (type === 3) {
						return value + 'A'
					} else return value
				}
				return value
			}
		},
		computed: {
			statusData() {
				const statusData = {
					name: '',
					val: ''
				}

				switch (this.warningData.status) {
					case -1:
						statusData.name = '忽略'
						statusData.val = '-1'
						break
					case 0:
						statusData.name = '待处理'
						statusData.val = '0'
						break
					case 1:
						statusData.name = '已处理'
						statusData.val = '1'
						break
				}

				return statusData
			}
		},
		methods: {
			setRemarks() {
				if (this.statusData.val !== '0') {
					return
				}

				this.$u.vuex(`s_bus.remarks`, this.remarks)
				uni.navigateTo({
					url: '/pages/input-page/index?type=textarea&lable=备注&placeholder=输入备注&key=remarks'
				});
			},
			queryCatLogDetails() {
				this.$u.api.equipmentApi.queryCatLogDetails({
					parameter: {
						id: this.uuid,
						sourseType: Number(this.instruType),
						dbName: this.dbName
					}
				}).then((res) => {
					this.warningData = res || {}
				})
			},
			updateCatLogStatus(status = '') {
				if (this.isLock) {
					return
				}

				if (!status) {
					uni.showToast({
						title: '请选择操作方式',
						icon: 'none'
					});

					return
				}
				this.isLock = true

				this.$u.api.equipmentApi.updateCatLogStatus({
					parameter: {
						id: this.uuid,
						instruId: this.warningData.instruId,
						sourseType: Number(this.instruType),
						dbName: this.dbName,
						comment: this.remarks,
						status
					}
				}).then(() => {
					uni.showToast({
						title: '操作成功',
						icon: 'none'
					});
					this.$u.vuex('s_isPageUpdate', true)
					uni.navigateBack();
				}).finally(() => {
					this.isLock = false
				})
			}
		},
		onLoad(data) {
			this.uuid = data.uuid || ''
			this.dbName = data.dbName || ''
			this.instruType = data.instruType || ''
			this.jurisdiction = data.jurisdiction || ''
			this.queryCatLogDetails()
		},
		onShow() {
			if (this.s_bus.remarks) {
				this.remarks = this.s_bus.remarks
				this.$u.vuex(`s_bus.remarks`, '')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.warning-details {
		padding: 18rpx;

		.content {
			background-color: #FFFFFF;
			border-radius: 24rpx;

			.item {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 24rpx;
				color: #333333;
				font-size: 32rpx;

				.val {
					flex: 1;
					text-align: right;
					margin-left: 24rpx;
					word-break: break-all;
				}

				.status {
					padding: 8rpx;
					font-size: 20rpx;
					border-radius: 6rpx;

					&.status-1 {
						color: #999999;
						background-color: #F0F2F5;
					}

					&.status0 {
						color: #FF3D3D;
						background-color: #FFE6E8;
					}

					&.status1 {
						color: #31CC31;
						background-color: #E6FFE6;
					}
				}

				.remark {
					color: #2C72F9;
				}
			}
		}

		.footer-box {
			position: fixed;
			bottom: 40rpx;
			left: 0;
			right: 0;
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
	}
</style>
