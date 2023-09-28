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

<template>
  <div class="al-c">
    <div class="pos-r flex-1">
      <icon-search class="y-center ev-n" style="left: 10px" />
      <input type="text" placeholder="Search" class="bg-info bdrs-100 w100p top-search" />
    </div>

    <q-btn
      class="ml-3"
      color="primary"
      rounded
      :round="asMobile"
      :size="btnSize"
      :style="asMobile ? '' : 'width: 110px'"
    >
      <icon-add />
      <span class="ml-2" v-if="!asMobile">NEW</span>
    </q-btn>

    <q-btn class="ml-3" color="info" rounded :round="asMobile" :size="btnSize" @click="onWallet">
      <q-avatar size="22px">
        <img src="/img/metamask.png" />
      </q-avatar>
      <span v-if="!asMobile" class="q-ml-sm">Connect Wallet</span>
    </q-btn>
  </div>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  data() {
    const { screen } = useQuasar();
    return {
      screen,
    };
  },
  computed: {
    asMobile() {
      return this.screen.width < 690;
    },
    btnSize() {
      return this.asMobile ? "12px" : null;
    },
  },
};
</script>