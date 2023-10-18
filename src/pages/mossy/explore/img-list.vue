<style lang="scss">
.example-item {
  width: 290px;
}
</style>

<script setup>
import ImgRow from "./img-row.vue";
</script>

<template>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm" id="my-gallery">
      <q-intersection v-for="index in 8" :key="index" transition="scale" once class="example-item">
        <q-card flat bordered class="q-ma-sm">
          <img-row
            :src="`https://fastly.jsdelivr.net/npm/@vant/assets/apple-${index}.jpeg`"
          ></img-row>

          <q-card-section>
            <div class="text-h6">Card #{{ index }}</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
        </q-card>
      </q-intersection>
    </div>
  </div>
</template>

<script>
import Lightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

export default {
  mounted() {
    const box = new Lightbox({
      gallery: "#my-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    box.init();
  },
};
</script>