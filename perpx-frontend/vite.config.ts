import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const plugins = [react(), tailwindcss()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress ox package warnings
        if (warning.message.includes('ox')) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Check Web3 libraries FIRST
            if (id.includes('@walletconnect') || id.includes('walletconnect')) {
              return 'walletconnect';
            }
            if (id.includes('wagmi') || id.includes('@wagmi')) {
              return 'web3-wagmi';
            }
            if (id.includes('viem')) {
              return 'web3-viem';
            }
            if (id.includes('ox/')) {
              return 'ox';
            }
            if (id.includes('@tanstack')) {
              return 'tanstack';
            }
            // UI libraries
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            // React libraries
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            if (id.includes('react/') || id.includes('react\\')) {
              return 'react';
            }
            if (id.includes('scheduler')) {
              return 'react';
            }
            // Router
            if (id.includes('wouter')) {
              return 'router';
            }
            // Utilities
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('clsx')) {
              return 'utils';
            }
            // Everything else - split by first letter
            const match = id.match(/node_modules\/([^/]+)/);
            if (match) {
              const packageName = match[1];
              return `vendor-${packageName.charAt(0)}`;
            }
            return 'vendor-other';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
