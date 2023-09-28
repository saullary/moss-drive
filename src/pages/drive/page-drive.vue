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
import FilePreview from "./qs-preview.vue";
</script>

<template>
  <div class="q-pa-md">
    <div class="al-c">
      <q-checkbox
        class="mr-4"
        size="40px"
        :label="checked.length + ` selected`"
        v-model="checkAll"
        indeterminate-value="not-empty"
      />
      <div
        :class="{
          'x-center pos-f z-100': screen.xs,
        }"
        style="bottom: 30px"
      >
        <q-btn-group class="split-line" rounded>
          <q-btn color="primary">
            <img src="/img/driver/stone.svg" width="22" />
          </q-btn>
          <q-btn color="primary">
            <img src="/img/driver/link.svg" width="22" />
          </q-btn>
          <q-btn color="primary">
            <img src="/img/driver/move.svg" width="22" />
          </q-btn>
          <q-btn color="primary">
            <img src="/img/driver/download.svg" width="22" />
          </q-btn>
          <q-btn color="primary">
            <img src="/img/driver/trash.svg" width="22" />
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
    <div class="q-mt-lg">
      <q-breadcrumbs gutter="sm">
        <q-breadcrumbs-el label="All files" to="/drive" />
        <q-breadcrumbs-el v-for="it in breadLinks" :key="it.to" :label="it.label" :to="it.to" />
      </q-breadcrumbs>
    </div>
    <div class="q-mt-md">
      <component
        :is="showMode + '-list'"
        :rows="objList"
        :loading="objLoading"
        :checked="checked"
        @row-click="onRowClick"
        @row-check="onRowCheck"
      />
    </div>
  </div>
  <q-dialog v-model="showPreview" transition-show="slide-up" transition-hide="jump-up">
    <q-card class="full-width" style="max-width: 900px">
      <q-card-section class="pos-a right-0 top-0 z-100">
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <file-preview :list="fileList" :current="fileIdx"></file-preview>
    </q-card>
  </q-dialog>
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
      showPreview: false,
      fileIdx: -1,
      showMode: "grid",
      checkAll: false,
      checked: [],
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
    breadLinks() {
      let arr = this.path.split("/").slice(1);
      let to = "/" + arr[0];
      arr.splice(0, 1);
      return arr.map((seg) => {
        to += "/" + seg;
        console.log(to);
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
      if (val) this.checked = this.objList.map((it) => it.key);
      else this.checked = [];
    },
    checked(val) {
      let isAll = val.length == this.objList.length;
      if (!isAll && val.length > 0) isAll = "not-empty";
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
        this.objLoading = index;
        this.$router.push(this.$route.path + "/" + row.name);
        return;
      }
      this.fileIdx = this.fileList.findIndex((it) => it.url == row.url);
      this.showPreview = true;
      console.log(this.fileIdx);
    },
    onUpload(e) {
      console.log(e);
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
        // window.$alert(error.message)
      }
      this.objLoading = false;
    },
    async getList() {
      try {
        if (this.objLoading == -1 || this.objLoading === false) {
          this.objLoading = true;
        }
        const data = await this.$bucket.listObjects({
          Bucket: this.bucketName,
          Prefix: this.bucketPrefix,
        });
        this.objList = data.rows;
      } catch (error) {
        console.log(error);
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