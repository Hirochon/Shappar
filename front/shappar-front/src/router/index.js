import Vue from 'vue'
import VueRouter from 'vue-router'
import Public from '../views/Public.vue'
// import Private from '../views/Private.vue'
import New from '../views/New.vue'
import MyPage from '../views/MyPage.vue'
import LoginPage from '../views/LoginPage'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/',
    component: Public,
    // metaっていうの作ってあげることで指定できた、正しいかどうかは調査中
    meta: {
      requiresAuth: true
    }
  },
  // {
  //   path: '/Private',
  //   component: Private
  // },
  {
    path: '/New',
    component: New,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/MyPage',
    component: MyPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    // pathにないやつ来たら強制送還！
    path: '*',
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn']
  const token = localStorage.getItem('access')
  // console.log(to)
  // console.log('to.path=', to.path)
  // console.log('isLoggedIn=', isLoggedIn)

  // ログインが必要な画面に遷移しようとした場合
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // ログインしている状態の場合
    if (isLoggedIn) {
      // console.log('User is already logged in. So, free to next.')
      next()

      // ログインしていない状態の場合
    } else {
      // まだ認証用トークンが残っていればユーザー情報を再取得
      if (token != null) {
        // console.log('User is not logged in. Trying to reload again.')

        store.dispatch('auth/reload')
          .then(() => {
            // 再取得できたらそのまま次へ
            // console.log('Succeeded to reload. So, free to next.')
            next()
          })
          .catch(() => {
            // 再取得できなければログイン画面へ
            forceToLoginPage(to, from, next)
          })
      } else {
        // 認証用トークンが無い場合は、ログイン画面へ
        forceToLoginPage(to, from, next)
      }
    }
  } else {
    // ログインが不要な画面であればそのまま次へ
    // console.log('Go to path page.')
    next()
  }
})

/**
 * ログイン画面へ強制送還
 */
function forceToLoginPage (to, from, next) {
  // console.log('Force user to login page.')
  next({
    path: '/login',
    // 遷移先のURLはクエリ文字列として付加
    query: { next: to.fullPath }
  })
}

export default router
