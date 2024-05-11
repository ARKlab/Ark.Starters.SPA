/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";
import copy from "rollup-plugin-copy";
import preload from "vite-plugin-preload";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ViteImageOptimizer(),
    react({ jsxImportSource: "@emotion/react", plugins: [["@swc/plugin-emotion", {}]] }),
    reactClickToComponent(),
    preload(),
    copy({
      targets: [{ src: "node_modules/zod-i18n-map/locales", dest: "public" }],
      hook: "buildStart",
    }),
    eslint({ fix: true, lintOnStart: true, exclude: ["node_modules/**", "build/**", "public/**"] }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    mockReset: true,
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
  },
  build: {
    emptyOutDir: true,
    outDir: "build",
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-router-dom", "react-dom", "react-error-boundary", "react-helmet-async"],
          rtk: ["@reduxjs/toolkit", "react-redux"],
          chakra: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
          i18n: [
            "i18next",
            "react-i18next",
            "zod-i18n-map",
            "i18next-http-backend",
            "i18next-browser-languagedetector",
          ],
        },
      },
    },
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/connectionStrings.cjs": "http://localhost:4000",
    },
  },
  preview: {
    port: 3000,
    open: true,
    proxy: {
      "/connectionStrings.cjs": "http://localhost:4000",
    },
  },
});
