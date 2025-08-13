import { createApp, reactive } from "vue";
import App from "./App.vue";
import routes from "./router/index";
import axios from "axios";
import VueAxios from "vue-axios";
import { createRouter, createWebHistory } from "vue-router";

import "bootstrap/dist/css/bootstrap.css";

// BootstrapVue 3
import { BootstrapVue3, BModal } from "bootstrap-vue-3";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import { BContainer, BRow, BCol } from "bootstrap-vue-3";
import Vuelidate from "@vuelidate/core";

import "bootstrap-icons/font/bootstrap-icons.css";

// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Shared store
const store = reactive({
  username: localStorage.getItem("username"),
  server_domain: "http://localhost:3000",
  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    console.log("login", this.username);
  },
  logout() {
    console.log("logout");
    localStorage.removeItem("username");
    this.username = undefined;
  },
});

// Axios interceptors
axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);
axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
console.log("VUE_APP_API_URL:", process.env.VUE_APP_API_URL);
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.withCredentials = true;
console.log("Axios baseURL:", axios.defaults.baseURL);

// Create app
const app = createApp(App);

// Plugins
app.use(router);
app.use(VueAxios, axios);
app.use(BootstrapVue3);
app.use(Vuelidate);
app.component("BModal", BModal);

// Register global BootstrapVue3 components
app.component("BContainer", BContainer);
app.component("BRow", BRow);
app.component("BCol", BCol);

// Global store
app.config.globalProperties.store = store;

// Mount app
app.mount("#app");
