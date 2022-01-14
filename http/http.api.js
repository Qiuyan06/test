import user from './api/user'

// 此处第二个参数vm，就是我们在页面使用的this，可以通过vm获取vuex等操作
const install = (Vue, vm) => {
    const userApi = user.install(vm)

    // 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
    vm.$u.api = {userApi};
}

export default {
    install
}
