import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const manifestPath = path.join(distDir, '.vite', 'manifest.json')
const swPath = path.join(distDir, 'service-worker.js')
const PLACEHOLDER = 'self.__PRECACHE_MANIFEST = self.__PRECACHE_MANIFEST || [];'

async function run() {
  try {
    const [manifestRaw, swSource] = await Promise.all([
      readFile(manifestPath, 'utf8'),
      readFile(swPath, 'utf8'),
    ])

    const manifest = JSON.parse(manifestRaw)
    const assets = new Set()

    for (const value of Object.values(manifest)) {
      if (value.file) assets.add(`/${value.file}`)
      value.css?.forEach((file) => assets.add(`/${file}`))
      value.assets?.forEach((file) => assets.add(`/${file}`))
    }

    const payload = JSON.stringify(Array.from(assets).sort(), null, 2)
    const nextSource = swSource.replace(PLACEHOLDER, `self.__PRECACHE_MANIFEST = ${payload};`)

    if (nextSource === swSource) {
      throw new Error('Failed to inject manifest into service worker – placeholder not found.')
    }

    await writeFile(swPath, nextSource)
    console.info(`[pwa] Injected ${assets.size} assets into service worker cache list.`)
  } catch (error) {
    console.error('[pwa] Unable to inject service worker manifest.', error)
    process.exitCode = 1
  }
}

run()
