<template>
  <div class="Update">
    <GlobalMessage/>
    <router-link class="Update__close" to="/mypage"><font-awesome-icon icon="times"/></router-link>
    <div class="Update__image">
      <img :src="beforeHomeImage" alt="" id="homeimage">
      <label class="Update__image__mask" for="home_file"><font-awesome-icon icon="camera"/></label>
      <input class="Update__file" id="home_file" type="file" name="homeimage" @change="imageSelect(0, $event)">
    </div>
    <div class="Update__icon">
      <img :src="beforeIconImage" alt="" id="iconimage">
      <label class="Update__icon__mask" for="icon_file"><font-awesome-icon icon="camera"/></label>
      <input class="Update__file" id="icon_file" type="file" name="iconimage" @change="imageSelect(1, $event)">
    </div>
    <label class="Update__title" for="user_name">ユーザー名</label>
    <input class="Update__input" id="user_name" v-model="name" type="text" placeholder="ユーザー名">
    <label class="Update__title" for="user_id">ユーザーID</label>
    <input class="Update__input" id="user_id" v-model="user_id" type="text" placeholder="ユーザーID">
    <label class="Update__title" for="introduction">紹介文</label>
    <textarea class="Update__introduction" id="introduction" v-model="introduction" cols="30" rows="5" placeholder="紹介文"></textarea>
    <div class="Update__submit" @click="updateUser()">
      保存する
    </div>
  </div>
</template>

<script>
import store from '../store'
import GlobalMessage from '@/components/GlobalMessage.vue'

import api from '@/services/api'
export default {
  name: 'updateUser',
  components: {
    GlobalMessage
  },
  data: function () {
    return {
      before_user_id: '',
      user_id: '',
      name: '',
      introduction: '',
      iconimage: null,
      homeimage: null,
      beforeHomeImage: null,
      beforeIconImage: null
    }
  },
  methods: {
    imageSelect (icon, e) {
      var file = e.target.files[0]
      const reader = new FileReader()
      if (icon) {
        this.iconimage = e.target.files[0]
        reader.onload = function (e) {
          const img = document.getElementById('iconimage')
          img.src = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.homeimage = e.target.files[0]
        reader.onload = function (e) {
          const img = document.getElementById('homeimage')
          img.src = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    updateUser () {
      var params = new FormData()
      if (this.user_id) params.append('user_id', this.user_id)
      if (this.name) params.append('name', this.name)
      if (this.introduction) params.append('introduction', this.introduction)
      if (this.iconimage) params.append('iconimage', this.iconimage)
      if (this.homeimage) params.append('homeimage', this.homeimage)
      api.patch('/api/v1/users/' + this.before_user_id + '', params)
        .then((response) => {
          if (response.status === 200) {
            this.$store.dispatch('message/setInfoMessage', { message: '更新完了' })
            this.$router.replace('/mypage')
          }
        })
    }
  },
  created: function () {
    this.before_user_id = store.getters['auth/username']
    this.user_id = this.before_user_id
    api.get('/api/v1/users/' + this.before_user_id)
      .then((response) => {
        this.name = response.data.name
        this.introduction = response.data.introduction
        this.beforeHomeImage = response.data.homeimage
        this.beforeIconImage = response.data.iconimage
      })
  }
}
</script>

<style lang="scss">
@import '@/assets/common.scss';
.Update{
  position: relative;
  background: white;
  &__close{
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 48px;
    line-height: 48px;
    background: none;
    text-align: center;
    font-size: 24px;
    color: white;
    z-index: 100;
    cursor: pointer;
    &:hover{
      color: white;
    }
  }
  &__image{
    position: relative;
    width: 100%;
    height: 200px;
    margin-bottom: 48px;
    background: #eee;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &__mask{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      line-height: 200px;
      background: rgba(0,0,0,0.5);
      font-size: 20px;
      color: white;
      text-align: center;
      cursor: pointer;
    }
  }
  &__icon{
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 50px);
    top: 140px;
    background: #BFE4E2;
    overflow: hidden;
    border: solid 3px white;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &__mask{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      line-height: 100px;
      background: rgba(0,0,0,0.5);
      font-size: 20px;
      color: white;
      text-align: center;
      cursor: pointer;
    }
  }
  &__file{
    display: none;
  }
  &__title{
    display: block;
    width: 100%;
    height: 20px;
    line-height: 12px;
    margin: 0;
    padding: 4px 16px;
    font-size: 12px;
    color: #999;
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
  }
  &__introduction{
    display: block;
    padding: 4px 16px;
    width: 100%;
    line-height: 24px;
    box-sizing: border-box;
    background: white;
    resize: none;
    border-bottom: solid 1px #eee;
  }
  &__submit{
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: white;
    text-align: center;
    background: $color-main;
    cursor: pointer;
  }
}
</style>
