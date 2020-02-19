<template>
  <div class="Public">
    <Search :query="query" @search="search()"></Search>
    <PostList :posts-data="posts"></PostList>
    <NavBar></NavBar>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/Search.vue'
import PostList from '@/components/PostList.vue'
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'public',
  components: {
    Search,
    PostList,
    NavBar
  },
  data: function () {
    return {
      unique_id: '',
      user_id: '',
      posts: [],
      query: ''
    }
  },
  methods: {
    search () {
      // console.log(this.query)
      this.axios.get('/api/v1/posts/public?q=' + this.query)
        .then((response) => {
          this.posts = response.data.posts
        })
    }
  },
  created: function () {
    this.unique_id = this.$store.state.auth.unique_id
    this.user_id = this.$store.state.auth.username
    this.axios.get('/api/v1/posts/public/' + this.unique_id)
      .then(async (response) => {
        var posts = response.data
        var i
        // var j
        for (i = 0; i < posts.length; i++) {
          posts[i].isSelect = -1
          // for (j = 0; j < posts[i].options.length; j++) {
          //   posts[i].options[j].id = j
          //   posts[i].options[j].selected = false
          // }
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
}
</style>
