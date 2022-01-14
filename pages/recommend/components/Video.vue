<template>
    <view class="video">
        <video
            :src="comData"
            controls
        >
        </video>
    </view>
</template>

<script>
    export default {
        props: {
            comData: {
                type: Object,
                required: true
            },
        },
        data(){
            return {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .video{
        margin-top: 30rpx;
        height: 400rpx;
    }
</style>
