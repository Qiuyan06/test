const install = (vm) => {
	return {
		getHomeList(params = {}) { // 登录
			return vm.$u.get('/api/index.php', params)
		},
		getRecommendList(params = {}) { // 登录
			return vm.$u.get('/api/list.php', params)
		},
	}
}

export default {
	install
}
