<template>
  <div class="PostDetails">
  </div>
</template>

<script>
import api from '@/services/api'
export default {
  name: 'PostDetails',
  props: {
    post_id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      data: {}
    }
  },
  methods: {
    getPostData () {
      api.get('/api/v1/posts/' + this.post_id + '/')
        .then((response) => {
          this.data = response.data
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/common.scss';
.PostDetails{
  width: 100%;
  height: 100%;
}
</style>
