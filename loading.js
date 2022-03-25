var mloadomgflag=null;
var rloadomgflag=null;
let LoadingCallback=[];
let $store = {
	commit:function(fnName,option){
		this.mutations[fnName](this.state,option)
	},
	state: {
		/* lodging */
		loadinginstance: null,
		loadinginstancepre: null,
		loadinginstancerev: null,
		loadinginstanceout: null,
		/* lodging */
	},
	mutations: {
		/* lodging */
		set_loadinginstance(state, info) {
			state.loadinginstance = info;
		},
		set_loadinginstancepre(state, info) {
			state.loadinginstancepre = info;
		},
		set_loadinginstancerev(state, info) {
			state.loadinginstancerev = info;
		},
		set_loadinginstanceout(state, info) {
			state.loadinginstanceout = info;
		},
		/* lodging */
	}
}
//			import $loading from "@/api/loading.js"		await $loading.aloading()
function closeloading(mloadomg){
	if(mloadomg){
		if($store.state.loadinginstancepre&&($store.state.loadinginstanceout||$store.state.loadinginstanceout=='0')){
			mloadomgflag=new Promise((rev)=>{
				rloadomgflag=rev
			})
			$store.state.loadinginstancepre.re(mloadomg)
		}else{
			mloadomgflag=Promise.resolve()
		}
	}else{
		$store.state.loadinginstanceout&&$store.commit('set_loadinginstanceout',Number($store.state.loadinginstanceout)-1)
		if($store.state.loadinginstanceout==0){
			$store.state.loadinginstancepre.re()
		}
	}
}
async function openloading(mloadomg,mmsg){
	if(mloadomg){
		closeloading(mloadomg)
		await mloadomgflag.then(()=>{
			mloadomgflag=null;
			rloadomgflag=null;
			mloading(mmsg)
		})
	}else{
		mloading(mmsg)
	}
}
async function aloading(){
	mloadomgflag&&await mloadomgflag
}

function mloading(mmsg){
	if(!$store.state.loadinginstancerev){
		$store.commit('set_loadinginstance',new Promise((re)=>{
			uni.showLoading({
				title:mmsg||''
			})
			$store.commit('set_loadinginstancerev',true)
			$store.commit('set_loadinginstancepre',{
				re:function(e){
					re(e)
				}
			})
			$store.commit('set_loadinginstanceout',1)
		}).then((re)=>{
			uni.hideLoading()
			$store.commit('set_loadinginstance',null)
			$store.commit('set_loadinginstancepre',null)
			$store.commit('set_loadinginstanceout',null)
			$store.commit('set_loadinginstancerev',null)
			if(re){
				rloadomgflag()
			}
			for (let item of LoadingCallback) {
				if(item()===false){
					break
				}
			}
			LoadingCallback.splice(0,)
		}))
	}else{
		$store.commit('set_loadinginstanceout',Number($store.state.loadinginstanceout)+1)
	}
}
function additionCallback(e){
	LoadingCallback.push(e)
}
export default {
	closeloading,
	openloading,
	aloading,
	additionCallback
}