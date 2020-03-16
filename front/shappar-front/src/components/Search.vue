<template>
  <div class="Search">
    <DrawerMenu :user="user"/>
    <form action="" class="Search__form" @submit.prevent="getPost">
      <label for="text-box" class="Search__label">検索</label>
      <input type="text" id="text-box" class="Search__input" v-model="childQuery">
      <div class="Search__submit"><font-awesome-icon icon="search" @click="getPost"/></div>
    </form>
    <div class="Search__button">
      <font-awesome-icon icon="ellipsis-h" @click="isMenuOpen = !isMenuOpen"/>
      <div class="Search__menu" :class="{on: isMenuOpen}">
        <div class="Search__menu__item"><router-link to="/settings">設定</router-link></div>
        <div class="Search__menu__item logout" @click="logout()">ログアウト</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import DrawerMenu from '@/components/DrawerMenu.vue'
export default {
  name: 'Search',
  components: {
    DrawerMenu
  },
  props: {
    query: {
      type: String
    }
  },
  data () {
    return {
      childQuery: '',
      user_id: '',
      user: {},
      isMenuOpen: false
    }
  },
  methods: {
    getPost () {
      this.$parent.query = this.childQuery
      this.$emit('search')
    },
    logout () {
      var result = window.confirm('ログアウトしてよろしいですか？')
      if (result) {
        this.$store.dispatch('auth/logout')
        this.$store.dispatch('message/setInfoMessage', { message: 'ログアウトしました' })
        this.$router.replace('/login')
      }
    }
  },
  created () {
    this.user_id = this.$store.state.auth.username
    api.get('/api/v1/users/' + this.user_id)
      .then((response) => {
        this.user = response.data
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/common.scss';
.Search{
  position: fixed;
  top: 8px;
  margin-left: 16px;
  display: flex;
  width: calc(100% - 32px);
  max-width: 668px;
  justify-content: space-between;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(black, 0.16);
  background: rgba(255,255,255,1);
  z-index: 100;
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
    padding: 4px;
    border-radius: 50%;
    background: $color-main;
    color: white;
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
        color: red;
      }
    }
  }
}
</style>
