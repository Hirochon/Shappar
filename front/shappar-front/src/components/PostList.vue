<template>
  <div class="PostList" id="PostList">
    <div class="Post" v-for="(post, index) in posts" :key="post.post_id" :id="post.post_id">
      <div class="Post__icon">
        <img :src="post.iconimage" :alt="post.user_id+'_icon'">
      </div>
      <div class="Post__top">
        <div class="Post__total">Total：{{post.total}}</div>
        <div class="Post__buttons" v-show="post.voted">
          <div class="Post__sort" v-if="post.user_id === $store.state.auth.username" @click="deletePost(post, index)"><font-awesome-icon icon="trash-alt"/></div>
          <div class="Post__sort" v-if="post.voted" @click="optionsSort(post, post.options)">
            <font-awesome-icon icon="list-ol" v-show="post.sort === 0"/>
            <font-awesome-icon icon="sort-amount-up" v-show="post.sort === 1"/>
            <font-awesome-icon icon="sort-amount-down-alt" v-show="post.sort === 2"/>
          </div>
          <div class="Post__reload" v-if="post.voted" @click="refleshPost(post)"><font-awesome-icon icon="sync-alt"/></div>
        </div>
      </div>
      <div class="Post__question">
        {{post.question}}
      </div>
      <div class="Post__container">
        <div class="Post__option" v-for="option in post.options" :key="option.select_num"
          @click="Select(post,option);"
          >
          <!-- <div class="Post__option__border" v-show="post.selected_num === option.select_num"></div> -->
          <div class="Post__result__bar" :style="{width: rate(option.votes, post.total) + '%'}" :class="{selected: post.selected_num === option.select_num}"></div>
          <div class="Post__result__num" v-show="post.view === 1">{{option.votes}}</div>
          <div class="Post__option__answer" v-show="post.view === 0">{{option.select_num + 1 + '. '}}{{option.answer}}</div>
        </div>
      </div>
      <div class="Post__details" @click="switchDetails(post.post_id)" v-if="post.voted">詳細を見る</div>
    </div>
    <PostDetails @switchDetails="switchDetails('')" :post_id="detailsPostId" v-if="isDetailsOpen"/>
  </div>
</template>

<script>
import PostDetails from '@/views/PostDetails'
import api from '@/services/api'
export default {
  name: 'PostList',
  components: {
    PostDetails
  },
  props: {
    posts: {
      type: Array,
      required: true
    },
    unique_id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      res: null,
      isDetailsOpen: false,
      detailsPostId: ''
    }
  },
  methods: {
    Select (post, option) {
      if (post.voted) {
        this.changeView(post)
        return
      }
      post.selected_num = option.select_num
      this.Submit(post, post.options)
    },
    Submit (post, options) {
      var selectsArray = []
      var j = options.length
      for (let i = 0; i < j; i++) {
        if (options[i]) selectsArray[i] = options[i].select_num
      }
      api.post('/api/v1/posts/' + post.post_id + '/polls/', {
        unique_id: this.$store.state.auth.unique_id,
        option: {
          select_num: post.selected_num,
          answer: options[post.selected_num].answer
        }
      })
        .then((response) => {
          post.voted = true
          // post.total++ // これでもいいかな？
          post.total = 0
          var updates = response.data.options.sort((a, b) => {
            return a.select_num < b.select_num ? -1 : 1
          })
          for (let i = 0; i < j; i++) {
            // 各選択肢の投票数を更新
            options[i].votes = updates[i].votes
            // totalを更新
            post.total += updates[i].votes
          }
          post.selected_num = response.data.selected_num
        })
    },
    rate (molec, denom) {
      return molec / denom * 100
    },
    changeView (post) {
      post.view = (post.view + 1) % 2
    },
    async refleshPost (post) {
      var res
      await api.get('/api/v1/posts/public/' + this.unique_id + '/' + post.post_id + '/')
        .then((response) => {
          res = response.data
        })
      post.voted = res.voted
      post.total = res.total
      post.options = res.options.sort((a, b) => {
        return a.select_num < b.select_num ? -1 : 1
      })
    },
    deletePost (post, index) {
      if (!confirm('この投稿を削除しますか？')) return
      // 送信前にも確認
      if (this.$store.state.auth.username !== post.user_id) return
      // apiにリクエスト
      api.delete('/api/v1/posts/' + post.post_id + '/')
        .then((response) => {
          // 成功したらリストから削除と通知
          if (response.status === 204) {
            // console.log('before set message')
            this.$store.dispatch('message/setInfoMessage', { message: '削除しました' })
            // indexで削除した投稿だけ配列から除こうとしたが
            // 自動更新の高さが変わるので一旦リロードする方針に変更する
            // this.posts.splice(index, 1)
            this.$emit('reload')
          }
        }).catch((error) => {
          console.log(error)
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
    },
    switchDetails (id) {
      this.detailsPostId = id
      this.isDetailsOpen = !this.isDetailsOpen
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/common.scss';
$icon-size: 56px;
$option-height: 40px;
.PostList{
  z-index: 10;
  padding: 48px 16px 16px;
}
.Post{
  margin-bottom: 40px;
  padding: 16px 16px 8px;
  background: #fff;
  position: relative;
  box-shadow: 0 0 8px rgba(black, 0.16);
  transition: .3s ease-in-out;
  &__icon{
    width: $icon-size;
    height: $icon-size;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0 8px rgba(black, 0.16);
    overflow: hidden;
    position: absolute;
    top: -24px;
    left: calc(50% - 28px);
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__top{
    width:100%;
    height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__total{
    width: auto;
    top: 16px;
    left: 16px;
    height: 24px;
    line-height: 20px;
    padding: 0 8px;
    border-radius: 12px;
    background: white;
    color: $color-main;
    font-size: 14px;
    border: solid 2px $color-main;
    font-weight: bold;
    transition: .3s ease-in-out;
  }
  &__buttons{
    right: 16px;
    top: 16px;
    display: flex;
    justify-content: space-around;
    height: 34px;
    // width: 80px;
    transition: .3s ease-in-out;
  }
  &__sort{
    cursor: pointer;
    width: 32px;
    height: 32px;
    padding: 6px;
    background: #fff;
    border-bottom: 0.5px solid #ccc;
    transition: .3s ease-in-out;
    svg{
      display: block;
      font-size: 20px;
      margin: 0 auto;
    }
    &:hover{
      border-bottom: solid 0.5px $color-main;
      color: $color-main;
    }
  }
  &__reload{
    cursor: pointer;
    width: 32px;
    height: 32px;
    padding: 6px;
    background: #fff;
    border-bottom: 0.5px solid #ccc;
    transition: .3s ease-in-out;
    svg{
      display: block;
      margin: 0 auto;
      font-size: 20px;
    }
    &:hover{
      border-bottom: solid 0.5px $color-main;
      color: $color-main;
      svg{
        transition: .3s ease-in-out;
        transform: rotate(180deg);
      }
    }
  }
  &__question{
    width: 100%;
    margin-bottom: 8px;
    padding: 0 8px;
  }
  &__container{
    width: 100%;
    @include scrollbar;
  }
  &__option{
    cursor: pointer;
    border-top: solid 1px #e9e9e9;
    width: 100%;
    position: relative;
    height: auto;
    min-height: $option-height;
    line-height: $option-height;
    padding: 0 8px;
    background: #fff;
    box-sizing: border-box;
    word-break: break-word;
    &__answer{
      line-height: $option-height;
    }
    &__border{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: 8px;
    }
  }
  &__result{
    &__num{
      line-height: $option-height;
    }
    &__bar{
      background: $color-sub;
      opacity: 0.5;
      height: $option-height;
      line-height: $option-height;
      border-radius: 0 8px 8px 0;
      position: absolute;
      top: 0;
      left: 0;
      &.selected{
        background: $color-main;
      }
    }
  }
}
</style>
