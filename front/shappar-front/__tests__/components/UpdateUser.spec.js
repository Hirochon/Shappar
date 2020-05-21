/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/views/UpdateUser.vue'
import Vuex from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('UpdateUser.vue', () => {
  let store
  let option
  let auth
  let user
  let wrapper
  let userId = 'sample1'
  let userData = {
    name: 'sample1',
    introduction: 'sample1 introduction',
    homeimage: 'homeimage',
    iconimage: 'iconimage'
  }

  const loadMock = jest.fn()
  loadMock.mockResolvedValue(userData)

  process.on('UnhandledRejection', console.dir)

  auth = {
    namespaced: true,
    getters: {
      username: () => userId
    }
  }

  user = {
    namespaced: true,
    actions: {
      load: loadMock
    }
  }
  store = new Vuex.Store({
    modules: {
      auth,
      user
    }
  })
  option = {
    store,
    localVue
  }
  beforeEach(() => {
    wrapper = shallowMount(Component, option)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy()
  })
  it('homeimage の表示?', () => {
    expect(wrapper.find('.Update__image__img').attributes().src).toBe(userData.homeimage)
  })
  it('iconimage の表示?', () => {
    expect(wrapper.find('.Update__icon__img').attributes().src).toBe(userData.iconimage)
  })
  it('name の表示', () => {
    expect(wrapper.find('#user_name').element.value).toBe(userData.name)
  })
  it('name のエラー', async () => {
    let text = 'a'.repeat(19)
    let input = wrapper.find('#user_name')
    let name = wrapper.vm.$data.name
    expect(name.isValid).toBe(true)
    input.element.value = text
    await (input.trigger('input'))
    expect(name.isValid).toBe(false)
    expect(wrapper.find('.Update__num.hasError').exists()).toBe(true)
    expect(wrapper.find('.Update__submit.hasError').exists()).toBe(true)
  })
  // it('user_id の表示', () => {
  //   expect(wrapper.find('#user_id').element.value).toBe(userId)
  // })
  // it('user_id のエラー', async () => {
  //   let text = 'a'.repeat(19)
  //   let input = wrapper.find('#user_id')
  //   let userid = wrapper.vm.$data.user_id
  //   expect(userid.isValid).toBe(true)
  //   input.element.value = text
  //   await (input.trigger('input'))
  //   expect(userid.isValid).toBe(false)
  //   expect(wrapper.find('.Update__num.hasError').exists()).toBe(true)
  //   expect(wrapper.find('.Update__submit.hasError').exists()).toBe(true)
  // })
  it('introduction の表示', () => {
    expect(wrapper.find('.Update__introduction').element.value).toBe(userData.introduction)
  })
  it('introduction のエラー', async () => {
    let text = 'a'.repeat(151)
    let textarea = wrapper.find('.Update__introduction')
    let introduction = wrapper.vm.$data.introduction
    expect(introduction.isValid).toBe(true)
    textarea.element.value = text
    await (textarea.trigger('input'))
    expect(introduction.isValid).toBe(false)
    expect(wrapper.find('.Update__num.hasError').exists()).toBe(true)
    expect(wrapper.find('.Update__submit.hasError').exists()).toBe(true)
  })
})
