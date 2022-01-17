<template>
    <view class="video">
        <video
			:style="{'width': '100%'}"
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
		width:100%;
        height: 400rpx;
    }
</style>
