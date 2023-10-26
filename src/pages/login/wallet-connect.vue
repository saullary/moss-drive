<template>
  <!-- <q-btn color="primary" @click="onConnect">Connect Wallet</q-btn> -->
  <q-btn-dropdown split color="primary" @click="onMainClick">
    <template #label>
      <img src="https://dashboard.4everland.org/img/metamask.3a5d5844.png" width="26" />
      <span class="ml-3">MetaMask</span>
    </template>
    <q-list>
      <q-item v-for="it in walletList" :key="it.name" clickable v-close-popup @click="onItemClick">
        <q-item-section avatar>
          <img :src="it.img" width="26" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ it.label }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ it.desc }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  data() {
    return {
      walletList: [
        {
          name: "phantom",
          label: "Phantom",
          desc: "solana",
          img: "https://dashboard.4everland.org/img/phantom.e54e87fd.png",
        },
        {
          name: "coinbase",
          label: "CoinBase Wallet",
          img: "https://dashboard.4everland.org/img/coinbase.e8af2fcc.png",
        },
      ],
    };
  },
  methods: {
    onConnect() {
      const provider = this.getProvider("okxwallet");
      console.log(provider);
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
        provider.providers?.forEach((it) => {
          if (it[isType]) provider = it;
        });
      }
      return provider;
    },
  },
};
</script>