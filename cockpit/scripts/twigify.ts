import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Wrap the single-file build in {% verbatim %} … {% endverbatim %} so it can
// be dropped straight into a Twig template without Twig trying to interpret
// any `{{`, `{%`, or `{#` sequences inside the bundled JS/CSS.

const __dirname = dirname(fileURLToPath(import.meta.url))
const IN = resolve(__dirname, '../dist/index.html')
const OUT = resolve(__dirname, '../dist/index.html.twig')

const html = readFileSync(IN, 'utf8')

// If the bundle ever happens to contain a literal `{% endverbatim %}`, the
// wrap below would break out of verbatim mode mid-file. Fail loudly rather
// than emitting a broken template.
if (html.includes('{% endverbatim %}') || html.includes('{%endverbatim%}')) {
  console.error(
    "[twigify] dist/index.html contains a literal '{% endverbatim %}' — wrapping would break Twig parsing.",
  )
  process.exit(1)
}

const wrapped = `{% verbatim %}\n${html}\n{% endverbatim %}\n`
writeFileSync(OUT, wrapped)

const bytes = Buffer.byteLength(wrapped)
console.log(`[twigify] wrote dist/index.html.twig (${(bytes / 1024).toFixed(1)} KB)`)
