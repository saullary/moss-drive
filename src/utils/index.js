import "./extend";
import bucket from "./bucket";
import { EventBus } from "quasar";

export default {
  install(app) {
    const global = app.config.globalProperties;
    global.$bucket = bucket;

    const bus = new EventBus();
    global.$bus = bus;
  },
};
