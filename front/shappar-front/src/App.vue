<template>
  <div id="app">
    <router-view/>
    <nav class="Nav-bar">
      <div class="Nav-bar__link">
        <router-link to="/public">Public</router-link>
      </div>
      <div class="Nav-bar__link">
        <router-link to="/private">Private</router-link>
      </div>
      <div class="Nav-bar__link">
        <router-link to="/new">New</router-link>
      </div>
      <div class="Nav-bar__link">
        <router-link to="/mypage">MyPage</router-link>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
html,body{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: #BFE4E2;
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
  background: #BFE4E2;
  padding-bottom: 80px;
}
.Nav-bar{
  position: fixed;
  bottom: 0;
  width:100%;
  height: 64px;
  padding: 8px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background: #eee;
  z-index: 100;
  &__link{
    height: 48px;
    line-height: 48px;
    a{
      text-decoration: none;
      color: #4180d7;
    }
  }
}
</style>
