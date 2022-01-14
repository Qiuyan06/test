<template>
    <view class="share-code">
        <view class="code">
            <u-image v-if="img" width="450rpx" height="450rpx" border-radius="12" :src="img">
                <u-loading slot="loading"></u-loading>
            </u-image>
        </view>
        <view class="desc">
            <text>分享用户扫一扫即可</text>
        </view>
        <view class="desc">
            <text v-if="sel === '2'">该二维码24小时内有效</text>
            <text v-else>该二维码仅一次有效</text>
        </view>
        <u-button type="primary" shape="circle" :custom-style="{width: '702rpx', height: '88rpx', fontSize: '34rpx', marginTop: '124rpx'}" @click="saveCode">保存至手机</u-button>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                permissionIds: '',
                roleId: '',
                sel: '',
                img: ''
            }
        },
        methods: {
            equipShareCode() {
                this.$u.api.equipmentApi.equipShareCode({
                    parameter: {
                        permissionIds: this.permissionIds,
                        roleId: this.roleId,
                        sel: this.sel
                    }
                }).then((res) => {
                    this.img = res ? 'data:image/jpeg;base64,' + res : ''
                })
            },
            saveCode() {
                if (!this.img) {
                    return
                }
                var b = new plus.nativeObj.Bitmap('bitblmap');

                b.loadBase64Data(this.img, function () {
                    /*这里一定要是_doc目录*/
                    b.save("_doc/share-code.png", {overwrite: true}, function (object) {
                        //保存到相册
                        plus.gallery.save("_doc/share-code.png", function () {
                            uni.showToast({
                                title: '保存成功'
                            });
                        }, function () {
                            uni.showToast({
                                title: '图片保存失败'
                            });
                        });
                    }, function () {
                        uni.showToast({
                            title: '图片保存失败'
                        });
                    });
                }, function () {
                    uni.showToast({
                        title: '图片保存失败'
                    });
                });
            }
        },
        onLoad(data) {
            this.permissionIds = data.permissionIds || ''
            this.roleId = data.roleId || ''
            this.sel = data.sel || ''

            this.equipShareCode()
        }
    }
</script>
<style>
    page {
        background-color: #FFFFFF;
    }
</style>
<style lang="scss" scoped>
    .share-code {
        padding-top: 84rpx;

        .code {
            width: 450rpx;
            height: 450rpx;
            margin: auto;
            overflow: hidden;
            margin-bottom: 20rpx;
        }

        .desc {
            font-size: 30rpx;
            color: #111737;
            margin-top: 20rpx;
            text-align: center;
        }
    }
</style>
