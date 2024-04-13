/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from 'vite-plugin-eslint';

function manualChunks(id) {
	if (id.includes('node_modules')) {
		return 'vendor';
	}
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), eslint({ cache: true, fix: true })],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.ts",
        // you might want to disable it, if you don't have tests that rely on CSS
        // since parsing CSS is slow
        css: true,
    },
    build: {
        emptyOutDir: true,
        outDir: 'build',
        chunkSizeWarningLimit: 2048,
        rollupOptions: {
            output: {
                manualChunks: {
                    router: ['react-router-dom'],
                    rtk: ['@reduxjs/toolkit'],
                    redux: ['react-redux'],
                    chakra: ['@chakra-ui/react'],
              }
           }
        },
        sourcemap: true
    },
    server: {
        port: 3000,
        open: true
    }
});