<template>
  <div class="New">
    <h2 class="New__title">質問文</h2>
      <textarea class="New__textarea" v-model="question" cols="30" rows="5"></textarea>
    <h2 class="New__title">選択肢</h2>
    <div class="New__add-option" @click="addOption">
      項目を追加する
    </div>
    <div class="New__options" v-for="option in options" :key="option.select_num">
      <textarea class="New__textarea" cols="30" rows="3" v-model="option.answer"></textarea>
      <div class="New__option__delete" @click="deleteOption(option.select_num)">
        項目を削除する
        </div>
    </div>
    <div class="New__submit" @click="releasePost">
      投稿する
    </div>
    <NavBar></NavBar>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'new',
  components: {
    NavBar
  },
  data: function () {
    return {
      unique_id: '',
      user_id: '',
      question: '',
      count: 2,
      options: [
        {
          select_num: 0,
          answer: ''
        },
        {
          select_num: 1,
          answer: ''
        }
      ]
    }
  },
  methods: {
    addOption () {
      if (this.count < 10) {
        this.options.push({
          select_num: this.count++,
          content: ''
        })
      } else {
        alert('これ以上作成できません')
      }
    },
    deleteOption (selectNum) {
      if (this.count > 2) {
        for (let i = 0; i < this.count; i++) {
          if (this.options[i].select_num === selectNum) {
            this.options.splice(i, 1)
            this.count--
            break
          }
        }
      } else {
        alert('これ以上削除できません')
      }
    },
    releasePost () {
      // var params = new FormData()
      // params.append('unique_id', this.unique_id)
      // params.append('question', this.question)
      // for (let i = 0; i < this.options.length; i++) {
      //   params.append('answer_' + (i + 1), this.options[i].answer)
      // }
      this.axios.post('/api/v1/posts/', {
        unique_id: this.unique_id,
        question: this.question,
        options: this.options
      })
        .then((response) => {
          // console.log(response)
          if (response.status === 201) alert('投稿完了！')
        })
      this.question = ''
      this.count = 2
      this.options = [
        {
          select_num: 0,
          answer: ''
        },
        {
          select_num: 1,
          answer: ''
        }
      ]
    }
  },
  created: function () {
    this.unique_id = this.$store.state.auth.unique_id
    this.user_id = this.$store.state.auth.username
  }
}
</script>

<style lang="scss">
.New{
  padding: 24px 16px 0;
  &__textarea{
    margin-top: 16px;
    padding: 8px;
    box-sizing: border-box;
    width: 100%;
    background: white;
    resize: none;
    border-radius: 8px;
  }
  &__add-option{
    margin-top: 16px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-radius: 8px;
    color: white;
    text-align: center;
    background: #4180d7;
  }
  &__option__delete{
    width: 100%;
    height: 32px;
    line-height: 32px;
    color: white;
    text-align: center;
    background: red;
    border-radius: 8px;
  }
  &__submit{
    margin-top: 16px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-radius: 8px;
    color: white;
    text-align: center;
    background: #41d761;
  }
}
</style>
