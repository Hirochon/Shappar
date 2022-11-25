<template>
  <!-- メッセージエリア -->
  <div id="messages" class="Message">
    <div v-show="message.error" class="Message__error">
      {{ message.error }}
    </div>
    <div v-show="message.warnings.length" class="Message__warnings">
      <p class="Message__warning" v-for="warning in message.warnings" :key="warning">{{ warning }}</p>
    </div>
    <div v-show="message.info" class="Message__info">
      {{ message.info }}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    message () {
      return this.$store.state.message
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/common.scss';
.Message{
  position: fixed;
  top: 0;
  // left: 0;
  width: 100%;
  max-width: 700px;
  z-index: 1000;
  transition: .3s ease-in-out;
  @mixin message {
    font-weight: bold;
    padding: 0.75rem 1.25rem;
    border-radius: 0.25rem;
  }
  &__error{
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
    @include message;
  }
  &__warning{
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
    margin-bottom: 0;
    @include message;
  }
  &__info{
    background: white;
    // background: $color-main;
    color: $color-main;
    // color: white;
    border: solid 2px $color-main;
    @include message;
  }
}
</style>
