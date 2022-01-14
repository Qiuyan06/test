<template>
    <view class="MemberItem" @click="selectMember">
        <view class="select-box" v-if="isEdit">
            <view class="select" :class="{active: isSelect}">
                <u-icon name="checkmark" size="18" color="#ffffff"></u-icon>
            </view>
        </view>
        <view class="image">
            <u-image width="90rpx" height="90rpx" border-radius="12" :src="comData.img">
                <u-loading slot="loading"></u-loading>
            </u-image>
        </view>
        <view class="mian">
            <view class="name">
                <text>{{comData.userName || ''}}</text>
            </view>
            <view class="phone">
                <text>{{comData.telephone || ''}}</text>
            </view>
        </view>
        <view class="power" :class="[`status${tsysRole.status}`]">
            <text>{{tsysRole.name}}</text>
        </view>
    </view>
</template>
<script>
    export default {
        props: {
            comData: {
                type: Object,
                required: true
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isSelect: false
            }
        },
        computed: {
            tsysRole() {
                const tsysRole = {
                    name: '',
                    status: ''
                }

                if (this.comData.tsysRole) {
                    tsysRole.name = this.comData.tsysRole.name
                    tsysRole.status = this.comData.tsysRole.status
                }

                return tsysRole
            }
        },
        methods: {
            selectMember() {
                if (!this.isEdit) {
                    return
                }

                this.isSelect = !this.isSelect

                this.$emit('selectMemberChange', {
                    isSelect: this.isSelect,
                    userId: this.comData.userId,
                    instruId: this.comData.instruId
                })
            }
        },
        watch: {
            isEdit() {
                this.isSelect = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    .MemberItem {
        display: flex;
        align-items: center;
        padding: 28rpx 30rpx 28rpx 0;
        border-bottom: 1rpx solid #E3E5EB;

        &:last-of-type {
            border-bottom: none;
        }

        .image {
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            border: 2rpx solid #C8D8EA;
            overflow: hidden;
            margin-right: 24rpx;
        }

        .mian {
            flex: 1;

            .name {
                word-break:break-all;
                font-size: 30rpx;
                font-weight: bold;
                color: #000000;
                margin-bottom: 16rpx;
            }

            .phone {
                font-size: 26rpx;
                color: #999999;
            }
        }

        .power {
            flex-shrink: 0;
            margin-left: 24rpx;
            width: 92rpx;
            height: 32rpx;
            border-radius: 6rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20rpx;

            &.status1 {
                color: #FF3D3D;
                background-color: #FFE6E8;
            }

            &.status2{
                color: #31CC31;
                background-color: #E6FFE6;
            }

            &.status3 {
                color: #3D7FFF;
                background-color: #3D7FFF;
            }
        }
    }

    .select-box {
        display: flex;
        align-items: center;
        margin-right: 26rpx;

        .select {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 37rpx;
            height: 37rpx;
            border-radius: 50%;
            border: 1rpx solid #BDC3CF;

            &.active {
                background-color: #2C72F9;
                border: none;
            }
        }
    }
</style>
