<template>
  <!-- <q-btn color="primary" @click="onConnect">Connect Wallet</q-btn> -->
  <q-btn-dropdown split color="primary" @click="onConnect('metamask')">
    <template #label>
      <img :src="defItem.img" width="26" />
      <span class="ml-3">{{ defItem.label }}</span>
    </template>
    <q-list>
      <q-item
        v-for="it in walletList.slice(1)"
        :key="it.name"
        clickable
        v-close-popup
        @click="onConnect(it.name)"
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
    @load="onLoad"
    ref="iframe"
    :src="'/check-wallet.html?t=' + checkTimes"
    frameborder="0"
  ></iframe>
</template>

<script>
export default {
  data() {
    return {
      walletList: [
        {
          name: "metamask",
          label: "MetaMask",
          sub: "Popular",
          img: "https://dashboard.4everland.org/img/metamask.3a5d5844.png",
          desc: "Your key to blockchain applications",
          link: "https://metamask.io/download/",
        },
        {
          name: "phantom",
          label: "Phantom",
          sub: "solana",
          img: "https://dashboard.4everland.org/img/phantom.e54e87fd.png",
          desc: "A friendly crypto wallet for web3",
          link: "https://phantom.app/",
        },
        {
          name: "coinbase",
          label: "CoinBase Wallet",
          img: "https://dashboard.4everland.org/img/coinbase.e8af2fcc.png",
          desc: "A crypto wallet on CoinBase",
          link: "https://www.coinbase.com/",
        },
        {
          name: "aptos",
          label: "Petra Aptos Wallet",
          img: "https://dashboard.4everland.org/img/petra.097a9d78.svg",
          desc: "A crypto wallet on Aptos",
          link: "https://petra.app/",
        },
        {
          name: "okxwallet",
          label: "OKX Wallet",
          img: "https://dashboard.4everland.org/img/okx.1028cc3e.svg",
          desc: "One interoperable wallet for all your Web3 needs",
          link: "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
        },
      ],
      showInstall: false,
      curName: "",
      checkFlag: -1,
      checkTimes: 0,
    };
  },
  computed: {
    defItem() {
      return this.walletList[0];
    },
    curItem() {
      return this.walletList.find((it) => it.name == this.curName) || this.defItem;
    },
  },
  watch: {
    checkFlag(val, old) {
      console.log("wallet-check", val);
      if (old == -1) return;
      this.$toast("Wallet changed");
      setTimeout(() => {
        location.reload();
      }, 1e3);
    },
  },
  mounted() {
    window.onfocus = () => {
      this.checkTimes++;
    };
  },
  methods: {
    onLoad() {
      this.checkFlag = this.$refs.iframe.contentDocument.title;
    },
    onInstall() {
      window.open(this.curItem.link);
    },
    onConnect(name) {
      this.curName = name;
      const provider = this.getProvider(name);
      console.log(provider);
      if (!provider) {
        this.showInstall = true;
      }
    },
    getProvider(type = "metamask") {
      if (["aptos", "okxwallet"].includes(type)) {
        return window[type];
      }
      let provider = window.ethereum;
      if (type == "phantom") {
        provider = window.phantom?.solana;
        return provider?.isPhantom ? provider : null;
      }
      if (!provider) {
        return null;
      }
      const isType = {
        metamask: "isMetaMask",
        coinbase: "isCoinbaseWallet",
      }[type];
      if (!provider[isType]) {
        const { providers = [] } = provider;
        provider = null;
        providers.forEach((it) => {
          if (it[isType]) provider = it;
        });
      }
      return provider;
    },
  },
};
</script>