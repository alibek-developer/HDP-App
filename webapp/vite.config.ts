import { createReadStream, promises as fsp } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const HERE = path.dirname(fileURLToPath(import.meta.url))
/** Dars videolarining joyi: repodagi `1-mavzu` papkasi (git kirmaydi, 1.4 GB). */
const MEDIA_ROOT = path.resolve(HERE, '../1-mavzu')

/**
 * Dev server: videolarni `/videos/<id>.mp4` manzilida uzatadi.
 * Faylni YouTube id'si bo'yicha topadi — `1-mavzu`dagi fayl nomlari
 * `<olsha>+<ytId>.mp4` ko'rinishida. Range so'rovlarini qo'llab-quvvatlaydi,
 * aks holda video orqaga qaytarib ko'rib bo'lmaydi.
 * Production'da bu yo'lni CDN (VITE_VIDEO_BASE_URL) egallaydi.
 */
const localVideos = (): Plugin => {
  let index: Promise<Map<string, string>> | null = null

  const buildIndex = () =>
    fsp.readdir(MEDIA_ROOT, { withFileTypes: true }).then(async (entries) => {
      const map = new Map<string, string>()
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        const dir = path.join(MEDIA_ROOT, entry.name)
        const files = await fsp.readdir(dir)
        for (const file of files) {
          if (!file.endsWith('.mp4')) continue
          const id = file.slice(0, -4).split('+').pop()
          if (id) map.set(id, path.join(dir, file))
        }
      }
      return map
    })

  const find = async (id: string) => {
    if (!index) index = buildIndex()
    try {
      const found = (await index).get(id)
      if (found) return found
      index = buildIndex() // papkaga yangi fayl qo'shilgan bo'lishi mumkin
      return (await index).get(id)
    } catch {
      index = null
      return null
    }
  }

  return {
    name: 'local-videos',
    configureServer(server) {
      server.middlewares.use('/videos', async (req, res) => {
        const id = decodeURIComponent((req.url || '').split('?')[0].replace(/^\//, '').replace(/\.mp4$/, ''))
        if (!/^[A-Za-z0-9_-]{1,32}$/.test(id)) {
          res.statusCode = 400
          return res.end()
        }
        const file = await find(id)
        if (!file) {
          res.statusCode = 404
          return res.end()
        }

        const { size } = await fsp.stat(file)
        const range = req.headers.range
        const match = range && /^bytes=(\d*)-(\d*)$/.exec(range)
        if (match) {
          const start = match[1] ? Number(match[1]) : 0
          const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1
          if (start >= size || start > end) {
            res.statusCode = 416
            res.setHeader('Content-Range', `bytes */${size}`)
            return res.end()
          }
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1,
            'Content-Type': 'video/mp4',
            'Cache-Control': 'no-store',
          })
          return createReadStream(file, { start, end }).pipe(res)
        }

        res.writeHead(200, {
          'Content-Length': size,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'video/mp4',
          'Cache-Control': 'no-store',
        })
        createReadStream(file).pipe(res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localVideos()],
  /** `.env` repodagi asosiy papkada (bot bilan bitta fayl) — faqat VITE_* o'zgaruvchilari ko'rinadi */
  envDir: '..',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
})
