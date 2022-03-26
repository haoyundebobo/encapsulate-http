import $http from "./http.js";
import $resetAjax from "./resetajax.js";
export default {
	install:function(event,option,e){
		event.config.globalProperties.$resetAjax=$resetAjax
		event.config.globalProperties.$set_$mConfig=$http.set_$mConfig
		$http.set_$mConfig({
			'apiPath':option.apiPath,
			'header':option.header||{},
			'ExpiredCode':option.ExpiredCode||[],
			'ExpiredFn':option.ExpiredFn,
			'token':option.token,
		})
	}
}