<style lang="scss">
.top-search {
  height: 36px;
  // width: 400px;
  padding-left: 36px;
  letter-spacing: 1px;
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
      class="bdrs-100 w100p top-search"
      :class="searchKey ? 'bg-white' : 'bg-info'"
    />
  </div>

  <q-btn
    v-if="inDrive || inStone"
    class="ml-3"
    color="primary"
    rounded
    :round="asMobile"
    :size="btnSize"
    :style="asMobile ? '' : 'width: 110px'"
    @click="onNew"
  >
    <icon-new-stone v-if="inStone"></icon-new-stone>
    <icon-add v-if="inDrive" />
    <span class="ml-2" v-if="!asMobile">{{ inDrive ? "NEW" : "Stone" }}</span>
    <upload-index v-if="inDrive" />
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
    inDrive() {
      return this.path.startsWith("/drive");
    },
    inStone() {
      return this.path.startsWith("/stone");
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
      this.$alert("test")
        .then(() => {
          this.$toast("ok");
        })
        .catch(() => {
          console.log(11);
        });
    },
  },
};
</script>