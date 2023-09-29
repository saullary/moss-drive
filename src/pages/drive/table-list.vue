<style lang="scss">
.table-list {
  thead {
    color: #94a3b8;
    .q-checkbox {
      display: none;
    }
  }
}
</style>

<template>
  <q-table
    class="table-list"
    color="primary"
    :loading="loading === true"
    flat
    tabindex="0"
    :rows="rows"
    :columns="columns"
    row-key="name"
    selection="multiple"
    v-model:selected="selected"
    :filter="filter"
    hide-pagination
    :rows-per-page-options="[0]"
  >
    <!-- <template #header> </template> -->
    <template #body="scope">
      <q-tr
        class="driver-list-item"
        :class="{
          active: checked.includes(scope.row.key),
        }"
        :props="scope"
        @click="onRow(scope.row, scope.rowIndex)"
      >
        <q-td style="width: 50px">
          <q-checkbox
            size="40px"
            color="primary"
            keep-color
            :model-value="checked.includes(scope.row.key)"
            @click="$emit('row-check', scope.row)"
          />
        </q-td>
        <q-td key="name">
          <div class="al-c">
            <div class="pos-r">
              <q-img
                :src="getIcon(scope.row)"
                spinner-size="20px"
                width="32px"
                class="cover ev-n trans-100"
                :class="{
                  'op-2': scope.rowIndex === loading,
                }"
              ></q-img>
              <div class="pos-center" v-if="scope.rowIndex === loading">
                <q-spinner-ios color="warning" size="20px" />
              </div>
            </div>
            <span class="fz-15 ml-3">{{ scope.row.name }}</span>
          </div>
        </q-td>
        <q-td key="size">
          {{ scope.row.sizeUnit }}
        </q-td>
        <q-td key="lastModified">
          {{ scope.row.updatedAt }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- <q-drawer show-if-above v-model="showPop" side="right" bordered>
    <div class="pos-s top-0">
      <div>File Info</div>
      <p v-for="i in 10" :key="i">{{ i }}</p>
    </div>
  </q-drawer> -->
</template>

<script>
export default {
  emits: ["row-click", "row-check"],
  props: {
    rows: Array,
    loading: null,
    checked: Array,
  },
  data() {
    return {
      filter: "",
      selected: [],
      columns: [
        {
          name: "Key",
          required: true,
          label: "Name",
          align: "left",
          field: "name",
          // field: (row) => row.name,
          // format: (val) => `${val}`,
          sortable: true,
        },
        { name: "size", align: "left", label: "Size", field: "size", sortable: true },
        {
          name: "updatedAt",
          align: "left",
          label: "Update Time",
          field: "lastModified",
          sortable: true,
        },
      ],
      activeIdx: -1,
    };
  },
  methods: {
    getIcon(row) {
      if (row.type == "img") {
        return row.url;
      } else {
        return `/img/driver/icon_${row.type}.png`;
      }
    },
    onRow(row, index) {
      // this.activeIdx = this.activeIdx == idx ? -1 : idx
      this.$emit("row-click", {
        row,
        index,
      });
    },
  },
};
</script>
