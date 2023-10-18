<style lang="scss">
body.body--dark {
  background-image: url(/img/mossy/bg-top-1.png);
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: contain;
}
.main-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}
.bg-active {
  background: #0000006e;
  color: #fff;
}
</style>

<template>
  <div class="pa-2"></div>
  <div class="pos-s z-100 top-0">
    <div class="main-wrap">
      <div class="bdrs-100 al-c bg-primary">
        <div class="al-c q-py-sm">
          <img src="/img/moss.svg" height="28" class="ml-5" />
          <img src="/img/mossy/mossyland.svg" height="28" class="ml-2" />
        </div>
        <div class="ml-5">
          <q-btn
            v-for="it in menus"
            :key="it.path"
            rounded
            flat
            :class="{
              'bg-active': it.path == path,
            }"
            :to="'/mossyland' + it.path"
            >{{ it.label }}</q-btn
          >
        </div>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
export default {
  computed: {
    path() {
      return this.$route.path.replace("/mossyland", "");
    },
  },
  data() {
    return {
      menus: [
        {
          path: "/moments",
          label: "Moments",
        },
        {
          path: "/explore",
          label: "Explore",
        },
        {
          path: "/collected",
          label: "Collected",
        },
      ],
    };
  },
};
</script>