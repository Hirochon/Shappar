<template>
  <div class="PostDetails" @click.stop="closeDetails()">
    <div class="PostDetails__container" id="PostDetails__area">
      <!-- <h2 class="Top__header">
        <div class="Top__close">
          <font-awesome-icon icon="times" @click.stop="closeDetails()"/>
        </div>
      </h2> -->
      <div class="Pie-chart__area">
        <svg class="Pie-char__main" :width="maxR" :height="maxR" viewBox="-100 -100 200 200" v-if="isActive === 0">
            <path :d="pieChartPath(100,num)" fill="#74B0FF" />
            <path
              v-for="(item, index) in voted_sex" :key="item.id"
              :d="pieChartPath(total, item.num, index)"
              :fill="fillCalc(index)"
              :style="{transform: 'rotate(' + calcDeg(voted_sex, index) + 'deg)'}"/>
        </svg>
        <svg class="Pie-char__main" :width="maxR" :height="maxR" viewBox="-100 -100 200 200" v-if="isActive === 1">
            <path :d="pieChartPath(100,num)" fill="#74B0FF" />
            <path
              v-for="(item, index) in voted_age" :key="item.id"
              :d="pieChartPath(total, item.num, index)"
              :fill="fillCalc(index)"
              :style="{transform: 'rotate(' + calcDeg(voted_age, index) + 'deg)'}"/>
        </svg>
        <svg class="Pie-char__main" :width="maxR" :height="maxR" viewBox="-100 -100 200 200" v-if="isActive === 2">
            <path :d="pieChartPath(100,num)" fill="#74B0FF" />
            <path
              v-for="(item, index) in voted_month" :key="item.id"
              :d="pieChartPath(total, item.num, index)"
              :fill="fillCalc(index)"
              :style="{transform: 'rotate(' + calcDeg(voted_month, index) + 'deg)'}"/>
        </svg>
        <div class="Pie-chart__inner"></div>
      </div>
      <div class="PostDetails__switch">
        <div class="PostDetails__button" @click.stop="isActive = 0" :class="{active: isActive === 0}">性別</div>
        <div class="PostDetails__button" @click.stop="isActive = 1" :class="{active: isActive === 1}">年齢</div>
        <div class="PostDetails__button" @click.stop="isActive = 2" :class="{active: isActive === 2}">誕生月</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
export default {
  name: 'PostDetails',
  props: {
    post_id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      voted_sex: [],
      voted_age: [],
      voted_month: [],
      total: 0,
      num: 0,
      width: 0,
      height: 0,
      maxR: 0,
      isActive: 0
    }
  },
  methods: {
    getPostData () {
      api.get('/api/v1/posts/' + this.post_id + '/')
        .then((response) => {
          let data = response.data
          this.total = data.total
          for (let key in data.voted_sex) {
            // console.log(key)
            let num = data.voted_sex[key]
            let deg = num / this.total
            let pie = Math.PI * 2 * deg
            this.voted_sex.push({
              id: key,
              num: data.voted_sex[key],
              deg: deg * 360,
              pie: pie
            })
          }
          this.voted_sex[0].id = '女性'
          this.voted_sex[1].id = '男性'
          this.voted_sex[2].id = 'その他'
          this.voted_sex[3].id = '未回答'
          for (let key in data.voted_age) {
            // console.log(key)
            let num = data.voted_age[key]
            let deg = num / this.total
            let pie = Math.PI * 2 * deg
            this.voted_age.push({
              id: key[0] * 10 + '代',
              num: num,
              deg: deg * 360,
              pie: pie
            })
          }
          this.voted_age[0].id = '10歳未満'
          this.voted_age[6].id += '以降'
          for (let key in data.voted_month) {
            // console.log(key)
            let num = data.voted_month[key]
            let deg = num / this.total
            let pie = Math.PI * 2 * num / this.total
            this.voted_month.push({
              id: key + '月',
              num: data.voted_month[key],
              deg: deg * 360,
              pie: pie
            })
          }
        })
    },
    closeDetails () {
      this.$emit('switchDetails')
    },
    fillCalc (index) {
      switch (index) {
        case 0:
          return '#ff00ff'
        case 1:
          return '#ffff00'
        case 2:
          return '#ff0000'
        case 3:
          return '#0000ff'
        case 4:
          return '#00ffff'
        case 5:
          return '#9000ff'
        case 6:
          return '#0000ff'
        case 7:
          return '#0000ff'
        case 8:
          return '#0000ff'
        case 9:
          return '#0000ff'
        case 10:
          return '#0000ff'
        case 11:
          return '#0000ff'
        case 12:
          return '#0000ff'
      }
    },
    pieChartPath (denom, molecule) {
      var d = 'M0,0 ' // 中心から
      d += 'L0,-100 ' // スタート位置
      d += 'A100,100 0 ' // x半径,y半径 時計回り
      var deg = molecule / denom * 2
      var pie = Math.PI * deg
      if (deg === 2) d += '0,0 '
      else if (deg % 2 <= 1) d += '0,1 '// 一周したらリセットするために余りを使う
      else d += '1,1 '
      d += 100 * Math.sin(pie) // y
      d += ','
      d += -100 * Math.cos(pie) // x
      d += 'z'
      return d
    },
    calcDeg (list, index) {
      var deg = 0
      for (let i = 0; i < index; i++) {
        deg += list[i].deg
      }
      return deg
    }
  },
  created () {
    this.getPostData()
  },
  mounted () {
    var area = document.getElementById('PostDetails__area')
    this.width = area.clientWidth
    this.height = area.clientHeight
    this.maxR = this.width > this.height ? this.height : this.width
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/common.scss';
.PostDetails{
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(black, .6);
  z-index: 100;
  overflow: scroll;
  &__container{
    width: 80%;
    height: 400px;
    // background: white;
  }
  &__switch{
    display: flex;
    width: 100%;
    background: white;
  }
  &__button{
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: $color-main;
    opacity: 0.5;
    &.active{
      opacity: 1;
    }
  }
}
</style>
