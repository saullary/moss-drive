<style lang="scss">
.main-toolbar {
  min-height: 72px;
  color: #fff;
}
@media (min-width: $breakpoint-md-min) {
  .main-toolbar {
    border-top-left-radius: 24px;
  }
  .m-toggle-btn {
    display: none;
  }
}
</style>

<script setup>
import MainHeader from "./main/main-header.vue";
import MainDrawer from "./main/main-drawer.vue";
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary">
      <q-toolbar class="main-toolbar bg-header">
        <q-btn
          class="m-toggle-btn"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <b>{{ title }}</b>
        </q-toolbar-title>
        <main-header />
      </q-toolbar>
    </q-header>

    <q-drawer :width="280" class="bg-primary" v-model="leftDrawerOpen" show-if-above>
      <main-drawer />
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
      <!-- <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view> -->
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  computed: {
    meta() {
      return this.$route.meta;
    },
    title() {
      return this.meta?.title;
    },
  },
  data() {
    return {
      leftDrawerOpen: false,
    };
  },
};
</script>
