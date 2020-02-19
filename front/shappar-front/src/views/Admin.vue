<template>
  <div id="home-page">
    <GlobalHeader :pageName="pageName"/>
    <GlobalMessage/>

    <!-- メインエリア -->
    <main class="container">
      <b-form @submit.prevent="createSampleUser">
        <div class="row text-center mt-5">
          <div class="col-sm-12">
            <b-button type="submit" variant="primary">ユーザー新規作成</b-button>
          </div>
        </div>
      </b-form>
    </main>
  </div>
</template>

<script>
// import api from '@/services/api'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalMessage from '@/components/GlobalMessage.vue'
export default {
  data: function () {
    return {
      pageName: 'Adminページ'
    }
  },
  components: {
    GlobalHeader,
    GlobalMessage
  },
  methods: {
    createSampleUser: function () {
      alert('createSampleUser')
    }
  }
}
</script>
