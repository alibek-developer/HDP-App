import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'uz.hdp.academy',
  appName: 'HDP Math',
  webDir: 'webapp/dist',
  backgroundColor: '#F3F7EE',
  android: {
    allowInlineMediaPlayback: true,
    /** Video va YouTube iframe'i WebView ichida to'siqsiz ishlashi uchun */
    webContentsDebuggingEnabled: true,
    /** YouTube WebView'ni UA'dagi «wv» belgisidan tanib, embed pleyerni
     *  bloklaydi — shu sabab to'liq brauzer UA'si qo'yiladi */
    overrideUserAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  },
  server: {
    androidScheme: 'https',
  },
  plugins: {
    /** Ilova ochilganda ko'rinadigan birinchi ekran — React'dagi
     *  SplashScreen o'zi yuklangach yashiriladi, shuning uchun qisqa */
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: '#0D5638',
      androidScaleType: 'CENTER',
      showSpinner: false,
    },
  },
}

export default config
