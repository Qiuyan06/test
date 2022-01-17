<template>
    <web-view :src="url"></web-view>
</template>

<script>
    export default {
        data(){
            return {
                title:'',
                url:''
            }
        },
        onLoad(data){
			wx.hideHomeButton()
			this.title=data.title
            this.url = decodeURIComponent(data.url)
        },
		onReady(){
			uni.setNavigationBarTitle({
				title:this.title
			})
		}
    }
</script>