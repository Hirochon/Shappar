/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/views/PostDetails.vue'
import Vuex from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('PostDetails.vue', () => {
  let option
  let wrapper

  const getPostData = jest.fn()

  process.on('UnhandledRejection', console.dir)

  option = {
    propsData: {
      post_id: 'test_post_id'
    },
    methods: {
      getPostData
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
  it('PostDetails__button.material-01 clickでisActive変更', () => {
    wrapper.vm.$data.isActive = 1
    wrapper.find('.PostDetails__button.material-01').trigger('click')
    expect(wrapper.vm.$data.isActive).toBe(0)
  })
  it('PostDetails__button.material-02 clickでisActive変更', () => {
    wrapper.find('.PostDetails__button.material-02').trigger('click')
    expect(wrapper.vm.$data.isActive).toBe(1)
  })
  it('PostDetails__button.material-03 clickでisActive変更', () => {
    wrapper.find('.PostDetails__button.material-03').trigger('click')
    expect(wrapper.vm.$data.isActive).toBe(2)
  })
  it('PostDetails__button.material-04 clickでisActive変更', () => {
    wrapper.find('.PostDetails__button.material-04').trigger('click')
    expect(wrapper.vm.$data.isActive).toBe(3)
  })
  it('PostDetails__button.material-05 clickでemitできているか', () => {
    wrapper.find('.PostDetails__button.material-05').trigger('click')
    expect(wrapper.emitted('switchDetails')).toBeTruthy()
  })
  it('PostDetails__overlay clickでemitできているか', () => {
    wrapper.find('.PostDetails__overlay').trigger('click')
    expect(wrapper.emitted('switchDetails')).toBeTruthy()
  })
})
