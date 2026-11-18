# Push Bildirishnomalar — backend kontrakti

Mobil ilova `expo-notifications` + **Expo Push Service** ishlatadi.
Backend faqat ikki ish qiladi: tokenlarni saqlash va admin so'rovida
Expo Push API'ga yuborish. FCM/APNs kalitlari production'da kerak bo'ladi,
hozircha Expo Push Service hammasini o'zi hal qiladi.

## 1. Ilova → backend

Ilova ishga tushganda (va `notifOn` yoqilganda) bitta so'rov:

```
POST {API}/api/v1/push-token
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxx]",
  "platform": "android" | "ios",
  "enabled": true,
  "telegramId": 123456789        // bo'lsa — auth bo'lgan user
}
```

- `enabled: false` — foydalanuvchi sozlamalarda o'chirgan; token saqlanadi,
  lekin yuborishdan chiqarib tashlanadi.
- Xatolik bo'lsa ilova jim o'tkazib yuboradi — endpoint hozircha yo'q bo'lsa
  muammo emas.

## 2. D1 jadvali (taklif)

```sql
CREATE TABLE push_tokens (
  token       TEXT PRIMARY KEY,
  user_id     TEXT,              -- telegramId yoki user id
  platform    TEXT NOT NULL,
  enabled     INTEGER NOT NULL DEFAULT 1,
  updated_at  TEXT NOT NULL
);
```

Upsert: `INSERT ... ON CONFLICT(token) DO UPDATE SET user_id, enabled, updated_at`.

## 3. Admin → backend → Expo Push

Admin panel notification yaratadi (title, body, ixtiyoriy `data.screen`),
backend barcha `enabled=1` tokenlarga yuboradi:

```
POST https://exp.host/--/api/v2/push/send
Content-Type: application/json

{
  "to": "ExponentPushToken[xxxx]",
  "title": "...",
  "body": "...",
  "data": { "screen": "Daily" },   // ixtiyoriy — ilova shu ekranni ochadi
  "sound": "default",
  "channelId": "default"
}
```

- Expo Push API bir so'rovda 100 tagacha token qabul qiladi (`to` array).
- `data.screen` ruxsat etilgan nomlar: `Main, Daily, Blitz, Balance,
  Formulas, SubjectLevels, Topic, ProblemSet`. Boshqa qiymat e'tiborsiz.
- `Tickets` javobida `status: "error"` bo'lgan tokenlar `DeviceNotRegistered`
  bo'lsa jadvaldan o'chiriladi.

## 4. Test (hozir)

Ilova ichida **Profil → Sozlamalar → Test bildirishnomasi**:
- lokal bildirishnoma darhol chiqadi (Expo Go'da ham);
- Expo push token bo'lsa, remote push ham jo'natiladi — backend'siz sinash
  uchun yetarli.

Remote push uchun **development build** kerak (`npx expo run:android` yoki
`eas build --profile development`) — Expo Go'da remote push ishlamaydi.
`getExpoPushTokenAsync` uchun EAS `projectId` kerak: `eas init` bilan
olinadi yoki `EXPO_PUBLIC_EAS_PROJECT_ID` env bilan beriladi.

## 5. Env

| O'zgaruvchi | Vazifasi |
|---|---|
| `EXPO_PUBLIC_API_BASE` | Backend URL, masalan `https://hdp-api.xxx.workers.dev` |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | Expo push token uchun (ixtiyoriy, eas init'dan keyin app.json'ga tushadi) |
