<template>
  <div class="MyPage" id="MyPage">
    <GlobalMessage/>
    <div class="Mypage__main">
      <div class="Mypage__to-public">
        <router-link to="/public"><font-awesome-icon icon="arrow-alt-circle-left"/></router-link>
      </div>
      <div class="Mypage__image">
        <img class="Mypage__image__img" :src="user.homeimage" alt="">
      </div>
      <!-- <div class="Mypage__logout" @click="logout">ログアウト</div> -->
      <div class="Mypage__container">
        <div class="Mypage__icon">
          <img class="Mypage__icon__img" :src="user.iconimage" alt="">
        </div>
        <div class="Mypage__settings">
          <router-link to="/settings" v-if="this.my_id === this.traget_id"><font-awesome-icon icon="edit"/></router-link>
        </div>
        <h2 class="Mypage__name">{{user.name}}</h2>
        <h2 class="Mypage__user_id">@{{user.user_id}}</h2>
        <div class="Mypage__introduction">
          {{user.introduction}}
        </div>
      </div>
    </div>
    <div class="PostSwitch">
      <div class="PostSwitch__button" @click="changeActive(0)" :class="{'active': isActive === 0}">
        <font-awesome-icon icon="clipboard-list"/>
      </div>
      <div class="PostSwitch__button" v-if="my_id === traget_id" @click="changeActive(1)" :class="{'active': isActive === 1}">
        <font-awesome-icon icon="clipboard-check"/>
      </div>
      <div class="PostSwitch__bar" :class="{other: my_id !== traget_id}" :style="{transform:tabBar}"></div>
    </div>
    <div class="Container Posted" v-show="isActive === 0" :class="{'active': isActive === 0}">
      <PostList :posts="posted" :isLoading="isLoading" @reload="loadPosts()"></PostList>
    </div>
    <div class="Container Voted" v-show="isActive === 1" :class="{'active': isActive === 1}">
      <PostList :posts="voted" :isLoading="isLoading" @reload="loadPosts()"></PostList>
    </div>
    <div class="Mypage__loading" v-if="isLoading">
      <font-awesome-icon icon="spinner" class="Public__loading__icon"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import GlobalMessage from '@/components/GlobalMessage.vue'
import PostList from '@/components/PostList.vue'

import api from '@/services/api'
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'MyPage',
  components: {
    GlobalMessage,
    PostList
  },
  data: function () {
    return {
      isActive: 0,
      isLoading: true,
      traget_id: '',
      user: {},
      postedTargetId: '',
      postedTargetHeight: -1,
      votedTargetId: '',
      votedTargetHeight: -1,
      posted: [],
      voted: []
    }
  },
  watch: {
    '$route' (to, from) {
      // ルートの変更の検知...他の人のマイページへ移る時
      // console.log('route')
      this.initComponent()
      // console.log('after init')
    }
  },
  methods: {
    changeActive (num) {
      this.isActive = num
    },
    logout () {
      var result = window.confirm('ログアウトしてよろしいですか？')
      if (result) {
        store.dispatch('auth/logout')
        store.dispatch('message/setInfoMessage', { message: 'ログアウトしました' })
        this.$router.replace('/login')
      }
    },
    async initPosts (targetList, posts) {
      await posts.forEach(item => {
        item.view = 0
        item.sort = 0
        item.isLoading = false
        item.options.sort((a, b) => {
          return a.select_num < b.select_num ? -1 : 1
        })
      })
      if (targetList) this.posted = posts
      else this.voted = posts
    },
    async loadPostedMore () {
      if (this.scrollTop() < this.postedTargetHeight) return
      if (this.postedTargetHeight < 0) return
      await (this.postedTargetHeight = -1)// 読み込み中のスクロールで発火するのを避けるためにlockをかける
      var nextPostId = this.posted[this.posted.length - 1].post_id
      this.isLoading = true
      await api.get('/api/v1/users/' + this.my_id + '/posted/?pid=' + nextPostId)
        .then((response) => {
          var posts = response.data.posts
          posts.forEach(item => {
            item.view = 0
            item.sort = 0
            item.isLoading = false
            item.options.sort((a, b) => {
              return a.select_num < b.select_num ? -1 : 1
            })
          })
          this.posted = this.posted.concat(posts)
          this.postedTargetId = posts.length === 10 ? posts[6].post_id : false
        })
        .then(() => {
          this.isLoading = false
        })
      if (this.postedTargetId) this.postedTargetHeight = document.getElementById(this.postedTargetId).offsetTop - window.innerHeight // 次の高さを計測
    },
    async loadVotedMore () {
      if (this.scrollTop() < this.votedTargetHeight) return
      if (this.votedTargetHeight < 0) return
      await (this.votedTargetHeight = -1)// 読み込み中のスクロールで発火するのを避けるためにlockをかける
      var nextPostId = this.voted[this.voted.length - 1].post_id
      this.isLoading = true
      await api.get('/api/v1/users/' + this.my_id + '/voted/?pid=' + nextPostId)
        .then((response) => {
          var posts = response.data.posts
          posts.forEach(item => {
            item.view = 0
            item.sort = 0
            item.isLoading = false
            item.options.sort((a, b) => {
              return a.select_num < b.select_num ? -1 : 1
            })
          })
          this.voted = this.voted.concat(posts)
          this.votedTargetId = posts.length === 10 ? posts[6].post_id : false
        })
        .then(() => {
          this.isLoading = false
        })
      if (this.votedTargetId) this.votedTargetHeight = document.getElementById(this.votedTargetId).offsetTop - window.innerHeight // 次の高さを計測
    },
    scrollTriggers () {
      if (this.isActive === 0) this.loadPostedMore()
      else this.loadVotedMore()
    },
    scrollTop () {
      return document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop : document.body.scrollTop
    },
    async loadPosts () {
      this.posted = []
      this.voted = []
      this.isLoading = true
      await api.get('/api/v1/users/' + this.traget_id + '/posted/')
        .then(async (response) => {
          var posts = response.data.posts
          await this.initPosts(true, posts)
          await (this.postedTargetId = posts.length === 10 ? posts[6].post_id : false) // 自動読み込みが可能かどうかを判定（10件ずつ読み込む）
          if (this.postedTargetId) this.postedTargetHeight = document.getElementById(this.postedTargetId).offsetTop - window.innerHeight // 次の高さを計測
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'production') console.log(error)
        })
      await api.get('/api/v1/users/' + this.traget_id + '/voted/')
        .then(async (response) => {
          if (response.status === 200) {
            var posts = response.data.posts
            await this.initPosts(false, response.data.posts)
            await (this.votedTargetId = posts.length === 10 ? posts[6].post_id : false) // 自動読み込みが可能かどうかを判定（10件ずつ読み込む）
            if (this.votedTargetId) this.votedTargetHeight = document.getElementById(this.votedTargetId).offsetTop - window.innerHeight // 次の高さを計測
          }
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'production') console.log(error)
        })
      this.isLoading = false
    },
    async initComponent () {
      // this.traget_id = this.$route.params.user_id
      this.traget_id = process.env.NODE_ENV === 'test'
        ? 'sample1'
        : this.$route.params.user_id
      this.isLoading = true
      this.isActive = 0
      this.posted = []
      this.voted = []
      await api.get('/api/v1/users/' + this.traget_id + '/')
        .then((response) => {
          this.user = response.data
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'production') console.log(error)
        })
      // 自分の情報を再取得 #229 に理由 => ページ増えたら管理大変になるし、routerでやってもいいかな？
      if (this.my_id === this.traget_id) store.dispatch('user/load', { user_id: store.getters['auth/username'] })
      // TODO error 処理
      this.loadPosts()
      this.isLoading = false
      window.addEventListener('scroll', this.scrollTriggers)// scrollによるトリガーの追加
    }
  },
  computed: {
    tabBar () {
      return 'translateX(' + (100 * this.isActive) + '%)'
    },
    ...mapGetters('user', {
      'my_id': 'user_id'
    })
  },
  created () {
    this.initComponent()
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollTriggers)
  }
}
</script>

<style lang="scss">
@import '@/assets/common.scss';
.Mypage{
  padding-bottom: 72px;
  &__h1{
    display: none;
  }
  &__to-public{
    width: 28px;
    height: 28px;
    border-radius: 50%;
    padding: 2px;
    // background: black;
    background: $color-main;
    color: white;
    // background: $color-main;
    position: absolute;
    left: 16px;
    top: 16px;
    a{
      display: block;
      color: white;
      &:hover{
        color: white;
      }
    }
    svg{
      margin: 0 auto;
      font-size: 24px;
      display: block;
    }
  }
  &__main{
    position: relative;
    background: white;
  }
  &__image{
    width: 100%;
    max-width: 700px;
    height: 50vw;
    background: #eee;
    overflow: hidden;
    @include media(700) {
      height: 350px;
    }
    &__img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__container{
    position: relative;
    width: 100%;
    max-width: 700px;
  }
  &__icon{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 50px);
    top: -100px;
    background: white;
    overflow: hidden;
    border: solid 3px white;
    &__img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__settings{
    width: 24px;
    height: 24px;
    background: white;
    // border: solid 2px #BFE4E2;
    position: absolute;
    right: 24px;
    top: -18px;
    a{
      display: block;
      height: 24px;
      padding: 2px 0;
      color: $color-main;
      &:hover{
        color: $color-main;
      }
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 20px;
    }
  }
  &__name{
    margin: 42px 0 0;
    padding: 0 16px;
    text-align: center;
    font-size: 24px;
  }
  &__user_id{
    margin: 0;
    font-size: 14px;
    padding: 0 16px;
    text-align: center;
    color: #666;
    color: $color-main;
  }
  &__introduction{
    margin: 16px 0 0;
    font-size: 14px;
    color: #333;
    padding: 0 16px;
    min-height: 32px;
    word-wrap: break-word;
  }
  &__loading{
    width: 100%;
    height: 50px;
    padding: 13px;
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
      animation: rotation 1s linear infinite;
    }
  }
}
.PostSwitch{
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  background: white;
  position: relative;
  &__button{
    opacity: 0.5;
    width: 100%;
    height: 48px;
    padding: 12px 0;
    color: $color-main;
    transition: .3s ease-in-out;
    cursor: pointer;
    &.active{
      opacity: 1;
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
    }
  }
  &__bar{
    width: 50%;
    height: 2px;
    background: $color-main;
    position: absolute;
    bottom: 0;
    transition: .3s ease-in-out;
    &.other{
      width: 100%;
    }
  }
}
</style>
