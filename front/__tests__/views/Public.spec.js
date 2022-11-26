/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/views/PublicPage.vue'
import Vuex from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('PublicPage.vue', () => {
  let option
  let wrapper

  const refresh = jest.fn()
  const scrollTrigger = jest.fn()

  process.on('UnhandledRejection', console.dir)

  option = {
    methods: {
      refresh,
      scrollTrigger
    },
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
  // loadingの表示
  it('loading を非表示→表示にする', async () => {
    await (wrapper.vm.$data.isLoading = false)
    expect(wrapper.find('.PublicPage__loading').exists()).toBe(false)
    await (wrapper.vm.$data.isLoading = true)
    expect(wrapper.find('.PublicPage__loading').exists()).toBe(true)
  })
})
