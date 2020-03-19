import Vue from 'vue';
import axios from 'axios';

//$ajax
axios.defaults.withCredentials = true;//让ajax携带cookie
Vue.prototype.$axios = axios;

//loading
let loading = {
  customClass: 'globalLoading',
  lock: true,
  text: '拼命加载中',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0)'
}

//http请求拦截器
Vue.prototype.$axios.interceptors.request.use(config => {

  //请求之前loading
  Vue.prototype.$loading(loading);

    //登录页面接口不需要token
    if(window.location.href.indexOf('login') == -1){
        config.headers = {
          Authorization: localStorage.getItem('token'),
          withCredentials: true
        }
    }
/*  config.headers = {
    "Content-Type":'multipart/form-data'
  }*/


    return config;
})

//http响应拦截器
Vue.prototype.$axios.interceptors.response.use(res => {
  //console.log(res)

  //更新token
  if (res.headers.authorization) localStorage.setItem('token', res.headers.authorization);

  //关闭loading
  Vue.prototype.$loading(loading).close()

  return res;
},error => {
    let res = error.response

    //console.log(res);
    Vue.prototype.$message.error({
      type:'error',
      message: '连接超时',
      onClose:() => {
        Vue.prototype.$loading(loading).close()
      }
    })

  //401:登录过期  403:未认证
  if(res.status == '401' || res.data.code == '403'){
    Vue.prototype.$message({
      type:'error',
      message: "登录过期，请重新登录",
      onClose:() => {
        window.location.href = `${window.location.origin}/#/login`
      }
    })
  }
    return Promise.reject(res);
})
