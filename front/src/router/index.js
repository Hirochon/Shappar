import Vue from 'vue'
import VueRouter from 'vue-router'
import Public from '@/views/Public.vue'
// import Private from '@/views/Private.vue'
// import NewPage from '@/views/NewPage.vue'
import MyPage from '@/views/MyPage.vue'
import LoginPage from '@/views/LoginPage'
import UpdateUser from '@/views/UpdateUser'
import AdminPage from '@/views/AdminPage'
import HomePage from '@/views/HomePage'
import store from '@/store'

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
  {
    path: '/Home',
    component: HomePage
  },
  // {
  //   path: '/Private',
  //   component: Private
  // },
  // {
  //   path: '/NewPage',
  //   component: NewPage,
  //   meta: {
  //     requiresAuth: true
  //   }
  // },
  {
    path: '/MyPage/:user_id',
    component: MyPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    component: UpdateUser,
    meta: {
      requiresAuth: true
    }
  },
  {
    // pathにないやつ来たら強制送還！
    path: '*',
    redirect: '/',
    meta: {
      requiresAuth: true
    }
  }
]

if (process.env.NODE_ENV === 'development') {
  routes.unshift({
    name: 'admin',
    path: '/admin',
    component: AdminPage,
    meta: {
      requiresAuth: true
    }
  })
}

const router = new VueRouter({
  mode: 'history',
  base: './',
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn']
  const token = localStorage.getItem('access')
  // console.log(to)
  // console.log('to.path=', to.path)
  // console.log('isLoggedIn=', isLoggedIn)
  // console.log('token=' + token)

  // ログインが必要な画面に遷移しようとした場合
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // console.log('inrequireAuth')
    // ログインしている状態の場合
    if (isLoggedIn && token != null) {
      // console.log('User is already logged in. So, free to next.')
      next()

      // ログインしていない状態の場合
    } else {
      // まだ認証用トークンが残っていればユーザー情報を再取得
      if (token != null) {
        // console.log('User is not logged in. Trying to reload again.')

        store.dispatch('auth/reload')
          .then(() => {
            // 再取得できたら詳細なユーザー情報を取得（TODO ここに関してはまとめれるならまとめてもらいたい）
            // console.log('Succeeded to reload. So, free to next.')
            store.dispatch('user/load', { user_id: store.getters['auth/username'] })
              .then(() => {
                next()
              })
          })
          .catch(() => {
            // 再取得できなければログイン画面へ
            // console.log('forceToLogin')
            forceToLoginPage(to, from, next)
          })
      } else {
        // 認証用トークンが無い場合は、ログイン画面へ
        store.dispatch('message/setErrorMessage', { message: '認証エラー' })
        forceToLoginPage(to, from, next)
      }
    }
  } else {
    // ログインが不要な画面であればそのまま次へ
    // console.log('Go to path page.')
    if (token != null) forceToRootPage(to, from, next)
    else next()
  }
})

/**
 * ログイン画面へ強制送還
 */
function forceToLoginPage (to, from, next) {
  // console.log('Force user to login page.')
  next({
    path: '/home',
    // 遷移先のURLはクエリ文字列として付加
    query: { next: to.fullPath }
  })
}

function forceToRootPage (to, from, next) {
  next({
    path: '/'
  })
}

export default router
