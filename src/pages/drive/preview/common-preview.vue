<style>
.qs-preview .q-carousel__slide {
  padding: 0;
}
.qs-preview .q-panel {
  overflow: hidden;
}
</style>

<script setup>
import ImgItem from "./img-item.vue";
</script>

<template>
  <q-card class="full-width" style="max-width: 900px">
    <q-card-section class="pos-a right-0 top-0 z-100">
      <q-btn icon="close" class="bg-black-5" flat round dense v-close-popup />
    </q-card-section>

    <q-carousel
      class="qs-preview"
      swipeable
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      :arrows="list.length > 1"
      v-model="curIdx"
      v-model:fullscreen="fullscreen"
      infinite
      height="82vh"
    >
      <q-carousel-slide v-for="(it, i) in list" :key="it.Key" :name="i">
        <img-item v-if="it.type == 'image'" :src="it.url" />
        <template v-else>
          <iframe class="wh100p" :src="getUrl(it)" frameborder="0" @load="loading = false"></iframe>
          <div class="pos-center" v-show="loading">
            <q-spinner-ios color="yellow" size="30px" />
          </div>
        </template>
      </q-carousel-slide>

      <template v-slot:control>
        <q-carousel-control position="top-left" :offset="[20, 20]">
          <div class="pa-1 bg-black-3 white">
            <span class="op-6" v-if="list.length > 1">{{ curIdx + 1 }}/{{ list.length }}</span>
            <span v-if="curItem" class="ml-2">{{ curItem.name }}</span>
          </div>
        </q-carousel-control>
        <!-- <q-carousel-control position="bottom-right" :offset="[18, 18]">
          <q-btn
            push
            round
            dense
            color="white"
            text-color="primary"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullscreen = !fullscreen"
          />
        </q-carousel-control> -->
      </template>
    </q-carousel>
  </q-card>
</template>

<script>
export default {
  props: {
    list: Array,
    current: Number,
  },
  data() {
    return {
      curIdx: this.current,
      fullscreen: false,
      loading: true,
    };
  },
  computed: {
    curItem() {
      return this.list[this.curIdx];
    },
  },
  watch: {
    current(val) {
      this.curIdx = val;
    },
    curItem() {
      console.log("loading");
      this.loading = true;
    },
  },
  methods: {
    getUrl(it) {
      let pre = "http://127.0.0.1:5174/";
      pre = "https://preview.4everland.org/";
      let url = pre + "?src=" + it.url;
      if (it.size > 1024 * 100) {
        if (/\.(js|json|txt|html)$/.test(it.name)) {
          url += "&type=download";
          // url = 'http://127.0.0.1:5173/test.html?src=' + it.url
        }
      }
      return url;
    },
  },
};
</script>