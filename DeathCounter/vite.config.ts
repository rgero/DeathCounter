import { fileURLToPath } from 'node:url'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor'
          }

          if (id.includes('node_modules/@tanstack/react-query/') || id.includes('node_modules/@tanstack/react-query-devtools/')) {
            return 'query-vendor'
          }

          if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/styled/')) {
            return 'mui-vendor'
          }

          if (
            id.includes('node_modules/@supabase/supabase-js/') ||
            id.includes('node_modules/axios/') ||
            id.includes('node_modules/crypto-js/') ||
            id.includes('node_modules/socket.io-client/') ||
            id.includes('node_modules/uuid/')
          ) {
            return 'backend-vendor'
          }

          return undefined
        },
      },
    },
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      'react-transition-group/TransitionGroupContext': path.resolve(__dirname, 'node_modules/react-transition-group/cjs/TransitionGroupContext.js'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: true,
  },
})
