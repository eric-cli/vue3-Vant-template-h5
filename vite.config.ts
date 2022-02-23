import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite"; // 依赖按需自动导入
import { viteMockServe } from "vite-plugin-mock"; // mock数据
import visualizer from "rollup-plugin-visualizer"; // 包依赖分析可视化
import compressPlugin from "vite-plugin-compression"; // 代码压缩
import path from "path";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      dts: "src/auto-imports.d.ts",

      // global imports to register
      imports: [
        // presets
        "vue",
        "vue-router",
        // custom
        {
          "@vueuse/core": [
            // named imports
            "useMouse", // import { useMouse } from '@vueuse/core',
            // alias
            ["useFetch", "useMyFetch"], // import { useFetch as useMyFetch } from '@vueuse/core',
          ],
          "element-plus": [
            "ElMessage",
            // alias
            // ["[from]", "[alias]"],
          ],
          // axios: [
          //   // default imports
          //   ["default", "axios"], // import { default as axios } from 'axios',
          // ],
          // "[package-name]": [
          //   "[import-names]",
          //   // alias
          //   ["[from]", "[alias]"],
          // ],
        },
      ],

      // custom resolvers
      // see https://github.com/antfu/unplugin-auto-import/pull/23/
      resolvers: [
        /* ... */
      ],
    }),
    eslintPlugin({
      // 配置
      cache: false, // 禁用 eslint 缓存
      fix: true,
      // include: [],
      exclude: [],
    }),
    viteMockServe({
      ignore: /^\_/,
      mockPath: "mock",
      localEnabled: true,
      prodEnabled: false,
      // 开发环境无需关心
      // injectCode 只受prodEnabled影响
      // https://github.com/anncwb/vite-plugin-mock/issues/9
      // 下面这段代码会被注入 main.ts
      injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';

          setupProdMockServer();
          `,
    }),
    visualizer({
      filename: "./node_modules/.cache/visualizer/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    compressPlugin({
      ext: ".gz",
      deleteOriginFile: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/index.scss";',
      },
    },
  },
  build: {
    // 生产环境去除 console debugger
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
    https: false,
    proxy: {},
  },
});
