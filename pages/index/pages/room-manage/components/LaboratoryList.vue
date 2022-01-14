<template>
  <view class="Laboratory" :class="{ noBool: !bool.val }">
    <view class="allState">
      <view class="state" :class="{ bool: bool.val }" v-if="bool.val">
        <text>{{ bool.name }}</text>
      </view>
      <view class="state" :class="{ noBool: !bool.val }" v-else>
        <text>异常</text>
      </view>
    </view>
    <view class="lab-checkbox">
        <u-checkbox v-if="flag" v-model="comData.checked" :name="comData.id" label-size="0" shape="circle"></u-checkbox>
    </view>
    <view class="allContent"  @click="toRoom">
      <view class="title">
          <view class="sub-name">{{comData.name || ''}}</view>
          <view class="name">{{comData.labName || "" }}</view>
        </view>
        <view class="content">
          <view class="content_left">
            <view class="percentage_num">
              <text style="color: #1e1e1e; font-size: 40rpx; font-weight: 700"
                >{{comData.runEquipCount || 0}}</text
              >
              <text style="color: #837e7f; font-size: 28rpx; font-weight: 500"
                >/{{comData.allEquipCount || 0}}</text
              >
            </view>
            <view class="percentage_run">
              <text style="color: #1e1e1e; font-size: 28rpx; font-weight: 500"
                >运行
              </text>
              <text style="color: #837e7f; font-size: 24rpx; font-weight: 500"
                >/设备</text
              >
            </view>
          </view>
          <view class="content_right">
            <view class="imageBox" :class="{ right_image: bool.val }" v-if="List.length < 1">
              <u-image
                  :src="require(bool.val ? '@/static/images/common/device-icon1.png':'@/static/images/common/device-icon2.png')"
                  width="142"
                  height="142"
              ></u-image>
            </view>
            <view class="list">
              <view
                class="content_right_item"
                :class="[current === index ? 'isActive' : '']"
                v-for="(item, index) in List"
                :key="index"
                @click="colorHandle(index)"
              >
                <view class="iconfont">{{ item.iconfont }}</view>
                <view class="text"> {{ item.iconfontname }} </view>
              </view>
            </view>
          </view>
        </view>
        <view class="warning" v-if="!bool.val">
          <view class="waning_bg" @click.stop="toRecord(comData.equipLogBean)">
            <view class="warning_left">
              <view class="iconfont">&#xe64d;</view>
              <view class="text"> {{comData.equipLogBean && comData.equipLogBean.warnContent}}，请立即处理 </view>
            </view>
            <view class="iconfont">&#xe642;</view>
          </view>
        </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    comData: {
      type: Object,
      required: true,
    },
     flag: {
                type: Boolean,
                default: false
            }
  },
  data() {
    return {
      List: [
        /*{
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
        },*/
      ],
      current: "",
    };
  },
  computed: {
    bool() {
      const bool = {
        name: "异常",
        val: false,
      };

      if (this.comData.bool) {
        bool.name = "正常";
        bool.val = true;
      }

      return bool;
    },
  },
  methods: {
    // 跳转到房间详情
    toRoom() {
      uni.navigateTo({
        url: "/pages/index/pages/room/index?roomId=" + this.comData.id,
      });
    },
    colorHandle(index) {
      this.current = index;
    },
    toRecord(data) {
      const instruNum = `?instruNum=${data.instruNum||''}`
      const instruId = `&instruId=${data.instruId||''}`
      const dbName = `&dbName=${data.dbName||''}`
      const jurisdiction = `&jurisdiction=${data.jurisdiction||''}`
      // 区分云盒子和其他类型设备的跳转
      const url = data.instruType==='1'?'/pages/index/pages/device-cloud-box-record/index':'/pages/index/pages/device-record/index'
        if(data.instruType==='1'){
            this.$u.api.equipmentApi.getSmartCloudBoxTemplateInfo({
                parameter: { equipId:data.instruId, platformType:'IOT-UU', moduleType:'4' }
            }).then((res) => {
                const data = res && res.setContent && JSON.parse(res.setContent)
                const warnLogger = data && data.tabs && data.tabs.filter(item=>item.isAlarmLog==='ON')
                if(warnLogger && Array.isArray(warnLogger) && warnLogger.length>0){
                    this.$u.vuex(`s_bus.setList`, warnLogger)
                    uni.navigateTo({
                        url: `${url}${instruNum}${instruId}${dbName}${jurisdiction}&instruType=${data.instruType}`
                    });
                }else{
                    uni.showToast({
                        title: '后台未配置报警信息',
                        icon: 'none'
                    })
                }
            })
        }else{
            uni.navigateTo({
                url: `${url}${instruNum}${instruId}${dbName}${jurisdiction}&instruType=${data.instruType}`
            });
        }

    }
  },
};
</script>
<style lang="scss" scoped>
.Laboratory {
  position: relative;
  padding: 30rpx 0 24rpx;
  background-image: linear-gradient(#fff, #eefcf2);
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
 .lab-checkbox{
      /deep/ .u-checkbox{
          margin: 20rpx 0 0 30rpx;
          max-width: 40rpx;
      }
  }
.allContent{
    flex: 1;
}
  &.noBool {
    border: 2rpx solid #ea1141;
    background-image: linear-gradient(#fff, #fdd9d9);
  }

  .state {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fbe7e7;
    font-size: 24rpx;
    color: #ea1141;
    border-radius: 0 22rpx 0 100rpx;
    padding: 11rpx 22rpx 11rpx 30rpx;

    &.bool {
      background-color: #e7fbed;
      color: #2ec33d;
    }
  }
  .title {
    padding-right: 110rpx;
    padding-left: 22rpx;
    font-size: 28rpx;
    color: #111737;

    .sub-name {
      padding: 4rpx 6rpx;
      font-size: 30rpx;
      color: #111737;
      border-radius: 6rpx;

      margin-left: 8rpx;
      font-weight: bold;
    }
    .name {
      padding: 4rpx 6rpx;
      padding-bottom: 0rpx;
      font-size: 26rpx;
      color: #818293;
      margin-left: 8rpx;
      line-height: 30px;
    }
  }
  .icon-font {
    font-size: 18rpx;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28rpx;
    padding-bottom: 6rpx;
    .content_left {
      height: 90rpx;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      width: 40%;
    }

    .content_right {
      height: 120rpx;
      width: 60%;
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
        .imageBox{
            position: absolute;
            bottom: 10rpx;
            right: 0rpx;
            height: 140rpx;
            width: 140rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
      .right_image {
        background-image: linear-gradient(#e7fbed, #fff);
        border-radius: 58rpx;
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .content_right_item {
          width: 47%;
          background-color: #f5f7f9;
          height: 56rpx;
          border-radius: 28rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          margin: 10rpx 0;
          padding: 0 10rpx;
          .iconfont {
            font-size: 30rpx;
            margin-right: 8rpx;
          }

          .text {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: nowrap;
            font-size: 26rpx;
          }
        }
      }
    }
  }

  .warning {
    padding: 0 40rpx;
    .waning_bg {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 24rpx;
      background-color: #fbd1d1;
      border-radius: 16rpx;

      margin-top: 15rpx;
      .warning_left {
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
          font-size: 32rpx;
          margin-right: 14rpx;
        }

        .text {
            margin-right: 6rpx;
            color: #f54242;
            font-size: 22rpx;
            line-height: 30rpx;
        }
      }

      .iconfont {
        font-size: 24rpx;
        color: #f54242;
      }
    }
  }
}
</style>
