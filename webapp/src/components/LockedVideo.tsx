import { useEffect, useRef, useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'

/**
 * Lokal dars pleyeri: oldinga o'tkazish yopiq, orqaga qaytarish erkin.
 * «Keyingi bo'lim» faqat darsning ~95% ko'rilgach yoqiladi — o'quvchi
 * darsni tushunib olmasdan keyingi bo'limga o'tmasin.
 * Kurs sotiladi, tekinga berilmaydi: tashqi (YouTube) havola va o'zini
 * «ko'rdim» deb tasdiqlash yo'li umuman yo'q. Fayl bo'lmasa pleyer o'zi
 * ko'rinmay qoladi va onUnavailable signalini beradi.
 */

/** Bufer/sekund siljishi uchun ruxsat etilgan ozodlik payi */
const SLACK = 5
/** Darsning shu qismi ko'rilgach «ko'rildi» hisoblanadi */
const WATCH_RATIO = 0.95

type Props = {
  src: string
  poster: string
  title: string
  watched: boolean
  onWatched: () => void
  /** Video fayl topilmadi (404) — bo'lim sharti bundan tashqari hisoblanadi */
  onUnavailable: () => void
}

const mmss = (t: number) => {
  if (!Number.isFinite(t) || t < 0) t = 0
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export const LockedVideo = ({ src, poster, title, watched, onWatched, onUnavailable }: Props) => {
  const ref = useRef<HTMLVideoElement | null>(null)
  const maxRef = useRef(0)
  const doneRef = useRef(false)

  const [missing, setMissing] = useState(false)
  const [duration, setDuration] = useState(0)
  const [watchedSec, setWatchedSec] = useState(0)

  useEffect(() => { if (missing) onUnavailable() }, [missing])

  const report = (v: HTMLVideoElement) => {
    if (!doneRef.current && v.duration > 0 && maxRef.current >= v.duration * WATCH_RATIO) {
      doneRef.current = true
      triggerHaptic('success')
      onWatched()
    }
  }

  const onTimeUpdate = () => {
    const v = ref.current
    if (!v || !v.duration) return
    // Oldinga sakrab tushgan bo'lsa — qaytarib o'tqazamiz (orqaga erkin)
    if (v.currentTime > maxRef.current + SLACK) {
      v.currentTime = Math.min(maxRef.current + SLACK, v.duration)
      triggerHaptic('warning')
      return
    }
    maxRef.current = Math.max(maxRef.current, v.currentTime)
    setWatchedSec(maxRef.current)
    report(v)
  }

  const onSeeking = () => {
    const v = ref.current
    if (!v || !v.duration) return
    const limit = Math.min(maxRef.current + SLACK, v.duration)
    if (v.currentTime > limit) v.currentTime = limit
  }

  const onLoadedMetadata = () => {
    const v = ref.current
    if (v) setDuration(v.duration)
  }

  const onEnded = () => {
    const v = ref.current
    if (!v) return
    maxRef.current = v.duration
    setWatchedSec(v.duration)
    doneRef.current = true
    onWatched()
  }

  if (missing) return null

  const ratio = duration > 0 ? Math.min(watchedSec / duration, 1) : 0

  return (
    <div className="overflow-hidden" style={{ background: '#0E1A12', borderRadius: 16 }}>
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          className="absolute inset-0 w-full h-full"
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          onError={() => setMissing(true)}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onSeeking={onSeeking}
          onEnded={onEnded}
          onRateChange={() => { if (ref.current && ref.current.playbackRate !== 1) ref.current.playbackRate = 1 }}
        />
      </div>

      {/* Ko'rilgan hudud — oldinga yopiq, shuning uchun oddiy progress chizig'i aldaydi */}
      <div className="px-3.5 pt-3">
        <div className="relative h-[5px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
          <span
            className="absolute left-0 top-0 bottom-0 transition-[width] duration-300"
            style={{ width: `${ratio * 100}%`, background: 'linear-gradient(90deg, #7ED321, #9BE04B)' }}
          />
          {ratio < WATCH_RATIO && (
            <span
              className="absolute top-[-3px] bottom-[-3px]"
              style={{ left: `${WATCH_RATIO * 100}%`, width: 2, background: 'rgba(205,233,174,0.45)' }}
            />
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-[12px] font-bold text-white/85">{title}</p>
          <span
            className="shrink-0 flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-[0.08em]"
            style={{ color: watched ? '#9BE04B' : 'rgba(205,233,174,0.6)' }}
          >
            {watched ? <><Check size={11} /> Ko'rildi</> : <><Lock size={10} /> {mmss(watchedSec)} / {mmss(duration)}</>}
          </span>
        </div>
      </div>
    </div>
  )
}
