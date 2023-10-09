<script setup>
import UploadMenu from "./upload-menu.vue";
</script>

<template>
  <q-badge color="orange" floating v-if="badgeNum > 0">{{ badgeNum }}</q-badge>
  <upload-menu
    v-if="!badgeNum"
    @files="onFiles"
    :disabled="uploading && badgeNum > 0"
    :allow-drop="showPop && !uploading"
  />
  <div>
    <q-dialog v-model="showPop" position="top">
      <q-card class="full-width" style="max-width: 600px">
        <q-card-section class="pos-s top-0 bg-dark z-10">
          <div class="al-c">
            <div class="text-h6">Upload</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-card-section>
          <div class="ta-c" v-show="isEmpty">
            <icon-upload />
            <p class="mt-5">Drop or Paste files to upload</p>
          </div>

          <q-markup-table flat>
            <tbody>
              <tr v-for="it in files" :key="it.name">
                <!-- <td>
                  <q-circular-progress
                    :value="it.progress"
                    size="24px"
                    :color="it.finished ? 'green' : 'orange'"
                    track-color="grey-3"
                  />
                </td> -->
                <td>{{ it.name }}</td>
                <td>
                  <span class="op-6">{{ it.size }}</span>
                </td>
                <td>
                  <span v-if="it.error">
                    <span>Failed</span>
                    <q-tooltip anchor="top middle" :offset="[0, 32]" class="bg-black">
                      {{ it.error }}
                    </q-tooltip>
                  </span>
                  <span v-else-if="it.finished">Uploaded</span>
                  <span v-else-if="it.progress"
                    >Uploading {{ Math.floor(it.progress * 100) }}%</span
                  >
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-actions v-show="!isEmpty" align="right" class="text-primary pos-s btm-0 bg-dark">
          <template v-if="!isDone">
            <q-btn v-if="uploading && !paused" flat @click="paused = true">Pause</q-btn>
            <q-btn v-else flat label="Cancel" @click="onCancel" />
          </template>
          <q-btn v-if="isDone" @click="onDone" color="primary"> Done </q-btn>
          <q-btn v-else color="primary" :loading="uploading && !paused" @click="onOk">{{
            paused ? "Continue" : "OK"
          }}</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      showPop: false,
      uploading: false,
      paused: false,
      isDone: false,
      finishNum: 0,
    };
  },
  computed: {
    isEmpty() {
      return !this.files.length;
    },
    badgeNum() {
      return this.files.length - this.finishNum;
    },
  },
  watch: {
    finishNum(val) {
      if (val && val == this.files.length) {
        this.isDone = true;
      }
    },
    showPop(val) {
      if (!val && this.finishNum) {
        this.onRefresh();
      }
    },
  },
  mounted() {
    this.$bus.on("click-new", () => {
      if (this.badgeNum) this.showPop = true;
    });
  },
  methods: {
    onRefresh() {
      this.$bus.emit("drive-refresh");
    },
    onFiles(e) {
      this.files = e;
      this.finishNum = 0;
      this.uploading = false;
      this.isDone = false;
      this.showPop = true;
    },
    onCancel() {
      this.files = [];
      this.uploading = false;
    },
    onDone() {
      this.showPop = false;
    },
    onOk() {
      if (!this.uploading) {
        this.uploading = true;
      }
      this.onStart();
    },
    async onStart() {
      this.paused = false;
      try {
        const list = this.files.filter((it) => !it.finished);
        await this.$bucket.limitTask(list, this.onUpload);
        console.log("task");
      } catch (error) {
        console.log(error.message);
      }
    },

    async onUpload(row) {
      if (this.paused) throw new Error("user paused");
      try {
        await this.$bucket.uploadFile(
          {
            Key: row.name,
            Body: row.file,
            ContentType: row.file.type,
          },
          {
            onProgress: (p) => {
              // console.log(p);
              row.progress = Math.floor(p * 100);
            },
          }
        );
        row.progress = 100;
      } catch (error) {
        console.log(error);
        row.error = error.message;
      }
      row.finished = true;
      this.finishNum += 1;
    },
  },
};
</script>