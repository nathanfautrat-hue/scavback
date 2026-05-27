import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Clone local du site Jumistx — sans backend Base44.
// Le SDK '@base44/sdk' est aliasé vers un stub qui renvoie des mocks.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Sub-path d'abord (Vite prend la première match)
      {
        find: '@base44/sdk/dist/utils/axios-client',
        replacement: path.resolve(__dirname, './src/stubs/axios-client.js'),
      },
      {
        find: '@base44/sdk',
        replacement: path.resolve(__dirname, './src/stubs/base44-sdk.js'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  server: {
    port: 5173,
    open: false,
  },
})
