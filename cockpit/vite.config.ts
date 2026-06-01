import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `BUILD_TARGET=single` produces a single, self-contained `dist/index.html`
// (JS, CSS, JSON data, logo, and knob texture all inlined). The dev server
// and the regular build are unaffected.
const SINGLE_FILE = process.env.BUILD_TARGET === 'single'

export default defineConfig({
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
