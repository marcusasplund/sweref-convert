import solid from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      'html-parse-string': new URL('./node_modules/html-parse-string/dist/index.js', import.meta.url).pathname
    },
    conditions: ['development', 'browser']
  },
  test: {
    setupFiles: ['./src/test-setup.tsx']
  }
})
