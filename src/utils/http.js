import Axios from "axios";

const { VITE_BASE_URL: baseURL, VITE_AUTH_URL: authURL } = import.meta.env;
// console.log(baseURL, authURL);
const http = Axios.create({
  baseURL,
});

http.interceptors.request.use(
  (config) => {
    const { token } = localStorage;
    config.url = config.url.replace("$auth", authURL);
    if (token) {
      config.headers.common["Authorization"] = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  (res) => {
    const data = res.data;
    if (typeof data == "object" && data && "code" in data) {
      if (data.code != 200 && data.code != "SUCCESS") {
        let msg = data.message || `${data.code} error`;
        // handleMsg(200, data.code, msg, res.config);
        window.$alert(msg);
        const error = new Error(msg);
        error.code = data.code;
        throw error;
      }
      if ("data" in data) {
        return data;
      }
    }
    return res;
  },
  (error) => {
    // , status, statusText, config = {}
    const { data = {}, status } = error.response || {};
    // console.log(error, status, statusText);
    let msg = data.message || error.message;
    // handleMsg(status, data.code, msg, config);
    console.log(status);
    // if (status == 401) {}
    window.$alert(msg);
    error.message = msg;
    error.code = data.code;
    return Promise.reject(error);
  }
);

export default http;
