<template>
    <u-popup class="detail" v-model="isShow" :z-index="998" mode="center" width="90%" border-radius="18">
        <view class="title">
            设置
        </view>
        <view class="box">
            <view class="lable">
                <text>备注</text>
            </view>
            <view class="value">
                <u-input v-model="textValue" placeholder="输入备注" :focus="true" type="textarea" height="70" />
            </view>
        </view>
        <view class="footer">
            <u-button type="primary" :custom-style="customStyle" @click="save">确认</u-button>
        </view>
    </u-popup>
</template>

<script>
    export default {
        data(){
            return {
                customStyle: {
                    width: '90%',
                    margin: '30rpx 0',
                },
                isShow:false,
                textValue: '',
            }
        },
        methods:{
            /* 显示弹框 */
            show(data) {
                this.isShow = true
                this.textValue = data
            },
            /* 关闭弹框 */
            close() {
                this.isShow = false
                this.textValue = ''
            },
            /* 标记无效 */
            save() {
                if(this.textValue)this.$emit('setRemark',this.textValue)
                this.close()
            }
        }
    }
</script>

<style lang="scss" scoped>
.detail {
    ::-webkit-scrollbar{
        display: none;
    }
    /deep/ .u-warning-hover {
        background: none !important;
    }

    .title {
        margin: 55rpx 0;
        height: 56rpx;
        text-align: center;
        font-size: 40rpx;
        font-weight: bold;
        color: #333333;
        line-height: 56rpx;
    }

    .box{
        background-color: #ffffff;
        padding: 24rpx 24rpx 0 24rpx;
        margin-bottom: 24rpx;

        .lable {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 32rpx;
            color: #333333;
            padding-bottom: 24rpx;
        }

        .value {
            padding-bottom: 24rpx;
        }
    }

    .footer {
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        width:100%;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: content-box;
        padding-bottom: var(--window-bottom);
        .custom-style{
            width: 50%;
        }
        .custom-style2{
            width: 100%;
        }
    }
}
</style>
