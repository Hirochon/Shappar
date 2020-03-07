<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html,body{
  width: 100%;
  height: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 0;
  background: #eee;
  overflow-x: hidden;
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
  //height: 100%;
  min-height: 100%;
  background: #eee;
  // padding-bottom: 80px;
}
</style>
