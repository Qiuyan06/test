import Vue from 'vue'
import App from './App'
import uView from 'uview-ui';
Vue.use(uView);

// vuex 封装
import vuexStore from '@/store/$u.mixin.js'
Vue.mixin(vuexStore);
import store from '@/store';
// vuex 封装


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/http/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import uploadImage from '@/http/uploadImage.js'
Vue.use(uploadImage, app)

// http接口API集中管理引入部分
import httpApi from '@/http/http.api.js'
Vue.use(httpApi, app)

app.$mount()
