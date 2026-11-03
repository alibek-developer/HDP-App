import { useRef, useState } from 'react'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
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

const mmss = (t: number) => {
  const sec = Number.isFinite(t) && t > 0 ? t : 0
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

type Msg =
  | { type: 'ready' }
  | { type: 'error' }
  | { type: 'time'; t: number; d: number }

const embedHtml = (videoId: string) => `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>html,body{margin:0;padding:0;background:#0E1A12;overflow:hidden}
#p{position:fixed;left:0;top:0;width:100%;height:100%}</style>
</head><body>
<div id="p"></div>
<script>
var API='https://www.youtube.com/iframe_api';
function send(m){try{window.ReactNativeWebView.postMessage(JSON.stringify(m))}catch(e){}}
var player=null, max=0, iv=null;
function poll(){ if(iv) return; iv=setInterval(function(){
  try{
    if(!player||!player.getCurrentTime) return;
    var d=player.getDuration()||0, t=player.getCurrentTime()||0;
    if(!d) return;
    if(t>max) max=t;
    send({type:'time',t:max,d:d});
  }catch(e){}
},1000); }
function stop(){ if(iv){clearInterval(iv); iv=null;} }
window.onYouTubeIframeAPIReady=function(){
  player=new YT.Player('p',{
    videoId:'${videoId}',
    playerVars:{rel:0,modestbranding:1,playsinline:1,iv_load_policy:3,controls:1,autoplay:0},
    events:{
      onReady:function(){send({type:'ready'})},
      onError:function(){send({type:'error'})},
      onStateChange:function(e){
        if(e.data===YT.PlayerState.PLAYING) poll(); else stop();
      }
    }
  });
};
(function(){var s=document.createElement('script');s.src=API;
 s.onerror=function(){send({type:'error'})};document.head.appendChild(s);})();
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

export const LessonVideo = ({ videoId, title, watched, onWatched, onUnavailable }: Props) => {
  const doneRef = useRef(false)
  const [failed, setFailed] = useState(false)
  const [duration, setDuration] = useState(0)
  const [watchedSec, setWatchedSec] = useState(0)

  const safeId = /^[A-Za-z0-9_-]{6,20}$/.test(videoId) ? videoId : ''

  const bail = () => {
    setFailed(true)
    onUnavailable()
  }

  const onMessage = (e: { nativeEvent: { data: string } }) => {
    let msg: Msg
    try {
      msg = JSON.parse(e.nativeEvent.data) as Msg
    } catch {
      return
    }
    if (msg.type === 'error') {
      bail()
      return
    }
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
        <Text style={styles.failNote}>Bu dars ilova ichida ochilmadi — YouTube&apos;da ko&apos;ring.</Text>
        <Pressable
          onPress={() => {
            triggerHaptic('light')
            Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`).catch(() => undefined)
          }}
          style={({ pressed }) => [styles.failCta, pressed && { opacity: 0.9 }]}
        >
          <Ionicons name="open-outline" size={13} color="#0E1A12" />
          <Text style={styles.failCtaText}>YouTube&apos;da ochish</Text>
        </Pressable>
      </View>
    )
  }

  const ratio = duration > 0 ? Math.min(watchedSec / duration, 1) : 0

  return (
    <View style={styles.card}>
      {safeId !== '' && (
        <View style={styles.frame}>
          <WebView
            source={{ html: embedHtml(safeId) }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            onMessage={onMessage}
            onError={bail}
            onHttpError={bail}
          />
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
          yopilmaydi, lekin oldinga o&apos;tkazishni YouTube o&apos;zi cheklamaydi.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0E1A12', borderRadius: 16, overflow: 'hidden' },
  frame: { aspectRatio: 16 / 9, backgroundColor: '#0E1A12' },
  webview: { flex: 1, backgroundColor: '#0E1A12' },

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
  failCta: {
    marginTop: 12,
    alignSelf: 'flex-start',
    height: 38,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#9BE04B',
    borderRadius: 19,
  },
  failCtaText: { fontSize: 12.5, fontWeight: '800', color: '#0E1A12' },
})
