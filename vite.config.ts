/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import msw from "@iodigital/vite-plugin-msw";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";
import { visualizer } from "rollup-plugin-visualizer";
import Info from "unplugin-info/vite";
import { defineConfig, loadEnv } from "vite";
import { i18nAlly } from "vite-plugin-i18n-ally";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import istanbul from "vite-plugin-istanbul";
import oxlint from "vite-plugin-oxlint";
import { VitePWA } from "vite-plugin-pwa";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

import { supportedLngs } from "./src/config/lang";

const chunkSizeLimit = 10048;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      Info(),
      msw({ mode: "browser", handlers: [], build: mode == "e2e" }),
      legacy({
        // Legacy browser targets (browsers that need polyfills)
        // Feature-based for browsers lacking modern features
        // CSS Grid polyfills cause rendering problems, so require native support
        targets: [
          "supports es6-module",        // Basic module support
          "supports css-variables",      // Chakra UI v3 requirement
          "supports css-grid",           // Layouts (polyfills cause issues)
          "supports serviceworkers",     // PWA requirement
          ">0.5%",                       // Market share threshold
          "not dead",                    // Still maintained
        ],
        
        // Modern browser targets (get clean, unpolyfilled code)
        // Uses Web Platform Baseline: features widely available for 30+ months
        // Includes downstream browsers (Opera, Brave, Samsung Internet)
        modernTargets: [
          "baseline widely available with downstream and " +
          "fully supports css-variables and " +
          "fully supports es6-module and " +
          "fully supports es6-module-dynamic-import and " +
          "fully supports css-grid and " +
          "fully supports async-functions and " +
          "fully supports serviceworkers"
        ],
        
        // Modern browsers get NO polyfills (fast experience)
        modernPolyfills: false,
        
        // Legacy browsers get polyfilled chunks (degraded but functional)
        renderLegacyChunks: true,
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
        pwaAssets: {
          disabled: false,
          config: true,
          htmlPreset: "2023",
          overrideManifestIcons: true,
        },
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
          };
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
        forceBuildInstrument: mode === "e2e" || mode === "test",
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

      exclude: [
        "**/node_modules/**",
        "**/build/**",
        "**/public/**",
        "**/dev-dist/**",
        "virtual:**",
        "**/cypress/**",
      ],
    },
    build: {
      emptyOutDir: true,
      outDir: "build",
      chunkSizeWarningLimit: chunkSizeLimit,
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks: {
            // Core libraries (rarely change) - separate for maximum cache stability
            react: ["react", "react-dom"],
            "react-router": ["react-router", "react-error-boundary"],

            // State management (occasional updates)
            rtk: [
              "@reduxjs/toolkit",
              "@reduxjs/toolkit/query",
              "@reduxjs/toolkit/react",
              "react-redux",
            ],

            // UI Framework (occasional updates) - already large, keep separate
            chakra: ["@chakra-ui/react", "@emotion/react"],

            // i18n libraries (rarely change)
            i18n: ["i18next", "react-i18next", "@semihbou/zod-i18n-map"],

            // Form libraries (occasional updates)
            hookForm: ["react-hook-form", "@hookform/resolvers", "zod"],

            // Utility libraries (rarely change)
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
        "/connectionStrings.cjs": `http://localhost:${process.env.CONNECTIONSTRINGS_PORT ?? "4000"}`,
      },
    },
    preview: {
      port: parseInt(process.env.PORT ?? "", 10) || 3000,
      open: true,
      proxy: {
        "/connectionStrings.cjs": `http://localhost:${process.env.CONNECTIONSTRINGS_PORT ?? "4000"}`,
      },
    },
    esbuild: {
      drop: mode == "production" ? ["console", "debugger"] : [],
    },
  };
});
