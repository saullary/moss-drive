<template>
  <q-dialog v-model="showPop" :persistent="creating">
    <q-card class="full-width" style="max-width: 450px">
      <q-card-section>
        <div class="text-h6">New Folder</div>
      </q-card-section>

      <q-card-section>
        <input
          v-model.trim="inputVal"
          type="text"
          class="w100p bdrs-3 pa-2"
          :class="{
            'bg-info': !inputVal.length,
          }"
          placeholder="Enter the folder name"
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
        this.inputVal = "";
        window.$toast(name + " created successfully", 1);
        this.showPop = false;
        this.$bus.emit("drive-refresh");
      } catch (error) {
        console.log(error);
        window.$alert(error.message);
      }
      this.creating = false;
    },
  },
};
</script>