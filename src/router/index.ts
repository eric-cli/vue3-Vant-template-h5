import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home/index.vue"; // 注意这里要带上 文件后缀.vue
// import Vuex from '@/views/vuex.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  // {
  //   path: '/vuex',
  //   name: 'Vuex',
  //   component: Vuex
  // },
  // {
  //   path: '/axios',
  //   name: 'Axios',
  //   component: () => import('@/views/axios.vue') // 懒加载组件
  // }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
