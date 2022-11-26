<template>
  <div class="Drawer">
    <transition name="overlay">
      <div
        v-if="isOpen"
        class="Drawer__overlay"
        @click.stop="$emit('close')"
        @touchmove.stop.prevent
        @wheel.stop.prevent
      />
    </transition>
    <transition name="drawer">
      <div
        class="Drawer__container"
        :class="{open: isOpen}"
        @click.stop
        @touchmove.stop.prevent
        @wheel.stop.prevent
      >
        <div
          class="Drawer__close"
          @click="$emit('close')"
        >
          <font-awesome-icon icon="times" />
        </div>
        <div class="Drawer__wrapper">
          <router-link
            class="Drawer__icon"
            :to="'/mypage/'+ user.user_id + '/'"
          >
            <img
              class="Drawer__icon__img"
              :src="user.iconimage"
              alt=""
            >
          </router-link>
        </div>
        <div class="Drawer__wrapper">
          <div class="Drawer__name">
            {{ user.name }}
          </div>
          <div class="Drawer__user_id">
            @{{ user.user_id }}
          </div>
        </div>
        <div class="Drawer__wrapper">
          <router-link
            class="Drawer__settings"
            :to="'/mypage/'+ user.user_id + '/'"
          >
            マイページ
          </router-link>
        </div>
        <div class="Drawer__wrapper">
          <router-link
            class="Drawer__settings"
            to="/settings"
          >
            設定
          </router-link>
        </div>
        <div class="Drawer__wrapper">
          <div
            class="Drawer__logout"
            @click="logout()"
          >
            ログアウト
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import api from '@/services/api'
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'DrawerMenu',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    logout () {
      const result = window.confirm('ログアウトしてよろしいですか？')
      if (result) {
        store.dispatch('auth/logout')
        store.dispatch('user/logout')
        store.dispatch('message/setInfoMessage', { message: 'ログアウトしました' })
        this.$router.replace('/login')
      }
    }
  },
  computed: {
    // 1:storeのuserModule, 2:このコンポーネント内で使えるcomputed, 3:userModuleのgetters
    ...mapGetters('user', {
      user: 'getUser'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/common.scss';
.Drawer{
  z-index: 200;
  &__overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(black, 0.5);
    z-index: 200;
    cursor: pointer;
  }
  &__container{
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    max-width: 230px;
    height: 100%;
    padding-top: 20px;
    background: white;
    transform: translateX(-100%);
    opacity: 0;
    transition: .3s ease-in-out;
    z-index: 200;
    @include media(1200) {
      transform: translateX(-246px);
      left: auto;
      opacity: 1;
    }
    &.open{
      transform: translateX(0);
      opacity: 1;
    }
  }
  &__header{
    position: relative;
    width: 100%;
    height: 48px;
    line-height: 32px;
    padding: 8px;
    font-size: 24px;
    color: #888;
    text-align: center;
    // border-bottom: solid 1px #ccc;
  }
  &__close{
    cursor: pointer;
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    padding: 4px;
    text-align: center;
    @include media(1200) {
      display: none ;
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
    }
  }
  &__wrapper{
    padding: 8px 16px;
    // &:first-child{
    //   margin-top: 20px;
    // }
    // border-bottom: solid 1px #eee;
  }
  &__icon{
    display: block;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: white;
    color: white;
    overflow: hidden;
    &__img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__name{
    // text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  &__user_id{
    margin: 0;
    font-size: 18px;
    // text-align: center;
    color: #666;
    color: $color-main;
  }
  &__logout{
    cursor: pointer;
    color: $color-err;
  }
  &__settings{
    display: block;
    color: $color-sub;
    &:hover{
      color: $color-sub;
    }
  }
}
.overlay-enter-active,.doverlayleave-active{
  transition: .3s ease-in-out;
}
.overlay-enter,.overlay-leave-to{
  z-index: -1;
  opacity: 0;
}
.drawer-enter-active,.drawer-leave-active{
  transition: .3s ease-in-out;
}
.drawer-enter,.drawer-leave-to{
  transform: translateX(-100%);
  opacity: 0;
}
</style>
