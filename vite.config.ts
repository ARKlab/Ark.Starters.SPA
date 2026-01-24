/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import msw from "@iodigital/vite-plugin-msw"
import legacy from "@vitejs/plugin-legacy"
import react from "@vitejs/plugin-react"
import copy from "rollup-plugin-copy"
import { visualizer } from "rollup-plugin-visualizer"
import Info from "unplugin-info/vite"
import { defineConfig, loadEnv } from "vite"
import { i18nAlly } from "vite-plugin-i18n-ally"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"
import istanbul from "vite-plugin-istanbul"
import oxlint from "vite-plugin-oxlint"
import { VitePWA } from "vite-plugin-pwa"
import { reactClickToComponent } from "vite-plugin-react-click-to-component"
import svgr from "vite-plugin-svgr"
import tsconfigPaths from "vite-tsconfig-paths"

import { supportedLngs } from "./src/config/lang"

const chunkSizeLimit = 10048

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [
      Info(),
      msw({ mode: "browser", handlers: [], build: mode == "e2e" }),
      legacy({
        targets: ["defaults"],
        modernTargets: [
          "fully supports es6-module and fully supports css-grid and fully supports es6-module-dynamic-import and >0.5%, not dead",
        ],
        modernPolyfills: true,
        renderLegacyChunks: false,
      }),
      svgr({
        svgrOptions: {
          plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
          svgoConfig: {
            floatPrecision: 2,
          },
        },
      }),
      ViteImageOptimizer(),
      react({
        //jsxImportSource: "@emotion/react",
        babel: {
          plugins: [["babel-plugin-react-compiler", {}]],
        },
      }),
      tsconfigPaths(),
      reactClickToComponent(),
      VitePWA({
        disable: mode == "e2e", // disable PWA in e2e mode due to conflict with MSW (only 1 ServiceWorker can be registered)
        pwaAssets: { disabled: false, config: true, htmlPreset: "2023", overrideManifestIcons: true },
        workbox: {
          maximumFileSizeToCacheInBytes: chunkSizeLimit * 1024,
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
        manifest: {
          name: env.VITE_APP_TITLE,
          description: env.VITE_APP_DESCRIPTION,
          theme_color: "#000000",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
      copy({
        targets: Object.keys(supportedLngs).map(l => {
          return {
            src: "node_modules/@semihbou/zod-i18n-map/locales/" + l,
            dest: "src/locales",
          }
        }),
        hook: "buildStart",
      }),
      i18nAlly(),
      oxlint({
        path: "src",
      }),
      istanbul({
        cypress: true,
        requireEnv: true,
        include: ["src/"],
        // forceBuildInstrument: true,
      }),
      // Bundle analyzer - only in analyze mode
      mode === "analyze" &&
        visualizer({
          filename: "./build/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: "treemap", // 'sunburst' | 'treemap' | 'network'
        }),
    ],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./vitest.setup.ts",
      mockReset: true,
      // you might want to disable it, if you don't have tests that rely on CSS
      // since parsing CSS is slow
      css: true,

      exclude: ["**/node_modules/**", "**/build/**", "**/public/**", "**/dev-dist/**", "virtual:**", "**/cypress/**"],
    },
    build: {
      emptyOutDir: true,
      outDir: mode == "e2e" ? "cypress/dist" : "build",
      chunkSizeWarningLimit: chunkSizeLimit,
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-router", "react-dom", "react-error-boundary"],
            rtk: ["@reduxjs/toolkit", "@reduxjs/toolkit/query", "@reduxjs/toolkit/react", "react-redux"],
            chakra: ["@chakra-ui/react", "@emotion/react"],
            i18n: ["i18next", "react-i18next", "@semihbou/zod-i18n-map"],
            hookForm: ["react-hook-form", "@hookform/resolvers"],
            common: ["@tanstack/react-table", "date-fns", "@dnd-kit/core", "@dnd-kit/sortable"],
          },
        },
      },
      sourcemap: "hidden",
    },
    server: {
      port: parseInt(process.env.PORT ?? "", 10) || 3000,
      open: true,
      proxy: {
        "/connectionStrings.cjs": "http://localhost:4000",
      },
    },
    preview: {
      port: parseInt(process.env.PORT ?? "", 10) || 3000,
      open: true,
      proxy: {
        "/connectionStrings.cjs": "http://localhost:4000",
      },
    },
    esbuild: {
      drop: mode == "production" ? ["console", "debugger"] : [],
    },
  }
})
