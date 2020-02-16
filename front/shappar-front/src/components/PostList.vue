<template>
  <div class="PostList">
    <div class="Post" v-for="post in postsData" :key="post.id">
      <div class="Post__icon">
        <img :src="post.iconimage" alt="">
      </div>
      <div class="Post__text">
        {{post.question}}
      </div>
      <div class="Post__container">
        <div class="Post__option" v-for="option in post.options" :key="option.id"
        @click="Select(post,option);"
        :class="{'active':post.isSelect === option.id}">
          {{option.content}}
        </div>
      </div>
      <transition name="result">
        <div v-if="post.voted">
          <div class="Post__divider"></div>
          <div class="Post__result__title">結果</div>
          <div class="Post__container">
            <div class="Post__result__option" v-for="option in post.options" :key="option.id">
              <div class="Post__result__bar" :style="{width: rate(option.num, post.total) + '%'}"></div>
              <div class="Post__result__num">{{option.num}}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostList',
  props: {
    postsData: {
      type: Array,
      required: true
    }
  },
  methods: {
    Select (post, option) {
      if (post.voted) return
      if (post.isSelect === option.id) post.isSelect = 0
      else post.isSelect = option.id
      this.Submit(post, post.options)
    },
    Submit (post, options) {
      var selectsArray = []
      var j = options.length
      for (let i = 0; i < j; i++) {
        if (options[i]) selectsArray[i] = options[i].id
      }
      this.axios.post('/api/v1/posts/' + post.post_id, {
        selects: selectsArray
      }).then((response) => {
        post.voted = true
        for (let i = 0; i < j; i++) {
          options[i].num = response.data.options[i].num
        }
      })
    },
    rate (molec, denom) {
      return molec / denom * 100
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$main-color: #4180d7;
.PostList{
  padding: 16px;
}
.Post{
  margin-top: 64px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  position: relative;
  box-shadow: 0 0 8px rgba(black, 0.16);
  &__icon{
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: greenyellow;
    left: calc(50% - 60px);
    top: -50px;
    box-shadow: 0 0 8px rgba(black, 0.16);
    overflow: hidden;
    img{
      width: 100%;
      object-fit: contain;
    }
  }
  &__text{
    width: 100%;
    margin-bottom: 8px;
    padding-top: 64px;
  }
  &__submit{
    user-select: none;
    pointer-events: none;
    opacity: 0.5;
    width: 100%;
    height: 32px;
    margin-top: 24px;
    line-height: 32px;
    text-align: center;
    background: $main-color;
    border-radius: 8px;
    color: #fff;
    &.active{
      pointer-events: auto;
      cursor: pointer;
      opacity: 1;
    }
  }
  &__container{
    width: 100%;
  }
  &__option{
    width: 100%;
    min-height: 48px;
    line-height: 48px;
    padding: 0 8px;
    border-radius: 8px;
    background: #eee;
    box-sizing: border-box;
    word-break: break-word;
    box-shadow: 0 0 8px rgba(black, 0.24);
    &:not(:last-child){
      margin-bottom: 16px;
    }
    &.active{
      background: $main-color;
      color: white;
    }
  }
  &__divider{
    background: black;
    width: 100%;
    height: 2px;
    margin: 16px 0 16px;
  }
  &__result{
    &__title{
      text-align: center;
      line-height: 32px;
      margin-bottom: 8px;
      font-size: 24px;
    }
    &__option{
      position: relative;
      width: 100%;
      background: #eee;
      height: 36px;
      line-height: 36px;
      border-radius: 8px;
      margin-bottom: 8px;
      box-sizing: border-box;
    }
    &__num{
      position: absolute;
      padding-left: 8px;
    }
    &__bar{
      background: #4180d7;
      opacity: 0.5;
      height: 36px;
      line-height: 36px;
      border-radius: 8px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.result-enter-active,.result-leave-active{
  transition: .3s ease-in-out;
}
.result-enter,.result-leave-to{
  opacity: 0;
}
</style>
