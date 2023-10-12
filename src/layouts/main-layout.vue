<style lang="scss">
.main-drawer {
  .q-item {
    color: #333;
    font-size: 15px;
  }
  .q-item.q-router-link--active,
  .q-item--active {
    color: #fff;
    background: #0000006e;
    font-weight: bold;
  }
}
.btn-mossy {
  padding: 6px 22px;
  background: linear-gradient(0deg, rgb(0 0 0 / 50%), rgb(0 0 0 / 80%));
}
.main-toolbar {
  min-height: 72px;
  background: #1e293b;
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
import MainHeader from "./main-header/index.vue";
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary">
      <q-toolbar class="main-toolbar">
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

    <q-drawer :width="280" class="main-drawer bg-primary" v-model="leftDrawerOpen" show-if-above>
      <q-list>
        <div class="">
          <img src="/img/logo.svg" height="80" />
        </div>
        <div class="q-pa-md q-mb-lg ta-c">
          <q-btn href="/mossyland/explore" target="_blank" rounded class="btn-mossy">
            <img src="/img/mossy.png" width="40" />
            <span class="fz-18 ml-2">Mossyland</span>
          </q-btn>
        </div>

        <q-item
          v-for="it in links"
          :key="it.title"
          clickable
          tag="a"
          :target="it.link ? '_blank' : null"
          :href="it.link"
          :to="it.to"
          :active="isActive(it)"
        >
          <q-item-section v-if="it.icon" avatar>
            <!-- <q-icon :name="it.icon" /> -->
            <icon-drawer :name="it.icon" :active="isActive(it)" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ it.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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
      links: [
        {
          title: "My Drive",
          icon: "driver",
          to: "/drive",
        },
        {
          title: "My Stones",
          icon: "stones",
          to: "/stone",
        },
        {
          title: "My Collections",
          icon: "star",
          // link: "https://quasar.dev/vue-components/table",
          to: "/collection",
        },
      ],
      leftDrawerOpen: false,
    };
  },
  methods: {
    isActive(it) {
      return this.$route.path.indexOf(it.to) == 0;
    },
  },
};
</script>
