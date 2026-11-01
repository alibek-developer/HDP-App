/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Video fayllar turadigan CDN yo'li, masalan https://cdn.example.com/mavzular/
   *  Bo'sh bo'lsa /videos/<id>.mp4 ishlatiladi (dev middleware yoki hosting shu yo'lda). */
  readonly VITE_VIDEO_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
