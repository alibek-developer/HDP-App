import { useEffect, useRef, useState } from 'react'
import { Check, ExternalLink, Film, Lock } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'

/**
 * YouTube dars pleyeri. Video fayllar internetda saqlanmaydi — ular
 * YouTube'da, shuning uchun bu yerda YouTube IFrame API'si ishlatiladi:
 * progress shu yerdan olinadi va darsning 95% ko'rilmasa bo'lim
 * yakunlanmaydi. Oldinga o'tkazishni YouTube'ning o'zi cheklamaydi —
 * uni ilova bilan majburlab bo'lmaydi, shuning uchun eslatma pastda.
 */

/** Darsning shu qismi ko'rilgach «ko'rildi» hisoblanadi */
const WATCH_RATIO = 0.95

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<any> | null = null
const loadApi = () => {
  if (!apiPromise) {
    apiPromise = new Promise(resolve => {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        resolve(window.YT)
      }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.onerror = () => resolve(null)
      document.head.appendChild(s)
    })
  }
  return apiPromise
}

const mmss = (t: number) => {
  if (!Number.isFinite(t) || t < 0) t = 0
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

type Props = {
  videoId: string
  title: string
  watched: boolean
  onWatched: () => void
  /** Embed bloklangan/vidyo o'chirilgan — bo'lim sharti bundan tashqari hisoblanadi */
  onUnavailable: () => void
}

export const LessonVideo = ({ videoId, title, watched, onWatched, onUnavailable }: Props) => {
  const slotRef = useRef<HTMLDivElement | null>(null)
  const maxRef = useRef(0)
  const doneRef = useRef(false)

  const [failed, setFailed] = useState(false)
  const [duration, setDuration] = useState(0)
  const [watchedSec, setWatchedSec] = useState(0)

  useEffect(() => {
    let player: any = null
    let poll: number | undefined
    let dead = false

    loadApi().then(YT => {
      if (dead || !YT || !slotRef.current) {
        if (!dead) { setFailed(true); onUnavailable() }
        return
      }
      /** React'ga tegishli bo'lmagan mount: YT.Player uni iframe'ga almashtiradi */
      const mount = document.createElement('div')
      slotRef.current.appendChild(mount)

      player = new YT.Player(mount, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
        events: {
          onError: () => {
            setFailed(true)
            onUnavailable()
          },
          onStateChange: (e: any) => {
            if (e.data !== YT.PlayerState.PLAYING) { window.clearInterval(poll); return }
            poll = window.setInterval(() => {
              const d: number = player?.getDuration?.() || 0
              const t: number = player?.getCurrentTime?.() || 0
              if (!d) return
              setDuration(d)
              maxRef.current = Math.max(maxRef.current, t)
              setWatchedSec(maxRef.current)
              if (!doneRef.current && maxRef.current >= d * WATCH_RATIO) {
                doneRef.current = true
                triggerHaptic('success')
                onWatched()
              }
            }, 1200)
          },
        },
      })
    })

    return () => {
      dead = true
      window.clearInterval(poll)
      player?.destroy?.()
    }
  }, [videoId])

  if (failed) {
    return (
      <div className="px-3.5 py-3.5" style={{ background: '#0E1A12', borderRadius: 16 }}>
        <div className="flex items-center gap-2.5">
          <Film size={15} className="shrink-0" style={{ color: '#9BE04B' }} />
          <p className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-white/85">{title}</p>
        </div>
        <p className="mt-2 text-[12px] font-medium leading-snug" style={{ color: 'rgba(205,233,174,0.7)' }}>
          Bu dars ilova ichida ochilmadi — YouTube'da ko'ring.
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => triggerHaptic('light')}
          className="mt-3 inline-flex items-center gap-1.5 h-[38px] px-4 text-[12.5px] font-extrabold active:scale-[0.97] transition-transform"
          style={{ background: '#9BE04B', color: '#0E1A12', borderRadius: 999 }}
        >
          <ExternalLink size={13} /> YouTube'da ochish
        </a>
      </div>
    )
  }

  const ratio = duration > 0 ? Math.min(watchedSec / duration, 1) : 0

  return (
    <div className="overflow-hidden" style={{ background: '#0E1A12', borderRadius: 16 }}>
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <div ref={slotRef} className="absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0" />
      </div>

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
        <p className="mt-2.5 pb-3 text-[11.5px] font-semibold leading-snug" style={{ color: 'rgba(205,233,174,0.55)', borderTop: '1px solid rgba(205,233,174,0.14)', paddingTop: 10 }}>
          Eslatma: dars YouTube'dan ochiladi — internet kerak. Darsni 95% ko'rmay turib bo'lim yopilmaydi,
          lekin oldinga o'tkazishni YouTube o'zi cheklamaydi.
        </p>
      </div>
    </div>
  )
}
