<style lang="scss">
.q-linear-progress__track--dark {
  border-radius: 20px;
  background: var(--q-primary);
  opacity: 1;
}
.q-linear-progress__model {
  border-radius: 20px;
}
</style>

<template>
  <div class="q-pa-md">
    <div class="bg-card-1 pa-4">
      <div class="al-c">
        <span class="title">IPFS Storage</span>
        <span class="ml-auto fz-13">
          <!-- Total 120GB July 3,2022 -->
          {{ usage.used }}/{{ usage.total }}
        </span>
      </div>
      <div class="mt-4">
        <q-linear-progress
          :value="0"
          :buffer="usage.perc"
          size="10px"
          rounded
          color="accent"
          style="background: #334155"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      usage: (s) => s.usageInfo,
    }),
  },
};
</script>