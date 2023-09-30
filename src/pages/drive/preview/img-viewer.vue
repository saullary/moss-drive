<script setup>
import ImgItem from "./img-item.vue";
</script>

<template>
  <q-card class="full-width" style="max-width: 650px">
    <q-card-section class="pos-a right-0 top-0 z-100">
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-carousel
      swipeable
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      :arrows="list.length > 1"
      v-model="curIdx"
      v-model:fullscreen="fullscreen"
      infinite
      height="75vh"
    >
      <q-carousel-slide v-for="(it, i) in list" :key="i" :name="i">
        <img-item :src="it.url" />
      </q-carousel-slide>

      <q-carousel-control position="bottom-right" :offset="[18, 18]">
        <q-btn
          push
          round
          dense
          color="white"
          text-color="primary"
          :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="fullscreen = !fullscreen"
        />
      </q-carousel-control>
    </q-carousel>
  </q-card>
</template>

<script>
export default {
  name: "img-viewer",
  props: {
    list: Array,
    current: Number,
  },
  data() {
    return {
      curIdx: this.current,
      fullscreen: false,
    };
  },
};
</script>