<template>
    <view class="select-equip">
        <view class="search">
            <u-search clearabled bg-color="#F0F2F5" border-color="#F0F2F5" :show-action="false"></u-search>
        </view>
        <view class="types">
            <view class="tabs">
                <view :class="{'type-item':true, 'active':active === item.id}" v-for="item in typesList" :key="item.id"
                      @click="change(item.id)">
                    {{item.name}}
                </view>
            </view>
            <view class="equipBox">
                <view class="equipBoxbg">
                    <view
                            class="equip-item"
                            v-for="item in list"
                            :key="item.id"
                            @click="addEquip(item)"
                    >
                        <view class="image">
                            <u-image
                                    class="img"
                                    width="70rpx"
                                    height="70rpx"
                                    :src="item.img"
                                    :show-error="true"
                                    :error-icon="require('@/static/images/common/default-img.png')"
                            >
                                <u-loading slot="loading"></u-loading>
                            </u-image>
                        </view>
                        <view class="content">
                            <view class="title">{{ item.title }}</view>
                            <view class="sub-title">{{ item.subTitle }}</view>
                        </view>
                    </view>
                    <u-loadmore :status="loadMoreStatus" bg-color="#F6F7FC" />
                </view>
            </view>
        </view>

    </view>
</template>
<script>
  export default {
    data() {
      return {
        active: 1,
        typesList: [
          {
              id: 1,
              name: '物联设备'
          },
          {
              id: 2,
              name: '环控设备'
          },
        ],
        list: [
        {
        id: 1,
        title: '云盒子',
        subTitle: '添加仪器、绑定设备',
        img: 'https://iotapp.prod.ilabeco.com/download/intelligent-terminal/detail/goodsDetailImg/yhz.png'
        },
        {
        id: 2,
        title: '仪器猫',
        subTitle: '添加仪器、绑定设备',
        img: 'https://iotapp.prod.ilabeco.com/download/intelligent-terminal/detail/goodsDetailImg/zndyglzzed.png'
        },
        {
        id: 3,
        title: '仪器猫伴侣',
        subTitle: '添加仪器、绑定设备',
        img: 'https://iotapp.prod.ilabeco.com/download/intelligent-terminal/detail/goodsDetailImg/znsjglzd.jpg'
        },
        {
        id: 4,
        title: '无物联设备仪器',
        subTitle: '添加仪器',
        img: 'https://iotapp.prod.ilabeco.com/download/iot/common/no-iot-instrument.png'
        }
        ],
        loadMoreStatus:'loading',
        nomoreText:'11',
        init: false,
          page:1,pageSize:10,
      }
    },
    computed:{
    },
    methods: {
        change(id) {
            if (id === this.active) return
            this.active = id
        },
        getApi(){
            this.hasMorePage(2,2)
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
        // 扫二维码获取数据
        getDeviceData() {
            uni.scanCode({
                success: (res) => {
                    if (res && res.result) {
                        const par = res.result.split("?")[1]
                        if (par) {
                            const vars = par.split("&");
                            vars.some((item) => {
                                const pair = item.split("=");
                                if (pair[0] === 'qrCodeParameter') {
                                    // 获取扫一扫的参数
                                    const qrCodeParameter = item.replace('qrCodeParameter=', '')

                                    /*this.$u.api.equipmentApi.equipShareCodeBand({
                                        parameter: {
                                            qrCodeParameter: qrCodeParameter
                                        }
                                    }).then((res) => {
                                        console.log('扫一扫获取到数据：',res)
                                    })*/
                                }
                            })
                        }
                    }
                }
            });
        },
        addEquip(item) {
        if (item.id === 4) {
          uni.navigateTo({
            url: '/pages/index/pages/add-equipment/pages/add-equipment-no-iot/index'
          })
        } else {
          uni.navigateTo({
            url: '/pages/index/pages/add-equipment/index?instruType=' + item.id
          })
        }
      }
    },
      onLoad(){
        this.getApi()
      },
      onPullDownRefresh() {
          console.log('下拉刷新')
      },
      onReachBottom() {
          if (this.loadMoreStatus === 'loadmore') {
              this.page++
              this.getApi()
          }
      },
  }
</script>
<style lang="scss" scoped>
  .select-equip{
      background-color: #FFFFFF;
      display: flex;
      flex-direction: column;
      .search {
          position: fixed;
          background: #fff;
          width: 100%;
          height: 100rpx;
          padding: 13rpx 24rpx;
          z-index: 9;
      }
      .types{
          margin-top: 100rpx;
          min-height: calc(100vh - 188rpx);
          position: relative;
          background: #fff;

          .tabs{
              position: fixed;
              left:0;
              width: 210rpx;
              height:calc(100vh - 88rpx);
              background: #F6F7FC;
              .type-item {
                  height: 100rpx;
                  line-height: 100rpx;
                  text-align: center;
                  font-size: 30rpx;
                  font-weight: 400;
                  color: #333333;
                  background: #F5F5F5;
                  &.active {
                      color: #1677FF;
                      background-color: #FFFFFF;
                      position: relative;

                      &::before {
                          content: '';
                          position: absolute;
                          top: 50%;
                          left: 0;
                          transform: translateY(-50%);
                          width: 6rpx;
                          height: 30rpx;
                          background: #1677FF;
                          border-radius: 3rpx;
                      }
                  }
              }
          }
          .equipBox{
              padding-left: 210rpx;
              .equipBoxbg{
                  .equip-item{
                      /*height: 88rpx;*/
                      background: #FFFFFF;
                      margin-bottom: 32rpx;
                      display: flex;
                      .image{
                          width: 88rpx;
                          height: 88rpx;
                          background: #F0F2FA;
                          border-radius: 12px;
                          margin: 32rpx 25rpx 0 32rpx;
                          .img{
                              margin: 8rpx auto 0;
                          }
                      }
                      .content{
                          flex: 1;
                          margin: 24rpx 0 0 0;
                          .title{
                              font-size: 32rpx;
                              font-weight: 600;
                              color: #333333;
                              line-height: 36rpx;
                              margin: 35rpx 0 24rpx;
                          }
                          .sub-title{
                              font-size: 26rpx;
                              font-weight: 400;
                              color: #77787D;
                              line-height: 30rpx;
                          }
                      }
                  }
                  .u-load-more-wrap{
                      width: 90%;
                      margin: 0 auto;
                  }
              }
          }

      }

  }
</style>
