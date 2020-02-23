<template>
  <div class="PostList">
    <div class="Post" v-for="post in postsData" :key="post.id">
      <div class="Post__icon">
        <img :src="post.iconimage" alt="">
      </div>
      <div class="Post__reload" v-if="post.voted" @click="reload(post)"><font-awesome-icon icon="sync-alt"/></div>
      <div class="Post__sort" v-if="post.voted" @click="optionsSort(post, post.options)">
        <font-awesome-icon icon="list-ol" v-show="post.sort === 0"/>
        <font-awesome-icon icon="sort-amount-down" v-show="post.sort === 1"/>
        <font-awesome-icon icon="sort-amount-up" v-show="post.sort === 2"/>
      </div>
      <div class="Post__changer" v-if="post.voted" @click="changeView(post)"><font-awesome-icon icon="exchange-alt"/></div>
      <div class="Post__text">
        {{post.question}}
      </div>
      <div class="Post__container">
        <div class="Post__option" v-for="option in post.options" :key="option.select_num"
        @click="Select(post,option);">
          <div class="Post__option__border" v-show="post.isSelect === option.select_num"></div>
          <div class="Post__result__bar" :style="{width: rate(option.votes, post.total) + '%'}"></div>
          <div class="Post__result__num" v-show="post.view === 1">{{option.votes}}</div>
          <div class="Post__option__answer" v-show="post.view === 0">{{option.answer}}</div>
        </div>
      </div>
      <!-- <transition name="result">
        <div v-if="post.voted">
          <div class="Post__divider"></div>
          <div class="Post__result__title">結果</div>
          <div class="Post__container">
            <div class="Post__result__option" v-for="option in post.options" :key="option.select_num">
              <div class="Post__result__bar" :style="{width: rate(option.votes, post.total) + '%'}"></div>
              <div class="Post__result__num">{{option.votes}}</div>
            </div>
          </div>
        </div>
      </transition> -->
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
  // data: function () {
  //   return {
  //     sort: 0
  //   }
  // },
  methods: {
    Select (post, option) {
      // if (post.voted) return
      post.isSelect = option.select_num
      this.Submit(post, post.options)
    },
    Submit (post, options) {
      // console.log(options)
      var selectsArray = []
      var j = options.length
      for (let i = 0; i < j; i++) {
        if (options[i]) selectsArray[i] = options[i].select_num
      }
      this.axios.post('/api/v1/posts/' + post.post_id + '/polls/', {
        unique_id: this.$store.state.auth.unique_id,
        option: {
          select_num: post.isSelect
        },
        answer: [
          options[post.select_num]
        ]
      })
        .then((response) => {
          post.voted = true
          for (let i = 0; i < j; i++) {
            options[i].votes = response.data.options[i].votes
          }
        })
    },
    rate (molec, denom) {
      return molec / denom * 100
    },
    changeView (post) {
      post.view = (post.view + 1) % 2
    },
    reload (post) {
      this.axios.get('/api/v1/posts/' + post.post_id)
        .then((response) => {
          var j = post.options.length
          for (let i = 0; i < j; i++) {
            post.options[i].votes = response.data.options[i].votes
          }
        })
    },
    optionsSort (post, options) {
      post.sort = (post.sort + 1) % 3
      switch (post.sort) {
        case 0:
          return options.sort(function (a, b) {
            if (a.select_num < b.select_num) return -1
            if (a.select_num > b.select_num) return 1
            return 0
          })
        case 1:
          return options.sort(function (a, b) {
            if (a.votes < b.votes) return 1
            if (a.votes > b.votes) return -1
            return 0
          })
        case 2:
          return options.sort(function (a, b) {
            if (a.votes < b.votes) return -1
            if (a.votes > b.votes) return 1
            return 0
          })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$main-color: #4180d7;
$icon-size: 40px;
$option-height: 24px;
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
    width: $icon-size;
    height: $icon-size;
    border-radius: 50%;
    background: greenyellow;
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
    // padding-top: 64px;
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
    position: relative;
    min-height: $option-height;
    line-height: $option-height;
    padding: 0 8px;
    border-radius: 8px;
    background: #eee;
    box-sizing: border-box;
    word-break: break-word;
    box-shadow: 0 0 8px rgba(black, 0.24);
    overflow: hidden;
    &:not(:last-child){
      margin-bottom: 16px;
    }
    // &.active{
    //   width: calc(100% - 16px);
    //   border: $main-color solid 1px;
    //   box-sizing: content-box;
    //   // color: white;
    // }
    &__answer{
      position: absolute;
      line-height: $option-height;
    }
    &__border{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: 8px;
      border: $main-color solid 2px;
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
      height: $option-height;
      line-height: $option-height;
      border-radius: 8px;
      margin-bottom: 8px;
      box-sizing: border-box;
    }
    &__num{
      position: absolute;
      // padding-left: 8px;
      line-height: $option-height;
    }
    &__bar{
      background: #4180d7;
      opacity: 0.5;
      height: $option-height;
      line-height: $option-height;
      border-radius: 8px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &__changer{
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    top: 16px;
    right: 96px;
    background: #ccc;
    text-align: center;
    line-height: 32px;
    font-size: 20px;
  }
  &__sort{
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    top: 16px;
    right: 56px;
    background: #ccc;
    text-align: center;
    line-height: 32px;
    font-size: 20px;
  }
  &__reload{
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    top: 16px;
    right: 16px;
    background: #ccc;
    text-align: center;
    line-height: 32px;
    font-size: 20px;
  }
}
.result-enter-active,.result-leave-active{
  transition: .3s ease-in-out;
}
.result-enter,.result-leave-to{
  opacity: 0;
}
</style>
