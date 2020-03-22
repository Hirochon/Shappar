<template>
  <div id="login-page" class="Login">
    <GlobalMessage/>
    <!-- メインエリア -->
    <div class="Login__title">Shapparにログイン</div>
    <main class="Login__container">
      <div class="Login__loading" v-if="isLoading">
        <font-awesome-icon icon="spinner" class="Login__rotate"/>
      </div>
      <form class="Login__form" @submit.prevent="submitLogin">
        <div class="Login__form__group">
          <label class="Login__form__title" :class="{active: isActive === 0}">ユーザーID</label>
          <input class="Login__input" type="text" v-model="form.username" required
          :class="{active: isActive === 0}"
          @focus="isActive = 0"
          @blur="isActive = -1"/>
        </div>
        <div class="Login__form__group">
          <label class="Login__form__title" :class="{active: isActive === 1}">パスワード</label>
          <input class="Login__input" type="password" v-model="form.password" required
          :class="{active: isActive === 1}"
          @focus="isActive = 1"
          @blur="isActive = -1"/>
        </div>
        <div class="row text-center">
          <div class="col-sm-12">
            <!-- <b-button type="submit" class="Login__submit">ログイン</b-button> -->
            <button type="submit" class="Login__submit">ログイン</button>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import GlobalMessage from '@/components/GlobalMessage.vue'
export default {
  components: {
    GlobalMessage
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      pageName: 'ログインページ',
      isLoading: false,
      isActive: -1,
      error: {}
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
          // console.log(error.response.data)
          this.error = error
        })
        .then(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/common.scss';
.Login{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  &__container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 16px 0;
    margin-top: 24px;
    background: white;
    border-radius: 3px;
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
  &__title{
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 24px;
    background: $color-main;
    color: white;
    text-align: center;
    padding: 16px;
    letter-spacing: 1.2px;
  }
  &__form__title{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 20px;
    line-height: 12px;
    margin: 0;
    padding: 4px 16px;
    font-size: 12px;
    color: #999;
    &.active{
      color: $color-main;
    }
  }
  &__input{
    // margin-bottom: 16px;
    padding: 4px 16px;
    height: 32px;
    line-height: 24px;
    box-sizing: border-box;
    width: 100%;
    background: white;
    border-bottom: solid 1px #eee;
    &.active{
      border-color: $color-main;
    }
  }
  &__submit{
    padding: 8px;
    color: white;
    background: $color-main;
    border-radius: 4px;
  }
  &__rotate{
    animation: rotation 1s linear infinite;
  }
}
</style>
