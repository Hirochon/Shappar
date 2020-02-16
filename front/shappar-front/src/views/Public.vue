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
    this.axios.get('/api/v1/posts/public')
      .then(async (response) => {
        var posts = response.data
        var iconimage = ''
        var i
        var j
        for (i = 0; i < posts.length; i++) {
          posts[i].isSelect = -1
          posts[i].options = [{}, {}, {}, {}]
          posts[i].options[0].content = posts[i].answer_1
          posts[i].options[1].content = posts[i].answer_2
          posts[i].answer_3 ? posts[i].options[2].content = posts[i].answer_3 : posts[i].options.splice(2, 1)
          posts[i].answer_4 ? posts[i].options[3].content = posts[i].answer_4 : posts[i].options.splice(posts[i].options.length - 1, 1)
          for (j = 0; j < posts[i].options.length; j++) {
            posts[i].options[j].id = j
            posts[i].options[j].selected = false
            posts[i].options[j].num = -1
          }
          // 同期処理で画像を取得
          await this.axios.get('/api/v1/users/' + posts[i].user_id)
            .then((response) => {
              iconimage = response.data.iconimage
            })
          posts[i].iconimage = iconimage
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
