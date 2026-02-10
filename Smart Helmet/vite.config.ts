import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
  react(),
  VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['icon.png'],
  manifest: {
    name: 'Smart Helmet App',
    short_name: 'Helmet',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: 'icon.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  devOptions: {
    enabled: true
  }
})

],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})

