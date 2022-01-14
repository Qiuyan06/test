<template>
	<view class="record-page">
		<Navbar :jurisdiction="jurisdiction" :instruType="instruType" :tabsCurrent="tabsCurrent" @showSet="showSet"></Navbar>
		<!--<view class="tabs">
			<u-tabs :list="tabsList" :is-scroll="false" :current="tabsCurrent" active-color="#3D7FFF" inactive-color="#333333"
			 @change="tabsChange"></u-tabs>
		</view>-->
		<view class="tabswrap">
			<view
					v-for="(item,index) in tabsList"
					:class="index===tabsCurrent?'tab-item active':'tab-item'"
					@click="tabsChange(index)"
			>
				{{item.name}}
			</view>
		</view>
		<div class="device-record">
			<!--     预警       -->
			<view class="warning-list" v-if="tabsCurrent === 0 && !isEmpty">
				<warning-item v-for="item in list" :key="item.uuid" :com-data="item" :db-name="dbName" :instruType="instruType"
				 :jurisdiction="Number(jurisdiction)">

				</warning-item>
			</view>
			<!--     维修       -->
			<!--<view class="repair-list" v-if="tabsCurrent === 1 && !isEmpty">
                <repair-item></repair-item>
                <repair-item></repair-item>
                <repair-item></repair-item>
                <repair-item></repair-item>
            </view>-->
			<!--     维护       -->
			<view class="uphold-list" v-if="tabsCurrent === 1 && !isEmpty">
				<uphold-item v-for="item in list" :jurisdiction="jurisdiction" :key="item.id" :instruId="instruId" :com-data="item"
				 @showDetail="showDetail" @handleSuccess="handleSuccess"></uphold-item>
			</view>
			<!--     计量       -->
			<view class="metering-list" v-if="tabsCurrent === 2 && !isEmpty">
				<metering-item v-for="item in list" :jurisdiction="jurisdiction" :key="item.id" :instruId="instruId" :com-data="item"
				 @showDetail="showDetail" @handleSuccess="handleSuccess">
				</metering-item>
			</view>
			<!--     保养       -->
			<!-- <view class="maintain-list" v-if="tabsCurrent === 3 && !isEmpty">
				<maintain-item v-for="item in list" :jurisdiction="jurisdiction" :key="item.id" :instruId="instruId" :com-data="item"
				 @showDetail="showDetail" @handleSuccess="handleSuccess"></maintain-item>
			</view> -->

			<u-loadmore v-if="!isEmpty" :status="loadMoreStatus" margin-bottom="24" />

			<!--<u-empty text="暂无数据" mode="list" :show="isEmpty" margin-top="100"></u-empty>-->
			<view class="empty-box" v-if="isEmpty">
				<u-image width="360rpx" height="309rpx" src="https://iotapp.prod.ilabeco.com/download/iot/common/empty-list.png">
					<view slot="loading"></view>
				</u-image>
				<text style="margin-bottom: 32rpx">抱歉，暂时还没有记录</text>
			</view>

			<!--    右下角浮窗    筛选按钮（预警、维修）-->
			<view v-if="tabsCurrent === 0" class="control-box">
				<text class="iconfont" @click="showSearch">&#xe645;</text>
			</view>
			<!--    右下角浮窗    新增按钮（维护、计量、保养）-->
			<template v-else>
				<view v-if="jurisdiction && Number(jurisdiction)!==3" class="control-box">
					<text class="iconfont" @click="showDetail('add')">&#xe63d;</text>
				</view>
			</template>
			<view class="footer-box">
				<text class="label">合计</text>
				<view class="val">
					<text class="iconfont">&#xe64a;</text>
					<text>{{total}}次</text>
				</view>
			</view>
		</div>
		<WarnSet ref="warnset" :instruId="instruId" :instruNum="instruNum" :dbName="dbName"></WarnSet>
		<MaintSet ref="maintset" :instruId="instruId"></MaintSet>
		<WarnSearch ref="warnsearch" @change="searchCatLogList" :instruType="instruType"></WarnSearch>
		<RepairSearch ref="repairsearch"></RepairSearch>
		<UpholdDetail ref="upholddetail" @save="savaServicelog" @update="updateService"></UpholdDetail>
		<MeteringDetail ref="meteringdetail" @save="saveIcInstruMeasure" @update="updateMeasure"></MeteringDetail>
		<MaintainDetail ref="maintaindetail" @save="savaServicelog" @update="updateService"></MaintainDetail>
	</view>
</template>
<script>
	import Navbar from './components/Navbar'
	import WarningItem from './components/WarningItem' // 预警项
	import RepairItem from './components/RepairItem' // 维修项
	import UpholdItem from './components/UpholdItem' // 维护项
	import MeteringItem from './components/MeteringItem' // 计量项
	import MaintainItem from './components/MaintainItem' // 保养项
	import WarnSet from './components/set/WarnSet' //预警设置
	import MaintSet from './components/set/MaintSet' //维护、保养、计量设置
	import WarnSearch from './components/search/WarnSearch' //预警筛选
	import RepairSearch from './components/search/RepairSearch' //维修筛选筛选
	import UpholdDetail from './components/detail/UpholdDetail' //维护详情
	import MeteringDetail from './components/detail/MeteringDetail' //计量详情
	import MaintainDetail from './components/detail/MaintainDetail' //保养详情
	export default {
		components: {
			Navbar,
			WarningItem,
			RepairItem,
			MaintainItem,
			MeteringItem,
			UpholdItem,
			WarnSet,
			MaintSet,
			WarnSearch,
			RepairSearch,
			UpholdDetail,
			MeteringDetail,
			MaintainDetail
		},
		data() {
			return {
				jurisdiction: null,
				instruId: '',
				instruNum: '',
				dbName: '',
				instruType: null,
				tabsList: [{
						name: '预警'
					},
					/*	{
						name: '维修'
					},*/
					{
						name: '维护'
					}, {
						name: '计量'
					},
					// {
					// 	name: '保养'
					// }
				],
				tabsCurrent: 0,
				page: 1,
				pageSize: 10,
				list: [],
				loadMoreStatus: 'loading',
				init: false,
				total: 0,
				searchParams_warn: {},
				searchParams_service: {},
				warnSearchParams: null
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
			// 切换记录类型
			tabsChange(index) {
				this.tabsCurrent = index
				this.resetData()
				this.getApi()
			},
			// 根据记录类型显示记录列表
			getApi() {
				if (this.tabsCurrent === 0) {
					this.catlogList()
				}
				/*else if (this.tabsCurrent === 1) {
					this.init = true
					uni.stopPullDownRefresh()
				} */
				else if (this.tabsCurrent === 1) {
					this.queryInstruServicelogList(1)
				} else if (this.tabsCurrent === 2) {
					this.queryIcInstruMeasureList()
				}
				//  else if (this.tabsCurrent === 3) {
				// 	this.queryInstruServicelogList(2)
				// }
			},
			// 获取预警列表
			catlogList() {
				this.$u.api.equipmentApi.catlogList({
					parameter: {
						sourseType: Number(this.instruType),
						instruId: this.instruId,
						instruNum: this.instruNum,
						dbName: this.dbName,
						...this.warnSearchParams
					},
					page: this.page,
					pageSize: this.pageSize
				}).then((res) => {
					const rows = res.rows || []

					if (rows && Array.isArray(rows)) {
						this.list = this.list.concat(rows)
					}

					this.total = res.total

					this.hasMorePage(res.total || 0, rows.length)
				}).finally(() => {
					this.init = true
					uni.stopPullDownRefresh()
				})
			},
			// 预警列表筛选搜索
			searchCatLogList(parameter) {
				this.warnSearchParams = parameter;
				this.$u.api.equipmentApi.catlogList({
					parameter: {
						sourseType: Number(this.instruType),
						instruId: this.instruId,
						instruNum: this.instruNum,
						dbName: this.dbName,
						...parameter
					},
					page: 1,
					pageSize: 10
				}).then(res => {
					this.resetData();
					const rows = res.rows || []
					if (rows && Array.isArray(rows)) {
						this.list = this.list.concat(rows)
					}

					this.total = res.total
					this.hasMorePage(res.total || 0, rows.length)
				}).finally(() => {
					this.init = true
				})
			},
			// 获取维护列表、保养列表
			queryInstruServicelogList(type = '') {
				this.$u.api.equipmentApi.queryInstruServicelogList({
					parameter: {
						instruId: this.instruId,
						type
					},
					page: this.page,
					pageSize: this.pageSize
				}).then((res) => {
					const rows = res.rows || []
					if (rows && Array.isArray(rows)) {
						this.list = this.list.concat(rows)
					}
					this.total = res.total
					this.hasMorePage(res.total || 0, rows.length)
				}).finally(() => {
					this.init = true
					uni.stopPullDownRefresh()
				})
			},
			// 增加维护、保养记录
			savaServicelog(parameter) {
				console.log(parameter)
				// console.log(this.$u.api.equipmentApi.savaServicelog)
				this.$u.api.equipmentApi.savaServicelog({
					parameter: { ...parameter,
						instruId: this.instruId
					}
				}).then(res => {
					// this.$refs.upholddetail.close();
					this.resetData();
					this.queryInstruServicelogList(parameter.type);
				})
			},
			// 获取计量列表
			queryIcInstruMeasureList() {
				this.$u.api.equipmentApi.queryIcInstruMeasureList({
					parameter: {
						instruId: this.instruId
					},
					page: this.page,
					pageSize: this.pageSize
				}).then((res) => {
					const rows = res.rows || []

					if (rows && Array.isArray(rows)) {
						this.list = this.list.concat(rows)
					}

					this.total = res.total

					this.hasMorePage(res.total || 0, rows.length)
				}).finally(() => {
					this.init = true
					uni.stopPullDownRefresh()
				})
			},
			// 增加计量记录
			saveIcInstruMeasure(parameter) {
				console.log(parameter)
				this.$u.api.equipmentApi.saveIcInstruMeasure({
					parameter: { ...parameter,
						instruId: this.instruId
					}
				}).then(res => {
					this.$refs.meteringdetail.close();
					this.handleSuccess();
				})
			},
			// 编辑计量
			updateMeasure(parameter) {
				this.$u.api.equipmentApi.updateMeasure({
					parameter: { ...parameter,
						instruId: this.instruId
					}
				}).then(res => {
					this.$refs.meteringdetail.close();
					this.handleSuccess();
				})
			},
			// 编辑维护记录
			updateService(parameter) {
				this.$u.api.equipmentApi.updateInstruServicelog({
					parameter: { ...parameter,
						instruId: this.instruId
					}
				}).then(res => {
					this.$refs.upholddetail.close();
					this.handleSuccess();
				})
			},
			// 是否显示下一页
			hasMorePage(total = 0, dataSize = 0) { // 判断是否还有下一页
				if (this.page === 1 && total <= this.pageSize) {
					this.loadMoreStatus = 'nomore'
				} else if (this.page > 1 && (dataSize < this.pageSize || total / this.pageSize === this.page)) {
					this.loadMoreStatus = 'nomore'
				} else {
					this.loadMoreStatus = 'loadmore'
				}
			},
			// 重置条件
			resetData() {
				this.init = false
				this.page = 1
				this.list = []
				this.loadMoreStatus = 'loadmore'
			},
			// 显示设置弹框
			showSet() {
				if (this.tabsCurrent === 0) {
					this.$refs.warnset.show()
				} else {
					this.$refs.maintset.show(this.tabsCurrent)
				}
			},
			// 显示筛选弹框(预警、维修)
			showSearch() {
				if (this.tabsCurrent === 0) {
					this.$refs.warnsearch.show()
				}
				/*else if (this.tabsCurrent === 1) {
					this.$refs.repairsearch.show()
				}*/
			},
			// 显示新增、编辑弹框（维护、计量、保养）
			showDetail(type, id = null) {
				if (this.tabsCurrent === 1) {
					this.$refs.upholddetail.show(type, id)
				} else if (this.tabsCurrent === 2) {
					this.$refs.meteringdetail.show(type, id)
				} else if (this.tabsCurrent === 3) {
					this.$refs.maintaindetail.show(type, id)
				}
			},
			// 新增、编辑、删除成功刷新页面
			handleSuccess(type) {
				if (type !== 'edit') this.resetData()
				this.getApi()
			},
		},
		onLoad(data) {
			console.log(data)
			this.instruId = data.instruId || ''
			this.instruNum = data.instruNum || ''
			this.dbName = data.dbName || ''
			this.instruType = Number(data.instruType || 0)
			this.jurisdiction = data.jurisdiction
			this.tabsCurrent = data.tabsCurrent && Number(data.tabsCurrent) || 0
			this.getApi()
		},
		onPullDownRefresh() {
			this.resetData()
			this.getApi()
		},
		onReachBottom() {
			if (this.loadMoreStatus === 'loadmore') {
				this.page++
				this.getApi()
			}
		},
		onShow() {
			if (this.s_isPageUpdate) {
				this.resetData()
				this.getApi()
				this.$u.vuex('s_isPageUpdate', false)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.record-page {
		.tabs {
			position: fixed;
			top: 140rpx;
			left: 0;
			right: 0;
			z-index: 99;
		}
		.tabswrap{
			display: flex;
			background: #fff;
			position: fixed;
			width: 100%;
			.tab-item{
				height: 40px;
				line-height: 40px;
				font-size: 15px;
				transition-duration: 0.5s;
				flex: 1 1 0%;
				width: auto;
				color: rgb(51, 51, 51);
				text-align: center;
				&.active{
					color: #3d7fff;
					font-weight: bold;
					position: relative;
					&:before{
						position: absolute;
						content: '';
						bottom: 0;
						left: 50%;
						margin-left: -40rpx;
						width: 80rpx;
						background-color: #3d7fff;
						height: 6rpx;
						border-radius: 6rpx;
					}
				}
			}
		}
	}



	.device-record {
		padding: 100rpx 18rpx;


	}

	.footer-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 98;
		background-color: #ffffff;
		padding: 24rpx 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.label {
			font-size: 34rpx;
			font-weight: bold;
			color: #000000;
		}

		.val {
			display: flex;
			align-items: center;
			color: #111737;
			font-size: 30rpx;

			.iconfont {
				font-size: 40rpx;
				margin-right: 12rpx;
			}
		}
	}

	.control-box {
		position: fixed;
		bottom: 140rpx;
		right: 38rpx;
		z-index: 98;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background-color: #4885FF;
		box-shadow: 0 5rpx 9rpx 0 #CFD7E7;

		.iconfont {
			color: #FFFFFF;
			font-size: 40rpx;
		}
	}

	.empty-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 640rpx 0 20rpx 0;
		font-size: 24rpx;
		color: #999999;
	}
</style>
