<template>
  <div class="Search">
    <form action="" class="Search__form" @submit.prevent="getPost">
      <label for="text-box" class="Search__label">検索</label>
      <input type="text" id="text-box" class="Search__input" v-model="childQuery">
      <div class="Search__submit"><font-awesome-icon icon="search" @click="getPost"/></div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    query: {
      type: String
    }
  },
  data () {
    return {
      childQuery: ''
    }
  },
  methods: {
    getPost () {
      this.$parent.query = this.childQuery
      this.$emit('search')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/common.scss';
.Search{
  position: fixed;
  top: 8px;
  left: 16px;
  // border-radius: 16px;
  display: flex;
  width: calc(100% - 32px);
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(black, 0.16);
  background: rgba(255,255,255,1);
  z-index: 100;
  &__form{
    position: relative;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    height: 32px;
    padding: 4px 8px;
    border-radius: 16px;
    border: solid 2px $color-main;
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
    // border: solid 2px black;
    cursor: pointer;
    text-align: center;
    line-height: 28px;
    color: $color-main;
    font-size: 18px;
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
