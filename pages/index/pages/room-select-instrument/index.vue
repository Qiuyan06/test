<template>
  <view>
    <view class="info">
      <u-icon name="error-circle-fill"></u-icon>
      <text style="margin-left: 10rpx;">最多可分享10台仪器</text>
    </view>
    <view class="content">
      <view class="nav">
        <view class="nav-left">
          <scroll-view scroll-y style="height: calc(100vh - 180px)">
            <template v-for="(item,index) in list">
              <view class="nav-left-item" :key="item.cateId" :class="item.cateId===categoryActive?'active':''" @click="categoryClickMain(item,index)">
                {{item.cateName}}
              </view>
            </template>
          </scroll-view>
        </view>
        <view class="nav-right">
          <scroll-view scroll-y :scroll-top="scrollTop" @scroll="scroll" style="height: calc(100vh - 180px)" scroll-with-animation >
            <view class="nav-right-content">
              <view class="nav-right-content-item">
<!--                <view class="title">显微镜及电镜</view>-->
                <view class="mc-content">
                  <view class="mc-item">
                    <u-checkbox-group @change="checkboxGroupChange" :wrap="true">
                      <u-checkbox
                          @change="checkboxChange"
                          v-model="item.checked"
                          v-for="(item, index) in subCategoryList" :key="index"
                          :name="item.instruId"
                          shape="circle"
                          :ref="'item' + item.instruId"
                      >{{item | typeFilter}}</u-checkbox>
                    </u-checkbox-group>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <view class="footer-btn">
      <u-button type="primary" shape="circle" :custom-style="{width: '95%', height: '88rpx', fontSize: '34rpx'}" @click="handleSubmit">
        已选择{{selectedIds.length}}台仪器
      </u-button>
    </view>
  </view>
</template>

<script>
  export default {
    filters: {
      typeFilter(val) {
        if (!val.instruType || val.instruType === 4) return val.instruName
        return `${val.instruName}（${['云盒子', '仪器猫', '仪器猫伴侣'][val.instruType - 1]}）`
      },
    },
    data(){
      return {
        categoryList:[],
        subCategoryList: [],
        categoryActive:0,
        scrollTop:0,
        scrollHeight:0,
        roomId: null,
        list: [],
        selectedIds: []
      }
    },
    methods:{
      // 选中某个复选框时，由checkbox时触发
      checkboxChange(e) {
        if (e.value) {
          this.selectedIds.push(e.name)
        } else {
          this.selectedIds.splice(this.selectedIds.indexOf(e.name), 1)
        }
        if (this.selectedIds.length > 10) {
          uni.showToast({
            title: '最多只能勾选10台仪器',
            icon: 'none'
          })
          this.subCategoryList = this.subCategoryList.map(item => {
            return {
              ...item,
              checked: false
            }
          })
          this.selectedIds.splice(this.selectedIds.indexOf(e.name), 1)
        }
      },
      // 选中任一checkbox时，由checkbox-group触发
      checkboxGroupChange(e) {
        // console.log(e);
      },
      scroll(e){
        this.scrollHeight = e.detail.scrollHeight;
      },
      categoryClickMain(item, index) {
        this.categoryActive = item.cateId
        this.subCategoryList = item.evipInfoRes.map(item => {
          return {
            ...item,
            checked: this.selectedIds.includes(item.instruId)
          }
        })
        this.scrollTop = -this.scrollHeight * index
      },
      owerEquipForShar() {
        const parameter = {
          roomId: this.roomId
        }
        this.$u.api.equipmentApi.owerEquipForShar({ parameter }).then((res) => {
          if (res) {
            this.list = res
            this.categoryActive = res[0] && res[0].cateId || null
            this.categoryClickMain(res[0] || {}, 0)
          }
        })
      },
      handleSubmit() {
        if (!this.selectedIds.length) {
          uni.showToast({
            title: '请先勾选仪器',
            icon: 'none'
          })
          return
        }
        uni.navigateTo({
          url: '/pages/index/pages/share-page/index?permissionIds=' + this.selectedIds.toString()
        })
      }
    },
    onLoad(data){
      this.roomId = data.roomId || null
      this.owerEquipForShar()
    }
  }
</script>

<style lang="scss" scoped>
  .info{
    height: 76rpx;
    background: #E9F1FF;
    padding-left: 20rpx;
    font-size: 28rpx;
    color: #2C72F9;
    line-height: 76rpx;
  }
  .content {
    background: #FFFFFF;
    border-radius: 24rpx;
    margin: 32rpx 18rpx;
    .nav {
      display: flex;
      width: 100%;
      .nav-left {
        width: 30%;
        .nav-left-item {
          min-height: 100rpx;
          background: #FBFBFC;
          display: flex;
          align-items: center;
          justify-content: center;
          word-break: break-all;
          padding: 20rpx;
          &:first-child{
            border-radius: 24rpx 0 0 0;
          }

        }
        .active {
          color: #1677FF;
          background: white;
          font-weight: bold;
          &:before{
            position: absolute;
            left: 0;
            content: '';
            width: 6rpx;
            height: 30rpx;
            background: #1677FF;
            border-radius: 3rpx;
          }
        }
      }
      .nav-right {
        width: 70%;
        .nav-right-content{
          padding: 10rpx 37rpx;
          .nav-right-content-item{
            .title{
              height: 100rpx;
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 45px;
            }
            .mc-content{
              .mc-item{
                /deep/ .u-checkbox-group {
                  display: block;
                  width: 100%;
                }
                /deep/ .u-checkbox{
                  display: block;
                  padding: 20rpx 0;
                }
                /deep/ .u-checkbox__icon-wrap.u-checkbox__icon-wrap--circle{
                  display: inline-block;
                  width: 50%;
                  float: right;
                  margin-top: 4rpx;
                }
                /deep/ .u-checkbox__label{
                  display: inline-block;
                  width: 50%;
                  float: left;
                  word-break: break-all;
                  line-height: 36rpx;
                }
                /deep/ .u-icon__icon.uicon-checkbox-mark.u-iconfont{
                  top: -18rpx !important;
                }
              }
            }
          }
        }
      }
    }
  }
  .footer-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 34rpx 0;
  }
</style>
