<script setup>
import ActDelete from "./act-delete.vue";
import ActMove from "./act-move.vue";
</script>

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

  <act-delete ref="delete" :check-list="checkList" />
  <act-move ref="move" :check-list="checkList" />
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
        const row = this.checkList[0];
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
          disabled: this.checkList.filter((it) => it.prefix).length > 0,
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
    checkList() {
      return this.objList.filter((it) => this.checked.includes(it.key));
    },
  },
  methods: {
    async onAct(name) {
      // console.log(name, rows);
      const item = this.checkList[0];
      if (name == "link") {
        await copyToClipboard(item.url);
        this.$toast("Copied", 1);
      } else if (name == "download") {
        window.open(item.url);
      } else if (name == "delete") {
        this.$refs.delete.showPop = true;
      } else if (name == "move") {
        this.$refs.move.showPop = true;
      }
    },
  },
};
</script>