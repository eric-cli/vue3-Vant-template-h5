import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import "amfe-flexible/index.js";
import "normalize.css/normalize.css";
const app = createApp(App);

// if (import.meta.env.DEV) {
//   // 开发环境加载 VConsole
//   import VConsole from 'vconsole';
//   const vConsole = new VConsole();
//   app.config.performance = true;
//   app.use(vConsole);
// }

app.use(router).mount("#app");
