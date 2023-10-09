<template>
  <div
    v-show="checked.length > 0"
    :class="{
      'x-center pos-f z-100': screen.xs,
    }"
    style="bottom: 30px"
  >
    <q-btn-group class="split-line" rounded>
      <q-btn
        @click="onAct(it.name)"
        color="primary"
        :class="{
          disable: it.disabled,
        }"
        v-for="it in objMenus"
        :key="it.name"
      >
        <img :src="`/img/driver/${it.icon || it.name}.svg`" width="22" />
        <q-tooltip anchor="top middle" :offset="[0, 28]" class="bg-black" v-if="!it.disabled">
          {{ it.name.capitalize() }}
        </q-tooltip>
      </q-btn>
    </q-btn-group>
  </div>
</template>

<script>
import { useQuasar, copyToClipboard } from "quasar";

export default {
  props: {
    checked: Array,
    objList: Array,
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
    };
  },
  computed: {
    objMenus() {
      const len = this.checked.length;
      let isFile = false;
      if (len == 1) {
        const row = this.objList.find((it) => it.key == this.checked[0]);
        isFile = !!row.url;
      }
      return [
        {
          name: "publish",
          icon: "stone",
        },
        {
          name: "link",
          disabled: !isFile,
        },
        {
          name: "move",
        },
        {
          name: "download",
          disabled: !isFile,
        },
        {
          name: "delete",
          icon: "trash",
        },
      ];
    },
  },
  methods: {
    async onAct(name) {
      const rows = this.objList.filter((it) => this.checked.includes(it.key));
      // console.log(name, rows);
      const item = rows[0];
      if (name == "link") {
        await copyToClipboard(item.url);
        window.$toast("Copied");
      } else if (name == "download") {
        window.open(item.url);
      }
    },
  },
};
</script>