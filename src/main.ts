import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import "amfe-flexible/index.js";
import "normalize.css/normalize.css";
import "virtual:windi.css";
const app = createApp(App);

app.use(router).mount("#app");
