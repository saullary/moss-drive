<template>
  <q-dialog v-model="showPop" :persistent="creating">
    <q-card class="full-width" style="max-width: 450px">
      <q-card-section>
        <div class="text-h6">New Folder</div>
      </q-card-section>

      <q-card-section>
        <input
          autofocus
          v-model.trim="inputVal"
          type="text"
          class="w100p bdrs-3 pa-2"
          :class="{
            'bg-info': !inputVal.length,
          }"
          placeholder="Enter the folder name"
          @keyup.enter="onCreate"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-if="!creating" flat color="white" label="Cancel" @click="showPop = false" />
        <q-btn
          :disable="!inputVal.length"
          rounded
          color="primary"
          width="100px"
          :loading="creating"
          @click="onCreate"
          >Create</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      creating: false,
      inputVal: "",
    };
  },
  watch: {
    showPop(val) {
      if (!val) {
        this.inputVal = "";
        this.creating = false;
      }
    },
  },
  methods: {
    async onCreate() {
      try {
        const name = this.inputVal;
        let msg = "";
        if (!/^[a-z\d-_]+$/.test(name)) {
          msg =
            "Folder names can consist only of lowercase letters, numbers, underscode (_), and hyphens (-).";
        }
        if (msg) {
          return window.$toast(msg);
        }
        this.creating = true;
        await this.$bucket.putObject({
          Key: name + "/",
        });
        this.showPop = false;
        window.$toast(`Folder ${name}/ created successfully`, 1);
        this.$bus.emit("drive-refresh");
      } catch (error) {
        window.$alert(error.message);
      }
      this.creating = false;
    },
  },
};
</script>