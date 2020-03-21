<template>
  <div id="login-page">
    <GlobalHeader :pageName="pageName"/>
    <GlobalMessage/>
    <!-- メインエリア -->
    <main class="Login__container">
      <div class="Login__loading" v-if="isLoading">
        <font-awesome-icon icon="spinner" class="Login__rotate"/>
      </div>
      <b-form class="Login__form" @submit.prevent="submitLogin">
        <div class="Login__form__group">
          <label class="">ユーザーID</label>
          <b-form-input type="text" v-model="form.username" required/>
        </div>
        <div class="Login__form__group">
          <label class="">パスワード</label>
          <b-form-input type="password" v-model="form.password" required/>
        </div>
        <div class="row text-center mt-5">
          <div class="col-sm-12">
            <b-button type="submit" variant="primary">ログイン</b-button>
          </div>
        </div>
      </b-form>
    </main>
  </div>
</template>

<script>
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalMessage from '@/components/GlobalMessage.vue'
export default {
  components: {
    GlobalHeader,
    GlobalMessage
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      pageName: 'ログインページ',
      isLoading: false
    }
  },
  methods: {
    // ログインボタン押下
    submitLogin: function () {
      // ログイン
      this.isLoading = true
      this.$store.dispatch('auth/login', {
        username: this.form.username,
        password: this.form.password
      })
        .then(() => {
          // console.log('Login succeeded.')
          this.$store.dispatch('message/setInfoMessage', { message: 'ログインしました。' })
          // クエリ文字列に「next」がなければ、ホーム画面へ
          const next = this.$route.query.next || '/'
          this.$router.replace(next)
        })
        .catch(error => {
          // this.$store.dispatch('message/setErrorMessage', { message: '認証エラー' })
          console.log(error.response.data)
        })
        .then(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
.Login{
  &__container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 16px;
  }
  &__form{
    display: block;
    width: 100%;
    height: 100%;
    &__group{
      width: 100%;
      margin-bottom: 16px;
    }
  }
  &__loading{
    width: 100%;
    height: 48px;
    padding: 12px;
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
    }
  }
  &__rotate{
    animation: rotation 1s linear infinite;
  }
}
</style>
