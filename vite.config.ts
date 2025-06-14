import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            // React core
            'react-vendor': ['react', 'react-dom'],

            // UI Library (Radix + shadcn)
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-avatar',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-accordion',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-label',
              '@radix-ui/react-slider',
              '@radix-ui/react-select',
              '@radix-ui/react-slot',
              '@radix-ui/react-separator'
            ],

            // Animation (HUGE - Load séparément)
            'animation-vendor': ['motion'],

            // 3D Graphics (TRÈS LOURD - Lazy load)
            'three-vendor': ['three'],

            // Supabase
            'supabase-vendor': ['@supabase/supabase-js'],

            // React Query
            'query-vendor': ['@tanstack/react-query'],

            // Router
            'router-vendor': ['react-router-dom'],

            // Date utilities
            'date-vendor': ['date-fns'],

            // Icons
            'icons-vendor': ['lucide-react'],

            // Unused/Heavy libs
            'charts-vendor': ['recharts'],

            // Utils
            'utils-vendor': ['clsx', 'class-variance-authority', 'tailwind-merge']
          },
        },
      },
      chunkSizeWarningLimit: 1000,

      // Optimisations supplémentaires
      cssCodeSplit: true,
      sourcemap: false, // Désactiver en prod pour réduire la taille

      // Compression
      reportCompressedSize: true,
    },

    // Optimiser les dépendances
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        'date-fns',
        'lucide-react'
      ],
      exclude: [
        'three', // Lazy load
        'motion', // Lazy load animations
        'recharts' // Pas utilisé
      ]
    },

    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
  };
});
