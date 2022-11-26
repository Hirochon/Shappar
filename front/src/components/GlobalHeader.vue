<template>
  <!-- ヘッダナビゲーション -->
  <div id="header">
    <b-navbar
      type="dark"
      variant="dark"
    >
      <div class="navbar-brand">
        {{ pageName }}
      </div>
      <b-navbar-nav
        v-if="$route.meta.requiresAuth"
        class="ml-auto"
      >
        <b-nav-item-dropdown
          v-if="isLoggedIn"
          right
        >
          <template #button-content>
            {{ username }}
          </template>
          <b-dropdown-item
            href="#"
            @click="clickLogout"
          >
            ログアウト
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          v-else
          href="#"
          @click="clickLogin"
        >
          ログイン
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  props: {
    pageName: {
      type: String,
      required: true
    }
  },
  computed: {
    username: function () {
      return this.$store.getters['auth/username']
    },
    isLoggedIn: function () {
      return this.$store.getters['auth/isLoggedIn']
    }
  },
  methods: {
    // ログアウトリンク押下
    clickLogout: function () {
      this.$store.dispatch('auth/logout')
      this.$store.dispatch('message/setInfoMessage', { message: 'ログアウトしました。' })
      this.$router.replace('/login')
    },
    // ログインリンク押下
    clickLogin: function () {
      this.$store.dispatch('message/clearMessages')
      this.$router.replace('/login')
    }
  }
}
</script>
