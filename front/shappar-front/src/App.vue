<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '@/assets/common.scss';
html,body{
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 0;
  background: #eee;
  overflow-x: hidden;
  @include scrollbar();
}
input, button, textarea, select {
    margin: 0;
    padding: 0;
    background: 0 0;
    border: none;
    border-radius: 0;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
#app{
  width: 100%;
  max-width: 700px;
  min-height: 100%;
  background: #eee;
}
</style>
