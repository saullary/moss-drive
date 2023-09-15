import { createApp } from "vue";
import App from "./App.vue";

import { Quasar, Dialog, Notify, Loading } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

import router from "./router";
import utils from "./utils";
import "./css/style.scss";
import Components from "./components";

const app = createApp(App);
app.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
    Loading,
  },
});

app.use(utils);

app.use(router);
app.use(Components);

app.mount("#app");
