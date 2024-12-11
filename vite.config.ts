/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import msw from "@iodigital/vite-plugin-msw";
import react from "@vitejs/plugin-react-swc";
import copy from "rollup-plugin-copy";
import { defineConfig, loadEnv } from "vite";
import eslint from "vite-plugin-eslint2";
import { i18nAlly } from "vite-plugin-i18n-ally";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import legacy from "vite-plugin-legacy-swc";
import { VitePWA } from "vite-plugin-pwa";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import svgr from "vite-plugin-svgr";

import { supportedLngs } from "./src/config/lang";

const chunkSizeLimit = 10048;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      msw({ mode: "browser", handlers: [] }),
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
      react({ jsxImportSource: "@emotion/react", plugins: [["@swc/plugin-emotion", {}]] }),
      reactClickToComponent(),
      VitePWA({
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
            src: "node_modules/zod-i18n-map/locales/" + l,
            dest: "src/locales",
          };
        }),
        hook: "buildStart",
      }),
      i18nAlly(),
      eslint({
        fix: true,
        build: true,
        lintOnStart: mode != "e2e",
        lintInWorker: mode == "development",
        cache: true,
        cacheLocation: "node_modules/.vite/.eslintcache",
        exclude: ["**/node_modules/**", "**/build/**", "**/public/**", "**/dev-dist/**", "virtual:**"],
        include: ["./src/**/*.{ts,tsx}"],
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
      outDir: "build",
      chunkSizeWarningLimit: chunkSizeLimit,
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-router-dom", "react-dom", "react-error-boundary", "react-helmet-async", "react-if"],
            rtk: ["@reduxjs/toolkit", "@reduxjs/toolkit/query", "@reduxjs/toolkit/react", "react-redux"],
            chakra: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
            i18n: ["i18next", "react-i18next", "zod-i18n-map"],
            finalForm: ["react-final-form", "react-final-form-arrays"],
            common: ["@tanstack/react-table", "ramda", "date-fns", "react-dnd", "react-dnd-html5-backend"],
          },
        },
      },
      sourcemap: true,
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
  };
});
