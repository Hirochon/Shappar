<template>
  <div class="PostDetails" @click.stop="closeDetails()" @touchmove.prevent.stop @touchstart.stop>
    <div class="PostDetails__container" id="PostDetails__area" @click.stop>
      <!-- <h2 class="Top__header">
        <div class="Top__close">
          <font-awesome-icon icon="times" @click.stop="closeDetails()"/>
        </div>
      </h2> -->
      <!-- <div class="Pie-chart__area">
        <svg class="Pie-char__main"
          :width="maxR" :height="maxR" viewBox="-100 -100 200 200"
          @click.stop="isActiveText = 1 - isActiveText"
          >
          <path
            v-for="(item, index) in isActiveData" :key="item.id"
            :d="pieChartPath(total, item.num, index)"
            :fill="fillCalc(index)"
            :style="{transform: 'rotate(' + calcDeg(isActiveData, index) + 'deg)'}"/>
          <g v-show="(item.num / total) > 0.05"
            v-for="(item, index) in isActiveData" :key="item.id + 'id'">
            <text
              v-show="isActiveText === 0"
              :x="calcX(index, item, isActiveData)" :y="calcY(index, item, isActiveData)"
              fill="#444" font-size="14"
              >
              <tspan>{{item.id}}</tspan>
              <tspan :x="calcX(index, item, isActiveData)" :y="calcY(index, item, isActiveData)+14">
                {{item.num+' 票'}}
              </tspan>
            </text>
            <text
              v-show="isActiveText === 1"
              :x="calcX(index, item, isActiveData)" :y="calcY(index, item, isActiveData)"
              fill="#444" font-size="14"
              >
              <tspan>{{Math.floor(item.num / total * 100)+'%'}}</tspan>
              <tspan :x="calcX(index, item, isActiveData)" :y="calcY(index, item, isActiveData)+14">
                {{'（' + item.num + ' 票）'}}
              </tspan>
            </text>
          </g>
        </svg>
        <div class="Pie-chart__inner"></div>
      </div> -->
      <doughnutChart :chartData="isActiveChartData" @click.stop></doughnutChart>
      <div class="PostDetails__switch">
        <div class="PostDetails__button" @click.stop="isActive = 0" :class="{active: isActive === 0}">
          <font-awesome-icon icon="venus-mars"/>
        </div>
        <div class="PostDetails__button" @click.stop="isActive = 1" :class="{active: isActive === 1}">
          age
        </div>
        <div class="PostDetails__button" @click.stop="isActive = 2" :class="{active: isActive === 2}">
          <font-awesome-icon icon="birthday-cake"/>
        </div>
      </div>
    </div>
    <div class="PostDetails__button">
      <font-awesome-icon icon="times" @click.stop="closeDetails()"/>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import doughnutChart from '@/components/DoughnutChart.vue'
// import GlobalMessage from '@/components/GlobalMessage.vue'
export default {
  name: 'PostDetails',
  components: {
    doughnutChart
  },
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
      isActive: 0,
      isActiveText: 0
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
          this.voted_sex = this.voted_sex.sort((a, b) => {
            if (a.num < b.num) return 1
            if (a.num > b.num) return -1
            return 0
          })
          this.voted_age = this.voted_age.sort((a, b) => {
            if (a.num < b.num) return 1
            if (a.num > b.num) return -1
            return 0
          })
          this.voted_month = this.voted_month.sort((a, b) => {
            if (a.num < b.num) return 1
            if (a.num > b.num) return -1
            return 0
          })
        })
    },
    closeDetails () {
      this.$emit('switchDetails')
    },
    fillCalc (index) {
      switch (index) {
        case 11:
          return '#41BE99'
        case 10:
          return '#26A69A'
        case 9:
          return '#26C6DA'
        case 8:
          return '#29B6F6'
        case 7:
          return '#42A5F5'
        case 6:
          return '#5C6BC0'
        case 5:
          return '#7E57C2'
        case 4:
          return '#AB47BC'
        case 3:
          return '#EC407A'
        case 2:
          return '#ef5350'
        case 1:
          return '#FF7043'
        case 0:
          return '#FFA726'
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
      d += 100 * Math.sin(pie)
      d += ','
      d += -100 * Math.cos(pie)
      d += 'z'
      return d
    },
    calcDeg (list, index) {
      var deg = 0
      for (let i = 0; i < index; i++) {
        deg += list[i].deg
      }
      return deg
    },
    calcX (index, item, list) {
      // svg font のx,yはボックスの左下
      var deg = this.calcDeg(list, index)
      deg += (item.deg / 2)
      var pie = Math.PI * deg / 180
      return Math.sin(pie) * this.maxR / 4 - 20
    },
    calcY (index, item, list) {
      var deg = this.calcDeg(list, index)
      deg += (item.deg / 2)
      var pie = Math.PI * deg / 180
      return -Math.cos(pie) * this.maxR / 4 + 12
    },
    optionsSort (post, options) {
      post.sort = (post.sort + 1) % 3
      switch (post.sort) {
        case 0:
          return options.sort(function (a, b) {
            if (a.select_num < b.select_num) return -1
            if (a.select_num > b.select_num) return 1
            return 0
          })
        case 1:
          return options.sort(function (a, b) {
            if (a.votes < b.votes) return 1
            if (a.votes > b.votes) return -1
            return 0
          })
        case 2:
          return options.sort(function (a, b) {
            if (a.votes < b.votes) return -1
            if (a.votes > b.votes) return 1
            return 0
          })
      }
    },
    dataNum (data) {
      var num = []
      data.forEach(item => {
        num.push(item.num)
      })
      return num
    },
    dataLabels (data) {
      var labels = []
      data.forEach(item => {
        labels.push(item.id)
      })
      return labels
    }
  },
  computed: {
    isActiveData () {
      switch (this.isActive) {
        case 0:
          return this.dataNum(this.voted_sex)
        case 1:
          return this.dataNum(this.voted_age)
        case 2:
          return this.dataNum(this.voted_month)
      }
      return false
    },
    isActivelabels () {
      switch (this.isActive) {
        case 0:
          return this.dataLabels(this.voted_sex)
        case 1:
          return this.dataLabels(this.voted_age)
        case 2:
          return this.dataLabels(this.voted_month)
      }
      return false
    },
    isActiveChartData () {
      // return {
      //   labels: [this.getRandomInt(), this.getRandomInt()],
      //   datasets: [
      //     {
      //       label: 'Data One',
      //       backgroundColor: '#f87979',
      //       borderColor: '#f87979',
      //       data: [this.getRandomInt(), this.getRandomInt()],
      //       fill: false
      //     }, {
      //       label: 'Data Two',
      //       backgroundColor: '#007979',
      //       borderColor: '#007979',
      //       data: [this.getRandomInt(), this.getRandomInt()],
      //       fill: false
      //     }
      //   ]
      // }
      return {
        labels: this.isActivelabels,
        datasets: [{
          data: this.isActiveData,
          backgroundColor: [
            '#FFA726',
            '#FF7043',
            '#ef5350',
            '#EC407A',
            '#AB47BC',
            '#7E57C2',
            '#5C6BC0',
            '#42A5F5',
            '#29B6F6',
            '#26C6DA',
            '#26A69A',
            '#66BB6A'
          ],
          borderColor: [
            '#FFA726',
            '#FF7043',
            '#ef5350',
            '#EC407A',
            '#AB47BC',
            '#7E57C2',
            '#5C6BC0',
            '#42A5F5',
            '#29B6F6',
            '#26C6DA',
            '#26A69A',
            '#66BB6A'
          ],
          borderWidth: 1
        }]
      }
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
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  background: rgba(black, .6);
  z-index: 100;
  overflow: scroll;
  &__container{
    width: 100%;
    height: 400px;
    // background: white;
  }
  &__switch{
    margin-top: 24px;
    padding: 0 16px;
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    // background: white;
    border-radius: 3px;
    overflow: hidden;
  }
  &__button{
    cursor: pointer;
    width: 48px;
    height: 48px;
    line-height: 24px;
    padding: 12px 8px;
    background: #a1dfcc;
    border-radius: 3px;
    text-align: center;
    font-weight: bold;
    letter-spacing: -3px;
    font-size: 24px;
    // font-family: ;
    &.active{
      background: $color-main;
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
    }
  }
}
</style>
