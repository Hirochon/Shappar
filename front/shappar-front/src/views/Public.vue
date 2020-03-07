<template>
  <div class="Public">
    <Search :query="query" @search="search()"></Search>
    <pull-to :top-load-method="refresh" :top-config="config" :wrapper-height="pullToHeight">
      <PostList :posts-data="posts"></PostList>
    </pull-to>
    <New/>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/Search.vue'
import PostList from '@/components/PostList.vue'
import New from '@/views/New.vue'
// pull-to-reflesh  使えてはいるが挙動がおかしいところがある
import PullTo from 'vue-pull-to'

export default {
  name: 'public',
  components: {
    Search,
    PostList,
    PullTo,
    New
  },
  data: function () {
    return {
      unique_id: '',
      user_id: '',
      posts: [],
      query: '',
      pullToHeight: (document.body.offsetHeight - 48) + 'px',
      config: {
        pullText: '↓',
        triggerText: '読み込み',
        loadingText: '更新中...',
        doneText: 'OK'
      }
    }
  },
  methods: {
    search () {
      // console.log(this.query)
      this.axios.get('/api/v1/posts/public?q=' + this.query)
        .then((response) => {
          this.posts = response.data.posts
        })
    },
    refresh (loaded) {
      this.axios.get('/api/v1/posts/public/' + this.unique_id + '/')
        .then((response) => {
          var posts = response.data
          var i
          for (i = 0; i < posts.length; i++) {
            posts[i].isSelect = -1// これに関しては投票済みなら更新なしやな
            posts[i].view = 0
            posts[i].sort = 0
          }
        })
      loaded('done')
    }
  },
  created: function () {
    this.unique_id = this.$store.state.auth.unique_id
    this.user_id = this.$store.state.auth.username
    this.axios.get('/api/v1/posts/public/' + this.unique_id)
      .then(async (response) => {
        var posts = response.data
        var i
        for (i = 0; i < posts.length; i++) {
          if (!posts[i].voted) posts[i].isSelect = -1// これに関しては投票済みなら更新なしやな
          posts[i].view = 0
          posts[i].sort = 0
          posts[i].options.sort(function (a, b) {
            return a.select_num < b.select_num ? -1 : 1
          })
        }
        this.posts = posts
      })
    this.query = ''
  }
}
</script>

<style lang="scss">
.Public{
  padding-top: 48px;
  height: 100%;
  box-sizing: content-box;
}
.action-block.action-block-top,.default-text{
  z-index: 0;
}
</style>
