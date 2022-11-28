<template>
  <div
    class="NewPage"
    @touchmove.stop.prevent
    @wheel.stop
  >
    <transition
      name="container"
      @touchmove.stop
    >
      <div
        v-if="isOpen"
        class="NewPage__container"
        @touchmove.stop.prevent
      >
        <div class="Top">
          <h2 class="Top__header">
            <div
              class="Top__close"
              @click.stop="closeNew()"
            >
              <font-awesome-icon icon="times" />
            </div>
            <div class="Top__data">
              <div
                class="Top__data__question"
                :class="{hasError:!question.isValid}"
              >
                {{ question.length }}/150
              </div>
              <div class="Top__data__options">
                {{ options.length }}
              </div>
            </div>
          </h2>
          <div class="Top__question">
            <textarea
              v-model="question.text"
              cols="30"
              rows="2"
              placeholder="質問"
              @input="questionValidate()"
            />
          </div>
        </div>
        <draggable
          v-model="options"
          handle=".NewPage__option__handle"
          @touchmove.prevent.stop
        >
          <transition-group
            name="option"
            @touchmove.stop
          >
            <div
              v-for="(option, index) in options"
              :key="option.id"
              class="NewPage__option__container"
              @touchmove.stop.prevent
            >
              <div
                :id="'option_'+option.id"
                class="NewPage__option__wrapper"
                @touchmove.stop.prevent
              >
                <div class="NewPage__option__data">
                  <div class="NewPage__option__controll">
                    <div
                      class="NewPage__delete"
                      @click="deleteOption(index)"
                    >
                      <font-awesome-icon icon="times" />
                    </div>
                    <div
                      class="NewPage__option__num"
                      :class="{hasError:!option.isValid}"
                      @touchmove.stop.prevent
                    >
                      {{ option.length }}/40
                    </div>
                  </div>
                  <textarea
                    v-model="option.answer"
                    class="NewPage__option__text"
                    cols="30"
                    rows="3"
                    :placeholder="'回答'+(index+1)"
                    @touchstart="delTouchStart(index)"
                    @touchmove.stop="delTouchMove(option.id)"
                    @touchend.stop="delTouchEnd(option.id)"
                    @input="answerValidate(option)"
                  />
                </div>
                <div class="NewPage__option__handle">
                  <font-awesome-icon icon="bars" />
                </div>
              </div>
              <div
                class="NewPage__delete__behind"
                :class="{on:deleteConfig.trigger}"
                @touchmove.stop.prevent
              >
                <font-awesome-icon icon="trash-alt" />
              </div>
            </div>
          </transition-group>
        </draggable>
        <div class="Buttons">
          <div
            class="Buttons__add-option"
            :class="{hasError: options.length === 10}"
            @click.stop="addOption"
          >
            <font-awesome-icon icon="plus" />
          </div>
          <div
            class="Buttons__submit"
            :class="{hasError:!postValidate}"
            @click.stop="servePost"
          >
            <font-awesome-icon icon="paper-plane" />
          </div>
        </div>
      </div>
    </transition>
    <div
      class="NewPage__FAB"
      @click="openNew()"
    >
      <font-awesome-icon icon="plus" />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

import api from '@/services/api'
export default {
  name: 'NewPage',
  components: {
    draggable
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['switchNew', 'refresh'],
  data: function () {
    return {
      question: {},
      count: 2,
      options: [],
      validPattern: {
        question: /\d/,
        options: ''
      },
      draggable_options: {
        animation: 200
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
  computed: {
    postValidate () {
      let count = 0
      if (!this.question.isValid) return false
      if (this.question.text === '') return false
      for (const item of this.options) {
        if (!this.answerValidate(item)) return false
        if (item.answer !== '' && item.isValid) count++
      }
      if (count < 2) return false
      return true
    }
  },
  created () {
    // Publicができる時（※開いたときではない）
    this.initPost()
    this.question.isValid = this.questionValidate()
    this.options.forEach(item => {
      item.isValid = this.answerValidate(item)
    })
  },
  methods: {
    addOption () {
      if (this.options.length === 10) return
      this.options.push({
        id: this.count++,
        answer: '',
        length: 0,
        isValid: true
      })
    },
    deleteOption (selectNum) {
      if (this.options.length > 2) {
        this.options.splice(selectNum, 1)
      } else {
        this.$store.dispatch('message/setErrorMessage', { message: '選択肢は2つ以上必要です。' })
      }
    },
    delTouchStart (index) {
      const e = event.type === 'touchstart' ? event.changedTouches[0] : event
      this.deleteConfig.isStart = true
      this.deleteConfig.trigger = false
      this.deleteConfig.startX = e.clientX
      this.deleteConfig.index = index
    },
    delTouchMove (id) {
      // touchイベントとその他のイベントの統合
      const e = event.type === 'touchmove' ? event.changedTouches[0] : event
      const delConf = this.deleteConfig
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
      const delConf = this.deleteConfig
      if (delConf.trigger) this.deleteOption(delConf.index)
      document.getElementById('option_' + id).style.transition = '.15s ease-in-out'
      document.getElementById('option_' + id).style.transform = null
      delConf.isStart = false
      delConf.trigger = false
    },
    servePost () {
      // console.log('servePost')
      if (!this.postValidate) return
      // 一旦保存
      this.savePost()
      // 送信する情報のみを抽出
      const serveOptions = []
      let count = 0
      for (const item of this.options) {
        if (item.answer === '') continue
        item.select_num = count++
        delete item.id
        delete item.length
        delete item.isValid
        serveOptions.push(item)
      }
      api.post('/api/v1/posts/', {
        question: this.question.text,
        options: serveOptions
      })
        .then((response) => {
          this.$store.dispatch('message/setInfoMessage', { message: '投稿が完了しました' })
          this.$emit('switchNew')
          this.$emit('refresh')
          localStorage.removeItem('post')
          this.initPost()
        })
    },
    questionValidate () {
      const question = this.question
      question.length = question.text.length
      question.isValid = question.length <= 150
      return question.isValid
    },
    answerValidate (option) {
      option.length = option.answer.length
      option.isValid = option.length <= 40
      return option.isValid
    },
    openNew () {
      this.$emit('switchNew')
      const post = JSON.parse(localStorage.getItem('post'))
      if (post === null) return
      if (confirm('下書きがあります。使用しますか？')) {
        this.question = post.question
        this.options = post.options
      } else {
        localStorage.removeItem('post')
        this.initPost()
      }
    },
    closeNew () {
      this.$emit('switchNew')
      if (this.isEmpty()) {
        // this.options = [
        //   { id: 0, answer: '', length: 0, isValid: true },
        //   { id: 1, answer: '', length: 0, isValid: true }
        // ]
        return localStorage.removeItem('post')
      }
      if (confirm('下書きを保存しますか？')) {
        this.savePost()
      }
      this.question = {
        text: '',
        length: 0,
        isValid: true
      }
      this.options = [
        { id: 0, answer: '', length: 0, isValid: true },
        { id: 1, answer: '', length: 0, isValid: true }
      ]
    },
    savePost () {
      const post = {
        question: this.question,
        options: this.options
      }
      const obj = JSON.stringify(post)
      localStorage.setItem('post', obj)
    },
    initPost () {
      this.question = {
        text: '',
        length: 0,
        isValid: true
      }
      this.count = 2
      this.options = [
        { id: 0, answer: '', length: 0, isValid: true },
        { id: 1, answer: '', length: 0, isValid: true }
      ]
    },
    isEmpty () {
      if (this.question.text !== '') return false
      for (const item of this.options) {
        if (item.answer !== '') return false
      }
      return true
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/common.scss';
.NewPage{
  // position: absolute;
  width: 100%;
  max-width: 700px;
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
    height: 100%;
    width: 100%;
    max-width: 700px;
    // max-height: 100%;
    // top: 100%;
    padding: 164px 0px 0;
    // margin-left: ;
    background: white;
    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 100;
    @include scrollbar;
  }
  &__FAB{
    cursor: pointer;
    position: fixed;
    bottom: 48px;
    width: 64px;
    height: 64px;
    margin-left: calc(100% - 96px);
    @include media(700){
      margin-left: 604px;
    }
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
    &__container{
      position: relative;
      display: flex;
      border-bottom: solid 1px #eee;
      height: 96px;
    }
    &__wrapper{
      width: 100%;
      display: flex;
      background: white;
    }
    &__data{
      width: calc(100% - 40px);
    }
    &__text{
      padding: 0 8px 0 16px;
      box-sizing: border-box;
      // width: calc(100% - 40px);
      width: 100%;
      height: 63px;
      line-height: 21px;
      background: #fff;
      resize: none;
      overflow: hidden;
    }
    &__handle{
      width: 40px;
      min-height:96px;
      padding: 42px 0;
      border-bottom: solid 1px #eee;
      color: black;
      background: #ccc;
      box-sizing: border-box;
      cursor: move;
      svg{
        display: block;
        margin: 0 auto;
        font-size: 14px;
      }
    }
    &__controll{
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 24px;
      // padding-left: calc(100% - 60px);
      padding: 0 8px 0 14px;
    }
    &__num{
      width: 40px;
      line-height: 24px;
      font-size: 14px;
      color:$color-main;
      text-align: right;
      &.hasError{
        color: $color-err;
      }
    }
  }
  &__delete__behind{
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 96px;
    padding: 42px 0;
    padding-left: calc(100% - 40px);
    background: $color-err;
    z-index: -1;
    color: white;
    border-bottom: solid 1px #eee;
    svg{
      display: block;
      margin: 0 auto;
      font-size: 12px;
    }
    &.on{
      padding: 38px 0;
      padding-left: calc(100% - 40px);
      svg{
        font-size: 20px;
      }
    }
  }
  &__delete{
    cursor: pointer;
    color: #888;
    padding: 2px 0;
    width: 20px;
    svg{
      display: block;
      font-size: 20px;
      margin: 0 auto;
    }
  }
}
.Top{
  position: fixed;
  top:0;
  width: 100%;
  max-width: 700px;
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
    padding: 6px;
    border-radius: 50%;
    svg{
      display: block;
      margin: 0 auto;
      font-size: 20px;
    }
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
      margin-right: 40px;
      border-radius: 12px;
      // background: $color-main;
      // color:#fff;
      color: $color-main;
      text-align: right;
      &.hasError{
        color: $color-err;
      }
    }
    &__options{
      position: absolute;
      top: 0;
      right: 0;
      width: 40px;
      height: 48px;
      line-height: 48px;
      // margin-right: -100px;
      font-size: 18px;
      // border-radius: 50%;
      color: white;
      text-align: center;
      background: $color-sub;
      // color: $color-sub;
      font-weight: bold;
    }
  }
  &__question{
    padding: 8px 16px;
    box-sizing: border-box;
    width: 100%;
    height: 100px;
    line-height: 1.6em;
    background: #fff;
    border-radius: 0;
    overflow-y: scroll;
    textarea{
      width: 100%;
      height: 100%;
      resize: none;
    }
    &::placeholder{
      padding: 8px 0;
      line-height: 16px;
    }
  }
}
.Buttons{
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 100;
  box-shadow: 0px -1px 6px 1px rgba(0,0,0,0.2);
  background: white;
  &__add-option{
    width: 100%;
    height: 48px;
    padding: 16px;
    color: white;
    background: $color-sub;
    cursor: pointer;
    &.hasError{
      opacity: 0.5;
      cursor:auto;
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 16px;
    }
  }
  &__submit{
    width: 100%;
    height: 48px;
    padding: 16px;
    color: white;
    background: $color-main;
    cursor: pointer;
    &.hasError{
      opacity: 0.5;
      cursor:auto;
    }
    svg{
      display: block;
      margin: 0 auto;
      font-size: 16px;
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
