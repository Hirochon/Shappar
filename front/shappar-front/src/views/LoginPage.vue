<template>
  <div id="login-page" class="Login">
    <GlobalMessage/>
    <!-- メインエリア -->
    <div class="Login__header">
      <h1 class="Login__shappar">
        <router-link to="/home">
          Shappar
        </router-link>
      </h1>
    </div>
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
      <div class="Login__submit test" @click="testUserLogin()">テストユーザーでログイン</div>
    </main>
    <div class="Login__signup">
      <a href="http://localhost:8000/accounts/signup/">アカウントを作成</a>
    </div>
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
    },
    testUserLogin () {
      this.isLoading = true
      this.$store.dispatch('auth/login', {
        username: 'sample',
        password: 'shappar1'
      })
        .then(() => {
          // console.log('Login succeeded.')
          this.$store.dispatch('message/setInfoMessage', { message: 'ログインしました。' })
          // クエリ文字列に「next」がなければ、ホーム画面へ
          const next = this.$route.query.next || '/'
          this.$router.replace(next)
        })
        .catch(error => {
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
  padding-top: 64px;
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
  &__header{
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 700px;
    height: 52px;
    // margin-bottom: 24px;
    background: $color-main;
    padding: 8px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
    z-index: 100;
  }
  &__links{
    display: flex;
  }
  &__shappar{
    margin: 0;
    padding: 4px 0;
    font-size: 24px;
    letter-spacing: 1.2px;
    text-align: center;
    font-weight: bold;
    a{
      color: white;
      &:hover{
        color: white;
        text-decoration: none;
      }
    }
  }
  &__link{
    margin-left: 4px;
    padding: 4px;
    // box-sizing: border-box;
    &.signup{
      border: solid 2px white;
      border-radius: 3px;
      padding: 2px 4px;
      cursor: pointer;
    }
    a{
      display: block;
      color: white;
      font-size: 13px;
      line-height: 30px;
      &:hover{
        color: white;
        text-decoration: none;
      }
    }
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
    &.test{
      margin-top: 24px;
      background: $color-sub;
    }
  }
  &__rotate{
    animation: rotation 1s linear infinite;
  }
  &__signup{
    margin: 8px 0;
    a{
      color: $color-sub;
      &:hover{
        color: $color-sub;
      }
    }
  }
}
</style>
