<template>
  <div class="PostDetails" id="PostDetails__area" @touchmove.prevent.stop @touchstart.stop @click.stop>
    <div class="PostDetails__overlay" @click.stop="closeDetails()"></div>
    <doughnutChart class="PostDetails__chart" :chartData="isActiveChartData"/>
    <div class="PostDetails__switch">
      <div class="PostDetails__wrap" :class="{active: isActive === 0}">
        <div class="PostDetails__button material-01" @click.stop="isActive = 0" :class="{active: isActive === 0}">
          <font-awesome-icon icon="venus-mars"/>
        </div>
      </div>
      <div class="PostDetails__wrap" :class="{active: isActive === 1}">
        <div class="PostDetails__button material-02" @click.stop="isActive = 1" :class="{active: isActive === 1}">
          <div class="PostDetails__age">a</div>
          <div class="PostDetails__age">g</div>
          <div class="PostDetails__age">e</div>
        </div>
      </div>
      <div class="PostDetails__wrap" :class="{active: isActive === 2}">
        <div class="PostDetails__button material-03" @click.stop="isActive = 2" :class="{active: isActive === 2}">
          <font-awesome-icon icon="birthday-cake"/>
        </div>
      </div>
      <div class="PostDetails__wrap" :class="{active: isActive === 3}">
        <div class="PostDetails__button material-04" @click.stop="isActive = 3" :class="{active: isActive === 3}">
          型
        </div>
      </div>
      <div class="PostDetails__wrap">
        <div class="PostDetails__button material-05" @click.stop="closeDetails()">
          <font-awesome-icon icon="times"/>
        </div>
      </div>
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
      voted_blood_type: [],
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
          const data = response.data
          this.total = data.total
          for (const key in data.voted_sex) {
            // console.log(key)
            this.voted_sex.push({
              num: data.voted_sex[key]
            })
          }
          this.voted_sex[0].id = '女性'
          this.voted_sex[1].id = '男性'
          this.voted_sex[2].id = 'その他'
          this.voted_sex[3].id = '未回答'
          for (const key in data.voted_age) {
            // console.log(key)
            this.voted_age.push({
              id: key[0] * 10 + '代',
              num: data.voted_age[key]
            })
          }
          this.voted_age[0].id = '10歳未満'
          this.voted_age[6].id += '以降'
          for (const key in data.voted_month) {
            // console.log(key)
            this.voted_month.push({
              id: key + '月',
              num: data.voted_month[key]
            })
          }
          for (const key in data.voted_blood_type) {
            // console.log(key)
            this.voted_blood_type.push({
              id: key + '型',
              num: data.voted_blood_type[key]
            })
          }
          this.voted_blood_type[4].id = 'その他'
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
          this.voted_blood_type = this.voted_blood_type.sort((a, b) => {
            if (a.num < b.num) return 1
            if (a.num > b.num) return -1
            return 0
          })
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'production') console.log(error)
        })
    },
    closeDetails () {
      this.$emit('switchDetails')
    },
    dataNum (data) {
      const num = []
      data.forEach(item => {
        num.push(item.num)
      })
      return num
    },
    dataLabels (data) {
      const labels = []
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
        case 3:
          return this.dataNum(this.voted_blood_type)
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
        case 3:
          return this.dataLabels(this.voted_blood_type)
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
  // align-items: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  max-width: 700px;
  z-index: 300;
  overflow: scroll;
  @include scrollbar();
  @include media(700) {
    left: calc(50% - 350px);
  }
  &__overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vmax;
    height: 100vmax;
    background: rgba(black, .6);
    z-index: -1;
  }
  &__container{
    position: fixed;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    // padding-top: 12px;
    // max-height: 700px;
    // background: white;
  }
  &__chart{
    // position: fixed;
    // top: 0;
    width: 100vmin;
    height: 100vmin;
    max-width: 700px;
    max-height: 700px;
    // margin: 48px auto;
    & > canvas{
      max-width: 700px;
    }
  }
  &__switch{
    width: auto;
    max-width: calc(100vmax - 100vmin);
    // max-width: 700px;
    max-height: 700px;
    // position: fixed;
    // bottom: 96px;
    padding: 16px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 3px;
    @include media(700) {
      max-width: 700px;
    }
  }
  &__wrap{
    width: 58px;
    height: 58px;
    padding: 5px;
    &.active{
      padding: 0;
    }
  }
  &__button{
    cursor: pointer;
    display: flex;
    justify-content: center;
    width: 48px;
    height: 48px;
    line-height: 24px;
    padding: 12px 0;
    border-radius: 50%;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    color: white;
    &.active{
      position: relative;
      width: 58px;
      height: 58px;
      padding: 17px 0;
    }
    @each $num, $color in $color-material {
      &.material-#{$num} {
        background: $color;
      }
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
    }
  }
  &__age{
    position: relative;
    &:first-child{
      left: 4px;
    }
    &:last-child{
      right: 4px;
    }
  }
}
</style>
