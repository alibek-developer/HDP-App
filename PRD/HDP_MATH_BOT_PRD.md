# HDP Academy Math — Telegram WebApp PRD
**Versiya:** 1.0 (Demo / Maket)  
**Format:** Telegram WebApp (Mini App)  
**Maqsad:** Mijozga ko'rsatish uchun ishlaydigan maket — mock data, to'liq navigatsiya, real dizayn

---

## 1. TEXNIK STACK

| Qism | Texnologiya |
|---|---|
| Platform | Telegram WebApp (Mini App) |
| Frontend | React + Vite + TypeScript |
| Data | Mock JSON (statik) |
| Shrift | Manrope (Google Fonts) |
| Ikonkalar | Lucide Icons yoki SVG inline |
| Bot token | `BOT_TOKEN_HERE` |
| Deploy | Vercel / Netlify (HTTPS shart) |

---

## 2. BREND & DIZAYN TIZIMI

### Ranglar
```
--primary:           #006C49   /* Asosiy yashil — tugmalar, aktiv elementlar */
--primary-light:     #10B981   /* Hover, progress, badge */
--primary-container: #DCFCE7   /* Yengil yashil fon */
--primary-dark:      #00422B   /* To'q — sarlavhalar */

--surface:           #FAF8FF   /* Sahifa foni */
--surface-low:       #F2F3FF   /* Karta foni */
--surface-card:      #FFFFFF   /* Kartalar */
--surface-border:    #E2E7FF   /* Chegara */

--on-surface:        #131B2E   /* Asosiy matn */
--on-surface-dim:    #3C4A42   /* Ikkinchi darajali matn */
--on-surface-muted:  #6C7A71   /* Uchinchi darajali matn */

--success:           #10B981   /* To'g'ri javob */
--error:             #BA1A1A   /* Xato javob */
--warning:           #F59E0B   /* Ogohlantirish */
--coin-gold:         #F59E0B   /* Koyn rangi */
--xp-blue:           #3B82F6   /* XP rangi */
```

### Tipografiya
```
Font: Manrope (Google Fonts)

H1:      32px / 700 / -0.02em
H2:      24px / 700 / -0.01em
H3:      20px / 600 / -0.005em
Body-lg: 18px / 400 / normal
Body-md: 16px / 400 / normal
Body-sm: 14px / 400 / normal
Label:   12px / 600 / 0.02em
Tiny:    11px / 700 / 0.04em
```

### Komponentlar
```
Border-radius:
  sm:   4px
  md:   8px
  lg:   12px
  xl:   16px
  2xl:  24px
  full: 9999px

Shadow:
  card: 0px 2px 12px rgba(0,0,0,0.06)
  modal: 0px 8px 32px rgba(0,0,0,0.12)

Spacing (8px grid):
  xs: 4px  |  sm: 8px  |  md: 16px
  lg: 24px |  xl: 32px | 2xl: 48px
```

---

## 3. NAVIGATSIYA

### Pastki menyu — 3 tab
```
[🏠 Asosiy] [📐 Formulalar] [👤 Profil]
```
- Aktiv tab: `--primary` rang, to'liq ikonka
- Passiv tab: `--on-surface-muted`, outline ikonka
- Fon: oq, yuqori `1px solid --surface-border`

### Sahifalar orasida o'tish
- Tab o'tish: fade animatsiya (150ms)
- Ichki sahifa: slide-in o'ngdan (200ms)
- Orqaga: slide-out o'ngga (200ms)

---

## 4. SCREENLAR

---

### SCREEN 0 — Splash / Loading
**Fayl:** `screen-splash`  
**Trigger:** Bot birinchi ochilganda

**Elementlar:**
- To'liq ekran, `--surface` fon
- Fonda matematik formulalar teksturasi (opacity: 0.06):
  `∫ ∑ √ π f(x) ax²+bx+c sin cos`
- Markazda: HDP logo (80x80, yashil fon, oq "hdp" yozuvi, border-radius: 20px)
- Logo ostida: `(H, D, P) ⊂ ℝ³` — kichik, `--on-surface-muted`
- Sarlavha: **"Matematika cho'qqilarini zabt eting"** — H2
- Tagline: `∀x ∈ Maqsad : x = Zafar` — pill shakl, border
- Pastda loading bar: yashil, 100% ga to'ladi (1.5s)
- Loading matni: `MODUL: TOPOLOGIYA ... 100%`
- Tugma: **"Davom etish →"** — to'liq kenglik, yashil, pill

**Mock data:** statik  
**O'tish:** tugma bosilganda → Screen 1 (Login)

---

### SCREEN 1 — Login / Onboarding
**Fayl:** `screen-login`

**Elementlar:**
- Yuqorida: HDP logo + "HDP ACADEMY MATEMATIKA" pill (yashil dot bilan)
- O'ngda: "Qayta tiklash" link
- Sarlavha: **"Matematikani 2x tezroq va chuqurroq egallang"**
- "HDP PRO" + "MATEMATIKA" badge yonida
- Sigma (Σ) ikonkasi — katta, gradient kartada
- Statistika qatori: `4.9 ⭐ Reyting | 2.4x O'rtacha o'sish | 25k+ O'quvchilar`
- 3 ta feature kartasi:
  1. 📐 **Cheksiz Darslar & Formulalar Banki** — barcha video va PDF larga kirish
  2. ⚡ **Al Qadam-baqadam Formula Yechimi** — lahzali tahlil
  3. 🎯 **Milliy Sertifikat & Mock Sinovlari** — real imtihon muhiti
- Narx kartalari:
  - **12 Oylik: 318,000 UZS** (636,000 dan, -50% badge)
  - **3 Oylik: 159,000 UZS**
- Tugma: **"HDP PRO'NI BOSHLASH →"** — to'liq kenglik, yashil
- Pastda: "Istalgan vaqtda bekor qilish mumkin · 7 kunlik kafolat"
- To'lov logolari: Payme · Click · Uzum Bank · Uzcard / Humo

**Mock data:** statik  
**O'tish:** Tugma → Screen 2 (Bosh sahifa)  
**Izoh:** Real ilovada Telegram auth bo'ladi, demoda skip qilinadi

---

### SCREEN 2 — Bosh sahifa (Asosiy tab)
**Fayl:** `screen-home`

**Header:**
- Chap: `HDP ACADEMY` kichik, `Formulalar & Shporalar` H2
- O'ng: Qidiruv 🔍 | Bookmark 🔖 | Avatar

**Stats qatori:**
- `🪙 1,250 Coin` — oltin pill
- `⚡ 3,850 XP` — ko'k pill  
- `Tarix >` — link

**Info banner:**
- `ℹ️ Coinlarni HDP Pro yoki kurslarga almashtiring`

**Kunlik Mega Masala kartasi** (to'q yashil fon):
- Badge: `🎯 KUNLIK MEGA MASALA` + `⏱ 04:22:15` countdown
- Kategoriya: `DTM / IMO`
- Masala nomi: **"Parametrli Tenglama"**
- Formula: `f(x) = x² - 2ax + a + 6 = 0`
- Tavsif: "tenglama ikkita musbat ildizga ega bo'lsa, a ning barcha qiymatlar sohasini toping."
- Mukofot: `+50 🪙 +80 XP`
- Tugma: **"Yechish →"**

**Kategoriyalar:**
- Filter pills: `Barchasi (320+)` · `Algebra (110)` · `Geometriya (85)`

**Tezkor Mashqlar & Blitz bo'limi:**
- Sarlavha: "Tezkor Mashqlar & Blitz" + "Do'stlar bilan bellashing va bonus coin yutib oling"
- 2 ta karta (grid):
  1. **Blitz Duel** — 1v1 Real-vaqt · 3 daqiqada 5 ta misol · `+30 Coin` · ▶ tugma
  2. **Streak Seriya** — 2x Koeffitsiyent · Ketma-ket 10 ta · `+100 Coin` · ▶ tugma

**Mavzuli Masalalar:**
- Sarlavha + "Hammasi →"
- List:
  1. Σ **Viyet teoremasi va kvadratik tenglamalar** `Yangi` · Oson · Algebra · `+15🪙 +25⚡` · **Yechish** tugma
  2. △ **Uchburchak medianasi va bissektrisasi** `✓ Yechilgan` · O'rta · Geometriya · `+25🪙 +40⚡` · **Qayta ko'rish** tugma
  3. 🔒 **Murakkab trigonometrik tengsizliklar (IMO)** `Qulflangan` · Qiyin · Analiz · `+60🪙 +100⚡` · **200 Coin** tugma

**Coinlar Do'koni banner:**
- "Coinlar Do'koni · 1,250 mavjud"
- "To'plangan coiningizni 1 oylik HDP Pro obunasiga yoki DTM yopiq konspektlariga almashtiring!"
- Badge: `DTM` `PRO` `PDF`
- **"Do'konga o'tish →"** tugma

**Mock data:**
```json
{
  "user": { "name": "Aliyev Sardor", "coin": 1250, "xp": 3850 },
  "daily_problem": {
    "title": "Parametrli Tenglama",
    "formula": "f(x) = x² - 2ax + a + 6 = 0",
    "reward_coin": 50, "reward_xp": 80,
    "timer": "04:22:15"
  },
  "problems": [
    { "id": 1, "title": "Viyet teoremasi va kvadratik tenglamalar", "status": "new", "difficulty": "easy", "coin": 15, "xp": 25 },
    { "id": 2, "title": "Uchburchak medianasi", "status": "solved", "difficulty": "medium", "coin": 25, "xp": 40 },
    { "id": 3, "title": "Murakkab trigonometrik tengsizliklar", "status": "locked", "difficulty": "hard", "coin": 60, "xp": 100, "unlock_cost": 200 }
  ]
}
```

**O'tish:**
- "Yechish" → Screen 5 (Masala yechish)
- "Do'konga o'tish" → Screen 8 (Do'kon)
- Blitz Duel ▶ → Screen 6 (Blitz)

---

### SCREEN 3 — Formulalar tab
**Fayl:** `screen-formulas`

**Header:**
- `HDP ACADEMY` + "Formulalar & Shporalar" H1
- Qidiruv 🔍 | Bookmark 🔖 | Avatar

**Qidiruv input:**
- Placeholder: "Formulani qidirish (Viyet, Pifagor...)"
- O'ng: Filter tugma

**Filter pills:**
- `Barchasi (140+)` · `Algebra (45)` · `Trigonometriya (32)` · ...

**Kun Formulasi kartasi** (yashil fon):
- Badge: `⭐ KUN FORMULASI · DTM 100%`
- Kategoriya: `MATEMATIK ANALIZ`
- Nomi: **"Nyuton-Leybnits Teoremasi"**
- Formula bloki (to'q fon): `∫ₐᵇ f(x)dx = F(b) − F(a)`
- `👁 9.4k ko'rildi` · **"Tahlil & Misol →"** tugma

**Ikki karta (grid):**
- **Formula Blitz** — 5 daqiqada 10 formula sinovi · `+30 XP` · ▶
- **PDF Shpora** — DTM 2024 to'liq konspekt · 12 MB · ⬇

**Asosiy Formulalar:**
- Sarlavha: "Σ Asosiy Formulalar · 142 ta mavjud"
- Formulalar listi:
  1. `Alg` **Viyet Teoremasi** — Kvadrat tenglama ildizlari xossalari
     - `x₁ + x₂ = −b / a` · `x₁ · x₂ = c / a`
     - Tags: `8-sinf` `Tezkor usul` · `✓ Yodlangan` · >
  2. `Geo` **Kosinuslar Teoremasi** — Ixtiyoriy uchburchak
     - `a² = b² + c² − 2bc · cos(α)`
     - Tags: `Planimetriya` `DTM Blok` · `✓ Yodlangan` · >
  3. `Mat` **Murakkab Funksiya Hosilasi** — Chain Rule
     - `(f(g(x)))' = f'(g(x)) · g'(x)`
     - Tags: `Hosila` `Olimpiada` · `✓ Yodlangan` · >
  4. `Trig` **Keltirish Formulalari**
     - `sin(π/2 − α) = cos(α)` · `tg(π/2 + α) = −ctg(α)`
     - Tags: `Trigonometriya` `Shpora` · >

**Pastki sticky banner:**
- "📋 Bugungi formula testi... Bilimingizni mustahkamlang" · **"Boshlash"** tugma

**Mock data:**
```json
{
  "formula_of_day": {
    "title": "Nyuton-Leybnits Teoremasi",
    "formula": "∫ₐᵇ f(x)dx = F(b) − F(a)",
    "views": 9400
  },
  "formulas": [
    { "id": 1, "cat": "Alg", "title": "Viyet Teoremasi", "saved": true },
    { "id": 2, "cat": "Geo", "title": "Kosinuslar Teoremasi", "saved": true },
    { "id": 3, "cat": "Mat", "title": "Murakkab Funksiya Hosilasi", "saved": true },
    { "id": 4, "cat": "Trig", "title": "Keltirish Formulalari", "saved": false }
  ]
}
```

**O'tish:** Formula bosish → Screen 4 (Formula detail)

---

### SCREEN 4 — Kurslar / Darslar
**Fayl:** `screen-courses`

**Header:**
- Orqaga ← · Kurs nomi · Share 🔗 · Download ⬇ · Avatar

**Dars info:**
- `MASALA #142 · ALGEBRA` kichik label
- `⏱ 02:45` · `+50🪙 +80⚡` pills
- Badges: `● DTM / IMO QIYIN DARAJA`
- Mavzu: `Kvadrat tenglamalar va Viyet` | `Doska / Qoralama`

**Asosiy bo'lim (sahifa 1/10 Bepul):**
- Sarlavha: **"O'rganishni davom eting"** · `3 / 10 Bepul`
- Darslar listi:
  - `✓ 1-DARS · 18 daqiqa · +50 XP` — **Matematik mantiq asoslari** · `Bajarildi`
  - `✓ 2-DARS · 24 daqiqa · +50 XP` — **Haqiqiy sonlar to'plami** · `Bajarildi`
  - `▶ 3-DARS · 32 daqiqa ●` — **Chiziqli tenglamalar va matritsalar** · `Hozir o'rganilmoqda` (aktiv, yashil border)
  - `04` — Kvadrat tenglamalar va Viyet · `Ochiq`
  - `05` — Modulli tenglamalar va grafiklar · `Ochiq`
  - `06` — Funksiyalar va ularning grafigi · `Ochiq`
  - Info: `🔓 7, 8, 9 va 10-darslar ham butunlay bepul ochiq!`

**PRO bo'limi:**
- Divider: `🔒 PRO BOSQICHI (11-100+ DARSLAR)` — to'liq kenglik, sariq

- **Olimpiada & PRO Masterclass** sarlavhasi
- `100+ DARS` · `Olimpiada darajasi` pills
- Pro darslar (qulflangan):
  - `🔒 11-DARS · Chuqurlashtirilgan` — Trigonometrik formulalar siri & tengsizliklar · >
  - `🔒 12-DARS · Xalqaro Olimpiada (IMO)` — Hosila va integral olimpiada darajasi · >
  - `🔒 13-DARS · Stereometriya 3D` — Fazoviy koordinatalar va kesimlar · >

**Sticky pastki tugma:**
- **"🎓 HDP Pro Obunasini faollashtirish →"** — to'liq kenglik, yashil

**Mock data:**
```json
{
  "course": {
    "title": "Olimpiada & PRO Masterclass",
    "free_lessons": 10,
    "pro_lessons": 100
  },
  "lessons": [
    { "id": 1, "title": "Matematik mantiq asoslari", "duration": "18 daqiqa", "status": "done", "xp": 50 },
    { "id": 2, "title": "Haqiqiy sonlar to'plami", "duration": "24 daqiqa", "status": "done", "xp": 50 },
    { "id": 3, "title": "Chiziqli tenglamalar", "duration": "32 daqiqa", "status": "active", "xp": 50 },
    { "id": 4, "title": "Kvadrat tenglamalar va Viyet", "duration": "22 daqiqa", "status": "open", "xp": 50 },
    { "id": 5, "title": "Modulli tenglamalar", "duration": "26 daqiqa", "status": "open", "xp": 50 },
    { "id": 6, "title": "Funksiyalar va grafiklar", "duration": "30 daqiqa", "status": "open", "xp": 50 }
  ]
}
```

**O'tish:** Aktiv dars → Screen 4a (Video) · Pro tugma → Screen 9 (Pro)

---

### SCREEN 4a — Video dars
**Fayl:** `screen-video`

**Header:** Orqaga ← · `Dars Video T...` · Share · Download · Bookmark · Avatar

**Video player (mock):**
- To'q fon (16:9)
- Formulalar fonda: `f(x) x² a 0`
- `● JONLI TAHLIL` badge
- ▶ Play tugma (katta, markazda)
- Progress bar: `06:42 / 14:18` — **SURISH BLOKLANGAN**
- `1.25x` · `1080p` · ⛶ tugmalar

**Dars ma'lumotlari:**
- Badges: `#142-Dars` · `Algebra` · `DTM 100%` · `Qiyin daraja`
- H2: **"Parametrli Tenglamalar: Parabola Uchi va Viyet Teoremasi Chuqur Tahlili"**
- Tavsif matni

**Resurslar qatori:**
- `⬇ Doska Konspekti (PDF)` · `✏ Qaydlar (3)` · ...

**Ustoz kartasi:**
- Avatar · **Azamat Qodirov** · `HDP Bosh O'qituvchisi`
- **"💬 Savol berish"** tugma

**Test kartasi:**
- `📋 Mustaqil Sinov`
- `+30 Coin` · `+50 XP` pills
- "3 ta test savoli bilan..."
- **"Testni Boshlash →"** tugma

**Tab bar:**
- `≡ Taymkodlar` | `📖 Doska Konspekti` | `💬 Savollar (48)`

**Taymkodlar listi:**
- `✓ 00:00 Ko'rildi` — Masala shartini tahlil qilish · ▶
- `▐▐ 04:15 ● Hozir ijroda (06:42)` — Parabola xossasi · ⏸
- `🔒 09:20 Davomiyligi: 3:20` — Diskriminant oraliqlarini kesishtirish
- `⭐ 12:40 IMO Layfxak` — IMO usulidagi 30 soniyalik tezkor test

**Sticky pastki:**
- `|◀` | **"KEYINGI DARS #143: Logarifmik Tengl... 16:05 →"**

**O'tish:** "Testni Boshlash" → Screen 5 (Masala yechish)

---

### SCREEN 5 — Masala Yechish
**Fayl:** `screen-solve`

**Header:**
- `← MASALA #142 · ALGEBRA`
- `⏱ 02:45` · `+50🪙 +80⚡`
- `● DTM / IMO QIYIN DARAJA`
- Mavzu: `Kvadrat tenglamalar va Viyet` | `Doska / Qoralama`

**Masala kartasi:**
- `KUNLIK MEGA MASALA · ✓ HDP Ekspert Tanlov`
- `KANONIK KO'RINISH`
- Formula (katta): `f(x) = x² − 2ax + a + 6 = 0`
- Matn: "Ushbu kvadrat tenglama **ikkita har xil musbat haqiqiy ildizga** ega bo'lsa, **a** parametrning barcha butun qiymatlar yig'indisini toping."

**Shartlar qatori:**
- `D > 0` (2 xil haqiqiy ildiz)
- `x₁ + x₂ > 0` (ildizlar yig'indisi)
- `x₁ · x₂ > 0` (ildizlar ko'paytmasi)

**Javob tanlash:**
- Label: "TO'G'RI JAVOBNI TANLANG · 1 ta urinish"
- 4 variant (A, B, C, D):
  - A: 14
  - B: **18** ← to'g'ri (yashil, ✓)
  - C: 21
  - D: 12

**Yechim bo'limi (javob berilgandan keyin):**
- "Bosqichma-bosqich Yechim · Barchasini yopish"
- **1-QADAM: DISKRIMINANT SHARTI** `D > 0`
  - Hisob-kitob matni va formulalar
- **2-QADAM: VIYET TEOREMASI VA ALOMATLAR** `x₁ > 0, x₂ > 0`
  - Yig'indi va ko'paytma shartlari
- **3-QADAM: SHARTLAR KESISHMASI VA YIG'INDI** `Xulosa`
  - `a ∈ (3, +∞)` · Misol parametr intervalida: `a = 4, 5, 9` · yig'indisi: **18 ga teng**

**HDP Tezkor Usul** (30 soniya):
- Parabola grafigi usuli bilan tezkor yechim

**Natija:**
- `⭐ To'g'ri javob belgilandi!`
- `+50 🪙 · +80 XP ⚡` animatsiya bilan
- **"Tushundim, keyingi misol →"** tugma
- `▶ Yechimni videoda ko'rish (1:45) · Ustoz Azamat`

**Pastki tab:** `≡ Qoralama` | `📊 Tahlil` | **"Tekshirish →"**

**Mock data:**
```json
{
  "problem": {
    "id": 142,
    "title": "Parametrli Tenglama",
    "formula": "f(x) = x² − 2ax + a + 6 = 0",
    "options": [14, 18, 21, 12],
    "correct": 18,
    "reward_coin": 50,
    "reward_xp": 80
  }
}
```

**O'tish:** To'g'ri javob → mukofot animatsiya → keyingi masala

---

### SCREEN 6 — Blitz Duel (O'yin)
**Fayl:** `screen-blitz`

**Mock ko'rinish:**
- Sarlavha: "BLITZ DUEL · 1v1"
- Raqib: "Jasur_math · 1,240 XP"
- Timer: `02:45` (katta, qizil)
- Joriy savol: `3/5`
- Formula savol
- 4 ta variant
- Progress: foydalanuvchi vs raqib

**O'tish:** Tugagach → natija screen

---

### SCREEN 7 — Profil tab
**Fayl:** `screen-profile`

**Header:**
- Σ logo · "Mening Profilim · HDP Shaxsiy Kabinet"
- 🔔 · ≡ settings

**Profil kartasi:**
- Avatar (80px) · ✏ tahrirlash
- **Aliyev Sardor** · `✓` verified
- `@sardor_hdp · #HDP-84219`
- Badge: `🏆 Olimpiada Ishtirokchisi · Lv.4`

**Pro kartasi** (to'q yashil):
- `💎 HDP Pro Faol` · `YILLIK` badge
- "Barcha 100+ maxsus darslar va IMO tahlili ochiq"
- `📅 Muddati: 31-Dekabr, 2025`
- **"Boshqarish"** tugma (oq)

**Stats grid (2x2):**
- `🔥 Olov Streak` · **12 kun** · "Shaxsiy rekord!"
- `⚡ XP Jam'armasi` · **3,850 XP** · "Keyingi: 4,000 XP (+150)"
- `📋 Yechilgan Masalalar` · **248 ta** · "94% aniqlik darajasi"
- `🏆 Reyting O'rni` · **#42-o'rin** · "Respublika Top-100"

**Haftalik Faollik:**
- Bar chart: Du Se Ch Pa Ju **Sha** Ya
- Eng baland: Sha (50m) · Jami: 4.4 soat

**Yutuqlar & Medallar:**
- "20 tadan 12 tasi ochilgan (60%)"
- 3 ta medal: `Tezkor Ma... Viyet Master` · `Olimpiada... DTMPro` · `Matritsa L-3 Algebra Pro`
- **"Barchasi →"**

**Sozlamalar listi:**
- `🎓 Mening Sertifikatlarim` · "2 ta rasmiy tasdiqlangan hujjat" · `PDF` · >
- `🔔 Bildirishnomalar & Eslatmalar` · "Har kuni soat 20:00 da dars" · toggle (on)
- `☀ Ilova Mavzusi` · "Yorug' (Toza Oq rejim)" · `Faol` · >
- `❓ Yordam va Qo'llab-quvvatlash` · "24/7 Telegram kurator (@hdp_support)" · >
- `→ Tizimdan chiqish` — qizil rang

**Footer:** `● HDP Academy v2.4.0 (Build 892) · Matematika & Fizika ixtisoslashtirilgan maktabi`

**Mock data:**
```json
{
  "user": {
    "name": "Aliyev Sardor",
    "username": "sardor_hdp",
    "id": "HDP-84219",
    "level": 4,
    "rank": "Olimpiada Ishtirokchisi",
    "streak": 12,
    "xp": 3850,
    "xp_next": 4000,
    "coin": 1250,
    "solved": 248,
    "accuracy": 94,
    "rating": 42,
    "pro": true,
    "pro_expires": "2025-12-31"
  }
}
```

---

### SCREEN 8 — Coinlar Do'koni
**Fayl:** `screen-shop`

**Header:** Orqaga ← · "Coinlar Do'koni" · `🪙 1,250`

**Kategoriyalar:**
- `PRO Obuna` · `DTM Materiallar` · `Bonuslar`

**PRO Obuna bo'limi:**
- Karta: "1 Oylik PRO · 200 Coin" · **"Sotib olish"**
- Karta: "3 Oylik PRO · 500 Coin" · **"Sotib olish"**

**DTM Materiallar:**
- "DTM 2024 Formulalar to'plami PDF · 50 Coin" · ⬇
- "IMO Masalalar arxivi · 100 Coin" · ⬇

**Mock data:** statik

---

### SCREEN 9 — Pro Subscription
**Fayl:** `screen-pro`

**Dizayn:** screen-login ga o'xshash (birinchi versiyasi)

**Variantlar:**
```
1 YILLIK PRO (CHEKSIZ)  ● seçilgan
39,000 so'm / oy | Jami 468,000 so'm / yil
🎁 Maxsus Sovg'a: +500 Bepul Coin va DTM 2025 PDF
Yillik tejamkorlik: 382,000 so'm

3 OYLIK INTENSIV  -25%
59,000 so'm / oy | 177,000 so'm / kvartal
Muddat: 90 kun

1 OYLIK BAZAVIY
79,000 so'm / oy | 79,000 so'm
Muddat: 30 kun
```

**To'lov:**
- Payme · Click · Uzum bank · HUMO / Uzcard / VISA
- `7 kunlik kafolat: agar dars sifati ma'qul kelmasa, mablag'ingiz to'liq qaytariladi`

**Tugma:** **"Pro Obunani Faollashtirish (468,000 so'm) →"**

---

## 5. ANIMATSIYALAR

| Holat | Animatsiya |
|---|---|
| Coin olish | `translateY(-40px)` + `opacity 0→1→0`, 800ms |
| XP olish | Yuqoriga uchadi, yashil rang |
| To'g'ri javob | Yashil flash + ✓ scale animatsiya |
| Xato javob | Qizil shake animatsiya |
| Screen o'tish | `translateX` slide, 200ms ease |
| Splash loader | Progress bar 0→100%, 1.5s |
| Tab o'tish | Opacity fade, 150ms |

---

## 6. TELEGRAM WEBAPP SOZLAMALAR

```typescript
// webapp/src/lib/telegram.ts
const tg = window.Telegram.WebApp

export const initTelegram = () => {
  tg.ready()
  tg.expand() // To'liq ekranga
  tg.setHeaderColor("#006C49")
  tg.setBackgroundColor("#FAF8FF")
}

export const showBackButton = (onClick: () => void) => {
  tg.BackButton.show()
  tg.BackButton.onClick(onClick)
}

export const hideBackButton = () => {
  tg.BackButton.hide()
}

export const showMainButton = (text: string, onClick: () => void) => {
  tg.MainButton.setText(text)
  tg.MainButton.onClick(onClick)
  tg.MainButton.show()
}

// webapp/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { initTelegram } from './lib/telegram'
import './index.css'

initTelegram()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

---

## 7. FAYL STRUKTURASI

```
hdp-math-bot/
├── bot/
│   └── index.ts                  ← Telegram bot (node-telegram-bot-api)
├── webapp/                       ← React + Vite app
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx              ← Entry point
│       ├── App.tsx               ← Router sozlamalar
│       ├── types/
│       │   └── index.ts          ← TypeScript interfeyslari
│       ├── data/
│       │   └── mockData.ts       ← Barcha mock JSON data
│       ├── store/
│       │   └── useStore.ts       ← Zustand global state
│       ├── lib/
│       │   └── telegram.ts       ← Telegram WebApp init va utils
│       ├── components/
│       │   ├── ui/               ← Shadcn/UI komponentlar
│       │   ├── BottomNav.tsx     ← Pastki navigatsiya
│       │   ├── CoinAnimation.tsx ← Coin/XP animatsiya (Framer Motion)
│       │   ├── FormulaCard.tsx   ← Formula karta
│       │   ├── ProblemCard.tsx   ← Masala karta
│       │   ├── ProBanner.tsx     ← Pro reklama banner
│       │   └── ProgressBar.tsx   ← Progress bar
│       └── screens/
│           ├── SplashScreen.tsx
│           ├── LoginScreen.tsx
│           ├── HomeScreen.tsx
│           ├── FormulasScreen.tsx
│           ├── CoursesScreen.tsx
│           ├── VideoScreen.tsx
│           ├── SolveScreen.tsx
│           ├── BlitzScreen.tsx
│           ├── ProfileScreen.tsx
│           ├── ShopScreen.tsx
│           └── ProScreen.tsx
└── package.json
```

## 8. BOT SOZLAMALAR (bot.js)

```typescript
// bot/index.ts
import TelegramBot from 'node-telegram-bot-api'

const BOT_TOKEN = process.env.BOT_TOKEN!
const WEBAPP_URL = process.env.WEBAPP_URL!

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

// Foydalanuvchi /start yuborganda WebApp ochiladi
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "HDP Academy Matematika ilovasiga xush kelibsiz! 🎓", {
    reply_markup: {
      inline_keyboard: [[{
        text: "📱 Ilovani ochish",
        web_app: { url: WEBAPP_URL }
      }]]
    }
  })
})
```

---

## 9. DEMO UCHUN MUHIM ESLATMALAR

1. **Mock data** — barcha ma'lumotlar statik JSON, hech qanday API yo'q
2. **Tugmalar** — barcha tugmalar screen o'tishni bajaradi
3. **Login** — Telegram auth yo'q, to'g'ridan-to'g'ri bosh sahifaga o'tadi
4. **Video** — real video yo'q, mock player ko'rinishi
5. **To'lov** — real to'lov yo'q, faqat UI ko'rinishi
6. **Countdown timer** — JavaScript `setInterval` bilan ishlaydi (real)
7. **Coin animatsiya** — ishlaydi (real animatsiya)
8. **Tab navigatsiya** — to'liq ishlaydi

