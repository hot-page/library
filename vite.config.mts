import { defineConfig } from 'vite'
import { checker } from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [checker({ typescript: true })],
  server: {
    port: 8001,
    cors: true,
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      input: 'src/index.ts',
      output: { entryFileNames: 'library.js' },
    },
  },
})
