<script setup>
import WalletConnect from "./wallet-connect.vue";
</script>

<template>
  <div class="q-pa-lg ta-c">
    <div class="mt-5 fz-30">Connect Wallet</div>
    <div class="pa-6"></div>
    <wallet-connect @login="ssoLogin" />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      loginData: (s) => s.loginData,
    }),
  },
  created() {
    if (this.loginData.uid) {
      this.$router.replace("/");
    }
  },
  methods: {
    onRedirect() {
      const redirectTo = localStorage.loginTo || "/";
      this.$router.replace(redirectTo);
    },
    async ssoLogin({ stoken }) {
      try {
        this.$loading("Login....");
        const { data } = await this.$http.post(`$auth/st/${stoken}`);
        this.$store.dispatch("login", data);
        this.onRedirect();
      } catch (error) {
        console.log(error);
      }
      this.$loadingClose();
    },
  },
};
</script>

