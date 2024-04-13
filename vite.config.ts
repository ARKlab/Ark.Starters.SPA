/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from 'vite-plugin-eslint';

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
                    react: ['react', 'react-router-dom', '@react-icons/all-files', 'react-dom', 'react-icons','react-error-boundary'],
                    rtk: ['@reduxjs/toolkit', 'react-redux'],
                    chakra: ['@chakra-ui/react', '@chakra-ui/icons', '@emotion/react', 'framer-motion'],
                    i18n: ['i18next', 'zod-i18n-map']
              }
           }
        },
        sourcemap: true
    },
    server: {
        port: 3000,
        open: true
    },
    preview: {
        port: 3000,
        open: true
    }
});