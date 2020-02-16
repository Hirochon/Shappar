<template>
  <div class="Update">
    <h2 class="Update__title">ユーザー名</h2>
    <input class="Update__input" v-model="name" type="text">
    <h2 class="Update__title">ユーザーID</h2>
    <input class="Update__input" v-model="user_id" type="text">
    <h2 class="Update__title">紹介文</h2>
    <textarea class="Update__input" v-model="introduction" cols="30" rows="5"></textarea>
    <h2 class="Update__title">アイコン</h2>
    <input class="Update__input" type="file" name="iconimage" @change="imageSelect(1, $event)">
    <h2 class="Update__title">ホーム画像</h2>
    <input class="Update__input" type="file" name="homeimage" @change="imageSelect(0, $event)">
    <div class="Update__submit" @click="updateUser">
      保存する
    </div>
    <NavBar></NavBar>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import store from '../store'

export default {
  name: 'updateUser',
  components: {
    NavBar
  },
  data: function () {
    return {
      before_user_id: '',
      user_id: '',
      name: '',
      introduction: '',
      iconimage: null,
      homeimage: null
    }
  },
  methods: {
    imageSelect (icon, e) {
      if (icon) this.iconimage = e.target.files[0]
      else this.homeimage = e.target.files[0]
    },
    updateUser () {
      var params = new FormData()
      params.append('user_id', this.user_id)
      params.append('name', this.name)
      params.append('introduction', this.introduction)
      params.append('iconimage', this.iconimage)
      params.append('homeimage', this.homeimage)
      this.axios.put('/api/v1/users/' + this.before_user_id + '/', params)
        .then((response) => {
          console.log(response)
          if (response.status === 200) {
            alert('更新完了！')
            this.user_id = ''
            this.name = ''
            this.introduction = ''
          }
        })
    }
  },
  created: function () {
    // console.log(this.$store.state.auth.username)
    // console.log(store.getters['auth/username'])
    // var username = this.$store.state.auth.username
    this.before_user_id = store.getters['auth/username']
    this.user_id = this.before_user_id
    this.axios.get('/api/v1/users/' + this.before_user_id)
      .then((response) => {
        this.name = response.data.name
        this.introduction = response.data.introduction
      })
  }
}
</script>

<style lang="scss">
.Update{
  padding: 24px 16px 0;
  &__input{
    margin-bottom: 16px;
    padding: 8px;
    box-sizing: border-box;
    width: 100%;
    background: white;
    resize: none;
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
