<template>
  <div class="New">
    <transition name="container">
      <div class="New__container" v-if="isOpen">
        <div class="Top">
          <h2 class="Top__header">
            <div class="Top__close">
              <font-awesome-icon icon="times" @click.stop="closeNew()"/>
            </div>
            <div class="Top__data">
              <div class="Top__data__question" :class="{hasError:!question.isValid}">{{question.length}}/150</div>
              <div class="Top__data__options">{{options.length}}</div>
            </div>
          </h2>
          <textarea class="Top__question"
            v-model="question.text" cols="30" rows="2" placeholder="質問文"
            @input="questionValidate()"
            >
          </textarea>
        </div>
        <draggable v-model="options" handle=".New__option__handle" @touchmove.prevent.stop>
          <transition-group name="option">
            <div class="New__options" v-for="(option, index) in options" :key="option.id">
              <div class="New__option__container" :id="'option_'+option.id">
                <textarea class="New__option" cols="30" rows="3" v-model="option.answer" :placeholder="index+1"
                  @touchstart="delTouchStart(index)"
                  @touchmove="delTouchMove(option.id)"
                  @touchend.stop="delTouchEnd(option.id)"
                  @input="answerValidate(option)"
                  ></textarea>
                <div class="New__option__handle"><font-awesome-icon icon="bars"/></div>
              </div>
              <div class="New__option__num" :class="{hasError:!option.isValid}">{{option.length}}/40</div>
              <!-- <div class="New__option__delete"></div> -->
              <div class="New__delete__behind" :class="{on:deleteConfig.trigger}"><font-awesome-icon icon="trash-alt"/></div>
            </div>
          </transition-group>
        </draggable>
        <div class="Buttons">
          <div class="Buttons__add-option" @click.stop="addOption">
            <font-awesome-icon icon="plus"/>
          </div>
          <div class="Buttons__submit" @click.stop="servePost" :class="{hasError:!postValidate}">
            サーブ
          </div>
        </div>
      </div>
    </transition>
    <div class="New__FAB" @click="openNew()"><font-awesome-icon icon="plus"/></div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

import api from '@/services/api'
export default {
  name: 'New',
  components: {
    draggable
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      unique_id: '',
      user_id: '',
      question: {
        text: '',
        length: 0,
        isValid: false
      },
      draggable_options: {
        animation: 200
      },
      count: 2,
      options: [
        { id: 0, answer: '', length: 0, isValid: false },
        { id: 1, answer: '', length: 0, isValid: false }
      ],
      validPattern: {
        question: /\d/,
        options: ''
      },
      deleteConfig: {
        isStart: false,
        trigger: false,
        loading: false,
        startX: 0,
        diffX: 0
      }
    }
  },
  methods: {
    addOption () {
      if (this.options.length < 10) {
        this.options.push({
          id: this.count++,
          answer: '',
          length: 0,
          isValid: false
        })
      } else {
        alert('これ以上作成できません')
      }
    },
    delTouchStart (index) {
      var e = event.type === 'touchstart' ? event.changedTouches[0] : event
      this.deleteConfig.isStart = true
      this.deleteConfig.trigger = false
      this.deleteConfig.startX = e.clientX
      this.deleteConfig.index = index
    },
    delTouchMove (id) {
      // touchイベントとその他のイベントの統合
      var e = event.type === 'touchmove' ? event.changedTouches[0] : event
      var delConf = this.deleteConfig
      delConf.diffX = e.clientX - delConf.startX
      delConf.trigger = delConf.diffX < -100 // 左に動いた距離が100pxを常時表示
      if (delConf.diffX < 0) {
        document.getElementById('option_' + id).style.transition = null
        document.getElementById('option_' + id).style.transform = 'translateX(' + delConf.diffX + 'px)'
      } else {
        document.getElementById('option_' + id).style.transition = '.15s ease-in-out'
        document.getElementById('option_' + id).style.transform = null
      }
    },
    delTouchEnd (id) {
      var delConf = this.deleteConfig
      if (delConf.trigger) this.deleteOption(delConf.index)
      document.getElementById('option_' + id).style.transition = '.15s ease-in-out'
      document.getElementById('option_' + id).style.transform = null
      delConf.isStart = false
      delConf.trigger = false
    },
    deleteOption (selectNum) {
      if (this.options.length > 2) {
        this.options.splice(selectNum, 1)
      } else {
        alert('これ以上削除できません')
      }
    },
    servePost () {
      // console.log('servePost')
      if (!this.postValidate) return
      for (let i = 0; i < this.options.length; i++) {
        this.options[i].select_num = i
        delete this.options[i].id
        delete this.options[i].length
        delete this.options[i].isValid
      }
      api.post('/api/v1/posts/', {
        unique_id: this.unique_id,
        question: this.question.text,
        options: this.options
      })
        .then((response) => {
          if (response.status === 201) alert('投稿完了！')
          this.$emit('switchNew')
          this.$emit('refresh')
        })
        .catch((error) => {
          // console.log(error.response)
          var errMessage
          switch (error.response.status) {
            case 400:
              errMessage = '無効なリクエストです。'
          }
          this.$store.dispatch('message/setErrorMessage', { message: errMessage })
          setTimeout(() => {
            this.$store.state.message.error = ''
            this.$store.state.message.warnings = []
            this.$store.state.message.info = ''
          }, 2000)
        })
      this.question = ''
      this.count = 2
      this.options = [
        { id: 0, answer: '', length: 0, isInvalid: false },
        { id: 1, answer: '', length: 0, isInvalid: false }
      ]
    },
    questionValidate () {
      var question = this.question
      question.length = question.text.length
      question.isValid = (question.length > 0 && question.length <= 150)
      return question.isValid
    },
    answerValidate (option) {
      option.length = option.answer.length
      option.isValid = (option.length > 0 && option.length <= 40)
      return option.isValid
    },
    openNew () {
      this.$emit('switchNew')
      var post = JSON.parse(localStorage.getItem('post'))
      if (post === null) return
      if (confirm('下書きがあります。使用しますか？')) {
        this.question = post.question
        this.options = post.options
      } else {
        localStorage.removeItem('post')
      }
    },
    closeNew () {
      this.$emit('switchNew')
      if (confirm('下書きを保存しますか？')) {
        var post = {
          question: this.question,
          options: this.options
        }
        var obj = JSON.stringify(post)
        localStorage.setItem('post', obj)
      } else {
        localStorage.removeItem('post')
      }
      this.question = {
        text: '',
        length: 0,
        isValid: false
      }
      this.options = [
        { id: 0, answer: '', length: 0, isValid: false },
        { id: 1, answer: '', length: 0, isValid: false }
      ]
    }
  },
  computed: {
    postValidate () {
      if (!this.question.isValid) return false
      for (let item of this.options) {
        if (!item.isValid) return false
      }
      // console.log('all clear')
      return true
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
    @include scrollbar;
  }
  &__FAB{
    cursor: pointer;
    position: fixed;
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
    &:hover{
      opacity: 0.8;
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
    &__num{
      position: absolute;
      bottom: 8px;
      right: 48px;
      width: 80px;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      border-radius: 12px;
      background: $color-sub;
      color:#fff;
      text-align: center;
      &.hasError{
        background: red;
      }
    }
  }
  &__options{
    position: relative;
  }
  &__option__container{
    display: flex;
  }
  &__delete__button{
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
  &__delete__behind{
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    line-height: 64px;
    background: red;
    text-align: right;
    padding: 0 14px;
    z-index: -1;
    font-size: 12px;
    color: white;
    &.on{
      padding: 0 11px;
      font-size: 20px;
    }
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
  &__header{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 49px;
    line-height: 48px;
    padding: 8px;
    margin: 0;
    border-bottom: solid 1px #ccc;
    color: #888;
  }
  &__close{
    cursor: pointer;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 50%;
    font-size: 20px;
  }
  &__data{
    height: 100%;
    padding: 4px 0;
    display: flex;
    &__question{
      width: 80px;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      margin-right: 16px;
      border-radius: 12px;
      background: $color-sub;
      color:#fff;
      text-align: center;
      &.hasError{
        background: red;
      }
    }
    &__options{
      width: $delete-width;
      height: $delete-width;
      line-height: $delete-width;
      font-size: 14px;
      border-radius: 50%;
      color: white;
      text-align: center;
      background: $color-main;
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
  background: white;
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
  &__submit{
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: white;
    text-align: center;
    background: $color-main;
    &.hasError{
      opacity: 0.5;
    }
  }
}
.container-enter-active,.container-leave-active{
  transition: .3s ease-in-out;
}
.container-enter,.container-leave-to{
  opacity: 0;
  transform: translateY(100%);
}
.option-enter-active,.option-leave-active{
  transition: .3s ease-in-out;
}
.option-enter,.option-leave-to{
  transform: translateX(-100%);
  opacity: 0;
}
</style>
