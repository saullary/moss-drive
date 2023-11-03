
<template>
  <RouterView />
</template>

<script>
import { useQuasar } from "quasar";
import { mapState } from "vuex";
import { getFileSize } from "./utils/helper";

export default {
  name: "App",
  computed: {
    ...mapState({
      uid: (s) => s.loginData.uid,
      // token: (s) => s.loginData.accessToken,
    }),
  },
  setup() {
    const $q = useQuasar();
    window.$q = $q;
    $q.dark.set(true);

    window.$loading = (opts) => {
      if (typeof opts == "string") {
        opts = {
          message: opts,
        };
      }
      $q.loading.show(opts);
    };
    window.$loadingClose = (group) => {
      $q.loading.hide(group);
    };
    window.$toast = (message, opts = "warning") => {
      if (opts > 0) {
        opts = ["positive", "negative", "warning", "info", "ongoing"][opts - 1];
        if (!opts) opts = "positive";
      }
      if (typeof opts == "string") {
        opts = {
          type: opts, //
        };
      }
      $q.notify({
        message,
        timeout: 1200,
        position: "top",
        ...opts,
      });
    };
    window.$alert = (message, opts = {}) => {
      return new Promise((resolve) => {
        $q.dialog({
          title: "Tip",
          message,
          transitionShow: "jump-up",
          transitionHide: "jump-up",
          ...opts,
        })
          .onOk(resolve)
          .onDismiss(resolve);
      });
    };
    window.$confirm = (message, opts) => {
      return new Promise((resolve, reject) => {
        $q.dialog({
          title: "Confirm",
          message,
          cancel: true,
          persistent: true,
          ...opts,
        })
          .onOk(resolve)
          .onCancel(reject);
      });
    };
    window.$prompt = (msg, opts) => {
      return window.$confirm(msg, {
        title: "",
        prompt: {
          model: "",
          type: "text", // optional
        },
        ...opts,
      });
    };
  },
  watch: {
    uid() {
      this.onInit();
    },
  },
  mounted() {
    this.onInit();
    this.$bus.on("update-usage", () => {
      this.getUsageInfo();
    });
  },
  methods: {
    async onInit() {
      try {
        this.checkRoute();
        if (this.uid) {
          await this.getUsageInfo();
          if (this.$route.path == "/") {
            this.$router.replace("/drive");
          }
        }
      } catch (error) {
        this.$alert(error.message);
      }
    },
    checkRoute() {
      const { meta } = this.$route;
      if (!this.uid && !meta.noUid) {
        this.$router.replace("/login");
      }
    },
    async getUsageInfo() {
      const { data } = await this.$http.get(`$pay/usage`);
      // console.log(data);
      const {
        usedIpfsStorage,
        ipfsStorage,
        airdropIpfsStorage,
        // ipfsDefaultStorage,
        // ipfsStorageExpired,
        // ipfsStorageStart,
      } = data;
      let totalStorage = ipfsStorage;
      if (!totalStorage) {
        totalStorage = airdropIpfsStorage;
      }
      this.$setStore({
        usageInfo: {
          totalStorage,
          ipfsStorage,
          perc: usedIpfsStorage / totalStorage,
          used: getFileSize(usedIpfsStorage),
          total: getFileSize(totalStorage),
        },
      });
    },
  },
};
</script>
