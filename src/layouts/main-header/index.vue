<style lang="scss">
.top-search {
  height: 36px;
  // width: 400px;
  padding-left: 36px;
  letter-spacing: 1px;
  &::-webkit-input-placeholder {
    color: #222;
  }
}
</style>

<script setup>
import UploadIndex from "./upload-index.vue";
</script>

<template>
  <div class="pos-r flex-1">
    <icon-search class="y-center ev-n" style="left: 10px" />
    <input
      v-model="searchKey"
      type="text"
      placeholder="Search"
      class="bg-info bdrs-100 w100p top-search"
    />
  </div>

  <q-btn
    class="ml-3"
    color="primary"
    rounded
    :round="asMobile"
    :size="btnSize"
    :style="asMobile ? '' : 'width: 110px'"
    @click="onNew"
  >
    <icon-add />
    <span class="ml-2" v-if="!asMobile">NEW</span>
    <upload-index />
  </q-btn>

  <q-btn class="ml-3" color="info" rounded :round="asMobile" :size="btnSize" @click="onWallet">
    <q-avatar size="22px">
      <img src="/img/metamask.png" />
    </q-avatar>
    <span v-if="!asMobile" class="q-ml-sm">Connect Wallet</span>
  </q-btn>
</template>

<script>
import { debounce } from "../../utils/helper";
import { useQuasar } from "quasar";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      searchKey: "",
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    asMobile() {
      return this.screen.width < 690;
    },
    btnSize() {
      return this.asMobile ? "12px" : null;
    },
  },
  watch: {
    searchKey(val) {
      this.searchKey = val.replace("/", "");
      debounce(() => {
        this.$bus.emit("search-key", this.searchKey);
      }, 500);
    },
    path() {
      this.searchKey = "";
    },
  },
  methods: {
    onNew() {
      this.$bus.emit("click-new");
    },
    onWallet() {
      window
        .$alert("test")
        .then(() => {
          window.$toast("ok");
        })
        .catch(() => {
          console.log(11);
        });
    },
  },
};
</script>