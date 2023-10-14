<style lang="scss">
.in-move-act {
  .q-breadcrumbs .text-primary {
    color: rgba(255, 255, 255, 0.4) !important;
  }
  .file-item {
    opacity: 0.7;
    pointer-events: none;
  }
}
</style>

<script setup>
import FilePreview from "./preview/preview-index.vue";
</script>

<template>
  <div class="pa-3 pb-0 pos-s z-100" style="top: 72px" v-if="isPage">
    <div class="al-c">
      <q-checkbox
        :disable="objLoading !== false"
        class="mr-4"
        size="40px"
        :label="checked.length + ` selected`"
        v-model="checkAll"
        indeterminate-value="not-empty"
      />

      <slot name="act" :checked="checked" :obj-list="objList"></slot>

      <div class="ml-auto">
        <q-btn round flat @click="showMode = modeIcon">
          <img :src="`/img/driver/mode-${modeIcon}.svg`" width="20" />
        </q-btn>
      </div>
    </div>
  </div>
  <div :class="isPage ? 'q-pa-md' : 'in-move-act'">
    <div :class="isPage ? 'q-mt-md q-ml-sm' : 'pos-s z-100 bg-dark '" style="top: 50px">
      <q-breadcrumbs gutter="sm">
        <q-breadcrumbs-el
          :label="isPage ? 'All files' : 'My Drive'"
          to="/drive"
          @click.prevent="goPath('/drive')"
        />
        <q-breadcrumbs-el
          v-for="it in breadLinks"
          :key="it.to"
          :label="it.label"
          :to="it.to"
          @click.prevent="goPath(it.to)"
        />
      </q-breadcrumbs>
    </div>
    <div class="q-mt-md">
      <div class="mt-9 ta-c" v-if="loadErr">
        <p class="op-8 mb-3">{{ loadErr }}</p>
        <q-btn color="info" @click="getList()" :loading="objLoading">Retry</q-btn>
      </div>
      <div class="ta-c q-py-lg" v-else-if="objLoading === false && objList.length == 0">
        <img src="/img/common/empty.svg" width="200" />
        <div class="op-8">No Data</div>
      </div>
      <q-infinite-scroll v-else @load="onLoad" :disable="objLoading !== false || !objNextToken">
        <component
          :is="showMode + '-list'"
          :isPage="isPage"
          :selection="isPage ? 'multiple' : null"
          :rows="objList"
          :loading="objLoading"
          :checked="checked"
          @row-click="onRowClick"
          @row-check="onRowCheck"
        />
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-ios color="yellow" size="30px" />
          </div>
        </template>
      </q-infinite-scroll>

      <div class="pa-8"></div>
    </div>
  </div>
  <file-preview v-model="showPreview" :list="fileList" :current="fileIdx" />
</template>

<script>
import TableList from "./list-table.vue";
import GridList from "./list-grid.vue";

export default {
  emits: ["update:prefix"],
  props: {
    isPage: Boolean,
  },
  components: {
    GridList,
    TableList,
  },
  data() {
    return {
      bucketName: null,
      objList: [],
      objLoading: false,
      objNextToken: null,
      loadErr: "",
      showPreview: false,
      fileIdx: -1,
      showMode: this.isPage ? "grid" : "table",
      checkAll: false,
      checked: [],
      curPath: "/drive",
      searchKey: "",
    };
  },
  computed: {
    modeIcon() {
      return this.showMode == "grid" ? "table" : "grid";
    },
    path() {
      if (this.isPage) return this.$route.path;
      return this.curPath;
    },
    inDrive() {
      return this.path.startsWith("/drive");
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
      return this.$bucket.getPrefixByPath(this.path);
    },
    fileList() {
      return this.objList.filter((it) => !it.prefix);
    },
  },
  created() {
    this.initBucket();
    this.$bus.on("drive-refresh", () => {
      this.getList();
    });
    this.$bus.on("search-key", (val) => {
      if (!this.inDrive) return;
      if (this.searchKey == val) return;
      this.searchKey = val;
      this.getList();
    });
  },
  watch: {
    path() {
      this.searchKey = "";
      if (this.$bucket.client) {
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
    bucketPrefix(val) {
      this.$emit("update:prefix", val);
    },
  },
  methods: {
    goPath(to) {
      if (this.isPage) {
        const method = this.$q.platform.has.touch ? "replace" : "push";
        this.$router[method](to);
      } else {
        this.curPath = to;
      }
    },
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
        this.goPath(this.path + "/" + row.name);
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
          this.$bucket.defBucket = this.bucketName;
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
    async onLoad(index, done) {
      console.log(index);
      await this.getList(true);
      done();
    },
    async getList(isMore) {
      try {
        const params = {
          Bucket: this.bucketName,
          folder: this.bucketPrefix,
          Prefix: this.bucketPrefix,
          Delimiter: "/",
          MaxKeys: 30,
        };
        if (isMore) {
          params.ContinuationToken = this.objNextToken;
        } else {
          this.checked = [];
          if (this.objLoading === false) {
            this.objLoading = true;
          }
        }
        if (this.isPage) {
          if (this.searchKey) {
            params.Prefix += this.searchKey;
          } else {
            this.$bucket.listParams = params;
          }
        }
        const data = await this.$bucket.listObjects(params);
        if (data.params.Prefix == params.Prefix) {
          if (isMore) {
            this.objList = this.objList.concat(data.rows);
          } else {
            this.objList = data.rows;
            this.objLoading = false;
          }
          this.loadErr = "";
          this.objNextToken = data.nextToken;
        }
      } catch (error) {
        console.log(error);
        this.loadErr = error.message;
        if (isMore) {
          window.$toast(this.loadErr);
        }
        this.objLoading = false;
      }
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