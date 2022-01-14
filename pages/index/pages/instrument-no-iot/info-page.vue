<template>
  <view class="info-page">
    <u-navbar
      title="仪器信息"
      :background="{ background: '#3978f7' }"
      back-icon-color="#fff"
      title-color="#fff"
      :border-bottom="false"
    >
      <view slot="right">
        <text
          v-if="jurisdiction && Number(jurisdiction) !== 3"
          class="icon-text iconfont"
          @click="handleEdit"
          >&#xe63b;</text
        >
      </view>
    </u-navbar>
    <device-info :instru-data="instruData"></device-info>
    <status-box
      :record-data="recordData"
      :instru-data="instruData"
    ></status-box>
    <home-info :room-data="roomData"></home-info>
    <view class="footer-box">
      <text>已经到页面底部啦~</text>
    </view>
  </view>
</template>
<script>
import DeviceInfo from "./components/DeviceInfo";
import StatusBox from "./components/StatusBox";
import HomeInfo from "./components/HomeInfo";

export default {
  components: {
    DeviceInfo,
    StatusBox,
    HomeInfo,
  },
  data() {
    return {
      jurisdiction: null,
      instruNum: "",
      instruId: "",
      dbName: "",
      instruData: null,
      recordData: null,
      roomData: null,
    };
  },
  methods: {
    //仪器信息
    getEquipInfoById() {
      if (!this.instruId) {
        return;
      }
      this.$u.api.equipmentApi
        .getEquipInfoById({
          parameter: {
            instruId: this.instruId,
          },
        })
        .then((res) => {
          this.instruData = res || null;
        });
    },
    equipRecord() {
      if (!this.instruId) {
        return;
      }

      const par = {
        instruId: this.instruId,
        dbName: this.dbName,
      };

      if (this.dbName) {
        par.dbName = this.dbName;
      }

      this.$u.api.equipmentApi
        .equipRecord({
          parameter: par,
        })
        .then((res) => {
          this.recordData = res || null;
        });
    },
    queryRoomByInstruId() {
      if (!this.instruId) {
        return;
      }
      this.$u.api.equipmentApi
        .queryRoomByInstruId({
          parameter: {
            instruId: this.instruId,
          },
        })
        .then((res) => {

          this.roomData = res;
        });
    },
    handleEdit() {
      uni.navigateTo({
        url:
          "/pages/index/pages/device-edit/index?instruId="+this.instruId+'&instruNum=' + this.instruNum,
      });
    },
  },
  onLoad(data) {

    this.instruId = data.instruId;
    this.dbName = data.dbName;
    this.jurisdiction = data.jurisdiction;
    this.instruNum = data.instruNum;
  },
  onShow() {
    this.equipRecord();
    this.queryRoomByInstruId();
    this.getEquipInfoById();
  },
  onBackPress(options) {
    let url = `/pages/index/pages/instrument-no-iot/index?instruNum=${this.instruNum}&instruId=${this.instruId}&dbName=${this.dbName}&state=${this.instruData.state}&userId=${this.instruData.userId}`
    uni.redirectTo({url:url})
    return true
  }
  /*onNavigationBarButtonTap() {
            uni.navigateTo({
                url: '/pages/index/pages/device-edit/index?instruType=3'
            });
        }*/
};
</script>
<style>
page {
  background-color: #3978f7;
}
</style>
<style lang="scss" scoped>
.info-page {
  padding: 35rpx 18rpx;
  .icon-text {
    margin-right: 23rpx;
    color: #fff;
    font-size: 40rpx;
  }
}

.footer-box {
  text-align: center;
  font-size: 28rpx;
  color: #ffffff;
  opacity: 0.5;
}
</style>
