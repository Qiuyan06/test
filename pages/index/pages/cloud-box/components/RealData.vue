<template>
  <view class="envinfo-box">
    <view class="item" v-for="(item, index) in realData">
      <view class="con" v-if="item.images">
        {{ item.fieldName }}
        <text class="iconfont">{{ item.images | formatFont }}</text>
      </view>
      <view class="cons" v-else>{{ item.fieldName }}</view>
      {{ showByRealData?item.fieldValue:'--' }}
    </view>
  </view>
</template>
<script>
export default {
  props: {
  showByRealData:{
      type:Boolean,
  },
    realData: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    formatFont(v) {
      if (v === null || v === '' || v === undefined) return ''
      return unescape('%u' + v.slice(3, 7))
    }
  }
}
</script>
<style lang="scss" scoped>
.envinfo-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 58rpx;

  .item {
    width: 209rpx;
    height: 140rpx;
    padding: 17rpx;
    background: linear-gradient(180deg, #ffffff 0%, #f7fffd 100%);
    border-radius: 16rpx;
    border: 2rpx solid #e3e5eb;
    margin-bottom: 20rpx;
    text-align: center;

    &.warn {
      background: linear-gradient(
        180deg,
        #ffffff 0%,
        #fffafa 46%,
        #ffdbdb 100%
      );
      border: 2rpx solid #f54242;
    }

    .con {
      display: flex;
      justify-content: space-between;
      margin-bottom: 35rpx;
      font-size: 26rpx;
      font-weight: bold;
      color: #111737;

      .iconfont {
        font-size: 30rpx;
      }
    }
    .cons {
      margin-bottom: 35rpx;
      font-size: 26rpx;
      font-weight: bold;
      color: #111737;
    }
  }

  &::after {
    content: '';
    width: 209rpx;
  }
}
</style>
