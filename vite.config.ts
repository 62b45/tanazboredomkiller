import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type Plugin } from 'vite'
import type { PluginContext } from 'rollup'

const PERF_BUDGET_KB = 200
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const performanceBudgetPlugin = (limitKb = PERF_BUDGET_KB): Plugin => ({
  name: 'performance-budget',
  apply: 'build',
  generateBundle(this: PluginContext, _options, bundle) {
    let totalBytes = 0
    for (const output of Object.values(bundle)) {
      if (output.type === 'chunk' && output.fileName.endsWith('.js')) {
        totalBytes += Buffer.byteLength(output.code, 'utf8')
      }
    }

    const totalKb = totalBytes / 1024
    const summary = `[budget] Total JS ${totalKb.toFixed(2)}kb (limit ${limitKb}kb)`

    if (totalKb > limitKb) {
      this.error(`${summary} — reduce dependencies or split more routes.`)
    } else {
      this.warn(summary)
    }
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const shouldAnalyze = Boolean(process.env.ANALYZE) || mode === 'analyze'

  return {
    plugins: [react(), performanceBudgetPlugin(), ...(shouldAnalyze ? [visualizer({
      filename: 'dist/bundle-report.html',
      template: 'treemap',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })] : [])],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
      },
    },
  }
})
