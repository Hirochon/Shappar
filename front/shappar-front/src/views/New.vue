<template>
  <div class="New">
    <h2 class="New__title">質問文</h2>
    <textarea class="New__textarea" v-model="text" cols="30" rows="10"></textarea>
    <h2 class="New__title">選択肢</h2>
    <div class="New__add-option" @click="addOption">
      項目を追加する
    </div>
    <div class="New__options" v-for="option in options" :key="option.id">
      <textarea class="New__textarea" cols="30" rows="10"></textarea>
      <div class="New__option__delete" @click="deleteOption(option.id)">
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
      id: 0,
      userId: '',
      text: '',
      count: 2,
      options: [
        {
          id: 0,
          content: ''
        },
        {
          id: 1,
          comnfent: ''
        }
      ]
    }
  },
  methods: {
    addOption () {
      if (this.count < 4) {
        this.options.push({
          id: this.count++,
          content: ''
        })
      } else {
        alert('これ以上作成できません')
      }
    },
    deleteOption (id) {
      if (this.count > 2) {
        for (let i = 0; i < this.count; i++) {
          if (this.options[i].id === id) {
            this.options.splice(i, 1)
            break
          }
        }
      } else {
        alert('これ以上削除できません')
      }
    },
    releasePost () {
      this.axios.post('/api/v1/posts', {
        text: this.text,
        options: this.options
      })
        .then((response) => {
          // console.log(response)
          if (response.status === 200) alert('投稿完了！')
        })
      this.text = ''
      this.options = [
        {
          id: 0,
          content: ''
        }
      ]
    }
  },
  created: function () {
    this.id = 1
    this.userId = 'sanple-user'
  }
}
</script>

<style lang="scss">
.New{
  padding: 64px 16px 0;
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
