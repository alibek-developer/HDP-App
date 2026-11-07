import type { TopicLesson, TopicTest, TheoryBlock, WorkedItem, TopicExercise } from './topicTypes'

/**
 * MAVZU 2 — «Oxiriga yetkazilmagan bo'lish. Natural sonlarning cheklangan
 * imkoniyati» (2.1–2.11).
 *
 * Manba: darslikning 2-bob nazariy qismi (2.1–2.11), «Amaliy qism» va
 * «O'zingizni sinab ko'ring!» mashqlari. Har bir bo'lim sarlavhasi, «Maqsad»,
 * TA'RIF / MA'LUMOT / MASALAN / ESLATMA / XULOSA / SAVOL bloklari, MISOL /
 * YECHISH va mashqlar kitobdagi matn bo'yicha ko'chirilgan; biror misol,
 * jadval yoki mashq qo'shilmagan. Formulalar rasmda berilgani uchun oddiy
 * matn (·, −, :, 1/3, n², ≤) bilan yozilgan.
 *
 * `2.8`, `2.9`, `2.10` bo'limlarida nazariya jadval ko'rinishida — shu sababli
 * ular `properties` maydoniga o'tkazilgan.
 *
 * `TOPIC_2_TEST` — 2.12, mavzu yakuniy 12 savolli testi.
 */

export const TOPIC_2_META = {
  id: 'mavzu-2',
  num: 2,
  chapter: "Oxiriga yetkazilmagan bo'lish. Natural sonlarning cheklangan imkoniyati",
  title: "Mavzu 2. Oxiriga yetkazilmagan bo'lish",
  lessonCount: 11,
}

/* ─────────── 2.1 ─────────── */

const THEORY_2_1: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Hurmətli o'quvchi! Keling siz bilan barcha uchun juda qiziqarli bo'lgan Biznes mavzusida suhbatlashamiz.",
  },
  {
    kind: 'SAVOL',
    text: 'Qaysi sohada biznes boshlagan ma\'qul?',
  },
  {
    kind: "MA'LUMOT",
    text: "Savolning javobi: oddiy, qaysi sohada muammo bo'lsa, o'sha sohada biznes boshlagan ma'qul, chunki muammo bor joyda shu muammoning yechimi uchun pul to'lashga tayyor potensial mijozlar oqimi bo'ladi.",
  },
  {
    kind: 'SAVOL',
    text: "Yana bir savol: Biznesda muammo o'zi nega paydo bo'ladi?",
  },
  {
    kind: "MA'LUMOT",
    text: "Muammo biznesning, qaysidir bir bo'g'ini yoki bir nechta bo'g'ini o'z funksiyasini bajara olmayotganligi uchun paydo bo'ladi. Muammoni yechish natijasida anashu o'z funksiyalarini bajara olmayotgan bo'g'inlar o'rniga, muammoga yechim bo'la oladigan boshqa bizneslar, yoki tizimlar paydo bo'ladi.",
  },
  {
    kind: "MA'LUMOT",
    text: "Endi matematika haqida suhbatlashsak ham bo'ladi: matematikaning o'z funksiyalarini to'laqonli bajara olmayotgan muammoli bo'g'inlaridan biri bu bo'lish amalidir. Bo'lish amali matematikaning eng muhim amallaridan biridir. Bo'lish amali haqida oldingi mavzuda tanishib o'tgandik, lekin mavzuyimiz to'laqonli oxiriga yetmagandi, ya'ni o'tgan mavzuda faqat natural sonlar ustida bo'lish amalini bajarishni o'rgandik xolos. Ammo haqiqiy muammo shundan boshlanadi: hohlagan natural sonimizni har doim ham boshqa bir natural songa bo'lishning iloji yo'q (hozircha). Masalan 7 ni 4 ga bo'lsak, javobni natural sonlarda ifodalay olmaymiz, ya'ni javob 1 dan katta ammo 2 dan kichik lekin bu oraliqda (1 bilan 2 oralig'ida) birorta ham natural son yo'q.",
  },
  {
    kind: "MA'LUMOT",
    text: "Ana shunday holatlarda yechim topish uchun insoniyat avvalo qoldiqli bo'lishni va keyinchalik oddiy kasrlar kabi matematikaning asos tushunchalarini ixtiro qiladi",
  },
]

/* ─────────── 2.2 ─────────── */

const THEORY_2_2: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Shaxsiy boyligi mlrd dollarlarni tashkil qiluvchi Arab Shayxi Xalifa ben Al Nahayan vafot etishidan oldin o'z tasarrufidagi jami 8 ta Ferrari rusumli avtomobillarini 3 ta o'g'liga meros sifatida qoldirib ketdi. O'g'illari esa nima ish qilishmasin 8 ta avtomobilni teng 3 qismga bo'la olishmadi. Sababi 8 ta buyumni 3 bo'lakka teng taqsimlashning natural sonlarda iloji yo'q edi. Shu tariqa o'g'illari orasida meros tufayli nizo chiqishi mumkin. Aziz matematiklar Shayhning o'g'illariga yordam bering! Ular qay tartibda meroslarini taqsimlagani ma'qul?",
  },
  {
    kind: 'XULOSA',
    text: "Natural sonlarni natural songa bo'lib, yechimni natural sonlarda olishning har doim ham imkoni bo'lavermas ekan",
  },
  {
    kind: "MA'LUMOT",
    text: "Keling shayx merosini taqsimlashga harakat qilamiz: 8 ta avtomobilni 3 ta og'ilga taqsimlamoqchi bo'lsak, har bir o'g'ilga 2 ta avtomobildan to'g'ri keladi va yana 2 ta avtomobil ortib qoladi. Ortib qolgan avtomobillarni esa yana kimdadir sovg'a qilish mumkin(Quyidagi rasm).",
  },
  {
    kind: "MA'LUMOT",
    text: "Endi bu masalani matematik yo'l bilan hal qilamiz: 8 ni 3 ga bo'lamiz, bo'linma 2 ga teng bo'lib, 2 qoldiq qoladi, ya'ni 8 : 3 = 2 (2 qoldiq) yoki 8 = 3 · 2 + 2.",
  },
  {
    kind: "MA'LUMOT",
    text: "Endi qoldiqli bo'lish haqida chuqurroq yondashamiz:",
  },
  {
    kind: "MA'LUMOT",
    text: "Umumiy holda qoldiqli bo'lish formulasi quyidagicha ifodalanadi: a = b · n + r. Bu yerda a — bo'linuvchi, b — bo'luvchi, n — bo'linma, r — qoldiq.",
  },
  {
    kind: 'MASALAN',
    text: "46 = 7 · 6 + 4. Ushbu misolda 46 — bo'linuvchi, 7 — bo'luvchi, 6 — bo'linma, 4 — qoldiq hisoblanadi.",
  },
  {
    kind: 'ESLATISH',
    text: "Qoldiq doimo musbat hamda bo'luvchidan kichik bo'lishi shart, ya'ni 0 ≤ r < b",
  },
]

const EXAMPLE_2_2: WorkedItem = {
  prompt:
    'Qaysi tenglik qoldiqli bo\'lishni ifodalaydi?   1) 85 = 12 · 7 + 1   2) 85 = 12 · 8 − 11   3) 85 = 6 · 13 + 7',
  steps: [
    '1) 12 · 7 + 1 = 85, qoldiq r = 1 va 1 < 12',
    '2) qoldiq manfiy (−11), ayirish ishlatilgan',
    '3) 13 soni bo\'luvchi 6 dan katta, ya\'ni qoldiq bo\'luvchidan kichik emas',
  ],
  answer:
    "1-tenglik (qoldiq musbat va bo'luvchidan kichik bo'lgani uchun faqat 1-tenglik qoldiqli bo'lishni ifodalaydi)",
}

const EX_2_2: TopicExercise[] = [
  {
    prompt: "O'zingizni sinab ko'ring! 876 ni 15 ga bo'lgandagi qoldiqni toping.",
    steps: ['876 = 15 · 58 + 6'],
    answer: '6',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Shunday son topingki, uni 8 ga bo'lganda bo'linma 7 ga teng bo'lib, 4 qoldiq qolsin",
    steps: ['a = b · n + r = 8 · 7 + 4'],
    answer: '60',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! 243 ni qandaydir songa bo'lganda bo'linma 15 ga, qoldiq 3 ga teng chiqdi. Bo'luvchi nechaga teng?",
    steps: ['243 = b · 15 + 3', '15 · b = 240', 'b = 16'],
    answer: '16',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! 279 ni 16 ga bo'lganda qoldiq 7 ga teng bo'lsa, bo'linma nechaga teng?",
    steps: ['279 = 16 · n + 7', '16 · n = 272', 'n = 17'],
    answer: '17',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi tengliklardan qaysi biri qoldiqli bo'lishni ifodalaydi: 1) 45 = 7 · 7 − 4   2) 45 = 7 · 5 + 10   3) 45 = 7 · 6 + 3",
    answer: '3) 45 = 7 · 6 + 3 (qoldiq 3 < 7)',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi tengliklardan qaysi biri qoldiqli bo'lishni ifodalaydi: 1) 97 = 9 · 9 + 16   2) 97 = 10 · 10 − 3   3) 97 = 8 · 12 + 1",
    answer: '3) 97 = 8 · 12 + 1 (qoldiq 1 < 8)',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Natural a sonini 36 ga bo'lganda bo'linma n, qoldiq n² ga teng bo'lsa, a sonining eng katta qiymatini toping.",
    steps: ["Qoldiq bo'luvchidan kichik: n² < 36, demak n ≤ 5", 'a = 36 · n + n², eng katta qiymat n = 5 da: a = 36 · 5 + 25 = 205'],
    answer: '205',
  },
  {
    prompt: "Amaliy qism. 743 ni 12 ga bo'lgandagi qoldiqni toping.",
    steps: ['743 = 12 · 61 + 11'],
    answer: '11',
  },
  {
    prompt: "Amaliy qism. 358 ni qanday songa bo'lganda bo'linma 17 va qoldiq 1 bo'ladi?",
    steps: ['358 = b · 17 + 1', '17 · b = 357', 'b = 21'],
    answer: '21',
  },
  {
    prompt:
      "Amaliy qism. Natural sonni 18 ga bo'lganda, bo'linma 15 ga, qoldiq 3 ga teng bo'ldi. Bo'linuvchini toping.",
    steps: ['a = 18 · 15 + 3'],
    answer: '273',
  },
  {
    prompt:
      "Amaliy qism. Qaysi tenglik qoldiqli bo'lishni ifodalaydi? 1) 76 = 8 · 9 + 4   2) 76 = 9 · 9 − 5   3) 76 = 4 · 18 + 4   4) 76 = 19 · 4 + 0",
    answer: '1) 76 = 8 · 9 + 4 (qoldiq 4 < 8)',
  },
  {
    prompt:
      "Amaliy qism. Quyidagi tengliklardan nechtasi qoldiqli bo'lishni ifodalaydi? 1) 59 = 5 · 11 + 4   2) 59 = 9 · 6 + 5   3) 59 = 7 · 7 + 10   4) 59 = 6 · 10 − 1",
    answer: '2 tasi (1 va 2)',
  },
  {
    prompt:
      "Amaliy qism. Yig'ilgan 770 t bug'doy hosilini temiryo'l orqali un zavodiga tashish kerak. Har bir yuk vagoniga 60 t bug'doy sig'adi. Hosilni zavodga tashish uchun nechta yuk vagoni kerak bo'ladi? Oxirgi vagonga qancha yuk yuklanadi?",
    steps: ['770 : 60 = 12 (50 qoldiq)', '12 ta vagon to\'la, qolgan 50 t 13-vagonga yuklanadi'],
    answer: '13 ta vagon; oxirgi vagonga 50 t yuklanadi',
  },
  {
    prompt:
      "Amaliy qism. Natural a sonini 26 ga bo'lganda bo'linma n, qoldiq n² ga teng bo'lsa, a sonining eng katta qiymatini toping.",
    steps: ["Qoldiq bo'luvchidan kichik: n² < 26, demak n ≤ 5", 'a = 26 · 5 + 25 = 155'],
    answer: '155',
  },
]

/* ─────────── 2.3 ─────────── */

const THEORY_2_3: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Insoniyat har doim ham natural sonni natural songa bo'lganda bo'linma natural son bo'lavermasligini anglab yetgach qoldiqli bo'lishni ixtiro qilgan edi. Ammo, qoldiqli bo'lish usuli hamisha ham bo'lish amalini bajarish uchun to'laqonli yechim bo'la olmadi. Shundan keyin insoniyat muammoning yechimi sifatida ulushlar, ya'ni kasrlarni o'yab topadi. Kasrlarning kelib chiqishi eramizdan oldingi bir necha minginchi yillarga borib taqaladi.",
  },
  {
    kind: 'XULOSA',
    text: "Xulosa qilib aytadigan bo'lsak, bo'lish amalini to'laqonli tushunishimiz yoki chegaralanmagan holatda bo'lish amalini bajarishimiz uchun insoniyat \"kasr\" tushunchasini ixtiro qildi.",
  },
  {
    kind: "TA'RIF",
    text: "Butunning bir yoki bir nechta bo'lagiga kasr deyiladi. Kasrlar o'z navbatida oddiy, aralash va o'nli kasrlarga bo'linadi.",
  },
]

/* ─────────── 2.4 ─────────── */

const THEORY_2_4: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Yuqorida aytib o'tilganidek, oddiy kasrlar kasrlarning bir turi bo'lib, natural sonlarda yechim topilmaydigan bo'linmalarda ishlatiladi.",
  },
  {
    kind: 'MASALAN',
    text: "Aytaylik bizga 8 ni 3 ga bo'lish talab etilsin, ya'ni 8:3 =? Barchamizga ma'lumki 8 ni 3 ga bo'lganda bo'linma 2 va 3 orasidagi qandaydir son chiqadi. Lekin bu oraliqda natural son mavjud emas. Ana shunday holatlarda biz oddiy kasrlardan foydalanamiz. Demak, 8:3 bo'linmani hisoblaydigan bo'lsak, 8/3 ko'rinishidagi oddiy kasr hosil bo'ladi.",
  },
  {
    kind: "TA'RIF",
    text: "Surat, maxraj va kasr chizig'idan iborat bo'lgan kasrlarga oddiy kasrlar deyiladi va quyidagicha ifodalanadi: a/b — bunda a — oddiy kasrning surati, b — oddiy kasrning maxraji.",
  },
  {
    kind: "MA'LUMOT",
    text: "Bu yerda: a — kasrning surati, b — kasrning maxraji, «—» belgisi esa kasr chizig'i deyiladi. Oddiy kasrlar o'qilgan paytda a taqsim b yoki b dan a kabi o'qiladi.",
  },
  {
    kind: 'MASALAN',
    text: "12/23 kasrni o'qigan paytda o'n ikki taqsim yigirma uch yoki yigirma uchdan o'n ikki deb o'qiymiz.",
  },
]

const EX_2_4: TopicExercise[] = [
  {
    prompt: "O'zingizni sinab ko'ring! Bo'linmani kasr ko'rinishida yozing: 1) 15:24   2) 7:8   3) 2:3   4) 3:42",
    answer: '1) 15/24   2) 7/8   3) 2/3   4) 3/42',
  },
  {
    prompt: "O'zingizni sinab ko'ring! Kasrni bo'linma ko'rinishida yozing: 1) 1/4   2) 2/17   3) 13/4   4) 3/11",
    answer: '1) 1:4   2) 2:17   3) 13:4   4) 3:11',
  },
  {
    prompt:
      "Amaliy qism. Bo'linmani kasr ko'rinishida yozing: 1) 5:6   2) 27:48   3) 42:23   4) 53:421",
    answer: '1) 5/6   2) 27/48   3) 42/23   4) 53/421',
  },
  {
    prompt:
      "Amaliy qism. Kasrni bo'linma ko'rinishida yozing: 1) 12/44   2) 23/13   3) 131/45   4) 3/1",
    answer: '1) 12:44   2) 23:13   3) 131:45   4) 3:1',
  },
  {
    prompt:
      "Amaliy qism. So'zlar bilan berilgan kasrlarni sonlar bilan yozing: 1) oltidan bir   2) o'n uchdan yigirma sakkiz   3) to'rt taqsim bir yuz uch   4) yigirma besh taqsim bir",
    answer: '1) 1/6   2) 28/13   3) 4/103   4) 25/1',
  },
]

/* ─────────── 2.5 ─────────── */

const THEORY_2_5: TheoryBlock[] = [
  {
    kind: "TA'RIF",
    text: "Kasrning surat va maxrajini (nolga teng bo'lmagan) ayni bir xil songa ko'paytirsak ham, bo'lsak ham uning qiymati o'zgarmaydi.",
  },
  {
    kind: 'MASALAN',
    text: "8/4 kasrning qiymati 2 ga teng. Endi shu kasrni surati va maxrajini 2 ga ko'paytiramiz, natijada 16/8 kasr hosil bo'ladi. Hosil bo'lgan kasrning ham qiymati 2 ga teng. Shu usulda surat va maxrajni bir xil songa bo'lsak ham qiymati yana 2 ga teng bo'laveradi.",
  },
]

const EXAMPLE_2_5: WorkedItem = {
  prompt: "Kasrning asosiy xossasidan foydalanib, noma'lum ifodani toping: 1/2 = x/4",
  steps: [
    "Kasrning asosiy xossasidan foydalanib birinchi kasrning surat va maxrajini 2 ga ko'paytirsak, maxrajlari bir-biriga teng bo'lgan ikkita 2/4 = x/4 kasrlar paydo bo'ladi.",
    "Kasrlar bir-birlariga teng bo'lishi uchun ularning suratlari ham, maxrajlari ham o'zaro teng bo'lishi kerak. Bundan ko'rinib turibdiki, x = 2 bo'lar ekan.",
  ],
  answer: 'x = 2',
}

const EX_2_5: TopicExercise[] = [
  {
    prompt:
      "O'zingizni sinab ko'ring! Kasrning asosiy xossasidan foydalanib, noma'lum ifodalarni toping: 12/24 = x/2 = 1/y",
    steps: ['12/24 = 1/2', '1/2 = x/2, demak x = 1', '1/2 = 1/y, demak y = 2'],
    answer: 'x = 1, y = 2',
  },
  {
    prompt: "O'zingizni sinab ko'ring! Ushbu 9/12 = x/4 ifodadan x ni toping.",
    steps: ['9/12 = 3/4'],
    answer: 'x = 3',
  },
  {
    prompt: "O'zingizni sinab ko'ring! Yulduzchalar o'rnidagi sonlarni toping: 4/5 = */15 = */25 = */35 = */45",
    answer: '12; 20; 28; 36',
  },
  {
    prompt:
      "Amaliy qism. Kasrning asosiy xossasidan foydalanib, noma'lum ifoda x ni toping: 3/9 = 6/x",
    steps: ['3 · x = 9 · 6', 'x = 54 : 3'],
    answer: 'x = 18',
  },
  {
    prompt:
      "Amaliy qism. Kasrning asosiy xossasidan foydalanib, noma'lum ifoda y ni toping: 5/4 = y/8",
    steps: ['5/4 = 10/8'],
    answer: 'y = 10',
  },
  {
    prompt:
      "Amaliy qism. Kasrning asosiy xossasidan foydalanib, noma'lum ifoda x va y ni toping: x/7 = 12/14 = 6/y",
    answer: 'x = 6, y = 7',
  },
  {
    prompt: "Amaliy qism. Yulduzchalar o'rnidagi sonlarni toping: 1/4 = */8 = */16 = */28 = */32",
    answer: '2; 4; 7; 8',
  },
]

/* ─────────── 2.6 ─────────── */

const THEORY_2_6: TheoryBlock[] = [
  {
    kind: "TA'RIF",
    text: "Kasrning surat va maxrajini bir xil songa bo'lishga kasrni qisqartirish deyiladi.",
  },
  {
    kind: 'MASALAN',
    text: "6/8 kasrning surat va maxraji bir vaqtning o'zida 2 ga qoldiqsiz bo'lingani uchun berilgan kasr 2 ga qisqaradi, ya'ni (6:2)/(8:2) = 3/4 kasr hosil bo'ladi.",
  },
  {
    kind: 'ESLATISH',
    text: "Kasrlarni qisqartirishda karra jadvalidan yoki bo'linish belgilaridan foydalaniladi.",
  },
]

const EX_2_6: TopicExercise[] = [
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 6/8", answer: '3/4' },
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 15/18", answer: '5/6' },
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 12/28", answer: '3/7' },
]

/* ─────────── 2.7 ─────────── */

const THEORY_2_7: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "303/909 kasr qisqaradimi? Qisqarsa qaysi songa qisqaradi? Shu kabi savollarga javob topish uchun bo'linish belgilaridan foydalanamiz. Bo'linish belgilari bizga kasrlarni qisqartirgan paytda, surat va maxrajini aynan qaysi songa qisqartirish kerakligini og'zaki topish uchun kerak bo'ladi.",
  },
  {
    kind: 'MASALAN',
    text: "12240/2325 kasrni qisqartiring. Ushbu kasrni qisqartirishdan oldin uning surat va maxrajidagi sonlar bir vaqtning o'zida qaysi songa bo'linishini bilishimiz lozim. Buning uchun esa bizga bo'linish belgilari kerak bo'ladi.",
  },
]

/* ─────────── 2.8 ─────────── */

const PROPS_2_8 = [
  {
    name: "2 ga bo'linishi",
    detail:
      "Agar natural sonning oxirgi raqami nol(…0) bo'lsa yoki 2 ga qoldiqsiz bo'linsa, berilgan son doimo 2 ga qoldiqsiz bo'linadi.",
    example:
      "28420 (32834) soni oxirgi raqami nol bo'lgani (oxirgi raqami 2 ga qoldiqsiz bo'lgani) uchun 2 ga qoldiqsiz bo'linadi",
  },
  {
    name: "4 ga bo'linishi",
    detail:
      "Agar natural sonning oxirgi ikkita raqami nollardan(…00) iborat bo'lsa yoki oxirgi ikkita raqamidan tuzilgan son 4 ga qoldiqsiz bo'linsa, berilgan son doimo 4 ga qoldiqsiz bo'linadi.",
    example:
      "382300 (31324) soni oxirgi ikkita raqami nollardan tashkil topgani(oxirgi ikki xonasidan tuzilgan son 4 ga bo'lingani) uchun 4 ga qoldiqsiz bo'linadi",
  },
  {
    name: "8 ga bo'linishi",
    detail:
      "Agar natural sonning oxirgi uchta raqami nollardan(…000) iborat bo'lsa yoki oxirgi uchta raqamidan tuzilgan son 8 ga qoldiqsiz bo'linsa, berilgan son doimo 8 ga qoldiqsiz bo'linadi.",
    example:
      "824000 (313480) soni oxirgi uchta raqami nollardan tashkil topgani(oxirgi uchta xonasidan tuzilgan son 8 ga bo'lingani) uchun 8 ga qoldiqsiz bo'linadi",
  },
]

const EX_2_8: TopicExercise[] = [
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi sonlaridan qaysilari 2 ga qoldiqsiz bo'linadi? 1) 2334   2) 4842   3) 385   4) 949   5) 9430   6) 3724",
    answer: '1, 2, 5, 6',
    steps: ['Oxirgi raqami 0, 2, 4, 6 yoki 8 bo\'lishi kerak'],
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! n raqamining qanday qiymatlarida 243134n soni 2 ga qoldiqsiz bo'linadi?",
    answer: 'n = 0, 2, 4, 6, 8',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi sonlaridan qaysilari 4 ga qoldiqsiz bo'linadi? 1) 2332   2) 4842   3) 384   4) 949   5) 94300   6) 3724",
    answer: '1, 3, 5, 6',
    steps: ['Oxirgi ikki xonasidan tuzilgan son: 32, 42, 84, 49, 00, 24 — bulardan 4 ga bo\'linadigani 32, 84, 00, 24'],
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi sonlaridan qaysilari 8 ga qoldiqsiz bo'linadi? 1) 3440   2) 48420   3) 3856   4) 949000   5) 9430   6) 3724",
    answer: '1, 3, 4',
    steps: ['Oxirgi uch xonasidan tuzilgan son: 440, 420, 856, 000, 430, 724 — bulardan 8 ga bo\'linadigani 440, 856, 000'],
  },
  {
    prompt:
      "Amaliy qism. Quyidagi sonlardan qaysilari 2 ga qoldiqsiz bo'linadi. 1) 252112   2) 56876   3) 2421586   4) 2548963",
    answer: '1, 2, 3',
  },
  {
    prompt:
      "Amaliy qism. Quyidagi sonlardan qaysilari 4 ga qoldiqsiz bo'linadi. 1) 2521124   2) 56875   3) 24215800   4) 2548960",
    answer: '1, 3, 4',
    steps: ['Oxirgi ikki xonasi: 24, 75, 00, 60'],
  },
  {
    prompt:
      "Amaliy qism. Quyidagi sonlardan qaysilari 8 ga qoldiqsiz bo'linadi. 1) 2521248   2) 56888   3) 2548256   4) 567618000",
    answer: '1, 2, 3, 4',
    steps: ['Oxirgi uch xonasi: 248, 888, 256, 000 — hammasi 8 ga bo\'linadi'],
  },
]

/* ─────────── 2.9 ─────────── */

const PROPS_2_9 = [
  {
    name: "3 ga bo'linishi",
    detail:
      "Agar natural sonning raqamlari yig'indisi 3 ga qoldiqsiz bo'linsa, berilgan son ham 3 ga qoldiqsiz bo'linadi.",
    example:
      "24363 sonining raqamlari yig'indisi: 2 + 4 + 3 + 6 + 3 = 18. 18 soni 3 ga qoldiqsiz bo'lgani uchun berilgan 24363 soni ham 3 ga qoldiqsiz bo'linadi",
  },
  {
    name: "9 ga bo'linishi",
    detail:
      "Agar natural sonning raqamlari yig'indisi 9 ga qoldiqsiz bo'linsa, berilgan son ham 9 ga qoldiqsiz bo'linadi.",
    example:
      "34353 sonining raqamlari yig'indisi: 3 + 4 + 3 + 5 + 3 = 18. 18 soni 9 ga qoldiqsiz bo'lgani uchun berilgan 34353 soni ham 9 ga qoldiqsiz bo'linadi",
  },
  {
    name: "6 ga bo'linishi",
    detail:
      "Agar natural son bir vaqtning o'zida 2 va 3 ga qoldiqsiz bo'linsa, u son 6 ga qoldiqsiz bo'linadi. (2 va 3 ga bo'linish belgisi yuqorida keltirilgan)",
    example:
      "24336 soni bir vaqtning o'zida ham 3 ga, ham 2 ga qoldiqsiz bo'linadi. Demak bu son 6 ga ham qoldiqsiz bo'linadi.",
  },
]

const EX_2_9: TopicExercise[] = [
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi sonlaridan qaysilari 3 ga qoldiqsiz bo'linadi? 1) 2334   2) 4842   3) 385   4) 909",
    answer: '1, 2, 4',
    steps: ['Raqamlar yig\'indisi: 12, 18, 16, 18'],
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi sonlaridan qaysilari 9 ga qoldiqsiz bo'linadi? 1) 2534   2) 4842   3) 3285   4) 999",
    answer: '2, 3, 4',
    steps: ['Raqamlar yig\'indisi: 14, 18, 18, 27'],
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! 4235*6 ifodada yulduzcha o'rniga shunday raqamni qo'yingki, natijada hosil bo'lgan son 9 ga qoldiqsiz bo'linsin",
    steps: ['4 + 2 + 3 + 5 + 6 = 20', '20 + 7 = 27, 27 soni 9 ga qoldiqsiz bo\'linadi'],
    answer: '7',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi sonlaridan qaysilari 6 ga qoldiqsiz bo'linadi? 1) 3488   2) 4840   3) 385   4) 9430",
    answer: 'Hech biri (385 toq, qolganlarining raqamlari yig\'indisi 3 ga bo\'linmaydi)',
  },
  {
    prompt:
      "Amaliy qism. Quyidagi sonlardan qaysilari 3 ga qoldiqsiz bo'linadi. 1) 2521122   2) 56876   3) 24215862   4) 2548962",
    answer: '1, 3, 4',
    steps: ['Raqamlar yig\'indisi: 15, 32, 30, 36'],
  },
  {
    prompt:
      "Amaliy qism. Quyidagi sonlardan qaysilari 9 ga qoldiqsiz bo'linadi. 1) 2521122   2) 456876   3) 21215862   4) 2548962",
    answer: '2, 3, 4',
    steps: ['Raqamlar yig\'indisi: 15, 36, 27, 36'],
  },
  {
    prompt:
      "Amaliy qism. Yulduzchalar o'rniga shunday raqamlarni qo'yingki, natijada hosil bo'lgan son 9 ga qoldiqsiz bo'linsin: 1) 235*;   2) 47*2;   3) 5*65;   4) *711;",
    steps: ['1) 2 + 3 + 5 = 10, 10 + 8 = 18', '2) 4 + 7 + 2 = 13, 13 + 5 = 18', '3) 5 + 6 + 5 = 16, 16 + 2 = 18', '4) 7 + 1 + 1 = 9, 9 + 0 = 9 yoki 9 + 9 = 18'],
    answer: "1) 8   2) 5   3) 2   4) 0 yoki 9 (son boshida nol yozilmaydi, demak 9)",
  },
  {
    prompt:
      "Amaliy qism. Quyidagi sonlardan qaysilari 6 ga bo'linadi. 1) 2521122   2) 56876   3) 148652   4) 448792452",
    answer: '1, 4',
    steps: ['1) juft, raqamlar yig\'indisi 15', '4) juft, raqamlar yig\'indisi 45'],
  },
]

/* ─────────── 2.10 ─────────── */

const PROPS_2_10 = [
  {
    name: "5 ga bo'linishi",
    detail:
      "Agar natural sonning oxirgi raqami 0 yoki 5 bilan tugasa, bu son 5 ga qoldiqsiz bo'linadi.",
    example: "7230 (2325) soni 0 (…5) raqami bilan tugagani uchun 5 ga qoldiqsiz bo'linadi",
  },
  {
    name: "10 ga bo'linishi",
    detail: "Agar natural sonning oxirgi raqami 0 bilan tugasa, bu son 10 ga qoldiqsiz bo'linadi.",
    example: "42230 soni 0 raqami bilan tugagani uchun 10 ga qoldiqsiz bo'linadi",
  },
]

const EX_2_10: TopicExercise[] = [
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi sonlaridan qaysilari 5 ga qoldiqsiz bo'linadi? 1) 3488   2) 4840   3) 385   4) 94000   5) 9430   6) 3724",
    answer: '2, 3, 4, 5',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! (25369 + 14368)·35698 ni 5 ga bo'lgandagi qoldiqni toping.",
    steps: [
      '25369 + 14368 = 39737, uni 5 ga bo\'lganda qoldiq 2',
      '35698 ni 5 ga bo\'lganda qoldiq 3',
      '2 · 3 = 6, 6 ni 5 ga bo\'lganda qoldiq 1',
    ],
    answer: '1',
  },
  {
    prompt:
      "O'zingizni sinab ko'ring! Quyidagi sonlaridan qaysilari 10 ga qoldiqsiz bo'linadi? 1) 3488   2) 4840   3) 385   4) 94000   5) 9430   6) 3724",
    answer: '2, 4, 5',
  },
  {
    prompt:
      "Amaliy qism. Quyidagi sonlardan qaysilari 5 ga qoldiqsiz bo'linadi. 1) 2521120   2) 124123   3) 847000   4) 56870",
    answer: '1, 3, 4',
  },
  {
    prompt:
      "Amaliy qism. Quyidagi sonlardan qaysilari 10 ga qoldiqsiz bo'linadi. 1) 25211220   2) 12412000   3) 847965   4) 45687",
    answer: '1, 2',
  },
]

/* ─────────── 2.11 ─────────── */

const THEORY_2_11: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Yuqorida ta'kidlab o'tganimizdek, kasrlarni surat va maxrajini bir xil songa bo'lish orqali uni qisqartiramiz. Surat va maxraji aynan qaysi songa bo'linishini esa karra jadvali yoki bo'linish belgilari orqali aniqlaymiz. Kasr qisqargan paytda bir nechta songa qisqarishi mumkin, lekin odatda kasrlar qisqartirilgan paytda surat va maxrajidagi sonlarning bo'luvchilarining eng kattasiga qisqartiriladi.",
  },
  {
    kind: 'MASALAN',
    text: "24/36 kasrni qisqartiring. Bo'linish belgilaridan foydalanadigan bo'lsak ushbu kasrni 2 ga, 3 ga, 6 ga va 12 ga qisqartirish mumkin. Lekin kasrni qisqartirgan paytda surat va maxrajga bo'linadigan shunday bir son topish kerakki, bir marotaba qisqartirgandan keyin boshqa qisqarmasin.",
  },
  {
    kind: 'YECHISH',
    text: "24/36 = (24:2)/(36:2) = 12/18 = (12:2)/(18:2) = 6/9 = (6:3)/(9:3) = 2/3 — kitobda chizib tashlangan (bir necha marta qisqartirilgan); 24/36 = (24:12)/(36:12) = 2/3 — kitobda to'g'ri deb belgilangan.",
  },
]

const EXAMPLE_2_11: WorkedItem = {
  prompt: 'Berilgan kasrlarni qisqartiring: 1) 3/21   2) 7/28   3) 11/55   4) 13/26',
  steps: [
    '1) 3/21 = (3:3)/(21:3) = 1/7',
    '2) 7/28 = (7:7)/(28:7) = 1/4',
    '3) 11/55 = (11:11)/(55:11) = 1/5',
    '4) 13/26 = (13:13)/(26:13) = 1/2',
  ],
  answer: '1) 1/7   2) 1/4   3) 1/5   4) 1/2',
}

const EX_2_11: TopicExercise[] = [
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 12/14", answer: '6/7' },
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 6/8", answer: '3/4' },
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 12/15", answer: '4/5' },
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 16/20", answer: '4/5' },
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 15/25", answer: '3/5' },
  { prompt: "O'zingizni sinab ko'ring! Kasrni qisqartiring: 18/24", answer: '3/4' },
  {
    prompt: "Amaliy qism. Kasrlarni qisqartiring: 1) 4/6   2) 12/14   3) 6/8   4) 12/15   5) 15/35   6) 33/55",
    answer: '1) 2/3   2) 6/7   3) 3/4   4) 4/5   5) 3/7   6) 3/5',
  },
  {
    prompt: "Amaliy qism. Kasrlarni qisqartiring: 1) 7/14   2) 14/21   3) 24/30   4) 15/20   5) 80/100   6) 72/60",
    answer: '1) 1/2   2) 2/3   3) 4/5   4) 3/4   5) 4/5   6) 6/5',
  },
  {
    prompt: "Amaliy qism. Kasrlarni qisqartiring: 1) 12/24   2) 13/39   3) 24/36   4) 15/75   5) 28/56   6) 108/180",
    answer: '1) 1/2   2) 1/3   3) 2/3   4) 1/5   5) 1/2   6) 3/5',
  },
  {
    prompt: "Amaliy qism. Kasrlarni qisqartiring: 1) 7/21   2) 63/45   3) 36/96   4) 12/144   5) 20/30   6) 27/81",
    answer: '1) 1/3   2) 7/5   3) 3/8   4) 1/12   5) 2/3   6) 1/3',
  },
]

/* ─────────── Bo'limlar ─────────── */

export const TOPIC_2_LESSONS: TopicLesson[] = [
  {
    id: '2.1',
    n: 1,
    title: "Natural sonlarning ojiz taraflari",
    goal: "Natural sonlarning ojiz taraflarini o'rganish",
    minutes: 12,
    videos: [
      {
        id: 'sxxqQ1SXfw8',
        title: "Natural sonlarning ojiz taraflari (Nazariy qism)",
      },
    ],
    theory: THEORY_2_1,
    practice: [],
  },

  {
    id: '2.2',
    n: 2,
    title: "Qoldiqli bo'lish",
    goal: "Qoldiqli bo'lish haqida tushunchaga ega bo'lish",
    minutes: 15,
    videos: [
      {
        id: 'Tpa2Urgm31o',
        title: "Qoldiqli bo'lish (Nazariy qism)",
      },
      {
        id: 'oEZwEp_482g',
        title: "Qoldiqli bo'lish (Amaliy qism)",
      },
    ],
    theory: THEORY_2_2,
    example: EXAMPLE_2_2,
    practice: [],
    exercises: EX_2_2,
  },

  {
    id: '2.3',
    n: 3,
    title: 'Kasrlar haqida tushuncha',
    goal: "Kasrlar haqida tushuncha ega bo'lish va ular ustida amal bajarishni o'rganish",
    minutes: 10,
    videos: [
      {
        id: 'IUD9ibanyv8',
        title: "Kasrlar haqida tushuncha (Nazariy qism)",
      },
    ],
    theory: THEORY_2_3,
    practice: [
      {
        prompt:
          "O'zingizni sinab ko'ring! So'zlar bilan berilgan kasrlarni sonlar bilan yozing: 1) yettidan uch  2) o'n uchdan ikki  3) yuzdan yetti  4) yetmish ikkidan o'n to'rt.",
        steps: ['1) 3/7', '2) 2/13', '3) 7/100', '4) 14/72'],
        answer: '3/7;  2/13;  7/100;  14/72',
      },
    ],
  },

  {
    id: '2.4',
    n: 4,
    title: 'Oddiy kasrlar',
    goal: "Oddiy kasrlar haqida tushunchaga ega bo'lish va ular ustida amal bajarish",
    minutes: 12,
    videos: [
      {
        id: 'CAEHcK7wIGA',
        title: "Oddiy kasrlar (Nazariy qism)",
      },
      {
        id: 'oEZwEp_482g',
        title: "Oddiy kasrlar (Amaliy qism)",
      },
    ],
    theory: THEORY_2_4,
    practice: [],
    exercises: EX_2_4,
  },

  {
    id: '2.5',
    n: 5,
    title: "Kasrning asosiy xossasi",
    goal: "Kasrni qisqartirish va umumiy maxrajga keltirish amallari mohiyatini tushunish",
    minutes: 14,
    videos: [
      {
        id: 'CAEHcK7wIGA',
        title: "Kasrning asosiy xossasi (Nazariy qism)",
      },
      {
        id: 'NXAXVjr59OI',
        title: "Kasrning asosiy xossasi (Amaliy qism)",
      },
    ],
    theory: THEORY_2_5,
    example: EXAMPLE_2_5,
    practice: [],
    exercises: EX_2_5,
  },

  {
    id: '2.6',
    n: 6,
    title: "Kasrlarni qisqartirish(Oddiy holatlar)",
    goal: "Kasrlar ustida turli amallar bajargan paytda, natijani kichikroq sonlarda olish",
    minutes: 12,
    videos: [
      {
        id: 'zGtTqHfb96g',
        title: "Kasrlarni qisqartirish(Oddiy holatlar) (Nazariy qism)",
      },
    ],
    theory: THEORY_2_6,
    practice: [],
    exercises: EX_2_6,
  },

  {
    id: '2.7',
    n: 7,
    title: "Sonlarning bo'linish belgilari",
    goal: "Sonlarning bo'linish belgilari nima uchun ishlatilishini bilish",
    minutes: 10,
    videos: [
      {
        id: 'oZ8pCGt5Vuw',
        title: "Sonlarning bo'linish belgilari (Nazariy qism)",
      },
    ],
    theory: THEORY_2_7,
    practice: [],
  },

  {
    id: '2.8',
    n: 8,
    title: "Sonlarning 2, 4 va 8 ga bo'linish belgilari",
    goal: "Bo'lish amalini bajarmasdan, sonlarni 2, 4 va 8 ga qoldiqsiz bo'lish usullarini o'rganish",
    minutes: 14,
    videos: [
      {
        id: 'R8CSWqIWzhU',
        title: "Sonlarning 2, 4 va 8 ga bo'linish belgilari (Nazariy qism)",
      },
      {
        id: 'l8MdSJpGDaI',
        title: "Sonlarning 2, 4 va 8 ga bo'linish belgilari (Amaliy qism)",
      },
    ],
    theory: [],
    properties: PROPS_2_8,
    practice: [],
    exercises: EX_2_8,
  },

  {
    id: '2.9',
    n: 9,
    title: "Sonlarning 3, 6 va 9 ga bo'linishi",
    goal: "Bo'lish amalini bajarmasdan, sonlarni 3, 9 va 6 ga qoldiqsiz bo'lish usullarini o'rganish",
    minutes: 14,
    videos: [
      {
        id: 'RwXxgo1Gpco',
        title: "Sonlarning 3, 6 va 9 ga bo'linishi (Nazariy qism)",
      },
      {
        id: 'lX_4KETqIvM',
        title: "Sonlarning 3, 6 va 9 ga bo'linish belgilari (Amaliy qism)",
      },
    ],
    theory: [],
    properties: PROPS_2_9,
    practice: [],
    exercises: EX_2_9,
  },

  {
    id: '2.10',
    n: 10,
    title: "Sonlarning 5 va 10 ga bo'linishi",
    goal: "Bo'lish amalini bajarmasdan, sonlarni 5 va 10 ga qoldiqsiz bo'lish usullarini o'rganish",
    minutes: 12,
    videos: [
      {
        id: 'uEfQnYqBTRI',
        title: "Sonlarning 5 va 10 ga bo'linishi (Nazariy qism)",
      },
      {
        id: '2g4tM_1B4qA',
        title: "Sonlarning 5 va 10 ga bo'linish belgilari (Amaliy qism)",
      },
    ],
    theory: [],
    properties: PROPS_2_10,
    practice: [],
    exercises: EX_2_10,
  },

  {
    id: '2.11',
    n: 11,
    title: 'Kasrlarni qisqartirish',
    goal: "Kasrlar ustida turli amallar bajargan paytda, natijani kichikroq sonlarda olish",
    minutes: 15,
    videos: [
      {
        id: 'uEfQnYqBTRI',
        title: "Kasrlarni qisqartirish (Nazariy qism)",
      },
      {
        id: 'wCnMFpWotpo',
        title: "Kasrlarni qisqartirish (Amaliy qism)",
      },
    ],
    theory: THEORY_2_11,
    example: EXAMPLE_2_11,
    practice: [],
    exercises: EX_2_11,
  },
]

/* ─────────── Yakuniy test ─────────── */

export const TOPIC_2_TEST: TopicTest = {
  id: '2.12',
  n: 12,
  title: 'Mavzu 2 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't2-01',
      prompt: "Qoldiqli bo'lishning umumiy formulasi qanday yoziladi?",
      options: ['a = b · n + r', 'a = b + n + r', 'a = b · r + n', 'a = n · r − b'],
      correct: 0,
      explain:
        "Kitobda formula a = b · n + r ko'rinishida berilgan: a — bo'linuvchi, b — bo'luvchi, n — bo'linma, r — qoldiq.",
    },
    {
      id: 't2-02',
      prompt: "Qoldiq haqidagi qaysi shart to'g'ri?",
      options: ['0 ≤ r < b', '0 < r ≤ b', 'r > b', 'r = b'],
      correct: 0,
      explain:
        "ESLATISH bo'yicha qoldiq doimo musbat hamda bo'luvchidan kichik bo'lishi shart, ya'ni 0 ≤ r < b.",
    },
    {
      id: 't2-03',
      prompt: "Qaysi tenglik qoldiqli bo'lishni ifodalaydi?",
      options: [
        '85 = 12 · 7 + 1',
        '85 = 12 · 8 − 11',
        '85 = 5 · 17 + 0',
        '85 = 6 · 13 + 7',
      ],
      correct: 0,
      explain:
        "Qoldiq musbat va bo'luvchidan kichik bo'lishi kerak: 12 · 7 + 1 da qoldiq 1 < 12; qolganlarida qoldiq manfiy, nolga teng yoki bo'luvchidan katta.",
    },
    {
      id: 't2-04',
      prompt: "876 ni 15 ga bo'lgandagi qoldiq nechaga teng?",
      options: ['4', '5', '6', '7'],
      correct: 2,
      explain: "876 = 15 · 58 + 6, ya'ni qoldiq 6 ga teng (qoldiq bo'luvchidan kichik).",
    },
    {
      id: 't2-05',
      prompt: "Surat, maxraj va kasr chizig'idan iborat bo'lgan kasrlar qanday kasrlar deyiladi?",
      options: ['oddiy kasrlar', "o'nli kasrlar", 'aralash kasrlar', 'davriy kasrlar'],
      correct: 0,
      explain:
        "TA'RIF bo'yicha surat, maxraj va kasr chizig'idan iborat kasrlar oddiy kasrlar deyiladi.",
    },
    {
      id: 't2-06',
      prompt: "12/23 kasr qanday o'qiladi?",
      options: [
        "o'n ikki taqsim yigirma uch",
        'yigirma uch taqsim o\'n ikki',
        "o'n ikki butun yigirma uch",
        "yigirma uchdan o'n uch",
      ],
      correct: 0,
      explain:
        "MASALAN bo'yicha 12/23 kasr «o'n ikki taqsim yigirma uch» yoki «yigirma uchdan o'n ikki» deb o'qiladi.",
    },
    {
      id: 't2-07',
      prompt: "Kasrning asosiy xossasi qanday ifodalanadi?",
      options: [
        "Surat va maxraj bir xil songa ko'paytirilsa ham, bo'linsa ham kasrning qiymati o'zgarmaydi",
        "Surat va maxrajga bir xil son qo'shilsa, kasrning qiymati o'zgarmaydi",
        "Surat va maxrajdan bir xil son ayirilsa, kasrning qiymati o'zgarmaydi",
        "Faqat surat bir xil songa ko'paytirilsa, kasrning qiymati o'zgarmaydi",
      ],
      correct: 0,
      explain:
        "TA'RIF bo'yicha kasrning surat va maxrajini (nolga teng bo'lmagan) ayni bir xil songa ko'paytirsak ham, bo'lsak ham uning qiymati o'zgarmaydi.",
    },
    {
      id: 't2-08',
      prompt: '6/8 kasrni qisqartiring.',
      options: ['3/4', '2/4', '3/8', '1/2'],
      correct: 0,
      explain:
        "MASALAN bo'yicha surat va maxraj bir vaqtning o'zida 2 ga bo'linadi: (6:2)/(8:2) = 3/4.",
    },
    {
      id: 't2-09',
      prompt: "Qaysi son 8 ga qoldiqsiz bo'linadi?",
      options: ['3440', '48420', '9430', '3724'],
      correct: 0,
      explain:
        "8 ga bo'linish belgisi: oxirgi uchta raqamidan tuzilgan son 8 ga bo'linishi kerak — 440 = 8 · 55, qolganlarida 420, 430 va 724 8 ga bo'linmaydi.",
    },
    {
      id: 't2-10',
      prompt: "3 ga bo'linish belgisi qanday?",
      options: [
        "Sonning raqamlari yig'indisi 3 ga qoldiqsiz bo'linsa, son ham 3 ga bo'linadi",
        "Sonning oxirgi raqami 3 bo'lsa, son 3 ga bo'linadi",
        "Sonning oxirgi ikki raqami 3 ga bo'linsa, son ham 3 ga bo'linadi",
        "Son 2 va 5 ga bo'linsa, u 3 ga ham bo'linadi",
      ],
      correct: 0,
      explain:
        "Jadval bo'yicha natural sonning raqamlari yig'indisi 3 ga qoldiqsiz bo'lsa, berilgan son ham 3 ga qoldiqsiz bo'linadi.",
    },
    {
      id: 't2-11',
      prompt: "Qaysi son 6 ga qoldiqsiz bo'linadi?",
      options: ['24336', '3488', '4840', '9430'],
      correct: 0,
      explain:
        "6 ga bo'linish belgisi: son bir vaqtning o'zida 2 va 3 ga bo'linishi kerak — 24336 juft va raqamlari yig'indisi 18 (3 ga bo'linadi).",
    },
    {
      id: 't2-12',
      prompt: "Qaysi son bir vaqtning o'zida ham 2 ga, ham 5 ga qoldiqsiz bo'linadi?",
      options: ['9430', '3724', '385', '3488'],
      correct: 0,
      explain:
        "9430 sonining oxirgi raqami 0: u 2 ga ham (juft), 5 ga ham (0 yoki 5 bilan tugaydi) qoldiqsiz bo'linadi.",
    },
  ],
}

export const TOPIC_2_PASS = 7
