<template>
    <u-navbar title="记录" :border-bottom="false">
        <view slot="right" v-if="!hideIcon">
            <u-icon name="setting" size="40" style="margin-right: 23rpx" @click="showSet"></u-icon>
        </view>
    </u-navbar>
</template>

<script>
    export default {
        props:{
            jurisdiction:{
                type: String,
                required: true
            },
            instruType:{
                type: Number,
                required: true
            },
            tabsCurrent:{
                type: Number,
                default: 0
            }
        },
        data(){
            return {
            }
        },
        computed: {
            // 查看权限隐藏设置按钮；隐藏非仪器猫类型设备的预警设置按钮；隐藏维修设置按钮
            hideIcon() {
                return Number(this.jurisdiction)===3 ||(this.tabsCurrent===0 && Number(this.instruType)!==2) ? true : false
            }
        },
        methods:{
            showSet(){
                this.$emit('showSet')
            }
        }
    }
</script>

