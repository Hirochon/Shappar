<template>
  <div class="HomePage">
    <GlobalMessage />
    <!-- メインエリア -->
    <div class="HomePage__header">
      <h1 class="HomePage__shappar">
        Shappar
      </h1>
      <div class="HomePage__links">
        <div
          class="HomePage__link signup"
          @click="toSignUp()"
        >
          <a>アカウント作成</a>
        </div>
        <div class="HomePage__link">
          <router-link to="/login">
            ログイン
          </router-link>
        </div>
      </div>
    </div>
    <div class="HomePage__container">
      <div class="HomePage__catch">
        気軽にアンケートを<br>集めよう！
      </div>
      <p class="HomePage__description">
        SNS型アンケートサービス
      </p>
      <div
        class="HomePage__button"
        @click="toSignUp()"
      >
        アカウントを作成
      </div>
      <div class="HomePage__links-inner">
        <div class="HomePage__link-inner">
          <a href="#introduction">Shapparとは？</a>
        </div>
        <div class="HomePage__link-inner">
          <a href="#feature">機能紹介</a>
        </div>
      </div>
    </div>
    <div class="HomePage__container white">
      <div class="HomePage__phone-img top">
        <img
          src="https://d3ms402csqm2a0.cloudfront.net/static/img/images/home_003.jpg"
          alt=""
        >
      </div>
      <h2
        id="introduction"
        class="HomePage__title"
      >
        Shapparとは？
      </h2>
      <!-- <img class="HomePage__full-img" src="https://d3ms402csqm2a0.cloudfront.net/static/img/images/home_001.jpg" alt=""> -->
      <img
        class="HomePage__img"
        src="https://d3ms402csqm2a0.cloudfront.net/static/img/images/home_002.png"
        alt=""
      >
      <div class="HomePage__card">
        <div class="HomePage__card__title">
          かんたんに質問
        </div>
        <div class="HomePage__card__detail">
          ちょっとしたアンケートでも
        </div>
        <div class="HomePage__card__detail">
          直感的に作れる
        </div>
      </div>
      <div class="HomePage__card">
        <div class="HomePage__card__title">
          ワンタップで投票
        </div>
        <div class="HomePage__card__detail">
          分かりやすい使い方で
        </div>
        <div class="HomePage__card__detail">
          次々に投票できる
        </div>
      </div>
      <div class="HomePage__card">
        <div class="HomePage__card__title">
          結果が集まる！
        </div>
        <div class="HomePage__card__detail">
          質問や投票した結果は
        </div>
        <div class="HomePage__card__detail">
          その場で確認できる
        </div>
      </div>
      <h2
        id="feature"
        class="HomePage__title"
      >
        機能紹介
      </h2>
      <div class="HomePage__phone-img">
        <img
          src="https://d3ms402csqm2a0.cloudfront.net/static/img/images/home_004.jpg"
          alt=""
        >
      </div>
      <div class="HomePage__card">
        <div class="HomePage__card__title">
          アンケート結果の詳細
        </div>
        <div class="HomePage__card__detail">
          投票者の情報を集めて
        </div>
        <div class="HomePage__card__detail">
          結果をグラフで表示
        </div>
      </div>
      <div class="HomePage__phone-img">
        <img
          src="https://d3ms402csqm2a0.cloudfront.net/static/img/images/home_005.jpg"
          alt=""
        >
      </div>
      <div class="HomePage__card">
        <div class="HomePage__card__title">
          ランキング機能
        </div>
        <div class="HomePage__card__detail">
          いま話題の投稿を確認できる
        </div>
      </div>
    </div>
    <div
      class="HomePage__button bottom"
      @click="toSignUp()"
    >
      さっそく始めてみる
    </div>
  </div>
</template>

<script>
import GlobalMessage from '@/components/GlobalMessage.vue'
export default {
  components: {
    GlobalMessage
  },
  methods: {
    toSignUp () {
      const path = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://shappar.site'
      window.location.href = path + '/accounts/signup/'
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/common.scss';
.HomePage{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
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
    color: white;
  }
  &__link{
    margin-left: 4px;
    padding: 4px;
    // box-sizing: border-box;
    &.signup{
      border: solid 2px white;
      border-radius: 3px;
      padding: 2px 4px;
      color: white;
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
  &__links-inner{
    padding: 24px 0 0;
  }
  &__link-inner{
    margin: 8px 0;
    text-align: center;
    a{
      color: white;
      text-decoration: underline;
      font-size: 18px;
      &:hover{
        color: white;
      }
    }
  }
  &__container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-bottom: 100px;
    background: $color-main;
    // border-radius: 3px;
    &.white{
      background: white;
      padding-bottom: 50px;
    }
  }
  &__catch{
    padding: 152px 0 32px;
    font-size: 32px;
    font-weight: bold;
    color: white;
    text-align: center;
  }
  &__button{
    cursor: pointer;
    width: 60%;
    height: 40px;
    line-height: 24px;
    padding: 8px;
    text-align: center;
    font-size: 16px;
    color: white;
    background: lightcoral;
    border-radius: 20px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
    a{
      color: white;
      &:hover{
        color: white;
      }
    }
    &.bottom{
      width: 100%;
      border-radius: 0;
      height: 80px;
      line-height: 80px;
      padding: 0;
      font-size: 20px;
      a:hover{
        text-decoration: none;
      }
    }
  }
  &__title{
    margin: 48px 0;
  }
  &__description{
    background: white;
    // color: white
    color: $color-main;
    height: 48px;
    line-height: 48px;
    padding: 0 24px;
    margin: 0 0 80px;
    border-radius: 4px;
    font-size: 20px;
  }
  &__full-img{
    width: 100%;
  }
  &__mid-img{
    width: 80%;
  }
  &__phone-img{
    &.top{
      position: relative;
      top: -50px;
    }
    width: 80%;
    max-width: 300px;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border: solid 12px #fff;
    padding-bottom: 12px;
    margin-bottom: 24px;
    img{
      width: 100%;
    }
  }
  &__img{
    display: block;
    height: 250px;
    margin-bottom: 48px;
  }
  &__card{
    width: calc(100% - 32px);
    margin-bottom: 24px;
    border-radius: 8px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
    &__title{
      width: 100%;
      height: 80px;
      line-height: 80px;
      margin-bottom: 16px;
      border-radius: 8px 8px 0 0 ;
      color: white;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      background: $color-main;
    }
    &__detail{
      text-align: center;
      width: 100%;
      height: 32px;
      line-height: 32px;
      &:last-child{
        margin-bottom: 16px;
      }
    }
  }
}
.spacer{
  width: 32px;
  height: 32px;
  display: inline-block;
}
</style>
