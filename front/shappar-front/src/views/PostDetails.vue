<template>
  <div class="PostDetails" @click.stop="closeDetails()" @touchmove.prevent.stop @touchstart.stop>
    <div class="PostDetails__container" id="PostDetails__area" @click.stop>
      <doughnutChart class="PostDetails__chart" :chartData="isActiveChartData" @click.stop></doughnutChart>
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
            this.voted_sex.push({
              num: data.voted_sex[key]
            })
          }
          this.voted_sex[0].id = '女性'
          this.voted_sex[1].id = '男性'
          this.voted_sex[2].id = 'その他'
          this.voted_sex[3].id = '未回答'
          for (let key in data.voted_age) {
            // console.log(key)
            this.voted_age.push({
              id: key[0] * 10 + '代',
              num: data.voted_age[key]
            })
          }
          this.voted_age[0].id = '10歳未満'
          this.voted_age[6].id += '以降'
          for (let key in data.voted_month) {
            // console.log(key)
            this.voted_month.push({
              id: key + '月',
              num: data.voted_month[key]
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
          borderWidth: 0
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
  z-index: 300;
  overflow: scroll;
  @include scrollbar();
  &__container{
    width: 100%;
    max-height: 700px;
    // background: white;
  }
  &__chart{
    max-width: 700px;
    margin: 0 auto;
    & > canvas{
      max-width: 700px;
    }
  }
  &__switch{
    max-width: 700px;
    margin: 0 auto;
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
