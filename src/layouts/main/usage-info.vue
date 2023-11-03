<template>
  <div class="bg-black-1 pa-5" v-if="usage.total">
    <div class="al-c">
      <span>IPFS Used</span>
      <span class="ml-auto">{{ usage.used }}/{{ usage.total }}</span>
    </div>
    <div class="mt-3">
      <q-linear-progress :value="usage.perc" color="secondary" />
    </div>
    <!-- <div class="mt-3 al-c" style="color: #475569">
        <span>Remaining 40GB July 3,2022</span>
        <div class="ml-1">
          <img src="/img/common/info-o.svg" width="16" class="d-b" />
          <q-tooltip anchor="top middle" self="bottom middle" max-width="300px" class="bg-black-8">
            "used resources" refers to the space occupied by files in "My Drive", while "remaining
            resources" refers to the remaining IPFS resources in the current account on 4EVERLAND.
          </q-tooltip>
        </div>
      </div> -->
    <div class="mt-5">
      <q-btn outline class="full-width" to="/resource">Get More</q-btn>
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