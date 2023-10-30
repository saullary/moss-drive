import "./extend";
import bucket from "./bucket";
import http from "./http";
import { EventBus } from "quasar";

export default {
  install(app) {
    const global = app.config.globalProperties;
    global.$bucket = bucket;
    global.$http = http;

    global.$openLink = (url) => {
      window.open(url);
    };

    const bus = new EventBus();
    global.$bus = bus;

    for (const func of ["toast", "alert", "confirm", "prompt", "loading", "loadingClose"]) {
      global["$" + func] = (...args) => {
        return window["$" + func](...args);
      };
    }
  },
};
