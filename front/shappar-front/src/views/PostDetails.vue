<template>
  <div class="PostDetails">
      <h2 class="Top__header"><!-- ここのヘッダーはコンポーネント化できる？ -->
        <div class="Top__close">
          <font-awesome-icon icon="times" @click.stop="closeDetails()"/>
        </div>
      </h2>
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
      total: 0
    }
  },
  methods: {
    getPostData () {
      api.get('/api/v1/posts/' + this.post_id + '/')
        .then((response) => {
          let data = response.data
          for (let key in data.voted_sex) {
            console.log(key)
            this.voted_sex.push({
              id: key,
              num: data.voted_sex[key]
            })
          }
          this.voted_sex[0].id = '女性'
          this.voted_sex[1].id = '男性'
          this.voted_sex[2].id = 'その他'
          this.voted_sex[3].id = '未回答'
          for (let key in data.voted_age) {
            console.log(key)
            this.voted_age.push({
              id: key[0] * 10 + '代',
              num: data.voted_age[key]
            })
          }
          this.voted_age[0].id = '10歳未満'
          this.voted_age[6].id += '以降'
          for (let key in data.voted_month) {
            console.log(key)
            this.voted_month.push({
              id: key + '月',
              num: data.voted_month[key]
            })
          }
          this.total = data.total
        })
    },
    closeDetails () {
      this.$emit('switchDetails')
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
  width: 100%;
  height: 100%;
  background: white;
  z-index: 100;
}
</style>
