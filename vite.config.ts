import { UserConfigExport, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite"; // 依赖按需自动导入
import visualizer from "rollup-plugin-visualizer"; // 包依赖分析可视化
import compressPlugin from "vite-plugin-compression"; // 代码压缩
import path from "path";
import eslintPlugin from "vite-plugin-eslint";
import styleImport, { VantResolve } from "vite-plugin-style-import";
import postCssPxToRem from "postcss-pxtorem";
import autoprefixer from "autoprefixer";
import { viteMockServe } from "vite-plugin-mock";
import { viteVConsole } from "vite-plugin-vconsole";

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // 根据项目配置。可以配置在.env文件
  const prodMock = false;
  return {
    base: "/",
    plugins: [
      vue(),
      viteVConsole({
        entry: [path.resolve("src/main.ts")], // entry file
        localEnabled: command === "serve", // dev environment
        enabled: command !== "serve" || mode === "test", // build production
        config: {
          // vconsole options
          maxLogNumber: 1000,
          theme: "dark",
        },
      }),
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
      styleImport({
        resolves: [VantResolve()],
      }),
      viteMockServe({
        ignore: /^\_/, // 自动读取模拟.ts 文件时，请忽略指定格式的文件
        mockPath: "mock", // default: mock 设置模拟.ts 文件的存储文件夹
        watchFiles: true, // default: true 设置是否监视mockPath对应的文件夹内文件中的更改
        supportTs: true, // default: true 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        localEnabled: command === "serve", // default: command === 'serve' 设置是否启用本地 xxx.ts 文件，不要在生产环境中打开它.设置为 false 将禁用 mock 功能
        prodEnabled: command !== "serve" && prodMock, // default: command !== 'serve' 设置打包是否启用 mock 功能
        // 开发环境无需关心
        // injectCode 只受prodEnabled影响
        // https://github.com/anncwb/vite-plugin-mock/issues/9
        // 下面这段代码会被注入 main.ts
        injectCode: `
            import { setupProdMockServer } from '../mock/_createProductionServer';

            setupProdMockServer();
            `,
      }),
      eslintPlugin({
        // 配置
        cache: false, // 禁用 eslint 缓存
        fix: true,
        // include: [],
        exclude: [],
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
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              "Android 4.1",
              "iOS 7.1",
              "Chrome > 31",
              "ff > 31",
              "ie >= 8",
              "> 1%",
            ],
            grid: true,
          }),
          postCssPxToRem({
            rootValue: 75, // （设计稿/10）1rem的大小
            propList: ["*"], // 需要转换的属性，这里选择全部都进行转换
            minPixelValue: 2,
          }),
        ],
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
  };
};
