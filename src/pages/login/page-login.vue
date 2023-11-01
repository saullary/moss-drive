<script setup>
import WalletConnect from "./wallet-connect.vue";
</script>

<template>
  <div class="q-pa-lg">
    <wallet-connect @login="ssoLogin" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    async ssoLogin({ stoken }) {
      try {
        this.$loading("Login....");
        const { data } = await this.$http.post(`$auth/st/${stoken}`);
        this.$setStore({
          loginData: data,
        });
        console.log(this.$store.state.loginData);
      } catch (error) {
        console.log(error);
      }
      this.$loadingClose();
    },
  },
};
</script>

