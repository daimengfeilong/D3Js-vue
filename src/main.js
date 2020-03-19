import Vue from 'vue';
import VueRouter from 'vue-router';
//import vueStore from './vuex/store.js';
import routes from './routes.js';
//import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
//import ElementUI from 'element-ui';
import * as d3 from 'd3';
import './assets/js/interceptors';
// 导入ajax请求控件
import axios from 'axios'
//require("./assets/js/global")
//import {filterRouter} from './assets/js/utils'

//Vue.use(ElementUI);
Vue.use(VueRouter);


Vue.prototype.$http = axios
Vue.prototype.$d3 = d3
window.d3 = d3

//事件通信
window.Bus = new Vue()

const router = new VueRouter({
  routes
})

//利用路由的钩子修改网站标题  在这里定义的是全局
router.beforeEach(function(to, from, next){
//  if(to.path!="/login")
//  {
////  vueStore.commit('setNavList',{data:{url:to.path,label:to.meta.title,currentActive:true}})
//    vueStore.commit('setNavList',{data:{url:to.path,data:to.query,label:to.meta.title,currentActive:true}})
//  }
  if(to.meta.title)
  {document.title = to.meta.title}
  next()  //确保要调用next
})


const app = new Vue({
    router: router,
    render: h => h(App)
}).$mount("#app")
