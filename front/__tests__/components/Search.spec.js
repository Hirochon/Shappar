/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/components/Search.vue'
import Vuex from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('Search.vue', () => {
  let store
  let option
  let user
  let wrapper

  beforeEach(() => {
    user = {
      namespaced: true,
      getters: {
        getUser: () => {
          return {
            user_id: 'user_id',
            name: 'name',
            introduction: 'introduction',
            iconimage: 'iconimage',
            homeimage: 'homeimage',
            isRanking: false
          }
        }
      }
    }
    store = new Vuex.Store({
      modules: {
        user
      }
    })
    option = {
      store,
      localVue,
      propsData: {
        query: ''
      }
    }
    wrapper = shallowMount(Component, option)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy()
  })
  it('iconimage の表示?', () => {
    let getUser = user.getters.getUser()
    expect(wrapper.find('.Search__drawer-switch__img').attributes().src).toBe(getUser.iconimage)
  })
  // it('form 入力でchildQueryが反映されているか', () => {
  //   wrapper.find('.Search__input').setValue('shappar')
  //   expect(wrapper).toBe('shappar')
  // })
  it('switch clickでemitできているか', () => {
    wrapper.find('.Search__drawer-switch.disp').trigger('click')
    expect(wrapper.emitted('drawerOpen')).toBeTruthy()
  })
  it('form submitでemitできているか', () => {
    wrapper.find('.Search__form').trigger('submit')
    expect(wrapper.emitted('search')).toBeTruthy()
  })
  it('submit clickでemitできているか', () => {
    wrapper.find('.Search__submit').trigger('click')
    expect(wrapper.emitted('search')).toBeTruthy()
  })
  it('button clickでemitできているか', () => {
    wrapper.find('.Search__button').trigger('click')
    expect(wrapper.emitted('changeRanking')).toBeTruthy()
  })
})
