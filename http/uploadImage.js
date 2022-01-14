// 此处第二个参数vm，就是我们在页面使用的this，可以通过vm获取vuex等操作
const install = (Vue, vm) => {
    Vue.prototype.$uploadFile = function (filePath) {
        uni.showToast({
            icon: 'loading'
        });

        return new Promise(function(resolve, reject) {
            uni.uploadFile({
                url: vm.s_baseApi + '/iot-ysa-base/uploadCompressionImage',
                filePath,
                name: 'file',
                header: {
                    token: vm.s_token
                },
                success: (uploadFileRes) => {
                    const data = JSON.parse(uploadFileRes.data)
                    const code = data.code

                    if (code === '200') {
                        resolve(data)
                    } else {
                        reject()
                    }
                },
                fail: () => {
                    reject()
                },
                complete: () => {
                    uni.hideToast();
                }
            });
        });

    }
}

export default {
    install
}
