<template>
  <div class="Public" @touchmove="pullToMove" @touchend="pullToEnd">
    <GlobalMessage/>
    <DrawerMenu :isOpen="isDrawerOpen" @close="isDrawerOpen = false"/>
    <New @switchNew="switchNew()" @refresh="refresh" :isOpen="isNewOpen"/>
    <transition name="search">
      <Search :query="query" @search="search()" @drawerOpen="isDrawerOpen = true" v-show="searchShow && !isNewOpen"></Search>
    </transition>
    <div class="Pull-to" id="Pull-to">
      <font-awesome-icon icon="spinner" class="Pull-to__rotate" v-if="refreshConfig.loading"/>
      <font-awesome-icon icon="chevron-circle-down" :class="{'Pull-to__on': refreshConfig.trigger}" v-if="refreshConfig.isStart"/>
    </div>
    <PostList :posts="posts" @reload="refresh()"></PostList>
    <div class="Public__loading" v-if="isLoading">
      <font-awesome-icon icon="spinner" class="Public__loading__icon"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/Search.vue'
import PostList from '@/components/PostList.vue'
import New from '@/views/New.vue'
import GlobalMessage from '@/components/GlobalMessage.vue'
import DrawerMenu from '@/components/DrawerMenu.vue'

import api from '@/services/api'
export default {
  name: 'public',
  components: {
    Search,
    PostList,
    New,
    GlobalMessage,
    DrawerMenu
  },
  data: function () {
    return {
      posts: [],
      query: '',
      isNewOpen: false,
      isDrawerOpen: false,
      isLoading: true,
      searchShow: true,
      positionY: 0,
      targetHeight: 0,
      targetId: '',
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
    async loadMore () {
      // console.log(this.targetHeight + ' : ' + this.scrollTop())
      if (this.scrollTop() < this.targetHeight) return
      if (this.targetHeight < 0) return
      await (this.targetHeight = -1)// 読み込み中のスクロールで発火するのを避けるためにlockをかける
      var nextPostId = this.posts[this.posts.length - 1].post_id
      this.isLoading = true
      await api.get('/api/v1/posts/public/?pid=' + nextPostId)
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
          this.posts = this.posts.concat(posts)
          this.targetId = posts.length === 10 ? posts[6].post_id : false
        })
        .then(() => {
          this.isLoading = false
        })
      if (this.targetId) this.targetHeight = document.getElementById(this.targetId).offsetTop - window.innerHeight // 次の高さを計測
    },
    pullToMove () {
      // touchイベントとその他のイベントの統合
      var e = event.type === 'touchmove' ? event.changedTouches[0] : event
      var refConf = this.refreshConfig
      if (this.scrollTop() > 0 || this.isnewOpen) { // 新規投稿画面使用時に発火しないため
        refConf.isStart = false
        return
      }
      if (!refConf.isStart) {
        refConf.isStart = true
        refConf.startY = e.clientY
      }
      refConf.diffY = e.clientY - refConf.startY
      refConf.trigger = refConf.diffY > 75 // 下がった高さが75pxを超えたら発火
      if (refConf.diffY > 0) {
        document.getElementById('PostList').style.transition = null
        document.getElementById('PostList').style.transform = 'translateY(' + refConf.diffY * 2 / 3 + 'px)'
        document.getElementById('Pull-to').style.transform = 'translateY(' + refConf.diffY * 2 / 3 + 'px)'
      } else {
        document.getElementById('PostList').style.transition = '.15s ease-in-out'
        document.getElementById('PostList').style.transform = null
      }
    },
    async pullToEnd (loaded) {
      var refConf = this.refreshConfig
      document.getElementById('PostList').style.transition = '.15s ease-in-out'
      if (!refConf.trigger) {
        document.getElementById('PostList').style.transform = null
        refConf.isStart = false
        return
      }
      refConf.isStart = false
      refConf.loading = true
      this.query = ''
      await this.refresh()
      document.getElementById('PostList').style.transform = null
      refConf.isStart = false
      refConf.trigger = false
      refConf.loading = false
      refConf.startY = 0
      refConf.diffY = 0
    },
    async search () {
      api.get('/api/v1/posts/public/?q=' + this.query)
        .then((response) => {
          this.initPosts(response.data.posts)
        })
    },
    async initPosts (posts) {
      await posts.forEach(item => {
        item.view = 0
        item.sort = 0
        item.isLoading = false
        item.options.sort((a, b) => {
          return a.select_num < b.select_num ? -1 : 1
        })
      })
      this.posts = posts
      // console.log(window.innerHeight)
      await (this.targetId = posts.length === 10 ? posts[6].post_id : false) // 自動読み込みが可能かどうかを判定（10件ずつ読み込む）
      if (this.targetId) this.targetHeight = document.getElementById(this.targetId).offsetTop - window.innerHeight // 次の高さを計測
    },
    async refresh () { // ここの非同期処理いるのか？
      await api.get('/api/v1/posts/public/')
        .then((response) => {
          this.initPosts(response.data.posts)
        })
    },
    switchSearch () {
      var newY = this.scrollTop()
      // 上に行く際は表示・下に行く際は行き始めてから50px超えたら
      if (newY < this.positionY) {
        this.searchShow = true
        this.positionY = newY
      }
      if (!this.searchShow) {
        this.positionY = newY
        // console.log('set newY')
      } else if (newY > this.positionY + 50) {
        this.searchShow = false
        // console.log('set false')
      }
    },
    scrollTriggers () {
      this.switchSearch()
      this.loadMore()
    },
    scrollTop () {
      return document.documentElement.scrollTop > 0 ? document.documentElement.scrollTop : document.body.scrollTop
    },
    switchNew () {
      this.isNewOpen = !this.isNewOpen
    }
  },
  created: function () {
    this.query = ''
    this.isLoading = true
    api.get('/api/v1/posts/public/')
      .then((response) => {
        this.initPosts(response.data.posts)
      })
      .then(() => {
        this.isLoading = false
      })
    window.addEventListener('scroll', this.scrollTriggers)// scrollによるトリガーの追加
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollTriggers)
  }
}
</script>

<style lang="scss">
.Public{
  padding-top: 48px;
  height: 100%;
  box-sizing: content-box;
  &__loading{
    width: 100%;
    height: 100px;
    padding: 38px;
    svg{
      display: block;
      margin: 0 auto;
      font-size: 24px;
      animation: rotation 1s linear infinite;
    }
  }
}
.Pull-to{
  position: absolute;
  top: 10px;
  width: 100%;
  height: 50px;
  padding: 15px 0;
  svg{
    display: block;
    margin: 0 auto;
    font-size: 20px;
  }
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
