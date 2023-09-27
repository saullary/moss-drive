<template>
  <div class="row pos-r" style="min-height: 300px">
    <div
      class="col-4 col-md-3 col-lg-2"
      @click="onRow(row, i)"
      v-for="(row, i) in rows"
      :key="row.key"
    >
      <div class="ta-c mb-5">
        <div class="pos-r">
          <q-img
            :src="getIcon(row)"
            :ratio="1"
            width="50%"
            :class="{
              'op-6': i === loading,
            }"
          ></q-img>
          <div class="pos-center" v-if="i === loading">
            <q-spinner-ios color="yellow" size="30px" />
          </div>
        </div>
        <p>{{ row.name }}</p>
        <p class="fz-12 op-5">{{ row.sizeUnit }}</p>
      </div>
    </div>

    <div class="x-center" style="top: 200px" v-if="true === loading">
      <q-spinner-ios color="warning" size="40px" />
    </div>
  </div>
</template>

<script>
export default {
  emits: ["row-click"],
  props: {
    rows: Array,
    loading: null,
  },
  data() {
    return {};
  },
  methods: {
    getIcon(row) {
      if (row.type == "image") {
        return row.url;
      } else {
        return `/img/driver/icon_${row.type}.svg`;
      }
    },
    onRow(row, index) {
      this.$emit("row-click", {
        row,
        index,
      });
    },
  },
};
</script>