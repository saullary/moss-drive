<template>
  <div class="q-pa-md">
    <q-table
      color="primary"
      :loading="loading"
      flat
      :rows="rows"
      :columns="columns"
      row-key="name"
      hide-pagination
      :rows-per-page-options="[0]"
    >
    </q-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      rows: [],
      columns: [
        { name: "name", align: "left", label: "Stone Name", field: "name", sortable: true },
        {
          name: "createdAt",
          align: "left",
          label: "Create Time",
          field: "createdAt",
          sortable: true,
        },
        { name: "action", align: "left", label: "Action", field: "action", sortable: true },
      ],
    };
  },
};
</script>