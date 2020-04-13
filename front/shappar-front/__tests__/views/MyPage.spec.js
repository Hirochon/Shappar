/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/views/MyPage.vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/**
 * mockが走ってないっぽい dockerの方にリクエストのログ出てるから...
 * => 結局 initComponent をモックしてそもそもapiでリクエストをなくした
 */

// import api from '../../__mocks__/api'
// jest.mock('api')

// jest.mock('api', () => ({
//   get: (url, body) => {
//     return new Promise(resolve => {
//       if (mockError) throw Error('Mock error')
//       resolve({ url, body })
//     })
//   }
// }))

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Router)
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('MyPage.vue', () => {
  let store
  let option
  let user
  let wrapper
  let userId = 'sample1'
  // let router = new Router({ name: 'MyPage', params: { user_id: userId } })
  // let $route

  const initComponent = jest.fn()

  process.on('UnhandledRejection', console.dir)

  user = {
    namespaced: true,
    getters: {
      user_id: () => userId
    }
  }
  store = new Vuex.Store({
    modules: {
      user
    }
  })
  // $route = {
  //   params: {
  //     user_id: userId
  //   },
  //   path: '/MyPage/sample1'
  // }
  option = {
    store,
    // router,
    methods: {
      initComponent
    },
    localVue
    // mocks: {
    //   $route: $route
    // },
    // stubs: ['router-link']
  }
  beforeEach(() => {
    wrapper = shallowMount(Component, option)
    wrapper.setData({
      user: {
        user_id: 'sample1',
        name: 'sample1',
        introduction: 'test introduction',
        iconimage: 'https://d3ms402csqm2a0.cloudfront.net/media/images/customuser/iconimage/icon.png',
        homeimage: 'https://d3ms402csqm2a0.cloudfront.net/media/images/customuser/homeimage/home.jpg'
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy()
  })
  it('homeimage の表示?', () => {
    expect(wrapper.find('.Mypage__image__img').attributes().src).toBe(wrapper.vm.$data.user.homeimage)
  })
  it('iconimage の表示?', () => {
    expect(wrapper.find('.Mypage__icon__img').attributes().src).toBe(wrapper.vm.$data.user.iconimage)
  })
  it('name の表示', () => {
    expect(wrapper.find('.Mypage__name').text()).toBe(wrapper.vm.$data.user.name)
  })
  it('user_id の表示', () => {
    expect(wrapper.find('.Mypage__user_id').text()).toBe('@' + wrapper.vm.$data.user.user_id)
  })
  it('introduction の表示', () => {
    expect(wrapper.find('.Mypage__introduction').text()).toBe(wrapper.vm.$data.user.introduction)
  })
})
