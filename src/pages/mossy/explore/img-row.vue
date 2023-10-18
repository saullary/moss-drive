<template>
  <a :href="src" :data-pswp-width="boxWidth" :data-pswp-height="boxHeight">
    <img ref="img" class="w100p" :src="src" @load="onLoad" />
  </a>
</template>

<script>
export default {
  props: {
    src: String,
    height: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      boxWidth: 700,
      boxHeight: 500,
    };
  },
  methods: {
    onLoad() {
      const el = this.$refs.img;
      if (!el) return;
      this.boxWidth = el.naturalWidth;
      this.boxHeight = el.naturalHeight;
    },
  },
};
</script>