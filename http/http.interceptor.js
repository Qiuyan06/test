const install = (Vue, vm) => {
	// 此为自定义配置参数
	Vue.prototype.$u.http.setConfig({
		baseUrl: vm.s_baseApi, // 请求的本域名
		method: 'POST',
		// 设置为json，返回后会对数据进行一次JSON.parse()
		dataType: 'json',
		showLoading: true, // 是否显示请求中的loading
		loadingText: '请求中...', // 请求loading中的文字提示
		loadingTime: 30000, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		originalData: false, // 是否在拦截器中返回服务端的原始数据
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// 配置请求头信息
		header: {
			'content-type': 'application/json;charset=UTF-8',
			'Login-Type': 'APP'
		}
	});

	// 请求拦截部分，如配置，每次请求前都会执行
	Vue.prototype.$u.http.interceptor.request = (config) => {
		// 引用token
		// 存放在vuex的token，假设使用了uView封装的vuex方式
		// 见：https://uviewui.com/components/globalVariable.html
		config.header.token = vm.s_token;

		// 最后需要将config进行return，如果return一个false值，则会取消本次请求
		return config;
	}

	// 响应拦截，如配置，每次请求结束都会执行本方法
	Vue.prototype.$u.http.interceptor.response = (res) => {
		const code = res.code
        return res
		if (code === '200') {
			return res.data
		} else if (code === '401') { // 未登录或的登录过期
			if (!isLoginPage()) {
				const currentRoute = getCurrentRoute().route
				const options = getCurrentRoute().options

				let url = '/pages/login/index'
				let redirectUrl = ''

				if (currentRoute) {
					redirectUrl += currentRoute
				}

				if (options) {
					redirectUrl += vm.$u.queryParams(options)
				}

				vm.$u.vuexResetAll()

				vm.$u.vuex('s_redirectUrl', redirectUrl)

				uni.redirectTo({
					url
				})
			}

			return false
		} else if (code === '302') {
			return false;
		}

		uni.showToast({
			title: (res.msg || '请求失败'),
			icon: 'none'
		})

		// 如果返回false，则会调用Promise的reject回调，
		// 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
		return false;
	}
}

function getCurrentRoute() { // 获取当前路由
	const page = getCurrentPages()
	let currPage = null
	let route = ''
	let options = null
	if (page && Array.isArray(page) && page.length > 0) {
		const pageSize = page.length
		currPage = page[pageSize - 1]
		route = currPage.route
		options = currPage.options
	}

	return {
		route,
		options
	}
}

function isLoginPage() { // 当前页面是否已经在登录页
	const route = getCurrentRoute().route;

	if (route === 'pages/login/index') {
		return true;
	}

	return false
}

export default {
	install
}
