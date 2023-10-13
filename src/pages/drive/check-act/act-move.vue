<template>
  <q-dialog v-model="showPop" position="top" :persistent="moving">
    <q-card class="full-width" style="max-width: 600px">
      <q-card-section class="pos-s top-0 bg-dark z-10">
        <div class="al-c">
          <div class="text-h6">
            <span v-if="isDone">{{ "file".getCountName(movedArr.length) }} moved to</span>
            <span v-else>Move to</span>
            <span v-if="isNext" class="ml-2">{{ moveToPrefix || "/" }}</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-markup-table v-if="isNext" flat>
          <tbody>
            <tr v-for="(it, i) in checkList" :key="it.name">
              <td>
                <span class="fz-15">{{ it.name }}</span>
              </td>
              <td>
                <span class="op-5">{{ it.sizeUnit }}</span>
              </td>
              <td>
                <span>{{ getStatus(it, i) }}</span>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <drive-list v-else v-model:prefix="moveToPrefix" />
      </q-card-section>

      <q-card-actions class="text-primary pos-s btm-0 bg-dark">
        <div class="mr-auto">
          <q-btn v-if="!isNext" flat label="New Folder" class="mr-auto" />
        </div>
        <template v-if="!isDone">
          <q-btn flat color="white" label="Cancel" @click="showPop = false" />
        </template>
        <q-btn v-if="isDone" color="primary" @click="showPop = false"> Done </q-btn>
        <q-btn
          v-else
          color="primary"
          :loading="moving"
          @click="onMove"
          :disable="curPrefix == moveToPrefix"
          >Move here</q-btn
        >
        <!-- to do: parent dir can not be moved to children dir -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import DriveList from "../drive-list.vue";

export default {
  components: {
    DriveList,
  },
  props: {
    checkList: Array,
  },
  data() {
    return {
      showPop: false,
      moving: false,
      isDone: false,
      moveToPrefix: "",
      isNext: false,
      movedArr: [],
      curMoveIdx: -1,
    };
  },
  computed: {
    curPrefix() {
      return this.$bucket.getPrefixByPath(this.$route.path);
    },
  },
  watch: {
    showPop(val) {
      if (!val) {
        if (this.movedArr.length) {
          this.$bus.emit("drive-refresh");
        }
        this.isDone = false;
        this.isNext = false;
        this.moving = false;
        this.moveToPrefix = "";
        this.movedArr = [];
        this.curMoveIdx = -1;
      }
    },
  },
  methods: {
    getStatus(it, i) {
      if (this.movedArr.includes(it.name)) return "Moved";
      if (this.curMoveIdx > i || this.isDone) return "Failed";
      if (i == this.curMoveIdx) return "Moving";
      return "";
    },
    onMove() {
      // console.log(this.curPrefix, this.moveToPrefix);
      this.isNext = true;
      this.doMove();
    },
    async doMove() {
      this.moving = true;
      for (const i in this.checkList) {
        if (!this.moving) break;
        this.curMoveIdx = i;
        const row = this.checkList[i];
        try {
          await this.$bucket.moveObject(this.curPrefix + row.name, this.moveToPrefix + row.name);
          this.movedArr.push(row.name);
        } catch (error) {
          console.log(error);
        }
      }
      this.moving = false;
      this.isDone = true;
    },
  },
};
</script>