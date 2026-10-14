import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/sweref/',
  build: {
    target: 'esnext'
  },
  plugins: [solidPlugin(), VitePWA({ registerType: 'autoUpdate' })]
})
