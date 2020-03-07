<template>
  <div class="Search">
    <form action="" class="Search__form">
      <label for="text-box" class="Search__label">検索</label>
      <input type="text" id="text-box" class="Search__input" v-model="query">
      <div class="Search__submit" @click="getPost"></div>
    </form>
    <div class="Search__filter"></div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data: function () {
    return {
      query: ''
    }
  },
  methods: {
    getPost () {
      this.$parent.query = this.query
      this.$emit('search')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.Search{
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
  background: rgba(255,255,255,0.8);
  z-index: 100;
  &__form{
    position: relative;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    height: 32px;
    padding: 4px 8px;
    border-radius: 16px;
    border: solid 2px black;
    background: #fff;
  }
  &__label{
    display: none;
  }
  &__input{
    margin-right: 24px;
    font-size: 16px;
    // background: red;
  }
  &__submit{
    position: absolute;
    top: 0;
    right: 4px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    box-sizing: border-box;
    border: solid 2px black;
    cursor: pointer;
  }
  &__filter{
    margin-left: 8px;
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: #eee;
  }
}
</style>
