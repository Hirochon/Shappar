<template>
  <div class="Search">
    <div
      class="Search__drawer-switch disp"
      @click="$emit('drawerOpen')"
    >
      <img
        class="Search__drawer-switch__img"
        :src="user.iconimage"
        alt=""
      >
    </div>
    <div class="Search__drawer-switch none">
      <img
        :src="user.iconimage"
        alt=""
      >
    </div>
    <div
      v-if="user.isRanking"
      class="Search__rank"
    >
      投票数ランキング
    </div>
    <form
      v-else
      class="Search__form"
      @submit.prevent="getPost()"
    >
      <label
        for="text-box"
        class="Search__label"
      >検索</label>
      <input
        id="text-box"
        v-model="childQuery"
        type="text"
        class="Search__input"
      >
      <div
        class="Search__submit"
        @click="getPost()"
      >
        <font-awesome-icon icon="search" />
      </div>
    </form>
    <div
      class="Search__button"
      :class="{active: user.isRanking}"
      @click="changeRanking()"
    >
      <font-awesome-icon icon="crown" />
      <!-- <font-awesome-icon icon="crown" @click="isMenuOpen = !isMenuOpen"/> -->
      <!-- <div class="Search__menu" :class="{on: isMenuOpen}">
        <div class="Search__menu__item"><router-link to="/settings">設定</router-link></div>
        <div class="Search__menu__item logout" @click="logout()">ログアウト</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Search',
  components: {
  },
  props: {
    query: {
      type: String
    }
  },
  data () {
    return {
      childQuery: '',
      isMenuOpen: false
    }
  },
  methods: {
    getPost () {
      this.$parent.query = this.childQuery
      this.$emit('search')
    },
    logout () {
      const result = window.confirm('ログアウトしてよろしいですか？')
      if (result) {
        this.$store.dispatch('auth/logout')
        this.$store.dispatch('message/setInfoMessage', { message: 'ログアウトしました' })
        this.$router.replace('/login')
      }
    },
    changeRanking () {
      this.$store.state.user.isRanking = !this.$store.state.user.isRanking
      this.$emit('changeRanking')
      // this.$store.dispatch('message/setInfoMessage', { message: 'ランキングモード' })
    }
  },
  computed: {
    // 1:storeのuserModule, 2:このコンポーネント内で使えるcomputed, 3:userModuleのgetters
    ...mapGetters('user', {
      user: 'getUser'
    })
    // 以下の方法でも取って来れるよな stateとgettersって何の差があるのか？
    // user () {
    //   return this.$store.state.user
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/common.scss';
.Search{
  position: fixed;
  // top: 8px;
  top: 0;
  // margin-left: 16px;
  display: flex;
  // width: calc(100% - 32px);
  width: 100%;
  max-width: 700px;
  // justify-content: space-between;
  justify-content: space-around;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(black, 0.16);
  background: rgba(255,255,255,1);
  z-index: 100;
  &__drawer-switch{
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: white;
    color: white;
    overflow: hidden;
    cursor: pointer;
    &.none{
      display: none;
    }
    @include media(1200) {
      display: none;
      &.none{
        display: block;
        opacity: 0;
        cursor: auto;
      }
    }
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__rank{
    width: 70%;
    height: 32px;
    line-height: 24px;
    padding: 4px 12px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: map-get($color-material, '01');
  }
  &__form{
    position: relative;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    width: 70%;
    height: 32px;
    padding: 4px 12px;
    border-radius: 16px;
    border: solid 2px $color-main;
    background: #fff;
  }
  &__label{
    display: none;
  }
  &__input{
    margin-right: 24px;
    font-size: 16px;
    width: 100%;
  }
  &__submit{
    position: absolute;
    top: 0;
    right: 4px;
    width: 28px;
    height: 28px;
    padding: 5px;
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    color: $color-main;
    transition: .3s ease-in-out;
    svg{
      display: block;
      margin: 0 auto;
      font-size: 18px;
    }
    &:hover{
      background: rgba($color-main,0.5);
    }
  }
  &__filter{
    margin-left: 8px;
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: #eee;
  }
  &__icon{
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: $color-main;
    color: white;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__button{
    position: relative;
    display: block;
    width: 32px;
    height: 32px;
    padding: 4px 0;
    border-radius: 50%;
    background: white;
    color: #999;
    cursor: pointer;
    // @include media-1200 {
    //   display: none;
    // }
    &.active{
      color: map-get($color-material, '01');
    }
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
    }
  }
  &__menu{
    display: none;
    position: absolute;
    top: 40px;
    right: -8px;
    width: 100px;
    background: #ccc;
    border-radius: 0 0 3px 3px;
    transition: .3s ease-in-out;
    &.on{
      display: block;
    }
    &__item{
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: 14px;
      &.logout{
        color: $color-err;
      }
    }
  }
}
</style>
