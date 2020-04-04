/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/components/DrawerMenu.vue'
import Vuex from 'vuex'
import Router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Router)
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('DrawerMenu.vue', () => {
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
            isRanking: 'isRankin'
          }
        },
        name: () => 'name'
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
        isOpen: false
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
  it('name の表示', () => {
    let getUser = user.getters.getUser()
    expect(wrapper.find('.Drawer__name').text()).toBe(getUser.name)
  })
  it('user_id の表示', () => {
    let getUser = user.getters.getUser()
    expect(wrapper.find('.Drawer__user_id').text()).toBe('@' + getUser.user_id)
  })
  it('iconimage の表示?', () => {
    let getUser = user.getters.getUser()
    expect(wrapper.find('.Drawer__icon__img').attributes().src).toBe(getUser.iconimage)
  })
  it('overlay 初期段階で非描画', () => {
    expect(wrapper.vm.isOpen).toBe(false)
    expect(wrapper.find('.Drawer__overlay').exists()).toBe(false)
  })
  it('overlay isOpen:true で描画', async () => {
    expect(wrapper.vm.isOpen).toBe(false)
    await wrapper.setProps({ isOpen: true })
    expect(wrapper.vm.isOpen).toBe(true)
    expect(wrapper.find('.Drawer__overlay').exists()).toBe(true)
  })
  it('overlay clickでemitできているか', () => {
    wrapper = shallowMount(Component, {
      store,
      localVue,
      propsData: {
        isOpen: true
      }
    })
    wrapper.find('.Drawer__overlay').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
  it('Drawer__close clickでemitできているか', () => {
    wrapper = shallowMount(Component, {
      store,
      localVue,
      propsData: {
        isOpen: true
      }
    })
    wrapper.find('.Drawer__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
