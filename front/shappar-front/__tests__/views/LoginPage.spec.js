/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/views/LoginPage.vue'
import Vuex from 'vuex'
import Router from '@/router'
import VueRouter from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
jest.mock('api')

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Router)
localVue.use(VueRouter)
const router = new VueRouter()
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('LoginPage.vue', () => {
  let store
  let option
  let auth
  let message
  let user
  let wrapper
  let input = { username: 'usernmae', password: 'password' }
  let count

  process.on('unhandledRejection', console.dir)

  beforeEach(() => {
    count = 0
    auth = {
      namespaced: true,
      getters: {
        username: () => 'username',
        isLoggedIn: () => true
      },
      actions: {
        // login: () => new Promise((resolve, reject) => {
        //   resolve({ data: 'resoleve' })
        // })
        login: () => count++
      }
    }
    message = {
      namespaced: true,
      actions: {
        setInfoMessage: () => count++
      }
    }
    user = {
      namespaced: true,
      actions: {
        load: () => count++
      }
    }
    store = new Vuex.Store({
      modules: {
        auth,
        message,
        user
      }
    })
    option = {
      store,
      router,
      localVue
    }
    wrapper = shallowMount(Component, option)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy()
  })

  it('ログインボタン押下時のフロー', (done) => {
    wrapper.find('#username').setValue(input.username)
    wrapper.find('#password').setValue(input.password)
    wrapper.find('.Login__form').trigger('submit')
    setTimeout(() => {
      expect(count).toBe(3)
      done()
    }, 100)
  })
  it('テストユーザーボタン押下時のフロー', (done) => {
    wrapper.find('.Login__test').trigger('click')
    setTimeout(() => {
      expect(count).toBe(3)
      done()
    }, 100)
  })
})
