import "./extend";
import bucket from "./bucket";
import { EventBus } from "quasar";

export default {
  install(app) {
    const global = app.config.globalProperties;
    global.$bucket = bucket;

    global.$openLink = (url) => {
      window.open(url);
    };

    const bus = new EventBus();
    global.$bus = bus;

    for (const func of ["toast", "alert", "confirm", "prompt"]) {
      global["$" + func] = (...args) => {
        return window["$" + func](...args);
      };
    }
  },
};
