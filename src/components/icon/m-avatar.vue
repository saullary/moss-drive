<template>
  <div ref="content" class="al-c"></div>
</template>

<script>
import jazzicon from "jazzicon";

export default {
  props: {
    hash: String,
    size: {
      default: 22,
      type: Number,
    },
  },
  data() {
    return {
      iconDom: null,
    };
  },
  mounted() {
    this.getIcon();
  },
  computed: {
    addrSeed() {
      const addr = this.hash.slice(2, 10);
      const seed = parseInt(addr, 16);
      return seed;
    },
  },
  methods: {
    getIcon() {
      const identicon = jazzicon(this.size, this.addrSeed);
      this.iconDom = identicon.cloneNode(true);
      this.$refs.content.appendChild(this.iconDom);
    },
  },
};
</script>
