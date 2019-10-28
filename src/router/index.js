import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/Users.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Roles.vue'

Vue.use(VueRouter)

// 解决重复点击同一导航报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights }
    ]
  },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

// 配置导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  const token = localStorage.getItem('token')
  console.log(token)
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
