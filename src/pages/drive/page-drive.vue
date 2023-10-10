<script setup>
import CheckAct from "./check-act.vue";
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
      <check-act :checked="checked" :obj-list="objList" @refresh="getList()" />

      <div class="ml-auto">
        <q-btn round flat @click="showMode = modeIcon">
          <img :src="`/img/driver/mode-${modeIcon}.svg`" width="20" />
        </q-btn>
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
        <q-btn color="info" @click="getList()" :loading="objLoading">Retry</q-btn>
      </div>
      <q-infinite-scroll v-else @load="onLoad" :disable="objLoading !== false || !objNextToken">
        <component
          :is="showMode + '-list'"
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
import TableList from "./table-list.vue";
import GridList from "./grid-list.vue";

export default {
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
      showMode: "grid",
      checkAll: false,
      checked: [],
    };
  },
  computed: {
    modeIcon() {
      return this.showMode == "grid" ? "table" : "grid";
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
    this.$bus.on("drive-refresh", () => {
      this.getList();
    });
  },
  watch: {
    path() {
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
        const data = await this.$bucket.listObjects(params);
        if (data.params.Prefix == this.bucketPrefix) {
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