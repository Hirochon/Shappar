/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/views/NewPage.vue'
import Vuex from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('NewPage.vue', () => {
  let option
  let wrapper

  beforeEach(() => {
    option = {
      localVue,
      propsData: {
        isOpen: true
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
  it('NewPage__container isOpen => falseで非表示', () => {
    option = {
      localVue,
      propsData: {
        isOpen: false
      }
    }
    wrapper = shallowMount(Component, option)
    expect(wrapper.find('.NewPage__container').exists()).toBe(false)
  })
  it('NewPage__container isOpen => trueで表示', () => {
    expect(wrapper.find('.NewPage__container').exists()).toBe(true)
  })
  it('NewPage__FAB clickでemitできているか', () => {
    wrapper.find('.NewPage__FAB').trigger('click')
    expect(wrapper.emitted('switchNew'))
  })
  it('Top__close clickでemitできているか', () => {
    wrapper.find('.Top__close').trigger('click')
    expect(wrapper.emitted('switchNew'))
  })
  it('question の表示', async () => {
    let question = 'test question'
    let textarea = wrapper.find('.Top__question > textarea').element
    // console.log(wrapper.vm.$data)
    // console.log(textarea.value)
    expect(textarea.value).toBe('')
    await (wrapper.vm.$data.question.text = question)
    expect(wrapper.find('.Top__question').exists()).toBe(true)
    expect(textarea.value).toBe(question)
  })
  it('question のエラー', async () => {
    let text = 'a'.repeat(151)
    let textarea = wrapper.find('.Top__question > textarea')
    let question = wrapper.vm.$data.question
    expect(question.isValid).toBe(true)
    textarea.element.value = text
    await (textarea.trigger('input'))
    expect(question.isValid).toBe(false)
    expect(wrapper.find('.Top__data__question.hasError').exists()).toBe(true)
  })
  it('option の数', () => {
    expect(wrapper.findAll('.NewPage__option__container').length).toBe(2)
  })
  it('option の数(右上)', () => {
    expect(wrapper.find('.Top__data__options').text()).toBe('2')
  })
  it('option の表示', async () => {
    let answer = 'test answer'
    let textarea = wrapper.find('.NewPage__option__text').element
    expect(textarea.value).toBe('')
    await (wrapper.vm.$data.options[0].answer = answer)
    expect(wrapper.find('.NewPage__option__text').exists()).toBe(true)
    expect(textarea.value).toBe(answer)
  })
  it('option のエラー', async () => {
    let text = 'a'.repeat(41)
    let textarea = wrapper.find('.NewPage__option__text')
    let answer = wrapper.vm.$data.options[0]
    expect(answer.isValid).toBe(true)
    textarea.element.value = text
    await (textarea.trigger('input'))
    expect(answer.isValid).toBe(false)
    expect(wrapper.find('.NewPage__option__num.hasError').exists()).toBe(true)
  })
  it('Buttons__add-option の状態', (done) => {
    let button = wrapper.find('.Buttons__add-option')
    expect(wrapper.find('.Buttons__add-option.hasError').exists()).toBe(false)
    for (let i = 0; i < 8; i++) button.trigger('click')
    // console.log(wrapper.vm.$data.options.length)
    setTimeout(() => {
      expect(wrapper.findAll('.NewPage__option__container').length).toBe(10)
      expect(wrapper.find('.Buttons__add-option.hasError').exists()).toBe(true)
      done()
    }, 10)
  })
  it('Buttons__submit の状態', async () => {
    let text = 'test text'
    expect(wrapper.find('.Buttons__submit.hasError').exists()).toBe(true)
    await (wrapper.vm.$data.question.text = text)
    await (wrapper.vm.$data.options[0].answer = text)
    await (wrapper.vm.$data.options[1].answer = text)
    expect(wrapper.find('.Buttons__submit.hasError').exists()).toBe(false)
  })
})
