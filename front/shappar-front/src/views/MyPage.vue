<template>
  <div class="MyPage">
    <div class="Mypage__main">
      <div class="Mypage__image">
        <img :src="user.homeImageURL" alt="">
      </div>
      <div class="Mypage__icon">
        <img :src="user.iconURL" alt="">
      </div>
      <div class="Mypage__name">
        <h1>{{user.name}}</h1>
        <h2>{{user.usersID}}</h2>
      </div>
      <div class="Mypage__text">
        {{user.text}}
      </div>
    </div>
    <div class="PostSwitch">
      <div class="PostSwitch__button" @click="changeActive(0)" :class="{'active': isActive === 0}">
        過去の投稿
      </div>
      <div class="PostSwitch__button" @click="changeActive(1)" :class="{'active': isActive === 1}">
        過去の投票
      </div>
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
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'MyPage',
  data: function () {
    return {
      id: 1,
      isActive: 0,
      user: {},
      posts: [],
      voted: []
    }
  },
  methods: {
    changeActive (num) {
      this.isActive = num
    }
  },
  created: function () {
    this.axios.get('/api/v1/users/' + this.id)
      .then((response) => {
        this.user = response.data
        console.log('userData : ' + response.status)
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
        console.log('postsData : ' + response.status)
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
        console.log('votedData : ' + response.status)
      })
  }
}
</script>

<style lang="scss">
.Mypage{
  padding-bottom: 72px;
  &__main{
    position: relative;
    background: white;
  }
  &__image{
    width: 100%;
    height: 200px;
    background: #eee;
  }
  &__icon{
    width: 120px;
    height: 120px;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 60px);
    top: 120px;
    background: #BFE4E2;
  }
  &__name{
    margin-top: 60px;
    padding: 0 16px;
  }
  &__text{
    padding: 0 16px;
  }
}
.PostSwitch{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 48px;
  background: #eee;
  &__button{
    background: #4180d7;
    opacity: 0.5;
    width: 50%;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: white;
    &.active{
      opacity: 1;
    }
  }
}
</style>
