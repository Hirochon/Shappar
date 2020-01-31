import Vue from 'vue'
import VueRouter from 'vue-router'
import Public from '../views/Public.vue'
import Private from '../views/Private.vue'
import New from '../views/New.vue'
import MyPage from '../views/MyPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/public',
    component: Public
  },
  {
    path: '/Private',
    component: Private
  },
  {
    path: '/New',
    component: New
  },
  {
    path: '/MyPage',
    component: MyPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
