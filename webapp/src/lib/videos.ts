const BASE = import.meta.env.VITE_VIDEO_BASE_URL

/**
 * Video fayl manzili.
 *  - Production: CDN (`VITE_VIDEO_BASE_URL` oxirida `/` bo'lishi shart emas).
 *  - Dev / hozircha: `/videos/<id>.mp4` — vite middleware `1-mavzu` papkasidan beradi.
 * Faylnomlar YouTube id'si bilan tugaydi (`...+<id>.mp4`), shuning uchun kalit — id.
 */
export const videoFileUrl = (videoId: string) => {
  const file = `${encodeURIComponent(videoId)}.mp4`
  return BASE ? `${BASE.replace(/\/+$/, '')}/${file}` : `/videos/${file}`
}
