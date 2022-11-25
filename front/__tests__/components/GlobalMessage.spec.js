/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/components/GlobalMessage.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
describe('GlobalMessage.vue', () => {
  let message
  let store
  let option
  let wrapper

  beforeEach(() => {
    message = {
      namespaced: true,
      state: {
        error: 'error message',
        warnings: ['warning message 1', 'warning message 2'],
        info: 'info message'
      }
    }
    store = new Vuex.Store({
      modules: {
        message
      }
    })
    option = {
      store,
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
  it('error の表示?', () => {
    expect(wrapper.find('.Message__error').text()).toBe(message.state.error)
  })
  it('warnings の表示?', () => {
    expect(wrapper.find('.Message__warnings').exists()).toBe(true)
  })
  it('warning の表示?', () => {
    expect(wrapper.findAll('.Message__warning').length).toBe(2)
  })
  it('info の表示?', () => {
    expect(wrapper.find('.Message__info').text()).toBe(message.state.info)
  })
  it('error を非表示にする?', async () => {
    expect(wrapper.find('.Message__error').text()).toBe(message.state.error)
    await (message.state.error = '')
    expect(wrapper.find('.Message__error').text()).toBe('')
  })
  it('warning を非表示にする?', async () => {
    expect(wrapper.findAll('.Message__warning').length).toBe(2)
    await (message.state.warnings = [])
    expect(wrapper.findAll('.Message__warning').length).toBe(0)
  })
  it('info を非表示にする?', async () => {
    expect(wrapper.find('.Message__info').text()).toBe(message.state.info)
    await (message.state.info = '')
    expect(wrapper.find('.Message__info').text()).toBe('')
  })
})
