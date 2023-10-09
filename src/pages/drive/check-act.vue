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

  <q-dialog v-model="showDel" position="top" persistent>
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section class="pos-s top-0 bg-dark z-10">
        <div class="al-c">
          <div class="text-h6">Delete</div>
          <!-- <q-space /> -->
          <!-- <q-btn icon="close" flat round dense v-close-popup /> -->
        </div>
      </q-card-section>

      <q-card-section>
        <q-markup-table flat>
          <tbody>
            <tr v-for="(it, i) in checkList" :key="it.name">
              <td>
                <span class="fz-15">{{ it.name }}<span v-if="it.prefix">/</span></span>
              </td>
              <td>
                <span v-if="it.prefix" class="op-8">{{ getDirNum(i) }}</span>
                <span v-else class="op-5">{{ it.sizeUnit }}</span>
              </td>
              <td>
                <span>{{ getDelStatus(i, it) }}</span>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-actions align="right" class="text-primary pos-s btm-0 bg-dark">
        <template v-if="!isDelDone">
          <q-btn flat label="Cancel" @click="onDelCancel" />
        </template>
        <q-btn v-if="isDelDone" @click="onDelDone" color="primary"> Done </q-btn>
        <q-btn v-else color="primary" :loading="deleting" @click="onDel">OK</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
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
      showDel: false,
      isDelDone: false,
      deleting: false,
      dirFileNumArr: [],
      dirDeleteIdx: -1,
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
    checkList() {
      return this.objList.filter((it) => this.checked.includes(it.key));
    },
  },
  watch: {
    showDel(val) {
      if (!val) {
        this.deleting = false;
        this.isDelDone = false;
        this.dirFileNumArr = [];
        this.dirDeleteIdx = -1;
      }
    },
  },
  methods: {
    getDirNum(i) {
      const num = this.dirFileNumArr[i];
      if (num) return `${num} file${num > 1 ? "s" : ""}`;
      return "-";
    },
    getDelStatus(i, it) {
      if (it.prefix) {
        if (this.dirFileNumArr[i] && (this.dirDeleteIdx > i || this.dirDeleteIdx == -1)) {
          return "Deleted";
        }
        if (this.dirFileNumArr[i]) return "Deleting";
        if (this.dirDeleteIdx == i) return "Seeking";
      } else {
        if (this.dirFileNumArr.length && this.dirDeleteIdx == -1) return "Deleting";
      }
      return "";
    },
    async onDel() {
      this.deleting = true;
      const dirList = this.checkList.filter((it) => it.prefix);
      for (const i in dirList) {
        this.dirDeleteIdx = i;
        // get files
        if (!this.deleting) break;
      }
      const fileList = this.checkList.filter((it) => !it.prefix);
      this.dirFileNumArr.push(fileList.length);
    },
    onDelObjs() {
      const params = {
        Bucket,
        Delete: {
          Objects: [{ Key: "" }],
          Quiet: false,
        },
      };
      return this.$bucket.deleteObjects(params);
    },
    onDelCancel() {
      this.showDel = false;
      if (this.dirFileNumArr.length) {
        this.$emit("refresh");
      }
    },
    onDelDone() {
      this.showDel = false;
      this.$emit("refresh");
    },
    async onAct(name) {
      // console.log(name, rows);
      const item = this.checkList[0];
      if (name == "link") {
        await copyToClipboard(item.url);
        window.$toast("Copied");
      } else if (name == "download") {
        window.open(item.url);
      } else if (name == "delete") {
        this.showDel = true;
      }
    },
  },
};
</script>