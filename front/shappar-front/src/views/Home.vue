<template>
  <div id="home-page">
    <GlobalHeader/>
    <GlobalMessage/>

    <!-- メインエリア -->
    <main class="container">
      <p class="h5 mb-4">ホーム</p>
      <b-form @submit.prevent="submitSave">
        <div class="row form-group">
          <label class="col-sm-3 col-form-label">タイトル</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="form.book.title">
          </div>
        </div>
        <div class="row form-group">
          <label class="col-sm-3 col-form-label">価格</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="form.book.price">
          </div>
        </div>
        <div class="row text-center mt-5">
          <div class="col-sm-12">
            <b-button type="submit" variant="primary">{{ isCreated ? '更新' : '登録' }}</b-button>
          </div>
        </div>
      </b-form>
    </main>
  </div>
</template>

<script>
import api from '@/services/api'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalMessage from '@/components/GlobalMessage.vue'
export default {
  components: {
    GlobalHeader,
    GlobalMessage
  },
  data () {
    return {
      form: {
        book: {
          title: '',
          price: 0
        }
      }
    }
  },
  computed: {
    isCreated: function () {
      return this.form.book.id !== undefined
    }
  },
  methods: {
    // 登録・更新ボタン押下
    submitSave: function () {
      api({
        // 登録済みかどうかでHTTPメソッドとエンドポイントを切り替える
        method: this.isCreated ? 'put' : 'post',
        url: this.isCreated ? '/books/' + this.form.book.id + '/' : '/books/',
        data: {
          'id': this.form.book.id,
          'title': this.form.book.title,
          'price': this.form.book.price
        }
      })
        .then(response => {
          const message = this.isCreated ? '更新しました。' : '登録しました。'
          this.$store.dispatch('message/setInfoMessage', { message: message })
          this.form.book = response.data
        })
    }
  }
}
</script>
