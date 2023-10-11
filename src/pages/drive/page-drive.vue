<script setup>
import CheckAct from "./check-act/check-act.vue";
import DriveList from "./drive-list.vue";
</script>

<template>
  <drive-list is-page>
    <template v-slot:act="props">
      <check-act v-bind="props" />
    </template>
  </drive-list>
</template>