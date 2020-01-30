<template>
  <div class="Public">
    <Search :query="query" @search="search()"></Search>
    <PostList :posts-data="posts"></PostList>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/Search.vue'
import PostList from '@/components/PostList.vue'

export default {
  name: 'public',
  components: {
    Search,
    PostList
  },
  data: function () {
    return {
      posts: [],
      query: ''
    }
  },
  methods: {
    search () {
      console.log(this.query)
      this.axios.get('/api/v1/posts/public?q=' + this.query)
        .then((response) => {
          this.posts = response.data.posts
        })
    }
  },
  created: function () {
    this.axios.get('/api/v1/posts/public')
      .then((response) => {
        var posts = response.data.posts
        var i
        var j
        for (i = 0; i < posts.length; i++) {
          posts[i].isSelect = 0
          for (j = 0; j < posts[i].options.length; j++) {
            posts[i].options[j].selected = false
          }
        }
        this.posts = response.data.posts
      })
    this.query = ''
  }
}
</script>

<style lang="scss">
.Public{
  padding-top: 48px;
}
</style>
