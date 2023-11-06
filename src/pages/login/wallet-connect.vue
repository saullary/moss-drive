<template>
  <!-- <q-btn color="primary" @click="onConnect">Connect Wallet</q-btn> -->
  <q-btn-dropdown :loading="loading" split color="primary" @click="onConnect(defItem.type)">
    <template #label>
      <img :src="defItem.img" width="26" />
      <span class="ml-3">{{ defItem.label }}</span>
    </template>
    <q-list>
      <q-item
        v-for="it in walletList.slice(1)"
        :key="it.type"
        clickable
        v-close-popup
        @click="onConnect(it.type)"
      >
        <q-item-section avatar>
          <img :src="it.img" width="26" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ it.label }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ it.sub }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <q-dialog v-model="showInstall">
    <q-card class="full-width" style="max-width: 450px">
      <q-card-section>
        <div class="text-h6">Install</div>
      </q-card-section>
      <q-card-section>
        <div class="al-c">
          <img :src="curItem.img" width="50" />
          <div class="ml-3">
            <div class="text-h6">{{ curItem.label }}</div>
            <p>{{ curItem.desc }}</p>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="mt-4" align="right">
        <q-btn flat color="white" label="Cancel" @click="showInstall = false" />
        <q-btn rounded color="primary" width="100px" @click="onInstall">OK</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <iframe
    class="d-n"
    @load="onLoad"
    ref="iframe"
    :src="'/check-wallet.html?t=' + checkTimes"
    frameborder="0"
  ></iframe>
</template>

<script>
import { mapState } from "vuex";
import { WalletSign } from "./wallet-sign";

const walletList = [
  {
    name: "metamask",
    type: "METAMASK",
    label: "MetaMask",
    sub: "Popular",
    img: "https://dashboard.4everland.org/img/metamask.3a5d5844.png",
    desc: "Your key to blockchain applications",
    link: "https://metamask.io/download/",
  },
  {
    name: "phantom",
    type: "SOLANA",
    label: "Phantom",
    sub: "solana",
    img: "https://dashboard.4everland.org/img/phantom.e54e87fd.png",
    desc: "A friendly crypto wallet for web3",
    link: "https://phantom.app/",
  },
  {
    name: "coinbase",
    type: "COINBASE",
    label: "CoinBase Wallet",
    img: "https://dashboard.4everland.org/img/coinbase.e8af2fcc.png",
    desc: "A crypto wallet on CoinBase",
    link: "https://www.coinbase.com/",
  },
  {
    name: "aptos",
    type: "PETRA",
    label: "Petra Aptos Wallet",
    img: "https://dashboard.4everland.org/img/petra.097a9d78.svg",
    desc: "A crypto wallet on Aptos",
    link: "https://petra.app/",
  },
  {
    name: "okxwallet",
    type: "OKX",
    label: "OKX Wallet",
    img: "https://dashboard.4everland.org/img/okx.1028cc3e.svg",
    desc: "One interoperable wallet for all your Web3 needs",
    link: "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
  },
];
export default {
  emits: ["login"],
  data() {
    return {
      walletList,
      showInstall: false,
      curType: "",
      checkFlag: -1,
      checkTimes: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      isFocus: (s) => s.isFocus,
    }),
    defItem() {
      return this.walletList[0];
    },
    curItem() {
      return this.walletList.find((it) => it.type == this.curType) || this.defItem;
    },
  },
  watch: {
    isFocus(val) {
      if (val) this.checkTimes++;
    },
    checkFlag(val, old) {
      console.log("wallet-check", val);
      if (old == -1) return;
      this.$toast("Wallet changed");
      setTimeout(() => {
        location.reload();
      }, 2e3);
    },
  },
  mounted() {},
  methods: {
    onLoad() {
      this.checkFlag = this.$refs.iframe.contentDocument.title;
    },
    onInstall() {
      window.open(this.curItem.link);
    },
    async onConnect(type) {
      this.curType = type;
      try {
        const wallet = new WalletSign(type);
        if (!wallet.client) {
          this.showInstall = true;
          return;
        }
        this.loading = true;
        const account = await wallet.getAccount();
        const nonce = await this.getNonce(account);
        const signature = await wallet.getSign(nonce);
        console.log({
          type,
          account,
          signature,
        });
        const stoken = await this.getStoken(account, {
          signature,
          walletType: type,
        });
        console.log({
          stoken,
        });
        this.$emit("login", {
          stoken,
        });
      } catch (error) {
        console.log(error);
        this.$alert(error.message);
      }
      // this.$loadingClose();
      this.loading = false;
    },
    async getNonce(account) {
      const { data } = await this.$http.get(`$auth/web3code/${account}`);
      return data.nonce;
    },
    async getStoken(account, params) {
      const body = {
        appName: "BUCKET",
        // inviteCode,
        type: "ETH",
        // capT: capToken,
        ...params,
      };
      const { data } = await this.$http.post(`$auth/web3login/${account}`, body);
      return data.stoken;
    },
  },
};
</script>

