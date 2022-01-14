<script>
	// #ifdef APP-PLUS
	import APPUpdate from "@/plugins/APPUpdate/index";
	// #endif
	export default {
	    data(){
	        return {
	            msgTimer:null
            }
        },
	    methods:{
            /*// 接收推送消息
            handleReceiveMsg(msg){
                if (plus.os.name == 'Android') {
                    let options = {cover: false,title: msg.title};
                    plus.push.createMessage(msg.content, msg.payload, options);
                }else{
                    // 去除重复消息
                    if (msg.aps == null && msg.type == "receive", msg.payload !== 'LocalMSG') {
                        console.log('receive', msg)
                        let mssage = JSON.parse(msg.content.replace(/(?:\s*['"]*)?([a-zA-Z0-9]+)(?:['"]*\s*)?:/g, '\"$1\":'))
                        let options = {cover: false,title: mssage.title};
                        plus.push.createMessage(mssage.content, 'LocalMSG', options);
                    }
                }
            },
            //点击消息
            handleClickMsg(msg){
                this.clearMsgTimer()
                this.msgTimer = setTimeout(() => {
                    console.log('click', msg)
                    if (msg.payload) {
                        if (typeof msg.payload === 'string') {
                            this.handleJump(JSON.parse(msg.payload))
                        }else{
                            this.handleJump(msg.payload)
                        }
                    }
                }, 1500)
            },
            //点击消息跳转
            handleJump(payload){
                that.$u.api.userApi.readSystemMsg({
                    ids: String(payload.id)
                }).then(res => {
                    const url = this.getMsgJumpUrl(payload,Number(payload.msgType))
                    uni.navigateTo({url})

                }).catch(e => {
                    console.log(e)
                })
            },
            // 获取消息跳转链接
            getMsgJumpUrl(payload,type){
                // 查看详情   1设备报警详情页、2实名认证页、3我的学习资料、4意见反馈详情页、5设备共享成员页
                let url = ''
                switch (type) {
                    // 设备报警详情
                    case 1:
                        url = '/pages/me/pages/device-record/pages/warning/index?type=1'
                        break;

                    // 实名认证详情
                    case 2:
                        url = `/pagesMine/pages/personalData/pages/certification/index?status=${payload.linkId}`
                        break;

                    // 学习资料详情
                    case 3:
                        url = '/pages/me/pages/my-study/index'
                        break;

                    // 意见反馈详情
                    case 4:
                        url = '/pagesMine/pages/feedback/pages/feedbackRecord/index'
                        break;

                    // 分享仪器
                    case 5:
                        url = `/pages/index/pages/device-member/index?instruId=${payload.linkId || 0}&jurisdiction=1&dbName=`
                        break;
                }
                return url
            },
            // 清除消息点击Timeout
            clearMsgTimer(){
                if(this.msgTimer){
                    clearTimeout(this.msgTimer)
                    this.msgTimer = null
                }
            }*/
        },
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			APPUpdate(false, '1');
			let that = this;
            /*//开启推送
            uni.subscribePush({
                provider: "unipush",
                success: function(res) {
                    that.$u.api.userApi.registerClient({
                        clientId: res.clientid
                    }).then(resInfo => {
                        console.log('消息推送绑定用户设备', res.clientid, resInfo)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            });
            plus.push.addEventListener("click", this.handleClickMsg, false)
            plus.push.addEventListener("receive", this.handleReceiveMsg, false)*/

			// #endif
		},
		onShow: function() {
			console.log('App Show')
			/*setTimeout(() => {
			  // #ifdef APP-PLUS
			  plus.navigator.closeSplashscreen();
			  // #endif
			}, 2000)*/
		},
		onHide: function() {
			console.log('App Hide');
			// this.$u.api.userApi.unregisterClient({}).then(res => {
			// 	console.log('消息推送解绑用户设备', res)
			// })
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";

	view,
	text,
	image {
		box-sizing: border-box;
		font-family: PingFang SC;
		line-height: 100%;
	}

	page {
		background-color: #F6F7FC;
		overflow-x: hidden;
	}

	@font-face {
		font-family: 'iconfont';
		/*src: url('//at.alicdn.com/t/font_2237843_hkg1mjvrhy9.ttf') format('truetype');*/
		src: url('~@/static/font/iconfont.ttf') format('truetype');
	}

	.iconfont {
		font-family: iconfont;
	}

	/deep/.uni-page-head-ft{
		margin-right: 26rpx;
	}
</style>
