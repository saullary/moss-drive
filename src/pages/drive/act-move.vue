<template>
  <q-dialog v-model="showPop" position="top" :persistent="moving">
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section class="pos-s top-0 bg-dark z-10">
        <div class="al-c">
          <div class="text-h6">
            <span>Move to</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <drive-list />
      </q-card-section>

      <q-card-actions align="right" class="text-primary pos-s btm-0 bg-dark">
        <template v-if="!isDone">
          <q-btn flat color="white" label="Cancel" @click="showPop = false" />
        </template>
        <q-btn v-if="isDone" color="primary" @click="showPop = false"> Done </q-btn>
        <q-btn v-else color="primary" :loading="moving" @click="onMove">OK</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import DriveList from "./drive-list.vue";

export default {
  components: {
    DriveList,
  },
  props: {
    checkList: Array,
  },
  data() {
    return {
      showPop: false,
      moving: false,
      isDone: false,
    };
  },
  methods: {
    onMove() {},
  },
};
</script>