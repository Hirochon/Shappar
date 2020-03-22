<template>
  <div class="Update" id="Update">
    <GlobalMessage/>
    <router-link class="Update__close" :to="'/mypage/'+ before_user_id + '/'"><font-awesome-icon icon="times"/></router-link>
    <div class="Update__image" :style="{width: width+'px',height: height+'px'}">
      <img :src="beforeHomeImage" alt="" id="homeimage">
      <label class="Update__image__mask" for="home_file"
        :style="{
          width: width+'px',height: height+'px',
          padding: height/2-10 + 'px 0'
        }"
        >
        <font-awesome-icon icon="camera"/>
      </label>
      <input class="Update__file" id="home_file" type="file" name="homeimage" @change="imageSelect(0, $event)">
    </div>
    <div class="Update__icon" :style="{top: height - 60 + 'px'}">
      <img :src="beforeIconImage" alt="" id="iconimage">
      <label class="Update__icon__mask" for="icon_file"><font-awesome-icon icon="camera"/></label>
      <input class="Update__file" id="icon_file" type="file" name="iconimage" @change="imageSelect(1, $event)">
    </div>
    <label class="Update__title" for="user_name">
      ユーザー名
      <span class="Update__num" :class="{hasError:!name.isValid}">{{name.length}}/18</span>
    </label>
    <input class="Update__input" id="user_name" v-model="name.value" type="text" placeholder="ユーザー名" @input="Validate(name,1,18)">
    <label class="Update__title" for="user_id">
      ユーザーID
      <span class="Update__num" :class="{hasError:!user_id.isValid}">{{user_id.length}}/18</span>
    </label>
    <input class="Update__input" id="user_id" v-model="user_id.value" type="text" placeholder="ユーザーID" @input="Validate(user_id,1,18)">
    <label class="Update__title" for="introduction">
      紹介文
      <span class="Update__num" :class="{hasError:!introduction.isValid}">{{introduction.length}}/150</span>
    </label>
    <textarea class="Update__introduction" id="introduction" v-model="introduction.value" cols="30" rows="5" placeholder="紹介文" @input="Validate(introduction,0,150)"></textarea>
    <div class="Update__submit" @click="updateUser()" :class="{hasError:!allValidate}">
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
      width: 0,
      height: 0,
      before_user_id: '',
      user_id: {
        value: '',
        length: 0,
        isValid: false
      },
      name: {
        value: '',
        length: 0,
        isValid: false
      },
      introduction: {
        value: '',
        length: 0,
        isValid: false
      },
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
      if (!this.allValidate) return
      if (this.user_id.value) params.append('user_id', this.user_id.value)
      if (this.name.value) params.append('name', this.name.value)
      params.append('introduction', this.introduction.value)
      if (this.iconimage) params.append('iconimage', this.iconimage)
      if (this.homeimage) params.append('homeimage', this.homeimage)
      api.patch('/api/v1/users/' + this.before_user_id + '/', params)
        .then(async (response) => {
          if (response.status === 200) {
            this.$store.dispatch('message/setInfoMessage', { message: '更新完了' })
            await this.$store.dispatch('auth/reload')// ここで一度更新してないとユーザーIDを変更した際にエラーが出る
            this.$router.replace('/mypage/' + store.getters['auth/username'])
          }
        })
    },
    Validate (option, min, max) {
      option.length = option.value.length
      option.isValid = (option.length >= min && option.length <= max)
      return option.isValid
    },
    resizeTriggers () {
      var area = document.getElementById('Update')
      this.width = area.clientWidth
      this.height = this.width / 2
    }
  },
  computed: {
    allValidate () {
      if (!this.user_id.isValid) return false
      if (!this.name.isValid) return false
      if (!this.introduction.isValid) return false
      return true
    }
  },
  created () {
    window.addEventListener('resize', this.resizeTriggers)
  },
  mounted: function () {
    this.before_user_id = store.getters['auth/username']
    this.user_id.value = this.before_user_id
    api.get('/api/v1/users/' + this.before_user_id + '/')
      .then((response) => {
        this.name.value = response.data.name
        this.introduction.value = response.data.introduction
        this.beforeHomeImage = response.data.homeimage
        this.beforeIconImage = response.data.iconimage
      })
      .then(() => {
        this.name.isValid = this.Validate(this.name, 1, 18)
        this.user_id.isValid = this.Validate(this.user_id, 1, 18)
        this.introduction.isValid = this.Validate(this.introduction, 0, 150)
      })
    var area = document.getElementById('Update')
    this.width = area.clientWidth
    this.height = this.width / 2
  },
  destroyed () {
    window.removeEventListener('resize', this.resizeTriggers)
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
    padding: 12px;
    background: none;
    color: white;
    z-index: 100;
    cursor: pointer;
    &:hover{
      color: white;
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
    }
  }
  &__image{
    position: relative;
    width: 100%;
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
      padding-top: calc(50% - 10px);
      margin: 0;
      background: rgba(0,0,0,0.5);
      color: white;
      cursor: pointer;
      svg{
        display: block;
        margin: 0 auto;
        font-size: 20px;
      }
    }
  }
  &__icon{
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 50px);
    background: white;
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
      width: 94px;
      height: 94px;
      padding: 37px 0;
      margin: 0;
      background: rgba(0,0,0,0.5);
      color: white;
      text-align: center;
      cursor: pointer;
      svg{
        display: block;
        margin: 0 auto;
        font-size: 20px;
      }
    }
  }
  &__file{
    display: none;
  }
  &__title{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 20px;
    line-height: 12px;
    margin: 0;
    padding: 4px 16px;
    font-size: 12px;
    color: #999;
  }
  &__num{
    // position: absolute;
    // bottom: 8px;
    // right: 48px;
    display: inline-block;
    width: 60px;
    height: 12px;
    line-height: 12px;
    font-size: 12px;
    border-radius: 6px;
    color: $color-main;
    text-align: center;
    &.hasError{
      color: $color-err;
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
    &.hasError{
      opacity: 0.5;
    }
  }
}
</style>
