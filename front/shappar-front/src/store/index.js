import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/services/api'

Vue.use(Vuex)

// 認証情報
const authModule = {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    unique_id: '',
    username: '',
    isLoggedIn: false
  },
  getters: {
    unique_id: state => state.unique_id,
    username: state => state.username,
    isLoggedIn: state => state.isLoggedIn
  },
  mutations: {
    set (state, payload) {
      state.unique_id = payload.user.id
      state.username = payload.user.username
      state.isLoggedIn = true
    },
    clear (state) {
      state.unique_id = ''
      state.username = ''
      state.isLoggedIn = false
    }
  },
  actions: {
    /**
     * ログイン
     */
    login (context, payload) {
      // alert('auth/login')
      return api.post('/api/v1/auth/jwt/create/', {
        'username': payload.username,
        'password': payload.password
      })
        .then(response => {
          // 認証用トークンをlocalStorageに保存
          localStorage.setItem('access', response.data.access)
          // ユーザー情報を取得してstoreのユーザー情報を更新
          return context.dispatch('reload')
            .then(user => user)
        })
    },
    /**
     * ログアウト
     */
    logout (context) {
      // 認証用トークンをlocalStorageから削除
      localStorage.removeItem('access')
      // storeのユーザー情報をクリア
      context.commit('clear')
    },
    /**
     * ユーザー情報更新
     */
    reload (context) {
      return api.get('/api/v1/auth/users/me/')
        .then(response => {
          // console.log(response)
          // alert('auth/reload')
          const user = response.data
          // storeのユーザー情報を更新
          context.commit('set', { user: user })
          return user
        })
    }
  }
}

// グローバルメッセージ
const messageModule = {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    error: '',
    warnings: [],
    info: ''
  },
  getters: {
    error: state => state.error,
    warnings: state => state.warnings,
    info: state => state.info
  },
  mutations: {
    set (state, payload) {
      if (payload.error) {
        state.error = payload.error
      }
      if (payload.warnings) {
        state.warnings = payload.warnings
      }
      if (payload.info) {
        state.info = payload.info
      }
    },
    clear (state) {
      // console.log('in clear')
      state.error = ''
      state.warnings = []
      state.info = ''
    }
  },
  actions: {
    /**
     * エラーメッセージ表示
     */
    setErrorMessage (context, payload) {
      // context.commit('clear')
      context.commit('set', { 'error': payload.message })
      setTimeout(() => {
        context.dispatch('clearMessages')
        // console.log('in setErrorMessage')
      }, 1500)
    },
    /**
     * 警告メッセージ（複数）表示
     */
    setWarningMessages (context, payload) {
      // context.commit('clear')
      context.commit('set', { 'warnings': payload.messages })
      setTimeout(() => {
        context.dispatch('clearMessages')
        // console.log('in setWarningMessages')
      }, 1500)
    },
    /**
     * インフォメーションメッセージ表示
     */
    setInfoMessage (context, payload) {
      // context.commit('clear')
      context.commit('set', { 'info': payload.message })
      setTimeout(() => {
        context.dispatch('clearMessages')
        // console.log('in setInfoMessage')
      }, 1500)
    },
    /**
     * 全メッセージ削除
     */
    clearMessages (context) {
      // console.log('in clearMessages')
      context.commit('clear')
    }
  }
}

const userModule = {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    user_id: '',
    name: '',
    introduction: '',
    iconimage: '',
    homeimage: ''
  },
  getters: {
    user_id: state => state.user_id,
    name: state => state.name,
    introduction: state => state.introduction,
    iconimage: state => state.iconimage,
    homeimage: state => state.homeimage
  },
  mutations: {
    set (state, payload) {
      state.user_id = payload.user.user_id
      state.name = payload.user.name
      state.introduction = payload.user.introduction
      state.iconimage = payload.user.iconimage
      state.homeimage = payload.user.homeimage
    },
    clear (state) {
      state.user_id = ''
      state.name = ''
      state.introduction = ''
      state.iconimage = ''
      state.homeimage = ''
    }
  },
  actions: {
    load (context, payload) {
      return api.get('/api/v1/users/' + payload.user_id + '/')
        .then(response => {
          // console.log(response.data)
          // alert('user/load')
          const user = response.data
          // storeのユーザー情報を更新
          context.commit('set', { user: user })
          return user
        })
    }
  }
}

const store = new Vuex.Store({
  modules: {
    auth: authModule,
    message: messageModule,
    user: userModule
  }
})

export default store
