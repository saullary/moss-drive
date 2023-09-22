<style lang="scss">
.main-drawer {
  background: #71ebaa;
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
.main-toolbar {
  background: #1e293b;
  color: #fff;
}
@media (min-width: $breakpoint-md-min) {
  .main-toolbar {
    border-top-left-radius: 20px;
  }
  .m-toggle-btn {
    display: none;
  }
}
</style>

<script setup>
import QsDrawerIcon from "./icon/qs-drawer-icon.vue";
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="background: #71ebaa">
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

        <q-toolbar-title> {{ title }} </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <div>
          <q-btn outline color="primary" rounded @click="onWallet">
            <div class="al-c">
              <q-avatar size="22px">
                <img src="/img/metamask.png" />
              </q-avatar>
              <span class="q-ml-sm">Connect Wallet</span>
            </div>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer class="main-drawer" v-model="leftDrawerOpen" show-if-above>
      <q-list>
        <div class="q-pa-">
          <img src="/img/logo.svg" height="80" />
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
            <qs-drawer-icon :name="it.icon" :active="isActive(it)" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ it.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
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
          link: "https://quasar.dev/vue-components/table",
        },
      ],
      leftDrawerOpen: false,
    };
  },
  methods: {
    isActive(it) {
      return this.$route.path.indexOf(it.to) == 0;
    },
    onWallet() {
      window
        .$alert("test")
        .then(() => {
          window.$toast("ok");
        })
        .catch(() => {
          console.log(11);
        });
    },
  },
};
</script>
