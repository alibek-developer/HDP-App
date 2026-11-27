# Value-first onboarding demo PRD

## 1. Maqsad

Yangi foydalanuvchi ilova qiymatini his qilishidan oldin login talab qilinishini kamaytirish. Foydalanuvchi bir haqiqiy matematik savolni hisobsiz yechadi, natija va tushuntirishni ko'radi, shundan keyin progressni saqlash uchun Telegram orqali kirishni taklif qiladi.

Bu versiya — demo. U tizimdagi haqiqiy savol bankidan foydalanadi, lekin yangi backend, to'lov yoki to'liq account tizimini qurmaydi.

## 2. Muammo

- Hozirgi `Boshlash` tugmasi darhol signup/login ekraniga olib boradi.
- Foydalanuvchi ilova nima berishini real namuna bilan ko'rmaydi.
- Login ekranida username-only kirish asosiy CTA bo'lib turadi; bu serverda hisob tekshiradigan autentifikatsiya emas.
- Maqsad va tug'ilgan sana birinchi foyda ko'rsatilishidan oldin so'raladi.
- Auth ekranlarida pastki qism bo'sh, matnlar kichik va bir xil CTA'lar raqobatlashadi.

## 3. Amaldagi oqim

```text
Onboarding
  ├─ Boshlash → SignUp → Telegram → profil (kerak bo'lsa) → Goal → BirthDate → Main
  └─ Hisobingiz bormi? → Login → username yoki Telegram → Goal → BirthDate → Main
```

## 4. Taklif qilinadigan demo oqimi

```text
Onboarding
  ├─ Bepul sinab ko'rish → DemoQuestion → DemoResult → SignUp
  │                                             └─ Qayta urinish → DemoQuestion
  └─ Hisobim bor → Login → Telegram yoki demo username → Goal → BirthDate → Main

SignUp/Login → Telegram
  ├─ ism Telegram profilida mavjud → Goal
  └─ ism yo'q/qisqa → profil maydoni → Goal
```

## 5. Ekran spetsifikatsiyasi

### 5.1 Onboarding / kutib olish

Maqsad: ilova qiymatini bir qarashda ko'rsatish va hisobsiz boshlash.

Elementlar:
- Yuqorida HDP markasi va `HDP Matematika`.
- Kuchli sarlavha: `Bitta savoldan boshlang.`
- Qisqa matn: `Hisobsiz sinab ko'ring. Natijangizni ko'ring, keyin progressni Telegram orqali saqlang.`
- Haqiqiy namuna savol kartasi: `Algebra · oson` va `2x + 6 = 14 tenglamada x nechaga teng?`
- Asosiy CTA: `Bepul sinab ko'rish`.
- Ikkilamchi CTA: `Hisobim bor`.
- Ishonch qatori: `Hisobsiz · 1 daqiqa · 10 mavzu bepul`.

Qoidalar:
- Soxta statistika, student soni yoki baho ko'rsatilmaydi.
- Abstrakt chiziqli illustration emas, real savol kartasi asosiy vizual bo'ladi.
- CTA barmoq zonasida, ekran pastki bo'shlig'ini egallaydi.

### 5.2 DemoQuestion / namuna savol

Maqsad: foydalanuvchiga ilovaning yechish tajribasini his qilish.

Elementlar:
- Ekran yuqorisida `Namuna savol` va `1/1`.
- Haqiqiy savol: `2x + 6 = 14 tenglamada x nechaga teng?`
- To'rtta variant: `2`, `4`, `8`, `10`.
- `Tekshirish` tugmasi.
- Tekshirilgach: to'g'ri/noto'g'ri holat va haqiqiy tushuntirish: `2x = 14 − 6 = 8, demak x = 4.`
- Asosiy CTA: `Natijani ko'rish`.

Qoidalar:
- Bu task ekrani: umumiy header, wallet chip yoki chiqish tugmasi bo'lmaydi.
- Foydalanuvchi variant tanlamaguncha `Tekshirish` o'chiq bo'lmaydi.
- Bir savol bir marta tekshiriladi; ikkinchi marta javob almashtirilmaydi.

### 5.3 DemoResult / demo natijasi

Maqsad: birinchi kichik g'alabani ko'rsatish va auth taklifini tabiiy qilish.

Elementlar:
- `To'g'ri javob` yoki `Keyingi urinishda yechamiz` holati.
- Tanlangan javob va to'g'ri javob.
- Qisqa tushuntirish.
- Asosiy CTA: `Telegram bilan saqlash`.
- Ikkilamchi CTA: `Qayta urinish`.

Qoidalar:
- Natija faqat tanlangan javobga qarab haqiqiy hisoblanadi.
- Coin/XP yoki progress saqlangani haqida demo natijasida da'vo qilinmaydi.

### 5.4 SignUp / Login

Maqsad: auth ni ishonchli va tushunarli qilish.

Elementlar:
- SignUp sarlavhasi: `Progressingizni saqlang`.
- Login sarlavhasi: `Xush kelibsiz`.
- Qisqa matn: `Telegram profilingiz orqali parolsiz kiring.`
- Asosiy CTA: `Telegram bilan davom etish`.
- Telegram afzalliklari: `Parolsiz`, `Telegram profil`, `Progress saqlanadi`.
- Login'da username-only yo'l `Demo rejim` deb ajratiladi va asosiy CTA emas.
- SignUp'da rozilik matni saqlanadi, lekin Telegram CTA'dan oldin turmaydi; CTA bosilgach rozilik bo'lmasa, xato ko'rsatiladi.
- Profil maydoni faqat Telegram ismi yetarli bo'lmasa ochiladi; Telegram ismi bo'lsa oldindan to'ldiriladi.

Qoidalar:
- Username-only demo kirish serverda tekshirilishini anglatmaydi.
- Ekran da bitta asosiy CTA bo'ladi.
- Matnlar `C.ink` / `C.ink2` kontrastida, mayda matnlar kamida 12–13 px.
- Pastki qism bo'sh qolmaydi; qisqa qiymat bloki yoki footer uni egallaydi.

### 5.5 Goal va BirthDate

- Goal va BirthDate auth'dan keyin saqlanadi.
- Goal'da aniq maqsad tanlanishi shart.
- BirthDate'da haqiqiy sana tanlanadi va `onboarded` faqat shu yerda yoqiladi.
- Bu ekranlar to'liq qayta dizayn qilinmaydi; faqat yangi oqimga mos back xatti-harakati tekshiriladi.

## 6. Vizual tizim

- Asosiy palitra saqlanadi: emerald, lime, oq/surface.
- Yangi kuchli element: to'q emerald namuna savol kartasi + lime accent.
- Tipografika: `T.display` / `T.h1` sarlavhalar, `T.bodyMd` / `T.bodySm` matnlar.
- Sarlavha 30–34 px, asosiy matn 14–16 px, yordamchi matn 12–13 px.
- Radius: kartalar 20–24 px, chip/taglar 10–12 px; auth switch kapsula emas, rounded-rect bo'ladi.
- Soft shadow faqat kuchaytirilgan kartalarda.
- Micro-motion: kirishda qisqa reveal, variant tanlashda haptic; doimiy og'ir animatsiya yo'q.

## 7. Texnik yondashuv

- Yangi route'lar: `DemoQuestion`, `DemoResult`.
- `DemoResult` parametrlari: `questionId`, `picked`.
- Demo savoli `src/data/problems.ts` ichidagi `algebra-oson` bankdan deterministik olinadi.
- Demo natija hisoblash va profil shartini tekshirish `src/lib/onboardingDemo.ts` ichida pure funksiyalar bo'ladi.
- `App.tsx` va `src/navigation/types.ts` ga yangi route'lar qo'shiladi.
- Auth'dan keyin Telegram ismi yetarli bo'lsa profil ekrani tashlab o'tiladi.
- Backend, Netlify, bot, to'lov, store reset yoki progress schema o'zgartirilmaydi.

## 8. Test va qabul mezonlari

Avtomatik:
- Demo savol mavjud, to'rtta variantli va to'g'ri indeks haqiqiy.
- To'g'ri tanlov `correct: true` qaytaradi.
- Noto'g'ri yoki noto'g'ri indeks `correct: false` qaytaradi.
- Telegram ismi 3 belgidan qisqa bo'lsagina profil so'raladi.
- `npm test`, `npx tsc --noEmit`, `npx expo lint` o'tadi.

Qo'lda / brauzer:
- Onboarding'dan hisobsiz savolga kirish mumkin.
- To'g'ri va noto'g'ri yo'llar tekshiriladi.
- Natijadan Telegram auth taklifiga o'tish mumkin.
- Login'da Telegram asosiy CTA bo'ladi.
- Telegram sheet ochiladi va `@hdpappbot` ko'rsatiladi.
- Auth'dan keyin Goal → BirthDate → Main oqimi buzilmaydi.
- Ekranlarda sahifasi scroll bo'sh joy qolmaydi.

## 9. Scope chegaralari

Bu demo quyidagilarni qilmaydi:
- Yangi account backend yoki parol tiklash.
- To'liq dars platformasini qayta qurish.
- To'lov/Payme/Click.
- Yangi rang palitrasi yoki brend almashtirish.
- Soxta social proof yoki sun'iy statistika.
- Production APK yoki store release.

## 10. Demo natijasi

Foydalanuvchi demo'ni ko'radi va keyingi ishlashda qaysi yo'l to'g'ri ekanini birga hal qiladi: value-first oqimni saqlash, auth'ni yanada soddalashtirish yoki boshqa g'oyani sinash.
