import Axios from "axios";
import store from "../store";

const { VITE_BASE_URL: baseURL, VITE_AUTH_URL: authURL } = import.meta.env;
// console.log(baseURL, authURL);
const http = Axios.create({
  baseURL,
});

let refreshing = false;
const pendingQueue = [];

function getToken(isAccess) {
  const key = isAccess ? "accessToken" : "refreshToken";
  return store.state.loginData[key];
}

http.interceptors.request.use(
  (config) => {
    const token = getToken(1);
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
    const res = await refreshToken();
    if (res.status === 200) {
      pendingQueue.forEach(({ config, resolve }) => {
        resolve(http(config));
      });
      return http(config);
    } else {
      console.log("refresh token invalid");
    }
  }
  window.$alert(data.msg);
}

async function refreshToken() {
  const res = await Axios.get(authURL + "/refresh", {
    params: {
      token: getToken(0),
    },
  });
  // localStorage.setItem("access_token", res.data.accessToken);
  // localStorage.setItem("refresh_token", res.data.refreshToken);
  return res;
}

export default http;
