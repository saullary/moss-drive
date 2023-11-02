<script setup>
import WalletConnect from "./wallet-connect.vue";
</script>

<template>
  <div class="q-pa-lg">
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
        this.$setStore({
          loginData: data,
        });
        this.onRedirect();
      } catch (error) {
        console.log(error);
      }
      this.$loadingClose();
    },
  },
};
</script>

