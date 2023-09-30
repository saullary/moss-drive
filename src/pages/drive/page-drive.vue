<style lang="scss">
.mode-toggle {
  background: #64748b;
  .q-btn {
    color: #000;
    width: 44px;
  }
  .bg-primary {
    border-radius: 100px !important;
  }
}
</style>

<script setup>
// import UploadAct from "./qs-upload-act.vue";
import FilePreview from "./preview/preview-index.vue";
</script>

<template>
  <div class="pa-3 pb-0 pos-s z-100" style="top: 72px">
    <div class="al-c">
      <q-checkbox
        :disable="objLoading !== false"
        class="mr-4"
        size="40px"
        :label="checked.length + ` selected`"
        v-model="checkAll"
        indeterminate-value="not-empty"
      />
      <div
        v-show="checked.length > 0"
        :class="{
          'x-center pos-f z-100': screen.xs,
        }"
        style="bottom: 30px"
      >
        <q-btn-group class="split-line" rounded>
          <q-btn
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
      <!-- <upload-act :bucket="bucketName" :prefix="bucketPrefix" @refresh="getList" /> -->

      <div class="ml-auto">
        <q-btn-toggle
          size="10px"
          class="mode-toggle"
          v-model="showMode"
          rounded
          toggle-color="primary"
          :options="[
            { value: 'grid', slot: 'grid' },
            { value: 'table', slot: 'table' },
          ]"
        >
          <template #grid>
            <img src="/img/driver/mode-grid.svg" width="20" />
          </template>
          <template #table>
            <img src="/img/driver/mode-list.svg" width="20" />
          </template>
        </q-btn-toggle>
      </div>
    </div>
  </div>
  <div class="q-pa-md">
    <div class="q-mt-md q-ml-sm">
      <q-breadcrumbs gutter="sm">
        <q-breadcrumbs-el label="All files" to="/drive" />
        <q-breadcrumbs-el v-for="it in breadLinks" :key="it.to" :label="it.label" :to="it.to" />
      </q-breadcrumbs>
    </div>
    <div class="q-mt-md">
      <div class="mt-9 ta-c" v-if="loadErr">
        <p class="op-8 mb-3">{{ loadErr }}</p>
        <q-btn color="info" @click="getList" :loading="objLoading">Retry</q-btn>
      </div>
      <component
        v-else
        :is="showMode + '-list'"
        :rows="objList"
        :loading="objLoading"
        :checked="checked"
        @row-click="onRowClick"
        @row-check="onRowCheck"
      />
    </div>
  </div>
  <file-preview v-model="showPreview" :list="fileList" :current="fileIdx"></file-preview>
</template>

<script>
import { useQuasar } from "quasar";
import TableList from "./table-list.vue";
import GridList from "./grid-list.vue";

export default {
  components: {
    GridList,
    TableList,
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      bucketName: null,
      objList: [],
      objLoading: false,
      loadErr: "",
      showPreview: false,
      fileIdx: -1,
      showMode: "grid",
      checkAll: false,
      checked: [],
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
    path() {
      return this.$route.path;
    },
    breadLinks() {
      let arr = this.path.split("/").slice(1);
      let to = "/" + arr[0];
      arr.splice(0, 1);
      return arr.map((seg) => {
        to += "/" + seg;
        return {
          label: seg,
          to,
        };
      });
    },
    bucketPrefix() {
      let prefix = this.path.split("/").slice(2).join("/");
      if (prefix) prefix += "/";
      return prefix;
    },
    fileList() {
      return this.objList.filter((it) => !it.prefix);
    },
  },
  created() {
    this.initBucket();
  },
  watch: {
    path() {
      if (this.$bucket.client) {
        this.checked = [];
        this.getList();
      }
    },
    checkAll(val) {
      if (val == "not-empty") return;
      if (val) this.checked = this.objList.map((it) => it.key);
      else this.checked = [];
    },
    "checked.length"(len) {
      let isAll = len == this.objList.length;
      if (!isAll && len > 0) isAll = "not-empty";
      this.checkAll = isAll;
    },
  },
  methods: {
    onRowCheck({ key }) {
      const idx = this.checked.indexOf(key);
      if (idx == -1) {
        this.checked.push(key);
      } else {
        this.checked.splice(idx, 1);
      }
    },
    onRowClick({ row, index }) {
      if (row.prefix) {
        if (this.objLoading !== false) return;
        this.objLoading = index;
        this.$router.push(this.$route.path + "/" + row.name);
        return;
      }
      this.fileIdx = this.fileList.findIndex((it) => it.url == row.url);
      this.showPreview = true;
    },
    async initBucket() {
      try {
        const testKey = this.$route.query.testKey;
        if (testKey) {
          localStorage.testKey = testKey;
        }
        if (localStorage.testKey) {
          this.$bucket.setClient(localStorage.testKey, "ZraPQHA7T6y0Ut3+Dd3eV5yDxE3hC2bvRFgcLYIE");
          this.bucketName = "qs3";
          this.objLoading = true;
          await this.checkBucket();
          await this.getList();
        }
      } catch (error) {
        console.log(error);
        this.loadErr = error.message;
      }
      this.objLoading = false;
    },
    async getList() {
      try {
        if (this.objLoading === false) {
          this.objLoading = true;
        }
        const data = await this.$bucket.listObjects({
          Bucket: this.bucketName,
          Prefix: this.bucketPrefix,
        });
        this.objList = data.rows;
        this.loadErr = "";
      } catch (error) {
        console.log(error);
        this.loadErr = error.message;
      }
      this.objLoading = false;
    },
    async checkBucket() {
      const list = await this.$bucket.listBuckets();
      if (!list.find((it) => it.Name == this.bucketName)) {
        await this.$bucket.createBucket(this.bucketName);
      }
    },
  },
};
</script>