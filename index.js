import $http from "./http.js";
import $resetAjax from "./resetajax.js";
export default {
	install:function(event,option,e){
		event.config.globalProperties.$resetAjax=$resetAjax
		//event.config.globalProperties.$set_$mConfig=$http.set_$mConfig
		$http.set_$mConfig('apiPath',option.apiPath)
		$http.set_$mConfig('header',option.header||{})
		$http.set_$mConfig('ExpiredCode',option.ExpiredCode||[])
		$http.set_$mConfig('ExpiredFn',option.ExpiredFn)
		$http.set_$mConfig('token',option.token)
	}
}