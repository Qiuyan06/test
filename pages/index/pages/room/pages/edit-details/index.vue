<template>
	<view class="home-details">
		<view class="content">
			<view class="row_content" @click="selectLaboratory">
				<text class="left">房间名称</text>
				<view class="right room-input">
					<u-input v-model="detail.name" maxlength="20" placeholder="20字符以内" />
				</view>
			</view>
			<view class="row_content" @click="selectLaboratory">
				<text class="left">所属实验室</text>
				<view class="right">
					<text class="val">{{laboratory ? (laboratory.name || '') : (detail.laboratory && detail.laboratory.name || '')}}</text>
					<u-icon name="arrow-right" color="#CCCCCC"></u-icon>
				</view>
			</view>
			<view class="row_content">
				<text class="left">仪器数量</text>
				<view class="right">{{ detail.devEquipInfoStatuList && detail.devEquipInfoStatuList.length || 0 }}</view>
			</view>
			<template v-if="detail.devEquipInfoStatuList && detail.devEquipInfoStatuList.length">
				<view class="row_content" v-for="(item,index) in (detail.devEquipInfoStatuList || [])" :key="item.index">
					<text class="left">仪器{{index +1}}</text>
					<view class="right">
						<text class="center">{{ item | typeFilter }}</text>
						<text class="remove" @click="delRoom(item)">解除</text>
					</view>
				</view>
			</template>
            <view class="row_content" @click="handleAdd">
                <view class="right">新增绑定设备<u-icon name="arrow-right" color="#CCCCCC"></u-icon></view>

            </view>
		</view>
		<view class="footer">
			<u-button shape="circle" type="primary" @click="handleSubmit">保存</u-button>
		</view>

		<!-- 确定删除弹框 -->
		<u-modal v-model="delShow" :show-title="false" :show-cancel-button="true" @confirm="handleDel">
			<view class="slot-content">
				<view class="popuper">
					<view class="warn">
						<text class="iconfont">&#xe64d;</text>
					</view>
					<view class="popuper_title">
                        <view v-if="isShow===true">
                            <view v-if="isBind===true">当前房间已绑定设备</view>
                            <view>是否要删除所选房间?</view>
                        </view>
                        <view v-else>
                            <view>{{delInfo}}</view>
                        </view>

                    </view>
					<view class="tishi">
						请谨慎操作
					</view>
				</view>
			</view>
		</u-modal>
		<!-- 多设备提示弹框 -->
		<u-modal v-model="equipShow" :show-title="false" :show-cancel-button="true" @confirm="handleInfo">
			<view class="slot-content">
				<view class="popuper">
					<view class="popuper_title">
							<view>
									<view>{{ msg }}</view>
							</view>
					</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import UButton from "../../../../../../uview-ui/components/u-button/u-button";
	export default {
		filters: {
			typeFilter(val) {
				if (!val.equipType || val.equipType === 4) return val.instruName
				return `${val.instruName}（${['云盒子', '仪器猫', '仪器猫伴侣'][val.equipType - 1]}）`
			},
		},
		components: {UButton},
		data() {
			return {
				isShow:false,
				isBind:false,
				delShow:false,
				roomId: null,
				detail: {},
				submitData: {},
				selectedMc: {},
				delInfo: '',
				laboratory: null,
				equipShow: false,
				msg: '',
				submitParams: {}
			}
		},
		methods: {
			// 获取房间信息
			equipStatisticInfo() {
				this.$u.api.roomApi.equipStatisticInfo({parameter: { roomId: this.roomId}}).then(res => {
					this.detail = res ||{}
				})
			},
			// 右上角的绑定设备按钮
			onNavigationBarButtonTap(e) {
                this.delShow = true
                this.isShow = true
                this.$u.api.roomApi.batchSelectRoomBand({ parameter: { roomIds:this.roomId.toString() }}).then(res =>{
                    if (res === 'false'){
                        this.isBind = true
                    } else {
                        this.isBind = false
                    }
                })
			},
			// 删除房间
			delRoom(item) {
			    this.isShow = false
				this.selectedMc = item
				this.delInfo = `是否确认把${item.instruName}从${this.detail.name}房间解除绑定？`
				this.delShow = true
			},
			handleDel() {
				if(!this.isShow) {
						this.detail.devEquipInfoStatuList = this.detail.devEquipInfoStatuList.filter(_item => !(_item.equipId === this.selectedMc.equipId))
						this.s_bus.addInstru =this.s_bus.addInstru && this.s_bus.addInstru.filter(_item =>!(_item.id === this.selectedMc.equipId))
				} else {
						this.$u.api.laboratoryApi.delRoomByIds([this.roomId]).then(res => {
								uni.showToast({
										title: '删除成功'
								})
							this.$u.vuex('s_bus.refresh', 'edit-room')
								uni.switchTab({
									url: '/pages/index/index'
								})
						})
				}
			},
			handleInfo() {
				const parameter = this.submitParams
				this.$u.api.roomApi.editRoom({ parameter }).then(res => {
					uni.showToast({
						title: '修改成功'
					})
					this.$u.vuex('s_bus.addInstru', null)
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/index/pages/room/index?roomId=' + this.roomId
						})
					}, 500)
				})
			},
			handleSubmit() {
				if (!this.detail.name) {
					uni.showToast({
						title: '请输入房间名称',
						icon: 'none'
					})
					return
				}
				const payload = Object.assign({}, this.detail)
				const parameter = {}
				parameter.id = payload.id
				parameter.roomNo = payload.roomNo
				parameter.name = payload.name
				parameter.labId = this.laboratory && this.laboratory.id || payload.laboratory.id
				parameter.instruIds = (payload.devEquipInfoStatuList || []).map(item => item.instruId).toString()
				const equipIds = (payload.devEquipInfoStatuList || []).map(item => item.equipId)
				const oInstruIds = (payload.devEquipInfoStatuList || []).map(item => item.instruId)
				const instruIds = [...new Set(oInstruIds)]
				this.$u.api.roomApi.queryEquipIdsByInstruIds({ parameter: { instruIds } }).then(res => {
					if (equipIds.length === res.equipIds.length && equipIds.every(item => res.equipIds.includes(item))) {
						parameter.equipIds = res.equipIds.toString()
						this.submitParams = parameter
						this.handleInfo()
					} else {
						parameter.equipIds = res.equipIds.toString()
						this.submitParams = parameter
						if (res.msg) {
							this.equipShow = true
							this.msg = res.msg
						} else {
							this.handleInfo()
						}
					}
				})
			},
			handleAdd() {
					uni.navigateTo({
							url:'/pages/select-page/pages/multiple-equip/index?api=roomApi.selRoomBandEquip&key=addInstru'
					})
			},
			selectLaboratory() {
				uni.navigateTo({
					url: '/pages/select-page/pages/laboratory/index?key=laboratory'
				})
			},
			initData() {
				if (this.s_bus.laboratory) {
					this.laboratory = this.s_bus.laboratory
					this.$u.vuex('s_bus.laboratory', null)
				}
				if(this.s_bus.addInstru) {
					const oldIds = this.detail.devEquipInfoStatuList && this.detail.devEquipInfoStatuList.map(_=>_.equipId) || []
					let newData =this.s_bus.addInstru.filter(_ =>{
						return !oldIds.includes(_.id)
					})
					newData = newData.map(item =>{
				    	return  {
							equipId:item.id,
							instruName:item.name,
								instruId: item.item && item.item.instruId
						}
					})
					this.detail.devEquipInfoStatuList =this.detail.devEquipInfoStatuList && this.detail.devEquipInfoStatuList.concat(newData)
				}
			},
		},
		onShow() {
			this.initData()
		},
		onLoad(data) {
			this.roomId = data.roomId
			this.equipStatisticInfo()
		}
	}
</script>

<style lang="scss" scoped>
	.home-details {
		padding: 20rpx;

		.content {
			padding: 0 20rpx;
			border-radius: 24rpx;
			background-color: #fff;

			.room-input{
				/deep/ .u-input__input{
					text-align: right;
				}
			}
			.lab-wrap{
				width: 100%;
				text-align: right;
			}

			.row_content {
				height: 96rpx;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #F5F5F5;

				.left {
					// flex: 1;
				}

				.right {
					flex: 1;
					text-align: right;
					margin-left: 80rpx;
					line-height: 45rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					.remove {
						height: 90rpx;
						width: 130rpx;
						line-height: 90rpx;
						color: #2C72F9;
						margin-left: 10rpx;
						display: inline-block;
					}

					.center {
						line-height: 36rpx;
					}
				}
			}
		}

	}
	.addInstru {
		margin-top: 50rpx;
	}

	.footer {
		background-color: #f6f7fc;
		width: 100%;
		height: 120rpx;
		padding: 20rpx 5% 20rpx 0;
		box-sizing: border-box;
		position: fixed;
		bottom: 20rpx;
	}
	.popuper {
		text-align: center;
		.warn {

			color: #FFA033;
			padding: 60rpx 0 20rpx 0;
		}
		.popuper_title{
			color: #333333;
			font-size: 32rpx;
			font-weight: 600;
			view{
				padding: 10rpx 30rpx;
				line-height: 48rpx;
			}
		}
		.tishi{
			color: #999999;
			font-size: 28rpx;
			padding: 40rpx 0 60rpx 0;
		}
	}
</style>
