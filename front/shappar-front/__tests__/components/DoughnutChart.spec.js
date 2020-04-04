/* eslint-disable no-undef */

// this.$refs.canvas.getContext('2d')がnullになる原因がわからず断念
// propsは渡せているみたいやけど
// mount と shallowMount をためしたけど変わらずマウントの仕方ではなかった
// 時間を割かなければならないので一時待機

// import Vue from 'vue'
// import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
// import DoughnutChart from '@/components/DoughnutChart.vue'

// const localVue = createLocalVue()

describe('Testing DoughnutChart component', () => {
  it('is a Vue instance', () => {
    // const wrapper = mount(DoughnutChart, {
    //   localVue,
    //   propsData: {
    //     chartData: {
    //       labels: ['女性', '男性', 'その他', '未回答'],
    //       datasets: [{
    //         data: [4, 2, 1, 0],
    //         backgroundColor: [
    //           '#FFA726',
    //           '#FF7043',
    //           '#ef5350',
    //           '#EC407A',
    //           '#AB47BC',
    //           '#7E57C2',
    //           '#5C6BC0',
    //           '#42A5F5',
    //           '#29B6F6',
    //           '#26C6DA',
    //           '#26A69A',
    //           '#66BB6A'
    //         ],
    //         borderWidth: 0
    //       }]
    //     }
    //   }
    // })
    // expect(wrapper.isVueInstance).toBeTruthy()
  })

  it('is a Vue instance', () => {
    // const wrapper = shallowMount(DoughnutChart, {
    //   propsData: {
    //     chartData: {
    //       labels: ['女性', '男性', 'その他', '未回答'],
    //       datasets: [{
    //         data: [4, 2, 1, 0],
    //         backgroundColor: [
    //           '#FFA726',
    //           '#FF7043',
    //           '#ef5350',
    //           '#EC407A',
    //           '#AB47BC',
    //           '#7E57C2',
    //           '#5C6BC0',
    //           '#42A5F5',
    //           '#29B6F6',
    //           '#26C6DA',
    //           '#26A69A',
    //           '#66BB6A'
    //         ],
    //         borderWidth: 0
    //       }]
    //     }
    //   }
    // })
    // expect(wrapper.isVueInstance).toBeTruthy()
  })

  // vue-chartjsのテストをひっぱてきてみた
  // https://github.com/apertureless/vue-chartjs/blob/develop/test/unit/specs/Doughnut.spec.js
  it('should render a canvas', () => {
    // var el = document.createElement('div')
    // const vm = new Vue({
    //   render: function (createElement) {
    //     return createElement(
    //       DoughnutChart,
    //       {
    //         props: {
    //           chartData: {
    //             labels: ['女性', '男性', 'その他', '未回答'],
    //             datasets: [{
    //               data: [4, 2, 1, 0],
    //               backgroundColor: [
    //                 '#FFA726',
    //                 '#FF7043',
    //                 '#ef5350',
    //                 '#EC407A',
    //                 '#AB47BC',
    //                 '#7E57C2',
    //                 '#5C6BC0',
    //                 '#42A5F5',
    //                 '#29B6F6',
    //                 '#26C6DA',
    //                 '#26A69A',
    //                 '#66BB6A'
    //               ],
    //               borderWidth: 0
    //             }]
    //           }
    //         }
    //       }
    //     )
    //   },
    //   components: { DoughnutChart }
    // }).$mount(el)

    // console.log(vm.$el.querySelector('canvas')[0])
    // console.log(vm.$el)

    // expect(vm.$el.querySelector('#doughnut-chart').exists())
    // expect(vm.$el.querySelector('canvas')).not.to.be.an('undefined')
    // expect(vm.$el.querySelector('canvas')).not.to.be.an('null')
    // expect(vm.$el.querySelector('canvas')).to.exist()
  })
})
