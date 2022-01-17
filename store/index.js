import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let lifeData = {}

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData') || {}
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['s_token', 's_userInfo']

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}

// 获取状态栏高度
function getStatusBarHeight() {
	let statusBarHeight = 0
	try {
		const res = uni.getSystemInfoSync();
		statusBarHeight = res.statusBarHeight
	} catch (e) {
		// error
	}

	return statusBarHeight
}

const initState = () => { // 初始化state数据
	return {
		s_statusBarHeight: getStatusBarHeight(), // 状态栏高度
		s_register: null, // 注册数据
		s_addEquip: null, // 新增仪器数据
		s_bus: {}, // 新增仪器数据
		s_token: lifeData.s_token || '',
		s_redirectUrl: '', // 重定向地址
		// s_baseApi: '/api', // api域名（H5环境）
		s_baseApi: 'https://video.c4eee.cn',// api域名（app生产环境）
		s_userInfo: lifeData.s_userInfo || null,
		s_isPageUpdate: false, // 页面onShow时刷新
		s_switchType: 1, // 区分首页和个人中心跳转预警记录
	}
}

const store = new Vuex.Store({
	state: initState,
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
		$uResetAll(state) { // 重置所有数据
			lifeData = {}
			uni.removeStorageSync('lifeData');

			({
				s_register: state.s_register,
				s_addEquip: state.s_addEquip,
				s_bus: state.s_bus,
				s_token: state.s_token,
				s_redirectUrl: state.s_redirectUrl,
				s_baseApi: state.s_baseApi,
				s_userInfo: state.s_userInfo,
				s_isPageUpdate: state.s_isPageUpdate,
			} = initState())
		}
	}
})

export default store
