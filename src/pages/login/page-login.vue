<script setup>
import WalletConnect from "./wallet-connect.vue";
</script>

<template>
  <div class="q-pa-lg ta-c">
    <div v-if="!xInfo">
      <div class="mt-5 fz-30">Login</div>
      <div class="pa-6"></div>
      <q-btn
        @click="onTwitter"
        :loading="xLoading"
        flat
        rounded
        style="background: #000; width: 200px"
      >
        <img src="/img/common/x.svg" width="20" />
      </q-btn>
    </div>
    <div v-else>
      <div class="mt-5 fz-30">Connect Wallet</div>
      <div class="pa-6"></div>
      <wallet-connect @login="ssoLogin" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      xInfo: null,
      xLoading: false,
    };
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
    async onTwitter() {
      try {
        this.xLoading = true;
        const { data } = await this.$http.get("$auth/login/twitter");
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      this.xLoading = false;
    },
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

