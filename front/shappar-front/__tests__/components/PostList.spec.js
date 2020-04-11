/* eslint-disable no-undef */

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Component from '@/components/PostList.vue'
import Vuex from 'vuex'
import Router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Router)
localVue.component('font-awesome-icon', FontAwesomeIcon)
describe('PostList.vue', () => {
  let store
  let option
  let user
  let posts
  let wrapper

  beforeEach(() => {
    user = {
      namespaced: true,
      getters: {
        name: () => 'sample1'
      }
    }
    posts = [
      {
        'post_id': 'ff0c46c4-fb14-4123-a11b-454a85ffc3de',
        'user_id': 'sample2',
        'iconimage': 'https://d3ms402csqm2a0.cloudfront.net/media/images/customuser/iconimage/icon.png',
        'question': 'question_18',
        'voted': false,
        'total': 2,
        'options': [
          {
            'select_num': 1,
            'answer': 'answer_1',
            'votes': 0
          },
          {
            'select_num': 2,
            'answer': 'answer_2',
            'votes': 0
          },
          {
            'select_num': 4,
            'answer': 'answer_4',
            'votes': 0
          },
          {
            'select_num': 5,
            'answer': 'answer_5',
            'votes': 0
          },
          {
            'select_num': 6,
            'answer': 'answer_6',
            'votes': 0
          },
          {
            'select_num': 7,
            'answer': 'answer_7',
            'votes': 0
          },
          {
            'select_num': 0,
            'answer': 'answer_0',
            'votes': 1
          },
          {
            'select_num': 3,
            'answer': 'answer_3',
            'votes': 1
          }
        ],
        'created_at': '2020-04-03T11:52:46.964429Z',
        'selected_num': 0
      },
      {
        'post_id': '13f133fb-0c09-426a-9007-5fc10f419cb6',
        'user_id': 'sample2',
        'iconimage': 'https://d3ms402csqm2a0.cloudfront.net/media/images/customuser/iconimage/icon.png',
        'question': 'question_19',
        'voted': false,
        'total': 0,
        'options': [
          {
            'select_num': 0,
            'answer': 'answer_0',
            'votes': -1
          },
          {
            'select_num': 1,
            'answer': 'answer_1',
            'votes': -1
          },
          {
            'select_num': 2,
            'answer': 'answer_2',
            'votes': -1
          },
          {
            'select_num': 3,
            'answer': 'answer_3',
            'votes': -1
          },
          {
            'select_num': 4,
            'answer': 'answer_4',
            'votes': -1
          },
          {
            'select_num': 5,
            'answer': 'answer_5',
            'votes': -1
          }
        ],
        'created_at': '2020-04-03T11:52:46.963009Z',
        'selected_num': -1
      },
      {
        'post_id': 'fa4f6222-01a1-4e0f-a577-04c1da2b6f3a',
        'user_id': 'sample2',
        'iconimage': 'https://d3ms402csqm2a0.cloudfront.net/media/images/customuser/iconimage/icon.png',
        'question': 'question_17',
        'voted': false,
        'total': 0,
        'options': [
          {
            'select_num': 0,
            'answer': 'answer_0',
            'votes': -1
          },
          {
            'select_num': 1,
            'answer': 'answer_1',
            'votes': -1
          },
          {
            'select_num': 2,
            'answer': 'answer_2',
            'votes': -1
          },
          {
            'select_num': 3,
            'answer': 'answer_3',
            'votes': -1
          },
          {
            'select_num': 4,
            'answer': 'answer_4',
            'votes': -1
          },
          {
            'select_num': 5,
            'answer': 'answer_5',
            'votes': -1
          },
          {
            'select_num': 6,
            'answer': 'answer_6',
            'votes': -1
          },
          {
            'select_num': 7,
            'answer': 'answer_7',
            'votes': -1
          },
          {
            'select_num': 8,
            'answer': 'answer_8',
            'votes': -1
          }
        ],
        'created_at': '2020-04-03T11:52:46.911335Z',
        'selected_num': -1
      }
    ]
    store = new Vuex.Store({
      modules: {
        user
      }
    })
    option = {
      store,
      localVue,
      propsData: {
        posts: posts,
        isLoading: false
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
  it('posts の数だけ投稿があるか', () => {
    expect(wrapper.findAll('.Post').length).toBe(3)
  })
  it('iconimage の表示', () => {
    expect(wrapper.find('.Post__icon__img').attributes().src).toBe(posts[0].iconimage)
  })
  it('total の表示', () => {
    expect(wrapper.find('.Post__total').text()).toBe('Total：' + posts[0].total)
  })
  it('question の表示', () => {
    expect(wrapper.find('.Post__question').text()).toBe(posts[0].question)
  })
  it('answer の表示', () => {
    expect(wrapper.find('.Post').findAll('.Post__option').length).toBe(posts[0].options.length)
  })
  it('none の表示', () => {
    option = {
      store,
      localVue,
      propsData: {
        posts: [],
        isLoading: false
      }
    }
    wrapper = shallowMount(Component, option)
    expect(wrapper.find('.Post__none').exists()).toBe(true)
  })
  // loadingの表示
  it('loading を非表示→表示にする', async () => {
    let Post = wrapper.find('.Post')
    expect(Post.find('.Post__loading').exists()).toBe(false)
    await (posts[0].isLoading = true)
    setTimeout(() => {
      expect(Post.find('.Post__loading').exists()).toBe(true)
    }, 500)
  })
  // 未投票の場合
  it('sort reload details を非表示→表示にする', async () => {
    let Post = wrapper.find('.Post')
    expect(Post.find('.Post__sort').exists()).toBe(false)
    expect(Post.find('.Post__reload').exists()).toBe(false)
    expect(Post.find('.Post__details').exists()).toBe(false)
    // await (posts[0].voted = true)
    await Post.find('.Post__option').click
    // 表示までに少し時間がかかるみたい
    setTimeout(() => {
      expect(Post.find('.Post__sort').exists()).toBe(true)
      expect(Post.find('.Post__reload').exists()).toBe(true)
      expect(Post.find('.Post__details').exists()).toBe(true)
    }, 500)
  })
  // deleteの表示
  it('delete を非表示→表示にする', async () => {
    let Post = wrapper.find('.Post')
    expect(Post.find('.Post__delete').exists()).toBe(false)
    await (posts[0].user_id = user.name)
    setTimeout(() => {
      expect(Post.find('.Post__delete').exists()).toBe(true)
    }, 500)
  })
  // apiのテスト?
  // sortに関しては詳細をすると壊れやすそうなのでしない
  // Pull to Refresh、スクロールは難しいのでしない（Publicのとき）
})
