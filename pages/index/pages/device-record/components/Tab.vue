<template>
    <view class="tabswrap">
        <view
            v-for="(item,index) in menuList"
            :class="item.name===current?'tab-item active':'tab-item'"
            @click="toUrl(item)"
        >
            {{item.name}}
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            current: {
                type: String,
                required: true
            },
            instruNum:{
                type: String,
                required: true
            },
            instruId:{
                type: String,
                required: true
            },
            dbName:{
                type: String,
                required: true
            },
            state:{
                type: String,
                    required: true
            },
            userId:{
                type: String,
                    required: true
            },
            instruType:{
                type: String,
                    required: true
            }
        },
        data(){
            return {
                menuList:[
                    {name:'预警',url:'/pages/index/pages/device-record/pages/warning/index'},
                    {name:'维修',url:'/pages/index/pages/device-record/pages/service/index'},
                    {name:'维护',url:'/pages/index/pages/device-record/pages/maintains/index'},
                    {name:'计量',url:'/pages/index/pages/device-record/pages/measurement/index'},
                    {name:'保养',url:'/pages/index/pages/device-record/pages/maintenance/index'}
                ],
            }
        },
        methods:{
            toUrl(item){
                if(item.name==='current')return
                uni.navigateTo({
                    url: `${item.url}?instruNum=${this.instruNum}&instruId=${this.instruId}&dbName=${this.dbName}&state=${this.state}&userId=${this.userId}&instruType=${this.instruType}`
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tabswrap{
        margin-top: 15rpx;
        display: flex;
        background: #fff;
        .tab-item{
            height: 40px;
            line-height: 40px;
            font-size: 15px;
            transition-duration: 0.5s;
            flex: 1 1 0%;
            width: auto;
            color: rgb(51, 51, 51);
            text-align: center;
            &.active{
                color: #3d7fff;
                font-weight: bold;
                position: relative;
                &:before{
                    position: absolute;
                    content: '';
                    bottom: 0;
                    left: 50%;
                    margin-left: -40rpx;
                    width: 80rpx;
                    background-color: #3d7fff;
                    height: 6rpx;
                    border-radius: 6rpx;
                }
            }
        }
    }
</style>
