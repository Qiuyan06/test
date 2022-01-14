<template>
  <view class="DetailsInfo">
    <view class="content">
      <view class="basic">
        <view class="name">
          <view>{{ roomData ? roomData.name || "" : "" }}</view>
          <view class="iconfont" style="font-size:32rpx; margin-left:15rpx">&#xe642;</view>
          <!-- <u-icon name="arrow-right" color="#111737" size="24" style="position: relative;top: 2rpx;left: 4rpx;"></u-icon> -->
        </view>
        <!--<view class="list">
          <view
            class="content_right_item"
            :class="[current===index?'active':'']"
            v-for="(item, index) in List"
            :key="index"
            @click=" colorHandle(index)"
          >
            <view class="iconfont">{{ item.iconfont }}</view>
            <view class="text"> {{ item.iconfontname }} </view>
          </view>
        </view>-->
        <view class="status" :class="[`state${state.val}`]">
          <text>{{ state.name }}</text>
        </view>
      </view>
      <view class="line">
        <view class="circular"></view>
        <view class="sub-line"></view>
        <view class="circular end"></view>
      </view>
      <view class="statistics">
        <view class="statistics-item">
          <view class="num">
            <text>{{ roomData ? roomData.instruCount || 0 : 0 }}</text>
          </view>
          <text class="label">设备</text>
        </view>
        <view class="statistics-item">
          <view class="num">
            <text>{{ roomData ? roomData.runningCount || 0 : 0 }}</text>
          </view>
          <text class="label">运行</text>
        </view>
        <view class="statistics-item">
          <view class="num">
            <text>{{ roomData ? roomData.waitCount || 0 : 0 }}</text>
          </view>
          <text class="label">待机</text>
        </view>
        <view class="statistics-item">
          <view class="num">
            <text>{{ roomData ? roomData.powerOffCount || 0 : 0 }}</text>
          </view>
          <text class="label">关机</text>
        </view>
        <view class="statistics-item">
          <view class="num">
            <text>{{ roomData ? roomData.warnCount || 0 : 0 }}</text>
          </view>
          <text class="label">报警</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      List: [
        {
          iconfont: "\ue66d",
          iconfontname: "60℃",
        },
        {
           iconfont: "\ue66c",
          iconfontname: "80%rh",
        },
        {
          iconfont: "\ue66a",
          iconfontname: "通风 开",
        },
        {
          iconfont: "\ue6aa",
          iconfontname: "120kwh",
        },
      ],
      current:""
    };
  },
  props: {
    roomData: {
      type: [Object, null],
      default: null,
    },
    instruData: {
      type: [Object, null],
      default: null,
    },
  },
  computed: {
    state() {
      let state = {
        val: 0,
        name: "",
      };

      if (this.roomData && this.roomData.bool) {
        state.name = "正常";
        state.val = 1;
      }

      if (this.roomData && !this.roomData.bool) {
        state.name = "异常";
        state.val = 2;
      }

      return state;
    },
  },
  methods: {
      colorHandle(index){

          this.current=index
      }
  },
};
</script>
<style lang="scss" scoped>
.DetailsInfo {
  padding: 28rpx 24rpx 100rpx;
  background-color: #3978f7;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;

  .content {
    background-color: #ffffff;
    border-radius: 24rpx;
    overflow: hidden;
    margin-bottom: 56rpx;

    .basic {
      position: relative;
      padding: 30rpx 30rpx 38rpx;

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
        color: #77787d;
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
          color: #2ec33d;
          background-color: #e7fbed;
        }

        &.state2 {
          color: #ea1141;
          background-color: #fbe7e7;
        }
      }
      .list {
          margin-top:40rpx ;
        display: flex;
        .content_right_item {
          flex: 1;
          background-color: #f5f7f9;
          height: 56rpx;
          border-radius: 28rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 8rpx;
          padding: 0 4rpx;
          .iconfont {
            font-size: 30rpx;
            margin-right: 8rpx;
          }

          .text {
            font-size: 26rpx;
          }
        }
      }
    }

    .line {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30rpx;

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
        background-color: #3978f7;
        margin: auto;

        &.end {
          left: auto;
          right: -15rpx;
        }
      }
    }

    .statistics {
      padding: 38rpx 0 35rpx;
      display: flex;
      align-items: center;

      .statistics-item {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .num {
          position: relative;
          font-size: 40rpx;
          font-weight: bold;
          color: #111737;
          margin-bottom: 14rpx;
        }

        .label {
          font-size: 26rpx;
          color: #111737;
          opacity: 0.6;
        }
      }
    }
  }
  .active{
      background-color: #ffeded!important;
      border:2rpx solid #ff0f0f;
  }
}
</style>
