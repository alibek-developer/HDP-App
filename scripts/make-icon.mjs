import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SRC = 'webapp/public/brand/hdp-logo-source.jpg'
const OUT = 'assets'
mkdirSync(OUT, { recursive: true })

const full = () => sharp(SRC).resize(1024, 1024, { fit: 'cover' })
const { data, info } = await full().raw().toBuffer({ resolveWithObject: true })

// Markaning fon yashili — old qatlamdan shu rangli piksellar olib tashlanadi.
// Orqa qatlam ham aynan shu yashil bo'lgani uchun kesilgan chekkalar sezilmaydi.
const BG = [data[0], data[1], data[2]]
const green = { r: BG[0], g: BG[1], b: BG[2] }
const isBg = (i) =>
  Math.abs(data[i] - BG[0]) + Math.abs(data[i + 1] - BG[1]) + Math.abs(data[i + 2] - BG[2]) < 90

const rgba = Buffer.alloc((data.length / 3) * 4)
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  rgba[j] = data[i]
  rgba[j + 1] = data[i + 1]
  rgba[j + 2] = data[i + 2]
  rgba[j + 3] = isBg(i) ? 0 : 255
}
const cut = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toBuffer()

// Adaptive ikonada belgi xavfsiz doiraga sig'ishi kerak: 1024ning ~62% i.
const SAFE = Math.round(1024 * 0.62)
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: await sharp(cut).resize(SAFE, SAFE).png().toBuffer(), gravity: 'center' }])
  .png()
  .toFile(`${OUT}/icon-foreground.png`)

await sharp({ create: { width: 1024, height: 1024, channels: 3, background: green } })
  .png()
  .toFile(`${OUT}/icon-background.png`)

// Legacy (maskalanmagan) ikonalar: halqa to'liq ko'rinadigan kvadrat.
await full().png().toFile(`${OUT}/icon.png`)

const SP = 2732
await sharp({ create: { width: SP, height: SP, channels: 3, background: green } })
  .composite([{ input: await sharp(cut).resize(Math.round(SP * 0.34), Math.round(SP * 0.34)).png().toBuffer(), gravity: 'center' }])
  .png()
  .toFile(`${OUT}/splash.png`)

console.log('OK fon:', BG, '-> assets/')
