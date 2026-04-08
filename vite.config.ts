/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { createHash } from "node:crypto"
import fs from "fs";
import path from "path";

import msw from "@iodigital/vite-plugin-msw";
import legacy, { cspHashes } from "@vitejs/plugin-legacy";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import copy from "rollup-plugin-copy";
import { visualizer } from "rollup-plugin-visualizer";
import Info from "unplugin-info/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import istanbul from "vite-plugin-istanbul";
import oxlint from "vite-plugin-oxlint";
import { VitePWA } from "vite-plugin-pwa";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import svgr from "vite-plugin-svgr";

import { supportedLngs } from "./src/config/lang";

const chunkSizeLimit = 10048;

/**
 * Vite plugin for i18next-http-backend with HMR support
 * Copies locale files to public directory and enables HMR during development
 */
function i18nextBackendHMR(): Plugin {
  return {
    name: "vite-plugin-i18next-backend-hmr",
    
    buildStart() {
      const srcLocalesDir = path.resolve(process.cwd(), "src/locales");
      const publicLocalesDir = path.resolve(process.cwd(), "public/locales");
      
      if (!fs.existsSync(publicLocalesDir)) {
        fs.mkdirSync(publicLocalesDir, { recursive: true });
      }
      
      const languages = fs.readdirSync(srcLocalesDir);
      for (const lang of languages) {
        const langSrcDir = path.join(srcLocalesDir, lang);
        const langPublicDir = path.join(publicLocalesDir, lang);
        
        if (fs.statSync(langSrcDir).isDirectory()) {
          if (!fs.existsSync(langPublicDir)) {
            fs.mkdirSync(langPublicDir, { recursive: true });
          }
          
          const files = fs.readdirSync(langSrcDir);
          for (const file of files) {
            if (file.endsWith(".json")) {
              fs.copyFileSync(
                path.join(langSrcDir, file),
                path.join(langPublicDir, file)
              );
            }
          }
        }
      }
    },
    
    handleHotUpdate({ file, server }) {
      if (file.includes("/locales/") && file.endsWith(".json")) {
        console.log("[i18next-hmr] Locale file changed:", file);
        
        const relativePath = path.relative(path.resolve(process.cwd(), "src/locales"), file);
        const publicPath = path.resolve(process.cwd(), "public/locales", relativePath);
        const publicDir = path.dirname(publicPath);
        
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.copyFileSync(file, publicPath);
        
        const pathParts = relativePath.split(path.sep);
        const lng = pathParts[0];
        const ns = path.basename(pathParts[1], ".json");
        
        server.ws.send({
          type: "custom",
          event: "i18next-hmr-reload",
          data: { lng, ns, path: `/locales/${lng}/${ns}.json` },
        });
      }
    },
  };
}

/**
 * Vite plugin that injects @vitejs/plugin-legacy CSP hashes into the
 * Content-Security-Policy meta tag at build time.
 * Required when renderLegacyChunks: true, which injects inline detection scripts.
 * Uses cspHashes exported by the plugin so hashes stay in sync with the version.
 *
 * Additionally extracts the data: URI used by the detection script (for import.meta.resolve
 * support checking) from the generated HTML and adds its SHA-256 hash to script-src.
 * Without this, Chrome's CSP blocks the data: import, window.__vite_is_modern_browser
 * is never set, and modern browsers fall back to loading the legacy bundle.
 */
function legacyCspHashesPlugin(): Plugin {
  const inlineHashes = cspHashes.map(h => `'sha256-${h}'`).join(" ")
  return {
    name: "vite-plugin-legacy-csp-hashes",
    enforce: "post",
    transformIndexHtml(html) {
      // @vitejs/plugin-legacy injects a detection script that does:
      //   import 'data:text/javascript,if(!import.meta.resolve)throw Error(...)'
      // The data: URI itself is blocked by CSP unless its content hash is in script-src.
      // Extract the data: URI dynamically so we stay in sync if plugin-legacy changes it.
      // Use alternating patterns: single-quoted first (plugin-legacy default), then double-quoted.
      // Anchored to the known plugin-legacy prefix "if(!import.meta.resolve)" to avoid matching
      // any other data: URI imports that may appear in the HTML.
      const dataUriMatch =
        html.match(/import'(data:text\/javascript,if\(!import\.meta\.resolve\)[^']+)'/) ??
        html.match(/import"(data:text\/javascript,if\(!import\.meta\.resolve\)[^"]+)"/)
      let dataUriHash = ""
      if (dataUriMatch) {
        try {
          // URL-decode the script content (browsers decode data: URIs before executing/hashing)
          const scriptContent = decodeURIComponent(dataUriMatch[1].replace(/^data:text\/javascript,/, ""))
          const hash = createHash("sha256").update(scriptContent).digest("base64")
          dataUriHash = ` 'sha256-${hash}'`
        } catch (e) {
          console.warn("[legacyCspHashesPlugin] Failed to decode data: URI content for CSP hash:", e)
        }
      }

      return html.replace(
        /(<meta[^>]+http-equiv="Content-Security-Policy"[^>]+content=")([^"]*)(")/,
        (_, prefix, content, suffix) =>
          `${prefix}${content}; script-src 'self' ${inlineHashes}${dataUriHash}${suffix}`,
      )
    },
  }
}


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
      }),
      babel({
        presets: [reactCompilerPreset()],
      }),
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
      // i18next backend with HMR support
      i18nextBackendHMR(),
      // Inject legacy plugin CSP hashes into Content-Security-Policy meta tag
      legacyCspHashesPlugin(),
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
    resolve: {
      tsconfigPaths: true,
    },
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
      outDir: mode == "e2e" ? "cypress/dist" : "build",
      chunkSizeWarningLimit: chunkSizeLimit,
      target: "esnext",
      rolldownOptions: {
        output: {
          // Vite 8 with Rolldown uses codeSplitting for manual chunk grouping
          // Migration: rollupOptions → rolldownOptions, advancedChunks → codeSplitting
          // See: https://rolldown.rs/in-depth/manual-code-splitting
          codeSplitting: {
            groups: [
              // Core libraries (rarely change) - separate for maximum cache stability
              {
                name: "react",
                test: /\/(react|react-dom)\//,
              },
              {
                name: "react-router",
                test: /\/(react-router|react-error-boundary)\//,
              },
              // State management (occasional updates)
              {
                name: "rtk",
                test: /\/@reduxjs\/toolkit|react-redux/,
              },
              // UI Framework (occasional updates) - already large, keep separate
              {
                name: "chakra",
                test: /\/@chakra-ui\/react|@emotion\/react/,
              },
              // i18n libraries (rarely change)
              {
                name: "i18n",
                test: /\/i18next|react-i18next|@semihbou\/zod-i18n-map/,
              },
              // Form libraries (occasional updates)
              {
                name: "hookForm",
                test: /\/react-hook-form|@hookform\/resolvers|zod/,
              },
              // Utility libraries (rarely change)
              {
                name: "common",
                test: /\/@tanstack\/react-table|date-fns|@dnd-kit\/(core|sortable)/,
              },
            ],
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
    // Note: Vite 8 uses Oxc minifier which does not yet support drop_console option.
    // Debugger statements are automatically removed by Oxc during minification.
    // If dropping console statements is critical, consider using terser:
    //   build: { minify: 'terser', terserOptions: { compress: { drop_console: true } } }
  };
});
