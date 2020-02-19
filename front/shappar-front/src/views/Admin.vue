<template>
  <div id="home-page">
    <GlobalHeader/>
    <GlobalMessage/>

    <!-- メインエリア -->
    <main class="container">
      <p class="h5 mb-4">Adminページ</p>
      <b-form @submit.prevent="createSampleUser">
        <div class="row text-center mt-5">
          <div class="col-sm-12">
            <b-button type="submit" variant="primary"></b-button>
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
