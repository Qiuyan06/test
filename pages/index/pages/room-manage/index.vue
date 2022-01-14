<template>
  <view class="my-laboratory">



    <view class="header">
      <view class="laboratory-type" @click="showLaboratoryPop">
        <text style="margin-right: 10rpx">{{laboratory ? (laboratory.name || '') : '全部实验室'}}</text>
        <u-icon name="arrow-down" color="#322142" size="24"></u-icon>
      </view>

      <!--实验室空态模块-->
      <view class="empty-box" v-if="isEmpty">
        <u-image width="360rpx" height="309rpx" src="https://iotapp.prod.ilabeco.com/download/iot/common/empty-list.png">
          <view slot="loading"></view>
        </u-image>
        <text style="margin-bottom: 32rpx">抱歉，暂时还没有房间</text>
        <u-button type="primary" shape="circle" @click="addRoom">添加房间</u-button>
      </view>


      <u-checkbox-group v-if="!isEmpty" @change="checkboxChange">
        <!-- <laboratory v-for="item in list" :key="item.id" :com-data="item" :flag="flag"></laboratory> -->
        <laboratory-list v-for="item in list" :key="item.id" :com-data="item" :flag="flag"></laboratory-list>
      </u-checkbox-group>
      <u-loadmore v-if="!isEmpty" :status="loadMoreStatus" bg-color="#F6F7FC" class="lab-load-more" />
    </view>



    <view v-if="flag" class="footer">
      <view class="all_btn">
        <u-checkbox-group>
          <u-checkbox shape="circle" v-model="isAllSelected" @change="checkedAll">全选</u-checkbox>
        </u-checkbox-group>

      </view>
      <view class="">
        <u-button shape="circle" size="medium" type="primary" @click="confirmDel">确定删除({{lengthData}})</u-button>
      </view>
    </view>

    <!-- //添加房间 -->
    <view class="add_lab" @click="addRoom">
      <text class="iconfont">&#xe63d;</text>
    </view>

    <!-- 确定删除弹框 -->
    <u-modal v-model="delShow" :show-title="false" :show-cancel-button="true" @confirm="handleDel">
      <view class="slot-content">
        <view class="popuper">
          <view class="warn">
            <text class="iconfont">&#xe64d;</text>
          </view>
          <view class="popuper_title">
            <view v-if="isShow === true">当前房间已绑定设备</view>
            <view> 是否要删除所选房间?</view>
          </view>
          <view class="tishi">
            删除后不可复原，请谨慎操作
          </view>
        </view>
      </view>
    </u-modal>
    <SelectLaboratory ref="SelectLaboratory" @change="changeSelectLab"></SelectLaboratory>
  </view>
</template>

<script>
import LaboratoryList from './components/LaboratoryList.vue'
  import Laboratory from './components/Laboratory'
  import SelectLaboratory from "../../componts/SelectLaboratory"
  export default {
    components: {
      Laboratory,
      LaboratoryList,
      SelectLaboratory
    },
    data() {
      return {
        isShow:false,
        flag: false,
        checked: false,
        delShow: false, // 确定删除弹框
        const: 0,
        isAllSelected: false, // 是否全部被选中
        checkedList: [], // 默认选中的值
        allcheckarr: [], // 点击单选按钮添加的数组
        lengthData:0,// 选中数据的长度
        page: 1,
        pageSize: 10,
        list: [],
        loadMoreStatus: 'loading',
        init: false,
        laboratory: null, // 实验室
        value1: 1,
        options1: [{
          label: '全部实验室',
          value: 1,
        },
          {
            label: '选择其他实验室',
            value: 2,
          }
        ],
        dropdownHide: true
      }
    },
    computed: {
      isEmpty() {
        return this.list.length < 1 && this.init
      }
    },
    watch: {
      isAllSelected: {
        handler(n) {
          if (n) {
            // 有复选框的数据列表进行遍历，设置checked为选中
            this.list.forEach((item, index) => {
              this.$set(item, 'checked', true)
            })
          } else if (this.checkedList.length === 0 || this.checkedList.length === this.list.length) {
            this.list.forEach((item, index) => {
              this.$set(item, 'checked', false)
            })
          }
        }

      },
      checkedList: {
        handler(n, o) {
          if (n) {
            this.isAllSelected = n.length === this.list.length
          }
        }
      }
    },

    methods: {
      addRoom(){
        uni.navigateTo({
          url: `/pages/index/pages/add-home/index`
        })
      },
      userLabRoomInfoList() {
        this.loadMoreStatus = 'loading'
        const pageParams = {
          page: this.page,
          pageSize: this.pageSize
        }
        const labId = this.laboratory && (this.laboratory.id !== null) ? this.laboratory.id : null
        this.$u.api.laboratoryApi.userLabRoomInfoList({ parameter: {labId}, ...pageParams }).then(res => {
          const rows = res.rows || []
          if (rows && Array.isArray(rows)) {
            this.list = this.list.concat(rows)
            this.isAllSelected = this.list.length === this.checkedList.length // 有数据取消选中全选按钮
            if(rows.length)this.getRoomStatus(rows)
          }
          this.hasMorePage(res.total || 0, rows.length)
        }).finally(() => {
          this.init = true
          uni.stopPullDownRefresh()
        })
      },
      getRoomStatus(data){
        const ids = data.map(item=>item.id)
        this.$u.api.roomApi.equipStatus(ids).then((res) => {
          const list = Object.assign([],this.list)
          const newList = list.map(item=>{
            const current = res.find(ele=>(ele.id===item.id))
            if(current){
              item = {...item,bool:current.bool,equipLogBean:current.equipLogBean}
            }
            return item
          })
          this.list = newList

        }).catch(e=>{
          console.log(e)
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
        this.laboratory = null
      },
      // 右上角的编辑按钮
      onNavigationBarButtonTap(e) {
        this.flag = !this.flag
      },
      // 全选
      checkedAll(v) {

        if (v.value) {
          this.list.forEach((item, index) => {
            if (this.allcheckarr.length < this.list.length) {
              this.allcheckarr.push(item.id)
            }
            this.checkedList = this.allcheckarr
            this.lengthData = this.checkedList.length
          })
        } else {
          this.isAllSelected = false
          this.checkedList = []
          this.allcheckarr = []
          this.lengthData = 0
        }
      },
      // 单选按钮
      checkboxChange(e) {
        this.allcheckarr = this.list.filter(item => item.checked).map(item => item.id)
        this.checkedList = this.allcheckarr
        this.lengthData = this.checkedList.length

      },
      deleteShow() {
        this.delShow = true
      },
      // 确定删除弹框
      confirmDel() {
        setTimeout(this.deleteShow,300)
        this.$u.api.roomApi.batchSelectRoomBand({ parameter: { roomIds: this.checkedList.toString() }}).then(res =>{
          if (res === 'false'){
            this.isShow = true
          } else {
            this.isShow = false
          }
        })

      },
      handleDel() {
        console.log(this.checkedList)
        this.$u.api.laboratoryApi.delRoomByIds(this.checkedList).then(res => {
          uni.showToast({
            title: '删除成功'
          })
          this.resetData()
          this.userLabRoomInfoList()
          this.$u.vuex('s_bus.refresh', 'edit-room')
        })
      },
      addLab() {
        uni.navigateTo({
          url: '/pages/me/pages/my-laboratory/pages/add-lab/index'
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
          this.page = 1
          this.list = []
          this.userLabRoomInfoList()
        }
      },
      changeSelectLab (item) {
        this.laboratory = item
        this.page = 1
        this.list = []
        this.userLabRoomInfoList()
      },
      // 显示实验室列表底下弹框
      showLaboratoryPop() {
        this.$refs['SelectLaboratory'].show()
      }
    },
    onShow() {
      this.$u.vuex('s_bus.refresh', 'edit-room')
      this.initData()
    },
    onLoad() {
      this.userLabRoomInfoList()
    },
    onPullDownRefresh() {
      this.resetData()
      this.userLabRoomInfoList()
    },
    onReachBottom() {
      if (this.loadMoreStatus === 'loadmore') {
        this.page++
        this.userLabRoomInfoList()
      }
    },
    onBackPress(options) {
      uni.switchTab({
        url: '/pages/index/index',
        success() {
          this.$u.vuex('s_bus.refresh', 'edit-room')
        }
      })
      return true
    }
  }
</script>

<style lang="scss" scoped>
  .my-laboratory {
    .header {
      width: 100vw;
      padding: 18rpx;
      /deep/.u-checkbox-group {
        display: block;
        margin-top: 80rpx;
      }

      .laboratory-type {
        position: fixed;
        top: 0;
        left: 0;
        padding: 0 18rpx;
        width: 100%;
        height: 80rpx;
        z-index: 1;
        display: flex;
        align-items: center;
        font-size: 28rpx;
        font-weight: bold;
        color: #3D7FFF;
        background: white;

        /deep/ .u-dropdown__menu__item{
          justify-content: left;
        }
        /deep/ .u-dropdown__content{
          width: 100vw;
          left: -18rpx;
        }
      }

      .Device {
        position: relative;
        display: flex;
        background-color: #FFFFFF;
        border-radius: 24rpx;
        padding: 24rpx;
        overflow: hidden;
        margin-bottom: 18rpx;

        /deep/.u-checkbox__label {
          margin: 0;
        }

        .content {
          flex: 1;
          margin-left: 18rpx;

          .title {
            padding-right: 120rpx;
            font-size: 30rpx;
            font-weight: 500;
            color: #111737;
            line-height: 44rpx;
            margin-bottom: 24rpx;
          }

          .info {
            display: flex;
            align-items: center;
            color: #77787D;
            font-size: 24rpx;
            margin-bottom: 25rpx;
          }

          .info-list {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .info-item {
              color: #77787D;
              font-size: 24rpx;
              width: 20%;
              line-height: 34rpx;

             /* &:last-of-type(1) {
                margin-right: 0;
              }*/

              .run {
                color: #2C72F9;
              }

              .stand {
                color: #52CCA3;
              }

              .offline {
                color: #F0A232;
              }

              .close {
                color: #646986;
              }

              .police {
                color: #EA1141;
              }
            }
          }
        }

        .status {
          position: absolute;
          top: 0;
          right: 0;
          border-radius: 0 0 0 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24rpx;
          width: 110rpx;
          height: 52rpx;

          &.state1 {
            background-color: #FBE7E7;
            color: #EA1141;
          }

          &.state2 {
            background-color: #E7FBED;
            color: #2EC33D;
          }
        }
      }
      .un-normal{
        border: 2rpx solid #EA1141;
      }
      .lab-load-more{
        margin-bottom: 160rpx !important;
      }

      .empty-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20vh 0 20rpx 0;
        font-size: 24rpx;
        color: #999999;
      }


    }

    .footer {
      background-color: #fff;
      height: 152rpx;
      width: 100vw;
      padding: 28rpx 32rpx;
      position: fixed;
      bottom: 0;
      z-index: 1;
      display: flex;
      align-items: center;

      .total {
        color: #000000;
        flex: 1;
        font-size: 34rpx;
        font-weight: 500;
      }

      .right_number {
        color: #111737;

        .iconfont {
          font-size: 40rpx;
          margin-right: 12rpx;
        }
      }

      .all_btn {
        flex: 1;
      }
    }

    .add_lab {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
      background-color: #4885FF;
      position: fixed;
      bottom: 192rpx;
      right: 44rpx;
      line-height: 80rpx;
      text-align: center;

      .iconfont {
        color: #fff;
        font-size: 40rpx;
      }

    }
  }

  .popuper {
    text-align: center;

    .warn {

      color: #FFA033;
      padding: 60rpx 0 20rpx 0;
    }

    .popuper_title {
      color: #333333;
      font-size: 32rpx;
      font-weight: 600;

      view {
        padding: 10rpx;
      }
    }

    .tishi {
      color: #999999;
      font-size: 28rpx;
      padding: 40rpx 0 60rpx 0;
    }
  }
</style>
