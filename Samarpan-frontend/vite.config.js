import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import copy from 'rollup-plugin-copy'
import { lottie } from 'vite-plugin-lottie'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.lottie"],
  plugins: [
    react(),
    tailwindcss(),
    lottie(),
    copy({
      targets: [{ src: 'public/_redirects', dest: 'dist' }],
      hook: 'writeBundle',
    }),
  ],
})
