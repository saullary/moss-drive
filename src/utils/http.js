import Axios from "axios";
import store, { setStore } from "../store";
import router from "../router";

const { VITE_BASE_URL: baseURL, VITE_AUTH_URL: authURL } = import.meta.env;
// console.log(baseURL, authURL);
const http = Axios.create({
  baseURL,
});

let refreshing = false;
const pendingQueue = [];

function getToken(isRefresh) {
  const key = isRefresh ? "refreshToken" : "accessToken";
  return store.state.loginData[key];
}

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.common["Authorization"] = token;
    }
    config.url = config.url.replace("$auth", authURL);
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  async (res) => {
    const data = res.data;
    if (typeof data == "object" && data && "code" in data) {
      if (data.code != 200 && data.code != "SUCCESS") {
        data.msg = data.message || `${data.code} error`;
        // handleMsg(200, data.code, msg, res.config);
        const pending = await handleError(200, res.config, data);
        if (pending) {
          return pending;
        }
        const error = new Error(data.msg);
        error.code = data.code;
        throw error;
      }
      if ("data" in data) {
        return data;
      }
    }
    return res;
  },
  async (error) => {
    // , status, statusText, config = {}
    const { data = {}, status, config } = error.response || {};
    data.msg = data.message || error.message;
    const pending = await handleError(status, config, data);
    if (pending) {
      return pending;
    }
    error.message = data.msg;
    error.code = data.code;
    return Promise.reject(error);
  }
);

async function handleError(status, config, data) {
  if (refreshing) {
    return new Promise((resolve) => {
      pendingQueue.push({
        config,
        resolve,
      });
    });
  }
  if (status == 401 || data.code == 401) {
    refreshing = true;
    const isOk = await refreshToken();
    if (isOk) {
      pendingQueue.forEach(({ config, resolve }) => {
        resolve(http(config));
      });
      return http(config);
    } else {
      console.log("redirect to login");
      router.replace({
        path: "/login",
        // query: {
        //   redirect:
        // }
      });
      return;
    }
  }
  window.$alert(data.msg);
}

async function refreshToken() {
  try {
    const res = await Axios.post(
      authURL + "/refresh",
      {
        refreshToken: getToken(1),
      },
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    );
    setStore({
      loginData: res.data,
    });
    return res.status == 200;
  } catch (error) {
    console.log("refresh err", error);
  }
  return false;
}

export default http;
