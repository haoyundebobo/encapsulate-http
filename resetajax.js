import $http from "./http.js";
export default {
	commit: function(fnName, option) {
		this.mutations[fnName](this.state, option)
	},
	state: {
		temporaryajax: [],
		notGoLogin: true
	},
	mutations: {
		set_data(state, obj) {
			for (let index in obj) {
				state[index] = obj[index];
			}
		},
		remove_data(state, ary) {
			for (let item of ary) {
				delete state[item];
			}
		},
		/* 登录后执行需要登录接口 */
		set_temporaryajax(state, info) {
			state.temporaryajax.push(info)
		},
		remove_temporaryajax(state) {
			for (let index in state.temporaryajax) {
				state.temporaryajax[index].reject(state.temporaryajax[index].rejectdata)
				state.temporaryajax[index] = null;
				if (/^,+$/.test(state.temporaryajax.join(',')) || state.temporaryajax.length == 1) {
					state.temporaryajax.splice(0, state.temporaryajax.length)
				}
			}
			state.notGoLogin = true
		},
		async implement_temporaryajax(state) {
			for (let index in state.temporaryajax) {
				$http[state.temporaryajax[index].method](state.temporaryajax[index].url, state.temporaryajax[index]
					.data).then((res) => {
					state.temporaryajax[index].resolve(res);
				}).catch((res) => {
					state.temporaryajax[index].reject(res)
				}).finally(() => {
					state.temporaryajax[index].resolve = null;
					state.temporaryajax[index].reject = null;
					state.temporaryajax[index] = null;
					if (/^,+$/.test(state.temporaryajax.join(',')) || state.temporaryajax.length == 1) {
						state.temporaryajax.splice(0, state.temporaryajax.length)
					}
				})
				if (state.temporaryajax[index].data.mloading) {
					await $loading.aloading()
				}
			}
			state.notGoLogin = true
		},
		/* 登录后执行需要登录接口 */
	}
}
