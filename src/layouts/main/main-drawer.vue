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
  color: #fff;
}
</style>

<script setup>
import UsageInfo from "./usage-info.vue";
</script>

<template>
  <div class="main-drawer h100p h-flex">
    <a href="./drive" class="">
      <img src="/img/logo.svg" height="80" />
    </a>
    <div class="q-pa-md q-mb-lg ta-c">
      <q-btn href="https://mossy-land.4everland.app" target="_blank" rounded class="btn-mossy">
        <img src="/img/mossy.png" width="40" />
        <span class="fz-18 ml-2">Mossyland</span>
      </q-btn>
    </div>
    <q-list>
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

    <usage-info class="mt-auto"></usage-info>
  </div>
</template>

<script>
export default {
  computed: {
    path() {
      return this.$route.path;
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
    };
  },
  methods: {
    isActive(it) {
      return this.$route.path.indexOf(it.to) == 0;
    },
  },
};
</script>