import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { triggerHaptic } from '../lib/haptics'
import { ABS_FILL, type Grad } from '../theme/tokens'

/**
 * YouTube dars pleyeri — xuddi web'dagi kabi: video YouTube'da yashaydi,
 * progress WebView ichidagi IFrame API'dan olinadi va dars 95% ko'rilmasa
 * bo'lim yakunlanmaydi.
 */

const WATCH_RATIO = 0.95
const RAIL_GRAD: Grad = ['#7ED321', '#9BE04B']

/**
 * Android WebView UA'sida «; wv)» qatari bor — shu qatorni ko'rgan YouTube
 * embed'ni bloklaydi (xuddi Capacitor'dagi kabi). Toza Chrome UA'si beriladi.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'

/**
 * YouTube embed sahifani «about:blank» manbadan ochsa Referer yo'q bo'lib
 * 153-xato («player konfiguratsiyasi noto'g'ri») qaytaradi. baseUrl haqiqiy
 * https manba beradi va playerVars.origin shu manbaga mos bo'ladi.
 */
const EMBED_ORIGIN = 'https://www.youtube.com'

/**
 * Ba'zi qurilmalar WebView ichidagi «html» hujjatda YouTube'ni baribir
 * ochmaydi. Zaxira yo'l — o'sha pleyer haqiqiy https sahifa sifatida
 * (relay/public/lesson-player.html).
 */
const PLAYER_PAGE =
  process.env.EXPO_PUBLIC_PLAYER_PAGE || 'https://hdp-academy-auth.netlify.app/lesson-player.html'

const mmss = (t: number) => {
  const sec = Number.isFinite(t) && t > 0 ? t : 0
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

type Msg =
  | { type: 'ready' }
  | { type: 'error'; code?: number }
  | { type: 'time'; t: number; d: number }

const embedHtml = (videoId: string) => `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>html,body{margin:0;padding:0;background:#0E1A12;overflow:hidden}
#p{position:fixed;left:0;top:0;width:100%;height:100%}</style>
</head><body>
<div id="p"></div>
<script>
var API='${EMBED_ORIGIN}/iframe_api';
function send(m){try{window.ReactNativeWebView.postMessage(JSON.stringify(m))}catch(e){}}
var player=null, pos=0, credit=0, iv=null, lastAt=0, jumped=false;
function poll(){ if(iv) return; lastAt=Date.now(); iv=setInterval(function(){
  try{
    if(!player||!player.getCurrentTime) return;
    var d=player.getDuration()||0, t=player.getCurrentTime()||0;
    if(!d) return;
    var now=Date.now(), wall=(now-lastAt)/1000; lastAt=now;
    var step=t-pos; pos=t;
    /* Faqat tabiiy oqim hisoblanadi: oldinga surish ko'rilgan vaqtga qo'shilmaydi */
    if(step>0){ if(step<=wall+5) credit+=step; else jumped=true; }
    send({type:'time',t:credit,d:d});
  }catch(e){}
},500); }
function stop(){ if(iv){clearInterval(iv); iv=null;} }
window.onYouTubeIframeAPIReady=function(){
  player=new YT.Player('p',{
    videoId:'${videoId}',
    playerVars:{rel:0,modestbranding:1,playsinline:1,iv_load_policy:3,controls:1,autoplay:0,enablejsapi:1,origin:'${EMBED_ORIGIN}'},
    events:{
      onReady:function(){send({type:'ready'})},
      onError:function(e){send({type:'error',code:e&&e.data})},
      onStateChange:function(e){
        if(e.data===YT.PlayerState.PLAYING){ poll(); return; }
        stop();
        /* Oxirigacha ko'rildi — sakrash bo'lmagan bo'lsa, hammasi ko'rilgan */
        if(e.data===YT.PlayerState.ENDED){
          var d=(player&&player.getDuration&&player.getDuration())||0;
          if(d) send({type:'time',t:jumped?credit:d,d:d});
        }
      }
    }
  });
};
(function(){var s=document.createElement('script');s.src=API;
 s.onerror=function(){send({type:'error',code:0})};document.head.appendChild(s);})();
</script>
</body></html>`

type Props = {
  videoId: string
  title: string
  watched: boolean
  onWatched: () => void
  /** Embed bloklangan / video o'chirilgan — bo'lim sharti bundan tashqari */
  onUnavailable: () => void
}

const failText = (code: number | null) => {
  if (code === 101 || code === 150) {
    return "Video egasi uni boshqa saytlarda ko'rishga ruxsat bermagan — YouTube ilovasida ochib ko'ring."
  }
  if (code === 100) return "Video YouTube'da topilmadi — u o'chirilgan yoki maxfiy bo'lishi mumkin."
  if (code === 2) return "Video havolasi noto'g'ri. YouTube'da ochib ko'ring."
  return "Bu dars ilova ichida ochilmadi — internet aloqasini tekshirib, qayta urinib ko'ring."
}

export const LessonVideo = ({ videoId, title, watched, onWatched, onUnavailable }: Props) => {
  const doneRef = useRef(false)
  const loadingRef = useRef(true)
  const bailRef = useRef<(code?: number) => void>(() => {})
  const [mode, setMode] = useState<'inline' | 'remote'>('inline')
  const [attempt, setAttempt] = useState(0)
  const [loading, setLoading] = useState(true)
  const [failCode, setFailCode] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)
  const [duration, setDuration] = useState(0)
  const [watchedSec, setWatchedSec] = useState(0)

  const safeId = /^[A-Za-z0-9_-]{6,20}$/.test(videoId) ? videoId : ''

  loadingRef.current = loading

  const bail = (code?: number) => {
    /** 100/101/150/2 — YouTube'ning o'zi rad etadi, zaxira sahifa ham yordam bermaydi */
    const hard = code === 100 || code === 101 || code === 150 || code === 2
    if (!hard && mode === 'inline') {
      setMode('remote')
      setLoading(true)
      return
    }
    setLoading(false)
    setFailCode(code ?? null)
    setFailed(true)
    onUnavailable()
  }

  bailRef.current = bail

  /** 20 soniyada na «ready», na xato kelsa — keyingi manbaga o'tamiz */
  useEffect(() => {
    if (failed) return
    const timer = setTimeout(() => {
      if (loadingRef.current) bailRef.current(0)
    }, 20000)
    return () => clearTimeout(timer)
  }, [failed, mode, attempt])

  const retry = () => {
    triggerHaptic('selection')
    doneRef.current = false
    setFailed(false)
    setFailCode(null)
    setLoading(true)
    setDuration(0)
    setWatchedSec(0)
    setAttempt(a => a + 1)
  }

  const openInYouTube = () => {
    triggerHaptic('selection')
    void Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)
  }

  /**
   * «Watch on YouTube» yoki sarlavhaga bosilsa WebView butun YouTube
   * saytiga o'tib ketardi — pleyer yo'qolib, progress to'xtardi va
   * bo'lim ochilmay qolardi. Endi faqat o'z pleyerimiz qoladi.
   */
  const onNavRequest = (req: { url: string }) => {
    const url = req.url
    const allowed =
      mode === 'inline'
        ? url.startsWith('about:') ||
          url.startsWith('data:') ||
          url === `${EMBED_ORIGIN}/` ||
          url === EMBED_ORIGIN
        : url.startsWith(PLAYER_PAGE)
    if (allowed) return true
    if (/youtube\.com\/watch|youtu\.be\//.test(url)) void Linking.openURL(url)
    return false
  }

  const onMessage = (e: { nativeEvent: { data: string } }) => {
    let msg: Msg
    try {
      msg = JSON.parse(e.nativeEvent.data) as Msg
    } catch {
      return
    }
    if (msg.type === 'error') {
      bail(msg.code)
      return
    }
    if (msg.type === 'ready') setLoading(false)
    if (msg.type !== 'time' || !msg.d) return
    setDuration(msg.d)
    setWatchedSec(msg.t)
    if (!doneRef.current && msg.t >= msg.d * WATCH_RATIO) {
      doneRef.current = true
      triggerHaptic('success')
      onWatched()
    }
  }

  if (failed) {
    return (
      <View style={styles.failCard}>
        <View style={styles.failTop}>
          <Ionicons name="film" size={15} color="#9BE04B" />
          <Text style={styles.failTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <Text style={styles.failNote}>{failText(failCode)}</Text>
        <View style={styles.failActions}>
          <Pressable
            onPress={retry}
            accessibilityLabel="Videoni qayta yuklash"
            style={({ pressed }) => [styles.failPrimary, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="refresh" size={15} color="#0E1A12" />
            <Text style={styles.failPrimaryText}>Qayta urinish</Text>
          </Pressable>
          <Pressable
            onPress={openInYouTube}
            accessibilityLabel="YouTube'da ochish"
            style={({ pressed }) => [styles.failGhost, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="logo-youtube" size={16} color="#9BE04B" />
            <Text style={styles.failGhostText}>YouTube&apos;da ochish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const ratio = duration > 0 ? Math.min(watchedSec / duration, 1) : 0

  return (
    <View style={styles.card}>
      {safeId !== '' && (
        <View style={styles.frame}>
          <WebView
            key={`yt-${safeId}-${mode}-${attempt}`}
            source={
              mode === 'inline'
                ? { html: embedHtml(safeId), baseUrl: `${EMBED_ORIGIN}/` }
                : { uri: `${PLAYER_PAGE}?v=${encodeURIComponent(safeId)}` }
            }
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            setSupportMultipleWindows={false}
            scrollEnabled={false}
            originWhitelist={['*']}
            userAgent={BROWSER_UA}
            onShouldStartLoadWithRequest={onNavRequest}
            onMessage={onMessage}
            onLoadEnd={() => setLoading(false)}
            onError={() => bail()}
            onHttpError={() => bail()}
          />
          {loading && (
            <View style={styles.loading} pointerEvents="none">
              <ActivityIndicator size="small" color="#9BE04B" />
              <Text style={styles.loadingText}>Video yuklanmoqda…</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.railTrack}>
          <View style={[styles.railFill, { width: `${ratio * 100}%` }]}>
            <LinearGradient colors={RAIL_GRAD} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={ABS_FILL} />
          </View>
          {ratio < WATCH_RATIO && <View style={styles.railGate} />}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.metaState}>
            {watched ? (
              <>
                <Ionicons name="checkmark" size={11} color="#9BE04B" />
                <Text style={[styles.metaStateText, { color: '#9BE04B' }]}>Ko&apos;rildi</Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed" size={10} color="rgba(205,233,174,0.6)" />
                <Text style={[styles.metaStateText, { color: 'rgba(205,233,174,0.6)' }]}>
                  {mmss(watchedSec)} / {mmss(duration)}
                </Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.note}>
          Eslatma: dars YouTube&apos;dan ochiladi — internet kerak. Darsni 95% ko&apos;rmay turib bo&apos;lim
          yopilmaydi; video oldinga surilsa, o&apos;tkazib yuborilgan qism ko&apos;rilgan hisoblanmaydi.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0E1A12', borderRadius: 16, overflow: 'hidden' },
  frame: { aspectRatio: 16 / 9, backgroundColor: '#0E1A12' },
  webview: { flex: 1, backgroundColor: '#0E1A12' },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0E1A12',
  },
  loadingText: { fontSize: 11.5, fontWeight: '600', color: 'rgba(205,233,174,0.6)' },

  body: { paddingHorizontal: 14, paddingTop: 12 },
  railTrack: { height: 5, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 3, overflow: 'hidden' },
  railFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3, overflow: 'hidden' },
  railGate: {
    position: 'absolute',
    left: `${WATCH_RATIO * 100}%`,
    top: -3,
    bottom: -3,
    width: 2,
    backgroundColor: 'rgba(205,233,174,0.45)',
  },

  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 },
  metaTitle: { flex: 1, minWidth: 0, fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  metaState: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
  metaStateText: { fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '800' },

  note: {
    marginTop: 10,
    paddingBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(205,233,174,0.14)',
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '600',
    color: 'rgba(205,233,174,0.55)',
  },

  failCard: { backgroundColor: '#0E1A12', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 14 },
  failTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  failTitle: { flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  failNote: { marginTop: 8, fontSize: 12, lineHeight: 18, fontWeight: '500', color: 'rgba(205,233,174,0.7)' },
  failActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  failPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#9BE04B',
  },
  failPrimaryText: { fontSize: 12.5, fontWeight: '800', color: '#0E1A12' },
  failGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(205,233,174,0.24)',
  },
  failGhostText: { fontSize: 12.5, fontWeight: '700', color: '#CDE9AE' },
})
