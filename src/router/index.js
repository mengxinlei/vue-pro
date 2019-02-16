import Vue from 'vue'
import Router from 'vue-router'


import Haha from '@/components/HelloWorld'//未登录主页面
import Home from '@/components/Home'   //登录后主页面
import Login from '@/components/Login' //登录页面
import Welcome from '@/components/Welcome' //登录后主页面显示页面

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/', component: Haha },
    { path: '/home', component: Home, redirect:'/welcome' ,children:[
      {path:'/welcome',component:Welcome}
    ]},
    { path: '/login', component: Login }
  ]
})



// 直至导航守卫,用来验证有没有登录  如果有token,说明登陆
//  实现逻辑:运用router的beforeach方法
router.beforeEach((to, form, next) => {
  //如果是login页面,那么继续往下执行
  if (to.path === '/login') {
    return next()
  }
  //获取token
  var token = window.sessionStorage.getItem('token')
  // 如果不是token,那么直接返回login页面
  if (!token) {
    return next('/login')
  }
  next() //请继续执行
})


// 到处router
export default router