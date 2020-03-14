<template>
  <div class="MyPage">
    <GlobalMessage/>
    <h1 class="Mypage__h1">{{user.user_id}} | Mypage</h1>
    <div class="Mypage__main">
      <div class="Mypage__to-public">
        <router-link to="/public"><font-awesome-icon icon="arrow-alt-circle-left"/></router-link>
      </div>
      <div class="Mypage__image">
        <img :src="user.homeimage" alt="">
      </div>
      <div class="Mypage__icon">
        <img :src="user.iconimage" alt="">
      </div>
      <div class="Mypage__settings">
        <router-link to="/settings"><font-awesome-icon icon="edit"/></router-link>
      </div>
      <!-- <div class="Mypage__logout" @click="logout">ログアウト</div> -->
      <h2 class="Mypage__name">{{user.name}}</h2>
      <h2 class="Mypage__user_id">@{{user.user_id}}</h2>
      <div class="Mypage__introduction">
        {{user.introduction}}
      </div>
    </div>
    <div class="PostSwitch">
      <div class="PostSwitch__button" @click="changeActive(0)" :class="{'active': isActive === 0}">
        過去の投稿
      </div>
      <div class="PostSwitch__button" @click="changeActive(1)" :class="{'active': isActive === 1}">
        過去の投票
      </div>
      <div class="PostSwitch__bar" :style="{transform:tabBar}"></div>
    </div>
    <div class="Container" v-show="isActive === 0">
      <PostList :posts="posted" :unique_id="unique_id"></PostList>
    </div>
    <div class="Container" v-show="isActive === 1">
      <PostList :posts="voted" :unique_id="unique_id"></PostList>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import GlobalMessage from '@/components/GlobalMessage.vue'
import PostList from '@/components/PostList.vue'

import api from '@/services/api'
export default {
  name: 'MyPage',
  components: {
    GlobalMessage,
    PostList
  },
  data: function () {
    return {
      unique_id: '',
      user_id: '',
      isActive: 0,
      user: {},
      postedTargetId: '',
      postedTargetHeight: 0,
      votedTargetId: '',
      votedTargetHeight: 0,
      posted: [],
      voted: []
    }
  },
  methods: {
    changeActive (num) {
      this.isActive = num
    },
    logout () {
      var result = window.confirm('ログアウトしてよろしいですか？')
      if (result) {
        this.$store.dispatch('auth/logout')
        this.$store.dispatch('message/setInfoMessage', { message: 'ログアウトしました' })
        this.$router.replace('/login')
      }
    },
    async initPosts (targetList, posts) {
      await posts.forEach(item => {
        item.view = 0
        item.sort = 0
        item.options.sort((a, b) => {
          return a.select_num < b.select_num ? -1 : 1
        })
      })
      // targetList = posts
      if (targetList) this.posted = posts
      else this.voted = posts
      // this.posts = posts
    },
    async loadPostedMore () {
      if (this.scrollTop() < this.postedTargetHeight) return
      if (this.postedTargetHeight < 0) return
      await (this.postedTargetHeight = -1)// 読み込み中のスクロールで発火するのを避けるためにlockをかける
      var nextPostId = this.posted[this.posted.length - 1].post_id
      await api.get('/api/v1/users/' + this.user_id + '/posted/?pid=' + nextPostId)
        .then((response) => {
          var posts = response.data.posts
          posts.forEach(item => {
            item.view = 0
            item.sort = 0
            item.options.sort((a, b) => {
              return a.select_num < b.select_num ? -1 : 1
            })
          })
          this.posted = this.posted.concat(posts)
          this.postedTargetId = posts.length === 10 ? posts[6].post_id : false
        })
      if (this.postedTargetId) this.postedTargetHeight = document.getElementById(this.postedTargetId).offsetTop // 次の高さを計測
    },
    async loadVotedMore () {
      if (this.scrollTop() < this.votedTargetHeight) return
      if (this.votedTargetHeight < 0) return
      await (this.votedTargetHeight = -1)// 読み込み中のスクロールで発火するのを避けるためにlockをかける
      var nextPostId = this.voted[this.voted.length - 1].post_id
      await api.get('/api/v1/users/' + this.user_id + '/voted/?pid=' + nextPostId)
        .then((response) => {
          var posts = response.data.posts
          posts.forEach(item => {
            item.view = 0
            item.sort = 0
            item.options.sort((a, b) => {
              return a.select_num < b.select_num ? -1 : 1
            })
          })
          this.voted = this.voted.concat(posts)
          this.votedTargetId = posts.length === 10 ? posts[6].post_id : false
        })
      if (this.votedTargetId) this.votedTargetHeight = document.getElementById(this.votedTargetId).offsetTop // 次の高さを計測
    },
    scrollTriggers () {
      if (this.isActive === 0) this.loadPostedMore()
      else this.loadVotedMore()
    },
    scrollTop () {
      return document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop : document.body.scrollTop
    }
  },
  computed: {
    tabBar () {
      return 'translateX(' + (100 * this.isActive) + '%)'
    }
  },
  created () {
    this.unique_id = this.$store.state.auth.unique_id
    this.user_id = this.$store.state.auth.username
    api.get('/api/v1/users/' + this.user_id + '/')
      .then((response) => {
        this.user = response.data
      })
    api.get('/api/v1/users/' + this.user_id + '/posted/')
      .then(async (response) => {
        var posts = response.data.posts
        await this.initPosts(true, posts)
        await (this.postedTargetId = posts.length === 10 ? posts[6].post_id : false) // 自動読み込みが可能かどうかを判定（10件ずつ読み込む）
        if (this.postedTargetId) this.postedTargetHeight = document.getElementById(this.postedTargetId).offsetTop // 次の高さを計測
      })
    api.get('/api/v1/users/' + this.user_id + '/voted/')
      .then(async (response) => {
        var posts = response.data.posts
        await this.initPosts(false, response.data.posts)
        await (this.votedTargetId = posts.length === 10 ? posts[6].post_id : false) // 自動読み込みが可能かどうかを判定（10件ずつ読み込む）
        if (this.votedTargetId) this.votedTargetHeight = document.getElementById(this.votedTargetId).offsetTop // 次の高さを計測
      })
    window.addEventListener('scroll', this.scrollTriggers)// scrollによるトリガーの追加
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
    height: 200px;
    background: #eee;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__icon{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 50px);
    top: 140px;
    background: $color-main;
    overflow: hidden;
    border: solid 3px white;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__settings{
    width: 24px;
    height: 24px;
    text-align: center;
    background: white;
    // border: solid 2px #BFE4E2;
    position: absolute;
    right: 24px;
    top: 218px;
    a{
      display: block;
      height: 24px;
      line-height: 24px;
      color: $color-main;
      font-size: 20px;
      &:hover{
        color: $color-main;
      }
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
}
.PostSwitch{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 48px;
  background: white;
  position: relative;
  &__button{
    // background: #4180d7;
    opacity: 0.5;
    width: 50%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: $color-main;
    transition: .3s ease-in-out;
    cursor: pointer;
    &.active{
      opacity: 1;
    }
  }
  &__bar{
    width: 50%;
    height: 2px;
    background: $color-main;
    position: absolute;
    bottom: 0;
    transition: .3s ease-in-out;
  }
}
</style>
