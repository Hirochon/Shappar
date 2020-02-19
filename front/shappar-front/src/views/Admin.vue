<template>
  <div id="home-page">
    <GlobalHeader :pageName="pageName"/>
    <GlobalMessage/>

    <!-- メインエリア -->
    <main class="container">
      <b-form @submit.prevent="createSampleUser">
        <div class="row text-center mt-5">
          <div class="col-sm-12">
            <b-button type="submit" variant="primary">ユーザー新規作成</b-button>
          </div>
        </div>
      </b-form>
      <b-form @submit.prevent="createSamplePosts">
        <div class="row text-center mt-5">
          <div class="col-sm-12">
            <input type="num" class="form-control" v-model="postNum">
          </div>
          <div class="col-sm-12">
            <b-button type="submit" variant="primary">新規投稿作成</b-button>
          </div>
          <div class="col-sm-12">
            <b-button variant="success"><router-link to="/" style="color: white">投稿一覧へ</router-link></b-button>
          </div>
        </div>
      </b-form>
    </main>
  </div>
</template>

<script>
// import api from '@/services/api'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalMessage from '@/components/GlobalMessage.vue'
export default {
  data: function () {
    return {
      pageName: 'Adminページ',
      postNum: 0,
      count: 2,
      options: [
        // {
        //   select_num: 0,
        //   answer: ''
        // },
        // {
        //   select_num: 1,
        //   answer: ''
        // }
      ]
    }
  },
  components: {
    GlobalHeader,
    GlobalMessage
  },
  methods: {
    createSampleUser () {
      alert('createSampleUser')
    },
    createSamplePosts () {
      for (let i = 0; i < this.postNum; i++) {
        let random = Math.floor(Math.random(i) * 100) % 8 + 2
        console.log('random:' + random)
        for (let j = 0; j < random; j++) {
          this.options[j] = {
            select_num: j,
            answer: 'answer_' + j
          }
        }
        this.axios.post('/api/v1/posts/', {
          unique_id: this.unique_id,
          question: 'question_' + i,
          options: this.options
        })
          .then((response) => {
            // console.log(response)
            if (response.status === 201) console.log(i + 1)
          })
        // 初期化
        this.question = ''
        this.count = 2
        this.options = []
        // this.options = [
        //   {
        //     select_num: 0,
        //     answer: ''
        //   },
        //   {
        //     select_num: 1,
        //     answer: ''
        //   }
        // ]
      }
    }
  },
  created: function () {
    this.unique_id = this.$store.state.auth.unique_id
    this.user_id = this.$store.state.auth.username
  }
}
</script>
