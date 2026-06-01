import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `BUILD_TARGET=single` produces a single, self-contained `dist/index.html`
// (JS, CSS, JSON data, logo, and knob texture all inlined). The dev server
// and the regular build are unaffected.
const SINGLE_FILE = process.env.BUILD_TARGET === 'single'

// `GH_PAGES=true` builds for the GitHub Pages project site, which is served
// under the `/pimcore-intro/` subpath. Dev, preview, and the single-file build
// keep the default root base.
const GH_PAGES = process.env.GH_PAGES === 'true'

export default defineConfig({
  base: GH_PAGES ? '/pimcore-intro/' : '/',
  plugins: [react(), ...(SINGLE_FILE ? [viteSingleFile()] : [])],
  server: { port: 5173, host: true },
  build: {
    // Big enough to inline the brushed-metal knob texture (~525 KB).
    assetsInlineLimit: SINGLE_FILE ? 1_500_000 : 4096,
    // The plugin needs everything emitted into a single chunk.
    ...(SINGLE_FILE
      ? {
          cssCodeSplit: false,
          rollupOptions: { output: { inlineDynamicImports: true } },
        }
      : {}),
  },
})
