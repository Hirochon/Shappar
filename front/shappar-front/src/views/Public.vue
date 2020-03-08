<template>
  <div class="Public">
    <Search :query="query" @search="search()"></Search>
    <pull-to :top-load-method="refresh" :top-config="config" :wrapper-height="pullToHeight">
      <PostList :posts="posts" :unique_id="unique_id"></PostList>
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
        triggerText: '',
        loadingText: 'Loading...',
        doneText: ''
      }
    }
  },
  methods: {
    search () {
      // console.log(this.query)
      this.axios.get('/api/v1/posts/public/' + this.unique_id + '/?q=' + this.query)
        .then((response) => {
          this.posts = response.data.posts
        })
    },
    async refresh (loaded) {
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
      loaded('done')
    }
  },
  created: function () {
    this.unique_id = this.$store.state.auth.unique_id
    this.user_id = this.$store.state.auth.username
    this.axios.get('/api/v1/posts/public/' + this.unique_id + '/')
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
