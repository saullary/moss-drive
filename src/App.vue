
<template>
  <RouterView />
</template>

<script>
import { useQuasar } from "quasar";

export default {
  name: "App",
  setup() {
    const $q = useQuasar();
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
    window.$alert = (message, title = "Tip", opts = {}) => {
      if (typeof title == "object") {
        opts = title;
      }
      return $q.dialog({
        title,
        message,
        ...opts,
      });
    };
    window.$prompt = (opts) => {
      return $q.dialog({
        cancel: true,
        persistent: true,
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
