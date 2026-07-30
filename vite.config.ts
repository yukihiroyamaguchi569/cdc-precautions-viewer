import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves the project site under /<repo>/.
// Override with BASE_PATH env if deploying elsewhere (e.g. a custom domain uses '/').
const base = process.env.BASE_PATH ?? '/cdc-precautions-viewer/';

export default defineConfig({
  base,
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'CDC Precautions — Appendix A',
        short_name: 'Precautions',
        description:
          'Search-first viewer for CDC Isolation Precautions Appendix A (Type and Duration of Precautions).',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff2}'],
      },
    }),
  ],
});
