// vite.config.ts
import { defineConfig } from "file:///C:/Users/jeppy/projects/Ark.Starters.SPA/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/jeppy/projects/Ark.Starters.SPA/node_modules/@vitejs/plugin-react/dist/index.mjs";
import eslint from "file:///C:/Users/jeppy/projects/Ark.Starters.SPA/node_modules/vite-plugin-eslint/dist/index.mjs";
import copy from "file:///C:/Users/jeppy/projects/Ark.Starters.SPA/node_modules/rollup-plugin-copy/dist/index.commonjs.js";
import preload from "file:///C:/Users/jeppy/projects/Ark.Starters.SPA/node_modules/vite-plugin-preload/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    preload(),
    copy({
      targets: [
        { src: "node_modules/zod-i18n-map/locales", dest: "public" }
      ],
      hook: "buildStart"
    }),
    eslint({ cache: true, fix: true })
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true
  },
  build: {
    emptyOutDir: true,
    outDir: "build",
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-router-dom", "@react-icons/all-files", "react-dom", "react-icons", "react-error-boundary"],
          rtk: ["@reduxjs/toolkit", "react-redux"],
          chakra: ["@chakra-ui/react", "@chakra-ui/icons", "@emotion/react", "framer-motion"],
          i18n: ["i18next", "react-i18next", "zod-i18n-map", "i18next-http-backend", "i18next-browser-languagedetector"]
        }
      }
    },
    sourcemap: true
  },
  server: {
    port: 3e3,
    open: true,
    proxy: {
      "/connectionStrings.cjs": "http://localhost:4000"
    }
  },
  preview: {
    port: 3e3,
    open: true,
    proxy: {
      "/connectionStrings.cjs": "http://localhost:4000"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqZXBweVxcXFxwcm9qZWN0c1xcXFxBcmsuU3RhcnRlcnMuU1BBXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqZXBweVxcXFxwcm9qZWN0c1xcXFxBcmsuU3RhcnRlcnMuU1BBXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9qZXBweS9wcm9qZWN0cy9BcmsuU3RhcnRlcnMuU1BBL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cclxuXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IGVzbGludCBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnO1xyXG5pbXBvcnQgY29weSBmcm9tICdyb2xsdXAtcGx1Z2luLWNvcHknO1xyXG5pbXBvcnQgcHJlbG9hZCBmcm9tIFwidml0ZS1wbHVnaW4tcHJlbG9hZFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICByZWFjdCgpLFxyXG4gICAgICAgIHByZWxvYWQoKSxcclxuICAgICAgICBjb3B5KHtcclxuICAgICAgICAgICAgdGFyZ2V0czogW1xyXG4gICAgICAgICAgICAgICAgeyBzcmM6IFwibm9kZV9tb2R1bGVzL3pvZC1pMThuLW1hcC9sb2NhbGVzXCIsIGRlc3Q6IFwicHVibGljXCIgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBob29rOiAnYnVpbGRTdGFydCdcclxuICAgICAgICB9KSxcclxuICAgICAgICBlc2xpbnQoeyBjYWNoZTogdHJ1ZSwgZml4OiB0cnVlIH0pXSxcclxuICAgIHRlc3Q6IHtcclxuICAgICAgICBnbG9iYWxzOiB0cnVlLFxyXG4gICAgICAgIGVudmlyb25tZW50OiBcImpzZG9tXCIsXHJcbiAgICAgICAgc2V0dXBGaWxlczogXCIuL3ZpdGVzdC5zZXR1cC50c1wiLFxyXG4gICAgICAgIC8vIHlvdSBtaWdodCB3YW50IHRvIGRpc2FibGUgaXQsIGlmIHlvdSBkb24ndCBoYXZlIHRlc3RzIHRoYXQgcmVseSBvbiBDU1NcclxuICAgICAgICAvLyBzaW5jZSBwYXJzaW5nIENTUyBpcyBzbG93XHJcbiAgICAgICAgY3NzOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICAgICAgb3V0RGlyOiAnYnVpbGQnLFxyXG4gICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjA0OCxcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhY3Q6IFsncmVhY3QnLCAncmVhY3Qtcm91dGVyLWRvbScsICdAcmVhY3QtaWNvbnMvYWxsLWZpbGVzJywgJ3JlYWN0LWRvbScsICdyZWFjdC1pY29ucycsJ3JlYWN0LWVycm9yLWJvdW5kYXJ5J10sXHJcbiAgICAgICAgICAgICAgICAgICAgcnRrOiBbJ0ByZWR1eGpzL3Rvb2xraXQnLCAncmVhY3QtcmVkdXgnXSxcclxuICAgICAgICAgICAgICAgICAgICBjaGFrcmE6IFsnQGNoYWtyYS11aS9yZWFjdCcsICdAY2hha3JhLXVpL2ljb25zJywgJ0BlbW90aW9uL3JlYWN0JywgJ2ZyYW1lci1tb3Rpb24nXSxcclxuICAgICAgICAgICAgICAgICAgICBpMThuOiBbJ2kxOG5leHQnLCAncmVhY3QtaTE4bmV4dCcsICd6b2QtaTE4bi1tYXAnLCAnaTE4bmV4dC1odHRwLWJhY2tlbmQnLCAnaTE4bmV4dC1icm93c2VyLWxhbmd1YWdlZGV0ZWN0b3InXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzb3VyY2VtYXA6IHRydWVcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBwb3J0OiAzMDAwLFxyXG4gICAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgJy9jb25uZWN0aW9uU3RyaW5ncy5janMnOiAnaHR0cDovL2xvY2FsaG9zdDo0MDAwJ1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwcmV2aWV3OiB7XHJcbiAgICAgICAgcG9ydDogMzAwMCxcclxuICAgICAgICBvcGVuOiB0cnVlLFxyXG4gICAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgICAgICcvY29ubmVjdGlvblN0cmluZ3MuY2pzJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMCdcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFHQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sVUFBVTtBQUNqQixPQUFPLGFBQWE7QUFHcEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBLE1BQ0QsU0FBUztBQUFBLFFBQ0wsRUFBRSxLQUFLLHFDQUFxQyxNQUFNLFNBQVM7QUFBQSxNQUMvRDtBQUFBLE1BQ0EsTUFBTTtBQUFBLElBQ1YsQ0FBQztBQUFBLElBQ0QsT0FBTyxFQUFFLE9BQU8sTUFBTSxLQUFLLEtBQUssQ0FBQztBQUFBLEVBQUM7QUFBQSxFQUN0QyxNQUFNO0FBQUEsSUFDRixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZO0FBQUE7QUFBQTtBQUFBLElBR1osS0FBSztBQUFBLEVBQ1Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILGFBQWE7QUFBQSxJQUNiLFFBQVE7QUFBQSxJQUNSLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGNBQWM7QUFBQSxVQUNWLE9BQU8sQ0FBQyxTQUFTLG9CQUFvQiwwQkFBMEIsYUFBYSxlQUFjLHNCQUFzQjtBQUFBLFVBQ2hILEtBQUssQ0FBQyxvQkFBb0IsYUFBYTtBQUFBLFVBQ3ZDLFFBQVEsQ0FBQyxvQkFBb0Isb0JBQW9CLGtCQUFrQixlQUFlO0FBQUEsVUFDbEYsTUFBTSxDQUFDLFdBQVcsaUJBQWlCLGdCQUFnQix3QkFBd0Isa0NBQWtDO0FBQUEsUUFDbkg7QUFBQSxNQUNIO0FBQUEsSUFDSDtBQUFBLElBQ0EsV0FBVztBQUFBLEVBQ2Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNILDBCQUEwQjtBQUFBLElBQzlCO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0gsMEJBQTBCO0FBQUEsSUFDOUI7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
