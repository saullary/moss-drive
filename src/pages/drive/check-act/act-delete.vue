<template>
  <q-dialog v-model="showPop" position="top" :persistent="deleting">
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section class="pos-s top-0 q-dark z-10">
        <div class="al-c">
          <div class="text-h6">
            <span v-if="delTotal">{{ delTotal }} file{{ delTotal > 1 ? "s" : "" }} deleted</span>
            <span v-else>Delete</span>
          </div>
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
                <span>{{ getStatus(it, i) }}</span>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-actions align="right" class="text-primary pos-s btm-0 q-dark">
        <template v-if="!isDelDone && !isDelRootFiles">
          <q-btn flat color="white" label="Cancel" @click="showPop = false" />
        </template>
        <q-btn v-if="isDelDone" @click="showPop = false" color="primary"> Done </q-btn>
        <q-btn v-else rounded color="primary" :loading="deleting" @click="onDel">OK</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    checkList: Array,
  },
  data() {
    return {
      showPop: false,
      isDelDone: false,
      deleting: false,
      dirFileNumArr: [],
      dirDeleteIdx: -1,
    };
  },
  computed: {
    isDelRootFiles() {
      return this.dirFileNumArr.length > 0 && this.dirDeleteIdx == -1;
    },
    delTotal() {
      let total = 0;
      for (const i in this.dirFileNumArr) {
        if (
          this.isDelDone ||
          this.dirDeleteIdx > i ||
          (this.dirDeleteIdx == -1 && i < this.dirFileNumArr.length - 1)
        ) {
          total += this.dirFileNumArr[i];
        }
      }
      return total;
    },
  },
  watch: {
    showPop(val) {
      if (!val) {
        if (this.dirFileNumArr.length) {
          this.$bus.emit("drive-refresh");
        }
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
    getStatus(it, i) {
      if (this.isDelDone) {
        return "Deleted";
      }
      if (it.prefix) {
        if (this.dirFileNumArr[i] && (this.dirDeleteIdx > i || this.dirDeleteIdx == -1)) {
          return "Deleted";
        }
        if (this.dirFileNumArr[i]) return "Deleting";
        if (this.dirDeleteIdx == i) return "Seeking";
      } else {
        if (this.isDelRootFiles) {
          return "Deleting";
        }
      }
      return "";
    },
    async onDel() {
      try {
        this.deleting = true;
        const dirList = this.checkList.filter((it) => it.prefix);
        for (const i in dirList) {
          this.dirDeleteIdx = i;
          const dirKey = dirList[i].key;
          const { rows: dirFiles } = await this.$bucket.listObjects({
            Prefix: dirKey,
          });
          await this.delMulti(
            [
              {
                key: dirKey,
              },
              ...dirFiles,
            ],
            dirFiles.length
          );
          if (!this.deleting) break;
        }
        this.dirDeleteIdx = -1;
        const rootFiles = this.checkList.filter((it) => !it.prefix);
        await this.delMulti(rootFiles);
        this.deleting = false;
        this.isDelDone = true;
        this.$bus.emit("update-usage");
      } catch (error) {
        window.$alert(error.message).then(() => {
          this.showPop = false;
        });
      }
    },
    delMulti(files, len) {
      if (!files.length) return;
      this.dirFileNumArr.push(len || files.length);
      const params = {
        Delete: {
          Objects: files.map((it) => {
            return {
              Key: it.key,
            };
          }),
          Quiet: false,
        },
      };
      return this.$bucket.deleteObjects(params);
    },
  },
};
</script>