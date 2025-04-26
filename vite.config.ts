import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['pokedex-promise-v2'],
    esbuildOptions: {
      platform: 'node',
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk pour les dépendances externes
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('framer-motion')) {
              return 'vendor';
            }
          }
          return undefined;
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  logLevel: 'info',
}));
