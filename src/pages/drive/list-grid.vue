<style lang="scss">
.driver-grid {
  .grid-item {
    border-radius: 8px;
    user-select: none;
    cursor: pointer;
    &:active .cover {
      opacity: 0.8;
    }
    &.active {
      background: #1e293b;
      .check-wrap {
        visibility: visible;
      }
    }
  }
}
body.no-touch .grid-item:hover,
body.touch .grid-item.hover {
  background: #334155;
  .check-wrap {
    visibility: visible;
  }
}
</style>

<template>
  <div class="row pos-r driver-grid" style="min-height: 300px">
    <div class="col-4 col-sm-3 col-md-2 pa-2" v-for="(row, i) in rows" :key="row.key">
      <div
        @click="onRow(row, i)"
        class="ta-c driver-list-item grid-item pb-4"
        :class="{
          active: isCheck(row),
          hover: hoverIdx == i,
        }"
      >
        <p
          class="ta-l hide"
          :class="{
            'check-wrap': selection == 'multiple',
          }"
        >
          <q-checkbox size="40px" :model-value="isCheck(row)" @click="onCheck(row)"></q-checkbox>
        </p>
        <div class="pos-r">
          <q-img
            :src="getIcon(row)"
            spinner-size="30px"
            :ratio="1"
            width="50%"
            class="cover ev-n trans-100"
            :class="{
              'op-6': i === loading,
            }"
          />
          <div class="pos-center" v-if="i === loading">
            <q-spinner-ios color="yellow" size="30px" />
          </div>
        </div>
        <p class="line-1">{{ row.name }}</p>
        <p
          class="fz-12 op-5"
          :class="{
            hide: row.prefix,
          }"
        >
          {{ row.sizeUnit || "-" }}
        </p>
      </div>
    </div>

    <div class="x-center" style="top: 180px" v-if="true === loading">
      <q-spinner-ios color="warning" size="40px" />
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  emits: ["row-click", "row-check"],
  props: {
    rows: Array,
    loading: null,
    checked: Array,
    selection: String,
  },
  data() {
    return {
      platform: useQuasar().platform,
      hoverIdx: -1,
    };
  },
  computed: {
    hasTouch() {
      return this.platform.has.touch;
    },
    isIos() {
      return this.platform.is.ios;
    },
  },
  watch: {
    rows() {
      this.hoverIdx = -1;
    },
  },
  methods: {
    isCheck(row) {
      return this.checked.includes(row.key);
    },
    onCheck(row) {
      this.$emit("row-check", row);
    },
    getIcon(row) {
      if (row.type == "image") {
        return row.url;
      } else {
        return `/img/driver/icon_${row.type}.png`;
      }
    },
    onRow(row, index) {
      if (this.hasTouch && !this.isCheck(row) && this.hoverIdx != index) {
        this.hoverIdx = index;
        return;
      }
      this.$emit("row-click", {
        row,
        index,
      });
    },
  },
};
</script>