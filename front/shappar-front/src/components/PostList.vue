<template>
  <div class="PostList">
    <div class="Post" v-for="post in postsData" :key="post.id">
      <div v-if="!post.voted">
        <div class="Post__icon"></div>
        <div class="Post__text">
          {{post.text}}
        </div>
        <div class="Post__options">
          <div class="Post__option" v-for="option in post.options" :key="option.id"
          @click="Select(post,option)"
          :class="{'active':post.isSelect === option.id}">
            {{option.content}}
          </div>
        </div>
        <div class="Post__submit"
        :class="{'active':post.isSelect !== 0}"
        @click="Submit(post,post.options)">
          回答して結果を見る
        </div>
      </div>
      <transition name="result">
        <div v-if="post.voted">
          <div class="Post__icon"></div>
          <div class="Post__text">
            {{post.text}}
          </div>
          <div class="Post__options">
            <div class="Post__option" v-for="option in post.options" :key="option.id">
              <p>{{option.content}}</p>
              <p>{{option.num}}</p>
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
      if (post.isSelect === option.id) post.isSelect = 0
      else post.isSelect = option.id
    },
    Submit (post, options) {
      var selectsArray = []
      var j = options.length
      for (let i = 0; i < j; i++) {
        if (options[i]) selectsArray[i] = options[i].id
      }
      this.axios.post('/api/v1/posts/' + post.id, {
        selects: selectsArray
      }).then((response) => {
        post.voted = true
        for (let i = 0; i < j; i++) {
          options[i].num = response.data.options[i].num
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.PostList{
  padding: 16px;
}
.Post{
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  &__text{
    width: 100%;
    margin-bottom: 8px
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
    background: #4180d7;
    border-radius: 8px;
    color: #fff;
    &.active{
      pointer-events: auto;
      cursor: pointer;
      opacity: 1;
    }
  }
  &__option{
    position: relative;
    width: calc(100% - 28px);
    min-height: 31px;
    line-height: 31px;
    margin-left: 28px;
    margin-bottom: 4px;
    padding-left: 8px;
    box-sizing: border-box;
    border-bottom: 2px solid black;
    word-break: break-word;
    &::before{
      content: '';
      display: block;
      position: absolute;
      top: 4px;
      left: -28px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      box-sizing: border-box;
      border: solid 2px black;
    }
    &.active{
      border-bottom: solid 2px #4180d7;
      &::after{
        content: '';
        width: 16px;
        height: 16px;
        position: absolute;
        top: 8px;
        left: -24px;
        border-radius: 50%;
        background: #4180d7;
      }
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
