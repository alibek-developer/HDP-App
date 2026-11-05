# HDP Academy

Matematikani o'rgatadigan mobil ilova: video dars → misol → test → natija. To'g'ri yechimlar coin va XP keltiradi, coinlar do'kondagi haqiqiy sovg'alarga almashtiriladi.

Expo SDK 58 (React Native 0.88) + TypeScript. Navigatsiya — React Navigation native-stack. Holat — Zustand + AsyncStorage (`hdp_progress_v1`).

## Ishga tushirish

```bash
npm install
npx expo start            # QR orqali Expo Go yoki dev build
```

Tekshiruv:

```bash
npx tsc --noEmit
npx expo export --platform android
```

## Build (EAS)

```bash
npx eas-cli@latest build --profile preview --platform android   # ichki APK
npx eas-cli@latest build --profile production --platform android
```

EAS hisobiga kirish va loyihani bog'lash (`eas init`) talab qilinadi.

## Tuzilma

- `App.tsx` — navigatsiya konteyneri va boshlang'ich ekran
- `src/screens/` — 22 ekran
- `src/components/` — pleyer, bottom-nav, do'kon javoni va boshqalar
- `src/data/` — darslar, masalalar, do'kon, 1-mavzu kontenti
- `src/store/useStore.ts` — progress, coin/XP, sotib olishlar
- `src/theme/` — ranglar, tipografika, kartalar

## Qoidalar

- Ta'lim zanjiri: video → misol → test → natija. Test faqat misol ishlangach ochiladi.
- 1-mavzu bo'limi videoning 95% ko'rilgach yakunlanadi; yakuniy testga 10 bo'lim tugagach kiriladi (chegara 18/30).
- Takroriy yechim coin to'lamaydi — birinchi o'tish (dars testi), oshgan natija (mavzu testi) va yangi yechilgan masalalar to'lanadi.
- `1-mavzu/` papkasi — xom video manbalar (~1.4 GB), repoga kirmaydi va build'ga qo'shilmaydi.
- Ilova videoni YouTube embed orqali ko'rsatadi — internet talab qilinadi.
