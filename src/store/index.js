import { createStore } from "vuex";

const SET_DATA = "setData";

const storState = {
  loginData: {},
  userInfo: {},
};
for (const key in storState) {
  let val = localStorage[key];
  try {
    if (val) storState[key] = JSON.parse(val);
  } catch (error) {
    console.log(key, error);
  }
}

const store = createStore({
  state: {
    ...storState,
    nowDate: new Date(),
    isTouch: "ontouchstart" in window,
    isFocus: true,
    token: () => {
      return localStorage.token;
    },
  },
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
  },
  actions: {},
});

export const setState = (data) => {
  store.commit(SET_DATA, data);
};

export const setStore = (data) => {
  for (const key in data) {
    try {
      localStorage[key] = JSON.stringify(data[key]);
    } catch (error) {
      console.log(key, error);
    }
  }
  setState(data);
};

window.onblur = () => {
  setState({
    isFocus: false,
  });
};
window.onfocus = () => {
  const isTouch = "ontouchstart" in window;
  setState({
    isFocus: true,
    isTouch,
  });
};

setInterval(() => {
  setState({
    nowDate: new Date(),
  });
}, 1e3);

export default store;
