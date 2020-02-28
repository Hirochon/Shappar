<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html,body{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: #BFE4E2;
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
  //height: 100%;
  min-height: 100%;
  background: #BFE4E2;
  padding-bottom: 80px;
}
</style>
