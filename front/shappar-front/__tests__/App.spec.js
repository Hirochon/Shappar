/* eslint-disable no-undef */
// import { mount } from '@vue/test-utils'
// createLocalVue と shallowMount でないとだめみたい、ちゃんと確かめていないのでテストを書いていきながら学ぶ
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/App.vue'
import Router from '../src/router'

const localVue = createLocalVue()
localVue.use(Router)
// RouterViewがどうやってもundefinedになるので一旦諦める、学習進めてからにする
// const RouterView = localVue.component('router-link')
// console.log(localVue)
// console.log(RouterView)
describe('Testing App component', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(Component, { localVue })
    expect(wrapper.isVueInstance).toBeTruthy()
  })
  it('can use router-view', () => {
    const wrapper = shallowMount(Component, { localVue })
    expect(wrapper.findAll('router-view-stub')).toHaveLength(1)
  })
})
