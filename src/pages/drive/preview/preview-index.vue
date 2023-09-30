<style lang="scss">
@media (max-width: 599.98px) {
  // .q-slider__track,
  .q-dialog__inner--bottom > div {
    border-radius: 0;
  }
}
</style>

<template>
  <q-dialog v-model="showPop" v-bind="dialogOpt">
    <component :is="compName" :list="compList" :current="compCurrent" />
  </q-dialog>
</template>

<script>
import CommonPreview from "./common-preview.vue";
import MusicPlayer from "./music-player.vue";
import ImgViewer from "./img-viewer.vue";

export default {
  components: {
    CommonPreview,
    MusicPlayer,
    ImgViewer,
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
    curItem() {
      return this.list[this.current] || {};
    },
    isAudio() {
      return this.curItem.type == "audio";
    },
    isImage() {
      return this.curItem.type == "image";
    },
    compName() {
      let name = "common-preview";
      if (this.isAudio) {
        name = MusicPlayer.name;
      } else if (this.isImage) {
        name = ImgViewer.name;
      }
      return name;
    },
    compList() {
      if (this.isAudio) {
        return this.list.filter((it) => it.type == "audio");
      }
      if (this.isImage) {
        return this.list.filter((it) => it.type == "image");
      }
      return this.list;
    },
    compCurrent() {
      if (this.isAudio || this.isImage) {
        return this.compList.findIndex((it) => it == this.curItem);
      }
      return this.current;
    },
    dialogOpt() {
      if (this.isAudio) {
        return {
          position: "bottom",
          // seamless: true,
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