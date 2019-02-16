import Vue from 'vue'
import App from './App'
import router from './router'


// 引入css文件
import './assets/css/global.css'

// 引入axios并配置
import axios from 'axios'
// 配置axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

// 配置请求拦截器,因为请求中必须要携带token令牌,才能获取到数据
axios.interceptors.request.use(
  function (config) {
    // 获取token
    var token = window.sessionStorage.getItem('token')
    // 将token挂载到axios请求头中
    config.headers.Authorization = token
    return config
  },
  function (error) {
    return Promise.reject(error);
  })


// 给Vue配置axios对象
Vue.prototype.$http = axios


// 引入图标字体
import './assets/font/iconfont.css'

// 引入elemrnt-ui组件库
import ElmentUI from 'element-ui'
Vue.use(ElmentUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
