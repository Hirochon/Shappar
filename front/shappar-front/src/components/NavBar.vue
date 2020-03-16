<template>
    <nav class="Nav-bar">
      <div class="Nav-bar__link">
        <router-link to="/"><font-awesome-icon icon="globe"/></router-link>
      </div>
      <!-- <div class="Nav-bar__link">
        <router-link to="/private">Private</router-link>
      </div> -->
      <div class="Nav-bar__link">
        <router-link to="/new"><font-awesome-icon icon="file-alt"/></router-link>
      </div>
      <div class="Nav-bar__link">
        <router-link to="/mypage"><font-awesome-icon icon="home"/></router-link>
      </div>
    </nav>
</template>

<style lang="scss">
.Nav-bar{
  position: fixed;
  bottom: 0;
  left:0;
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
    width: 100%;
    a{
      display: block;
      width: 100%;
      text-align: center;
      text-decoration: none;
      // color: #4180d7;
      color: #666;
      font-size: 24px;
    }
    .router-link-exact-active{
      color: #4180d7;
    }
  }
}
</style>
