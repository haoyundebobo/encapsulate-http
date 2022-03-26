//mmsg:加载显示内容    
//cancelloading:true 取消该加入loading    
//msg:true  错误不提示			 
//重置loading （单例 全局的 vx） //mloading:true  配合 await $loading.aloading()
//cancelajax 取消加入登录重新请求
import $resetajax from "./resetajax.js" 
import $loading from "./loading.js"
//import Vue from "vue";
let $mConfig={apiPath:'',header:{},ExpiredCode:[],ExpiredFn:true,token:''};

async function HTTP(obj, config) {
	const cancelloading=obj.data.cancelloading;
	cancelloading!==true && await $loading.openloading(obj.data.mloading, obj.data.mmsg)
	return new Promise((resolve, reject) => {
		let options = {
			dataType: "json",
			header:$mConfig.header,
			success: (res) => {
				if ($mConfig.ExpiredCode.indexOf(res.data.code) !== -1) {
					if (obj.data.cancelajax!==true) {
						$resetajax.commit('set_temporaryajax', {
							url: obj.url,
							data: obj.data,
							method:options.method,
							resolve: resolve,
							reject: reject,
							rejectdata: res.data
						})
					} else {
						reject(res.data)
					}
					$loading.additionCallback(function(){
						if($resetajax.state.notGoLogin){
							$resetajax.commit('set_data',{
								notGoLogin:false
							})
							$mConfig.ExpiredFn()
						}
						return false;
					})
				}else if (res.data.code === 200) {
					resolve(res.data.data||res.data.result,res.data);
				} else {
					if (!obj.data.message) {
						$loading.additionCallback(function(){
							$mUtilsMsg({
								title: res.data.message || '请求异常'
							})
						})
					}
					reject(res.data)
				}
			},
			fail:(err) => {
				$loading.additionCallback(function(){
					if(err.errMsg&&err.errMsg.indexOf('abort')=='-1'){
						uni.showToast({
							title: err.errMsg||"网络异常,请稍后尝试",
							icon: "none",
							duration: 1500
						});
						reject({
							msg: "网络异常,请稍后尝试"
						});
					}
				})
			},
			complete: (err) => {
				cancelloading!==true && $loading.closeloading()
			}
		};
		options = {
			...options,
			...obj
		};
		options.url = $mConfig.apiPath + options.url
		options.data = {
			...options.data,
			token: $mConfig.token
		}
		if(options.method==='GET'){
			const URLEncoded= JSON_to_URLEncoded(options.data);
			options.data={}
			if(URLEncoded!==''){
				options.url = options.url+'?'+URLEncoded;
			}
		}
		if(obj.data.request_for_abort!==undefined){
			if(obj.data.request_for_abort!==true){
				obj.data.request_for_abort.abort()
			}
			obj.data.request_for_abort = uni.request(options)
		}else{
			uni.request(options);
		}
	});
}


function JSON_to_URLEncoded(element,key,list){
  var list = list || [];
  if(typeof(element)=='object'){
    for (var idx in element){
			if(['mmsg','cancelloading','msg','request_for_abort','cancelajax'].indexOf(idx)===-1){
				JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
			}
		}
	}
   else {
    list.push(key+'='+encodeURIComponent(element));
  }
  return list.join('&');
}
let msgout,instance=false;
function $mUtilsMsg(obj, callback) {
	if (instance) {
		return false;
	}
	uni.showToast({
		title: obj.title || "",
		icon: obj.icon || "none",
		mask: obj.mask || false,
		duration: obj.duration || 1500
	});
	instance=true
	clearTimeout(msgout)
	msgout=setTimeout(() => {
		clearTimeout(msgout)
		callback ? callback() : "";
		instance=false
	}, 1500);
}
function set_$mConfig(n,e){
	for (let i in n) {
		$mConfig[i]=n[i]
	}
}
export default {
	POST(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "POST"
		}, config);
	},
	GET(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "GET"
		}, config);
	},
	set_$mConfig
};
