<template>
  <div class="Private">
    <Search></Search>
    <PostList :posts-data="posts"></PostList>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/Search.vue'
import PostList from '@/components/PostList.vue'

export default {
  name: 'private',
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
  created: function () {
    this.axios.get('/api/v1/posts/private')
      .then((response) => {
        var posts = response.data.posts
        for (let i = 0; i < posts.length; i++) {
          posts[i].isSelect = 0
          for (let j = 0; j < posts[i].options.length; j++) {
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
.Private{
  padding-top: 48px;
}
</style>
