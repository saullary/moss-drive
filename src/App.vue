
<template>
  <RouterView />
</template>

<script>
import { useQuasar } from "quasar";

export default {
  name: "App",
  setup() {
    const $q = useQuasar();
    console.log($q.dark.set(true));
    window.$loading = (opts) => {
      if (typeof opts == "string") {
        opts = {
          message: opts,
        };
      }
      $q.loading.show(opts);
    };
    window.$loading.close = (group) => {
      $q.loading.hide(group);
    };
    window.$toast = (message, opts) => {
      if (typeof opts == "string") {
        opts = {
          type: opts, // 'positive', 'negative', 'warning', 'info', 'ongoing'
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
};
</script>
