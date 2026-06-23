import solid from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [solid()],
  test: {
    setupFiles: ['./src/test-setup.tsx']
  },
  resolve: {
    conditions: ['development', 'browser']
  }
})
