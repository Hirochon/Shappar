<template>
  <div class="Public" @touchmove="refreshTrigger" @touchend="refresh">
    <transition name="search">
      <Search :query="query" @search="search()" v-show="searchShow"></Search>
    </transition>
    <div class="Pull-to" id="Pull-to">
      <font-awesome-icon icon="spinner" class="Pull-to__rotate" v-if="refreshConfig.loading"/>
      <font-awesome-icon icon="chevron-circle-down" :class="{'Pull-to__on': refreshConfig.trigger}" v-if="refreshConfig.isStart"/>
    </div>
    <PostList :posts="posts" :unique_id="unique_id"></PostList>
    <New/>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/Search.vue'
import PostList from '@/components/PostList.vue'
import New from '@/views/New.vue'

export default {
  name: 'public',
  components: {
    Search,
    PostList,
    New
  },
  data: function () {
    return {
      unique_id: '',
      user_id: '',
      posts: [],
      query: '',
      positionY: 0,
      targetHeight: 0,
      searchShow: true,
      refreshConfig: {
        isStart: false,
        trigger: false,
        loading: false,
        startY: 0,
        diffY: 0
      }
    }
  },
  methods: {
    search () {
      // console.log(this.query)
      this.axios.get('/api/v1/posts/public/' + this.unique_id + '/?q=' + this.query)
        .then((response) => {
          var posts = response.data.posts
          var length = posts.length
          for (let i = 0; i < length; i++) {
            posts[i].view = 0
            posts[i].sort = 0
            posts[i].options.sort(function (a, b) {
              return a.select_num < b.select_num ? -1 : 1
            })
          }
          this.posts = posts
        })
    },
    refreshTrigger () {
      // touchイベントとその他のイベントの統合
      var e = event.type === 'touchmove' ? event.changedTouches[0] : event
      var refConf = this.refreshConfig
      if (this.scrollTop() > 0) {
        refConf.isStart = false
        return
      }
      if (!refConf.isStart) {
        refConf.isStart = true
        refConf.startY = e.clientY
      }
      refConf.diffY = e.clientY - refConf.startY
      refConf.trigger = refConf.diffY > 75 // 下がった高さが75pxを来れたら発火
      // console.log(refConf.trigger)
      if (refConf.diffY > 0) {
        document.getElementById('PostList').style.transition = null
        document.getElementById('PostList').style.transform = 'translateY(' + refConf.diffY * 2 / 3 + 'px)'
        document.getElementById('Pull-to').style.transform = 'translateY(' + refConf.diffY * 2 / 3 + 'px)'
      } else {
        document.getElementById('PostList').style.transition = '.15s ease-in-out'
        document.getElementById('PostList').style.transform = null
      }
    },
    async refresh (loaded) {
      document.getElementById('PostList').style.transition = '.15s ease-in-out'
      var refConf = this.refreshConfig
      if (!refConf.trigger) {
        document.getElementById('PostList').style.transform = null
        refConf.isStart = false
        return
      }
      refConf.isStart = false
      refConf.loading = true
      // console.log('refresh')
      await this.axios.get('/api/v1/posts/public/' + this.unique_id + '/')
        .then((response) => {
          var posts = response.data.posts
          var i
          for (i = 0; i < posts.length; i++) {
            posts[i].view = 0
            posts[i].sort = 0
            posts[i].options.sort(function (a, b) {
              return a.select_num < b.select_num ? -1 : 1
            })
          }
          this.posts = posts
        })
      document.getElementById('PostList').style.transform = null
      this.query = ''
      refConf.isStart = false
      refConf.trigger = false
      refConf.loading = false
      refConf.startY = 0
      refConf.diffY = 0
    },
    async loadMore () {
      // console.log('targetHeight:' + this.targetHeight + ' :: scrollTop:' + this.scrollTop())
      if (this.scrollTop() < this.targetHeight) return
      if (this.targetHeight < 0) return
      await (this.targetHeight = -1)// lockをかける
      var nextPostId = this.posts[this.posts.length - 1].post_id
      var targetId
      await this.axios.get('/api/v1/posts/public/' + this.unique_id + '/?pid=' + nextPostId)
        .then((response) => {
          var posts = response.data.posts
          this.nextPostId = response.data.pid
          posts.forEach(item => {
            item.view = 0
            item.sort = 0
            item.options.sort((a, b) => {
              return a.select_num < b.select_num ? -1 : 1
            })
            this.posts.push(item)
            // console.log(posts[6].post_id)
            targetId = posts.length === 10 ? posts[6].post_id : false
          })
        })
      // console.log(this.targetHeight)
      // console.log(targetId)
      if (targetId) this.targetHeight = document.getElementById(targetId).offsetTop // 次の高さを計測
    },
    switchSearch () {
      var newY = this.scrollTop()
      this.searchShow = newY < this.positionY
      this.positionY = newY
      // console.log('switchSearch')
    },
    scrollTriggers () {
      this.switchSearch()
      this.loadMore()
    },
    scrollTop () {
      return document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop : document.body.scrollTop
    }
  },
  created: async function () {
    var targetId
    this.unique_id = this.$store.state.auth.unique_id
    this.user_id = this.$store.state.auth.username
    await this.axios.get('/api/v1/posts/public/' + this.unique_id + '/')
      .then(async (response) => {
        var posts = response.data.posts
        var length = posts.length
        for (let i = 0; i < length; i++) {
          posts[i].view = 0
          posts[i].sort = 0
          posts[i].options.sort(function (a, b) {
            return a.select_num < b.select_num ? -1 : 1
          })
        }
        this.posts = posts
        if (length === 10) targetId = posts[6].post_id
      })
    this.query = ''
    this.targetHeight = document.getElementById(targetId).offsetTop
    // console.log(this.targetHeight)
    window.addEventListener('scroll', this.scrollTriggers)// searchのトリガー
  }
}
</script>

<style lang="scss">
.Public{
  padding-top: 48px;
  height: 100%;
  box-sizing: content-box;
}
.Pull-to{
  position: absolute;
  top: 10px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  &__on{
    transform: rotate(180deg);
    transition: .3s;
  }
  &__rotate{
    animation: rotation 1s linear infinite;
  }
}
@keyframes rotation {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.search-enter-active,.search-leave-active{
  transition: .3s ease-in-out;
}
.search-enter,.search-leave-to{
  transform: translateY(-200%);
}
</style>
