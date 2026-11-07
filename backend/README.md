# HDP API — Cloudflare Workers

HDP Academy ilovasining backend'i: Telegram orqali kirish, sessiyalar va dars
progressi. Baza — D1 (SQLite), vaqtinchalik kalitlar — KV. Video uchun R2 keyingi
bosqichda ulanadi.

## Endpointlar

| Metod | Yo'l | Vazifasi |
| --- | --- | --- |
| GET | `/api/health` | tirikligini tekshirish |
| GET | `/api/tg-start` | bir martalik `nonce` va bot havolasi |
| GET | `/api/tg-status?nonce=` | `pending` / `ready` (+ sessiya `token`) |
| POST | `/api/telegram` | Telegram webhook (maxfiy sarlavha bilan) |
| GET | `/api/v1/me` | profil va progress jamlanmasi |
| GET | `/api/v1/progress` | darslar bo'yicha progress |
| PUT | `/api/v1/progress` | progressni yozish (`lessonId`, `state`, `score`) |
| DELETE | `/api/v1/session` | sessiyani yopish |

`/api/tg-start`, `/api/tg-status` va `/api/telegram` — Netlify relay bilan bir xil
shartnoma, shuning uchun ilovada faqat manzil o'zgaradi.

Sessiya tokeni D1'da faqat SHA-256 xeshi ko'rinishida saqlanadi va 30 kun amal qiladi.

## Birinchi sozlash

```bash
cd backend
npm install
npx wrangler login

npx wrangler kv namespace create AUTH      # chiqqan id'ni wrangler.toml'ga yozing
npx wrangler d1 create hdp                 # chiqqan database_id'ni yozing
npx wrangler r2 bucket create hdp-videos   # video bosqichi uchun

npm run db:remote                          # sxemani bazaga qo'llash
npx wrangler secret put BOT_TOKEN
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET

npm run deploy
```

Deploy'dan keyin manzil `https://hdp-api.<subdomain>.workers.dev` bo'ladi.

## Ilovani ulash

```bash
EXPO_PUBLIC_TELEGRAM_RELAY=https://hdp-api.<subdomain>.workers.dev npx expo start
```

EAS build uchun bu qiymat `eas.json`dagi profil `env` bo'limiga yoziladi. Manzil
almashtirilgach bot webhook'i birinchi kirish urinishida avtomatik yangilanadi —
Telegram tasdiqlari yangi backend'ga tushadi.

## Lokal ishlash

```bash
npm run db:local     # sxema lokal D1'ga
npm run dev          # http://127.0.0.1:8787
node test/smoke.mjs  # to'liq oqim: start -> webhook -> ready -> me -> progress -> logout
```

Lokal maxfiy qiymatlar `.dev.vars` faylida (repo'ga tushmaydi). `BOT_TOKEN`
bo'lmasa Worker Telegram'ga murojaat qilmaydi — testlar tarmoqsiz o'tadi.

## Xarajat

Hozirgi hajm (kuniga bir necha ming so'rov, 10 mavzu) Cloudflare'ning bepul
rejasiga bemalol sig'adi: to'lov faqat R2'da katta video saqlanadigan bosqichda
kerak bo'ladi. Aniq limitlar Cloudflare hujjatlarida.
