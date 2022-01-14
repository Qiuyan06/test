<template>
  <view class="info-page">
      <u-navbar title="房间信息" :background="{ background: '#3978f7' }" back-icon-color="#fff" title-color="#fff" :border-bottom="false">
          <view slot="right">
              <text class="icon-text iconfont" @click="handleEdit">&#xe63b;</text>
          </view>
      </u-navbar>
    <view class="StatusBox">
      <view class="mian">
        <view class="title">
          <text>{{ roomData.name }}</text>
          <view class="sub-title">
            {{ (roomData.laboratory && roomData.laboratory.deptName || '') + '·' + (roomData.laboratory && roomData.laboratory.name || '') }}
          </view>
        </view>
        <view class="statistics">
          <view class="statistics-item">
            <text class="val">{{roomData ? roomData.instruCount || 0 : 0}}</text>
            <text class="label">设备</text>
          </view>
          <view class="statistics-item">
            <text class="val">{{roomData ? roomData.runningCount || 0 : 0}}</text>
            <text class="label">运行</text>
          </view>
          <view class="statistics-item">
            <text class="val">{{roomData ? roomData.waitCount || 0 : 0}}</text>
            <text class="label">待机</text>
          </view>
          <view class="statistics-item">
            <text class="val">{{roomData ? roomData.powerOffCount || 0 : 0}}</text>
            <text class="label">关机</text>
          </view>
          <view class="statistics-item">
            <text class="val">{{roomData ? roomData.warnCount || 0 : 0}}</text>
            <text class="label">报警</text>
          </view>
        </view>
        <view class="status" :class="[`state${state.val}`]">
          <text>{{state.txt}}</text>
        </view>
      </view>
      <!--<view class="bottom">
        <text class="iconfont">&#xe66b;</text>
        <text class="txt">【保养提醒】2020/9/28（30天后）色谱仪需要保养</text>
      </view>-->
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        roomId: null,
        roomData: {}
      }
    },
    computed: {
      state() {
        let state = {
          val: 0,
          txt: ''
        }

        if (this.roomData && this.roomData.bool) {
          state.txt = '正常'
          state.val = 1
        }

        if (this.roomData && !this.roomData.bool) {
          state.txt = '异常'
          state.val = 2
        }

        return state
      }
    },
    methods: {
        equipStatisticInfo() {
        this.$u.api.roomApi.equipStatisticInfo({
          parameter: {
            roomId: this.roomId
          }
        }).then((res) => {
          if (res) {
            this.roomData = res
          }
        })
      },
        // 右上角的编辑按钮
        handleEdit() {
            uni.navigateTo({
              url: '/pages/index/pages/room/pages/edit-details/index?roomId=' + this.roomId
            })
        },
    },
    onLoad(data) {
      this.roomId = data.roomId || null
      this.equipStatisticInfo()
    }
  }
</script>
<style>
  page {
    background-color: #3978F7;
  }
</style>
<style lang="scss" scoped>
  .info-page {
    padding: 35rpx 18rpx;
      .icon-text{
          margin-right: 23rpx;
          color:#fff;
          font-size:40rpx;
      }
  }
  .StatusBox {
    border-radius: 24rpx;
    overflow: hidden;
    background-color: #FFE7B4;
    margin-bottom: 18rpx;

    .mian {
      position: relative;
      border-radius: 24rpx;
      background-color: #FFFFFF;
      padding: 22rpx 30rpx 52rpx;

      .title {
        padding-bottom: 23rpx;
        border-bottom: 1rpx solid #EEEEEE;
        font-size: 32rpx;
        color: #333333;
        font-weight: bold;
        margin-bottom: 41rpx;
        .sub-title{
          height: 32px;
          font-size: 28rpx;
          color: #77787D;
          line-height: 32px;
        }
      }

      .statistics {
        display: flex;
        align-items: center;
        justify-content: space-around;

        .statistics-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20rpx;

          .val {
            color: #111737;
            font-size: 40rpx;
            font-weight: bold;
            margin-bottom: 17rpx;
          }

          .label {
            color: #111737;
            font-size: 26rpx;
            opacity: 0.6;
          }
        }
      }

      .status {
        position: absolute;
        top: 0;
        right: 0;
        border-radius: 0 24rpx 0 100rpx;
        font-size: 24rpx;
        padding: 12rpx 24rpx 12rpx 38rpx;

        &.state1 {
          color: #4885FF;
          background-color: #E1EBFF;
        }

        &.state2 {
          color: #EA1141;
          background-color: #FBE7E7;
        }
      }
    }

    .bottom {
      padding: 35rpx 30rpx 55rpx;
      display: flex;
      align-items: center;
      color: #333333;

      .iconfont {
        position: relative;
        top: 4rpx;
        font-size: 48rpx;
        margin-right: 10rpx;
      }

      .txt {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 26rpx;
      }
    }
  }

  .details {
    background-color: #F6F7FC;
    border-radius: 20px;
    padding: 32rpx 22rpx 1rpx;
    margin-bottom: 56rpx;
  }

  .details-item {
    display: flex;
    align-items: center;
    color: #333333;
    font-size: 24rpx;
    margin-bottom: 44rpx;

    .iconfont {
      font-size: 30rpx;
      margin-right: 20rpx;
    }

    .label {
      margin-right: 30rpx;
    }

    .line {
      flex: 1;
      height: 1rpx;
      border-bottom: 2rpx dashed #111737;
      margin-right: 20rpx;
      min-width: 10rpx;
      word-break: break-all;
    }
  }
</style>
