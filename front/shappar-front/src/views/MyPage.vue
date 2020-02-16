<template>
  <div class="MyPage">
    <h1 class="Mypage__h1">{{user.user_id}} | Mypage</h1>
    <div class="Mypage__main">
      <div class="Mypage__image">
        <img :src="user.homeimage" alt="">
      </div>
      <div class="Mypage__icon">
        <img :src="user.iconimage" alt="">
      </div>
      <div class="Mypage__settings">
        <router-link to="/settings">編集</router-link>
      </div>
      <div class="Mypage__logout" @click="logout">ログアウト</div>
      <div class="Mypage__name">
        <h2 class="Mypage__name">{{user.name}}</h2>
        <h2 class="Mypage__user_id">{{user.user_id}}</h2>
      </div>
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
    <div class="PostList" v-if="isActive === 0">
      <div class="Post" v-for="post in posts" :key="post.id">
        <div class="Post__icon"></div>
        <div class="Post__text">
          {{post.text}}
        </div>
        <div class="Post__options">
          <div class="Post__option" v-for="option in post.options" :key="option.id">
            <p>{{option.content}}</p>
            <p>{{option.num}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="PostList" v-else>
      <div class="Post" v-for="post in voted" :key="post.id">
        <div class="Post__icon"></div>
        <div class="Post__text">
          {{post.text}}
        </div>
        <div class="Post__options">
          <div class="Post__option" v-for="option in post.options" :key="option.id">
            <p>{{option.content}}</p>
            <p>{{option.num}}</p>
          </div>
        </div>
      </div>
    </div>
    <NavBar></NavBar>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'MyPage',
  components: {
    NavBar
  },
  data: function () {
    return {
      user_id: this.$store.state.auth.username,
      isActive: 0,
      user: {},
      posts: [],
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
    }
  },
  computed: {
    tabBar () {
      return 'translateX(' + (100 * this.isActive) + '%)'
    }
  },
  created: function () {
    this.axios.get('/api/v1/users/' + this.user_id)
      .then((response) => {
        this.user = response.data
        // console.log('userData : ' + response.status)
      })
    this.axios.get('/api/v1/users/' + this.id + '/posts')
      .then((response) => {
        var posts = response.data.posts
        for (let i = 0; i < posts.length; i++) {
          posts[i].isSelect = 0
          for (let j = 0; j < posts[i].options.length; j++) {
            posts[i].options[j].selected = false
          }
        }
        this.posts = response.data.posts
        // console.log('postsData : ' + response.status)
      })
    this.axios.get('/api/v1/users/' + this.id + '/voted')
      .then((response) => {
        var posts = response.data.posts
        for (let i = 0; i < posts.length; i++) {
          posts[i].isSelect = 0
          for (let j = 0; j < posts[i].options.length; j++) {
            posts[i].options[j].selected = false
          }
        }
        this.voted = response.data.posts
        // console.log('votedData : ' + response.status)
      })
  }
}
</script>

<style lang="scss">
.Mypage{
  padding-bottom: 72px;
  &__h1{
    display: none;
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
    width: 120px;
    height: 120px;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 60px);
    top: 120px;
    background: #BFE4E2;
    overflow: hidden;
    img{
      width: 100%;
      // height: 100%;
    }
  }
  &__settings{
    width: 100px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 12px;
    background: white;
    border: solid 2px #BFE4E2;
    position: absolute;
    right: 4px;
    top: 208px;
  }
  &__logout{
    width: 100px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 12px;
    background: white;
    border: solid 2px red;
    position: absolute;
    color: red;
    left: 4px;
    top: 208px;
  }
  &__name{
    margin: 60px 0 0;
    text-align: center;
    font-size: 24px;
  }
  &__user_id{
    font-size: 14px;
    text-align: center;
    color: #666;
  }
  &__introduction{
    font-size: 14px;
    color: #333;
    padding: 0 16px;
    min-height: 32px;
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
    color: #4180d7;
    transition: .3s ease-in-out;
    &.active{
      opacity: 1;
    }
  }
  &__bar{
    width: 50%;
    height: 2px;
    background: #4180d7;
    position: absolute;
    bottom: 0;
    transition: .3s ease-in-out;
  }
}
</style>
