<template>
  <!-- メッセージエリア -->
  <div id="messages" class="Message">
    <b-alert variant="danger" show v-show="message.error" class="mb-0">
      {{ message.error }}
    </b-alert>
    <b-alert
      variant="warning" show v-show="message.warnings.length > 0" class="mb-0">
      <p v-for="warning in message.warnings" class="mb-0" :key="warning">{{ warning }}</p>
    </b-alert>
    <b-alert variant="info" show v-show="message.info" class="mb-0">
      {{ message.info }}
    </b-alert>
  </div>
</template>

<script>
export default {
  computed: {
    message: function () {
      return this.$store.state.message
    }
  },
  created () {
    setTimeout(() => {
      this.$store.dispatch('message/clearMessages')
    }, 1500)
  }
}
</script>

<style lang="scss">
.Message{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: .3s ease-in-out;
}
</style>
