```
app.use($httpProxy,{
  apiPath:'http://39.105.127.96:8085/' ,//接口请求域名,
  ExpiredCode:[500,700,2001],//token过期 自动请求,
  header:{token:store.state.token},
  token:store.state.token,
  ExpiredFn:function(){
	//调用接口 token过期时候执行 
	//假如 同时调用1234，其中124需要登录才能调用
	//该方法ExpiredFn 会在1234 全部请求完成后执行
	//配合下边 implement_temporaryajax 或者 remove_temporaryajax
	//登录成功后 会自动请求124 假如不想让2 自动请求 看下边 请求参数配置
	console.log('应该重新登录了')
	store.dispatch('TimeoutLogin')
  }
})

/* 登录页面 */
onUnload() {
	if(this.implement_temporaryajax==true){
		this.implement_temporaryajax=null
	}else{
		this.$resetAjax.commit('remove_temporaryajax')
	}　
}
登录成功跳转前 因为要设置 token 和 清空节流判断flag
this.$set_$mConfig({
	token:res.token,
	header:{token:res.token}
})
this.$mUtils.whereBack(()=>{
	this.implement_temporaryajax=true
	this.$resetAjax.commit('implement_temporaryajax')
})

ps：uniapp 弹窗是针对整个项目 ，假如a界面弹窗 ，没有关闭来到b。
	b 是没有弹窗 假如b返回，a弹窗继续，假如 b 调用弹窗api b 弹窗，a弹窗就会关闭消失
```