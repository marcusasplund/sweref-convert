import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/sweref/',
  plugins: [solidPlugin(), VitePWA({ registerType: 'autoUpdate' })],
  build: {
    target: 'esnext'
  }
})
