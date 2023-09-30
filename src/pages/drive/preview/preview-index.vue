<template>
  <q-dialog v-model="showPop" v-bind="dialogOpt">
    <component :is="compName" :list="list" :current="current" />
  </q-dialog>
</template>

<script>
import CommonPreview from "./common-preview.vue";
import MusicPlayer from "./music-player.vue";

export default {
  components: {
    CommonPreview,
    MusicPlayer,
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: Boolean,
    list: Array,
    current: Number,
  },
  data() {
    return {
      showPop: this.modelValue,
    };
  },
  computed: {
    compName() {
      let name = "common-preview";
      if (this.list.every((it) => it.type == "audio")) {
        name = MusicPlayer.name;
      }
      return name;
    },
    dialogOpt() {
      if (this.compName == MusicPlayer.name) {
        return {
          position: "bottom",
        };
      }
      return {};
    },
  },
  watch: {
    modelValue(val) {
      this.showPop = val;
    },
    showPop(val) {
      this.$emit("update:modelValue", val);
    },
  },
};
</script>