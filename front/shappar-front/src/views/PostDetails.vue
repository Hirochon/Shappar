<template>
  <div class="PostDetails">
      <h2 class="Top__header"><!-- ここのヘッダーはコンポーネント化できる？ -->
        <div class="Top__close">
          <font-awesome-icon icon="times" @click.stop="closeDetails()"/>
        </div>
      </h2>
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
    },
    closeDetails () {
      this.$emit('switchDetails')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/common.scss';
.PostDetails{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 100;
}
</style>
