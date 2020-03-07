<template>
  <div class="New">
    <transition name="container">
      <div class="New__container" v-if="isOpen">
        <div class="Top">
          <h2 class="New__header">
            <div class="New__close">
              <font-awesome-icon icon="times" @click="isOpen = false"/>
            </div>
            </h2>
          <textarea class="New__question" v-model="question" cols="30" rows="2" placeholder="質問文"></textarea>
          <div class="Buttons__num">{{options.length}}</div>
        </div>
        <draggable v-model="options" handle=".New__option__handle">
          <div class="New__options" v-for="(option, index) in options" :key="option.id">
            <textarea class="New__option" cols="30" rows="3" v-model="option.answer" :placeholder="index+1"></textarea>
            <div class="New__option__handle"><font-awesome-icon icon="bars"/></div>
          </div>
        </draggable>
        <div class="Buttons">
          <div class="Buttons__add-option" @click="addOption">
            <font-awesome-icon icon="plus"/>
          </div>
          <div class="Buttons__submit" @click="releasePost">
            サーブ
          </div>
        </div>
      </div>
    </transition>
    <div class="FAB" @click="isOpen = true"><font-awesome-icon icon="plus"/></div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'New',
  components: {
    draggable
  },
  data: function () {
    return {
      unique_id: '',
      user_id: '',
      question: '',
      count: 2,
      isOpen: false,
      draggable_options: {
        animation: 200
      },
      options: [
        {
          id: 0,
          answer: ''
        },
        {
          id: 1,
          answer: ''
        }
      ]
    }
  },
  methods: {
    addOption () {
      if (this.options.length < 10) {
        this.options.push({
          id: this.count++,
          answer: ''
        })
      } else {
        alert('これ以上作成できません')
      }
    },
    deleteOption (selectNum) {
      if (this.options.length > 2) {
        this.options.splice(selectNum, 1)
        // this.count--
      } else {
        alert('これ以上削除できません')
      }
    },
    releasePost () {
      // var params = new FormData()
      // params.append('unique_id', this.unique_id)
      // params.append('question', this.question)
      for (let i = 0; i < this.options.length; i++) {
        this.options[i].select_num = i
      }
      this.axios.post('/api/v1/posts/', {
        unique_id: this.unique_id,
        question: this.question,
        options: this.options
      })
        .then((response) => {
          // console.log(response)
          if (response.status === 201) alert('投稿完了！')
        })
      this.question = ''
      this.count = 2
      this.options = [
        {
          id: 0,
          answer: ''
        },
        {
          id: 1,
          answer: ''
        }
      ]
    }
  },
  created: function () {
    this.unique_id = this.$store.state.auth.unique_id
    this.user_id = this.$store.state.auth.username
  }
}
</script>

<style lang="scss">
@import '@/assets/common.scss';
$delete-width: 24px;
.New{
  position: absolute;
  width: 100%;
  // height: 100%;
  // top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  &.active{
    top:0;
  }
  &__container{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    // max-height: 100%;
    // top: 100%;
    padding: 164px 0px 64px;
    background: white;
    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 100;
  }
  &__header{
    width: 100%;
    height: 48px;
    line-height: 48px;
    padding: 8px;
    margin: 0;
    border-bottom: solid 1px #ccc;
    color: #888;
  }
  &__close{
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 50%;
    font-size: 20px;
    &:hover{
      background: rgba($color: #41be99, $alpha: 0.3)
    }
  }
  &__question{
    padding: 8px 16px;
    box-sizing: border-box;
    width: 100%;
    height: 100px;
    line-height: 1.6em;
    background: #fff;
    resize: none;
    border-radius: 0;
    &::placeholder{
      padding: 8px 0;
      line-height: 16px;
    }
  }
  &__option{
    // margin-bottom: 16px;
    padding: 8px 16px;
    box-sizing: border-box;
    width: calc(100% - 40px);
    height: 64px;
    line-height: 24px;
    background: #fff;
    resize: none;
    // border-radius: 8px 0 0 8px;
    border-bottom: solid 1px #eee;
  }
  &__options{
    position: relative;
    display: flex;
  }
  &__option__delete{
    position: absolute;
    top: -4px;
    right: -4px;
    width: $delete-width;
    height: $delete-width;
    line-height: $delete-width;
    font-size: 14px;
    border-radius: 50%;
    color: white;
    text-align: center;
    background: red;
    z-index: 10;
  }
  &__option__index{
    position: absolute;
    top: calc(50% - 24px);
    left: -12px;
    width: $delete-width;
    height: $delete-width;
    line-height: $delete-width;
    font-size: 14px;
    border-radius: 50%;
    color: white;
    text-align: center;
    background: #4180d7;
  }
  &__option__handle{
    width: 40px;
    height: 64px;
    line-height: 64px;
    font-size: 14px;
    // border-radius: 0 8px 8px 0;
    border-bottom: solid 1px #eee;
    color: black;
    text-align: center;
    background: #ccc;
  }
}
.Top{
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  height: 148px;
  background: white;
  z-index: 100;
  box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.2);
}
.Buttons{
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: space-between;
  bottom:0;
  left: 0;
  z-index: 100;
  box-shadow: 0px -1px 6px 1px rgba(0,0,0,0.2);
  &__add-option{
    position: sticky;
    top: 8px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    // border-radius: 8px;
    color: white;
    text-align: center;
    background: $color-sub;
    z-index: 100;
  }
  &__num{
    position: absolute;
    top: 12px;
    right: 12px;
    width: $delete-width;
    height: $delete-width;
    line-height: $delete-width;
    font-size: 14px;
    border-radius: 50%;
    color: white;
    text-align: center;
    background: $color-main;
  }
  &__submit{
    width: 100%;
    height: 48px;
    line-height: 48px;
    // border-radius: 8px;
    color: white;
    text-align: center;
    background: $color-main;
    // background: #17b8a3;
  }
}
.FAB{
  position: absolute;
  right: 16px;
  bottom: 48px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: white;
  background: $color-main;
  box-shadow: 1px 1px 6px 1px rgba(0,0,0,0.2);
  line-height: 64px;
  text-align: center;
  font-size: 24px;
  z-index: 10;
  :hover{
    opacity: 0.5;
  }
}
.container-enter-active,.container-leave-active{
  transition: .3s ease-in-out;
}
.container-enter,.container-leave-to{
  opacity: 0;
  transform: translateY(100%);
}
</style>
