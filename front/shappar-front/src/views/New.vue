<template>
  <div class="New">
    <h2 class="New__title">質問文</h2>
      <textarea class="New__textarea" v-model="question" cols="30" rows="5"></textarea>
    <h2 class="New__title">選択肢</h2>
    <div class="New__add-option" @click="addOption">
      項目を追加する
      <div class="New__num">{{count}}</div>
    </div>
    <draggable :option="draggable_options">
      <div class="New__options" v-for="(option, index) in options" :key="option.select_num">
        <textarea class="New__textarea" cols="30" rows="3" v-model="option.answer"></textarea>
        <div class="New__option__delete" @click="deleteOption(index)">
          <font-awesome-icon icon="times"/>
        </div>
        <div class="New__option__index">{{index + 1}}</div>
      </div>
    </draggable>
    <div class="New__submit" @click="releasePost">
      投稿する
    </div>
    <NavBar></NavBar>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import draggable from 'vuedraggable'

export default {
  name: 'new',
  components: {
    NavBar,
    draggable
  },
  data: function () {
    return {
      unique_id: '',
      user_id: '',
      question: '',
      count: 2,
      draggable_options: {
        Animation: 200
      },
      options: [
        {
          answer: ''
        },
        {
          answer: ''
        }
      ]
    }
  },
  methods: {
    addOption () {
      if (this.count < 10) {
        this.options.push({
          answer: ''
        })
        this.count++
      } else {
        alert('これ以上作成できません')
      }
    },
    deleteOption (selectNum) {
      if (this.count > 2) {
        this.options.splice(selectNum, 1)
        this.count--
      } else {
        alert('これ以上削除できません')
      }
    },
    releasePost () {
      // var params = new FormData()
      // params.append('unique_id', this.unique_id)
      // params.append('question', this.question)
      for (let i = 0; i < this.options.length; i++) {
        this.options[i].select_num = i
      }
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
          answer: ''
        },
        {
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
$delete-width: 24px;
.New{
  padding: 24px 16px 0;
  &__textarea{
    margin-bottom: 16px;
    padding: 8px 16px;
    box-sizing: border-box;
    width: 100%;
    background: white;
    resize: none;
    border-radius: 8px;
  }
  &__add-option{
    position: sticky;
    top: 0;
    margin-top: 16px;
    margin-bottom: 16px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-radius: 8px;
    color: white;
    text-align: center;
    background: #4180d7;
    z-index: 100;
  }
  &__num{
    position: absolute;
    top: 12px;
    right: 12px;
    width: $delete-width;
    height: $delete-width;
    line-height: $delete-width;
    font-size: 14px;
    border-radius: 50%;
    color: white;
    text-align: center;
    background: orange;
  }
  &__options{
    position: relative;
  }
  &__option__delete{
    position: absolute;
    top: -4px;
    right: -4px;
    width: $delete-width;
    height: $delete-width;
    line-height: $delete-width;
    font-size: 14px;
    border-radius: 50%;
    color: white;
    text-align: center;
    background: red;
  }
  &__option__index{
    position: absolute;
    top: calc(50% - 24px);
    left: -12px;
    width: $delete-width;
    height: $delete-width;
    line-height: $delete-width;
    font-size: 14px;
    border-radius: 50%;
    color: white;
    text-align: center;
    background: #4180d7;
  }
  &__submit{
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
