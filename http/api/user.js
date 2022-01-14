const install = (vm) => {
	return {
		getList(params = {}) { // 登录
			return vm.$u.get('/api/index.php?appid=wx92bf5c6c1d1cb19e', params)
		},
	}
}

export default {
	install
}
