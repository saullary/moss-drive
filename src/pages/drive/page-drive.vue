<script setup>
import CheckAct from "./check-act/check-act.vue";
import DriveList from "./drive-list.vue";
</script>

<template>
  <drive-list v-if="isCreated" is-page>
    <template v-slot:act="props">
      <check-act v-bind="props" />
    </template>
  </drive-list>
  <div class="pa-6 mt-9 ta-c" v-else-if="loadErr">
    <p class="op-8 mb-3">{{ loadErr }}</p>
    <q-btn color="info" @click="onRetry">Retry</q-btn>
  </div>
  <div class="q-pa-md" v-else>
    <div class="pa-2" style="width: 200px">
      <q-skeleton type="text" class="text-subtitle1" />
      <q-skeleton type="text" width="50%" class="text-subtitle1 mt-6 mb-6" />
    </div>
    <div class="row">
      <div v-for="i in 8" :key="i" class="col-4 col-sm-3 col-md-2 pa-2">
        <q-card flat>
          <q-skeleton height="150px" square />

          <q-card-section>
            <q-skeleton type="text" class="text-subtitle1" />
            <q-skeleton type="text" width="50%" class="text-subtitle1" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      isCreated: false,
      loadErr: "",
    };
  },
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uid,
      stsData: (s) => s.stsData,
    }),
  },
  created() {
    this.initBucket();
  },
  methods: {
    onRetry() {
      this.$setStore({
        stsData: {},
      });
      this.loadErr = "";
      this.initBucket();
    },
    async initBucket() {
      try {
        if (Date.now() > (this.stsData.expiredAt || 0) * 1e3) {
          const { data: stsData } = await this.$http.get("$bucket/user/sts/assume-role");
          this.$setStore({
            stsData,
          });
        }
        const { accessKey, secretKey, sessionToken } = this.stsData;
        this.$bucket.setClient({
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
          sessionToken,
        });
        this.bucketName = "moss-bucket-" + this.uid.slice(-8);
        this.$bucket.defBucket = this.bucketName;
        if (localStorage.moss_bucket != this.bucketName) {
          await this.checkBucket();
        }
        this.isCreated = true;
      } catch (error) {
        console.log(error);
        this.loadErr = error.message;
      }
    },
    async checkBucket() {
      const list = await this.$bucket.listBuckets();
      if (!list.find((it) => it.Name == this.bucketName)) {
        await this.$bucket.createBucket(this.bucketName);
      }
      localStorage.moss_bucket = this.bucketName;
    },
  },
};
</script>