import type { TopicLesson, TopicTest, TheoryBlock, WorkedItem, TopicExercise } from './topicTypes'

/**
 * MAVZU 10 — «Algebraga kirish. Algebraik ifodalar» (10.1–10.8).
 *
 * Manba: «Algebra-1 kurs kitobi» ning II-BOB. ALGEBRA bo'limi, kitob
 * sahifalari 79–87 (skanerlangan p82.png–p90.png). Har bir bo'lim
 * sarlavhasi, «Maqsad», TA'RIF / MA'LUMOT / MASALA / MASALAN / ESLATMA /
 * XULOSA bloklari, MISOL / YECHISH va «O'zingizni sinab ko'ring»
 * mashqlari kitobdagi matn bo'yicha ko'chirilgan. Har bir bo'limda
 * kitobda chop etilgan bitta youtu.be havolasi nazariy video sifatida
 * olingan (amaliy qism havolasi chop etilmagan).
 *
 * Mashq javobi faqat aniq hisob-kitob bilan tasdiqlangan holatda
 * qo'shilgan. 10.4 dagi MISOLda kitob «Javob: 5» deb chop etgan, lekin
 * yechimning o'zi (3·10 + 7)·5/(10 − 5) = 37 beradi — shu sababli
 * javob 37 deb yozildi.
 *
 * `TOPIC_10_TEST` — 10.9, mavzu yakuniy 12 savolli testi.
 */

export const TOPIC_10_META = {
  id: 'mavzu-10',
  num: 10,
  chapter: 'Algebraga kirish. Algebraik ifodalar',
  title: 'Mavzu 10. Algebraik ifodalar',
  lessonCount: 8,
}

/* ─────────── 10.1 ─────────── */

const THEORY_10_1: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Algebra tarixi. Algebra so'zi buyuk matematik va astranom Muhammad ibn Muso al-Xorazmiyning “Kitob al-Muxtasar fi hisob al-jabr val-muqobala” asaridagi “al-jabr” so'zidan olingan. Bu so'z arabcha so'z bo'lib, tiklash yoki to'ldirish degan ma'nolarni anglatadi.",
  },
  {
    kind: "MA'LUMOT",
    text: "Algebraga oid ma'lumotlar al-xorazmiydan tashqari Bobilning toshga o'yilgan qo'lyozmalarida, Iskandariyalik Diofant hamda Hindistonlik matematik Brahmaguptaning asarlarida ham uchraydi, lekin algebrani to'liq fanga bobokalonimiz al-Xorazmiy olib kirgan. Shunday bo'lsa ham g'arbliklar algebraning otasi sifatida Diofantni, sharqliklar esa al-Xorazmiyni tan olishadilar.",
  },
  {
    kind: "MA'LUMOT",
    text: "Diofant (taxminan 3-asr), Brahmagupta (598-668), Al-Xorazmiy (783-850).",
  },
  {
    kind: 'SAVOL',
    text: "Algebraning rivojlanish evalyutsiyasi grafigini tasvirlashga harakat qiling.",
  },
]

/* ─────────── 10.2 ─────────── */

const THEORY_10_2: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Matematika fanining Algebra qismining asosiy vazifalari quyidagilardan iborat:",
  },
  {
    kind: "MA'LUMOT",
    text: "1. Tenglamalar va ularni yechishni o'rganish. “Kitob al-muxtasar fi hisob al-jabr val-muqobala” asaridagi al-jabr qismi tenglamadagi manfiy hadlarni tenglikning ikkinchi qismiga musbat qilib o'tkazish haqida yozilgan bo'lsa, val-muqobala qismi esa tenglamaning ikkala qismidan teng hadlarni tashlab yuborish kabi qimmatli ma'lumotlarni o'zida aks etgan.",
  },
  {
    kind: "MA'LUMOT",
    text: "Quyidagi misolni ko'rib o'tsak:",
  },
  {
    kind: "MA'LUMOT",
    text: "Biz noma'lumni har xil ko'rinishda ifodalashimiz mumkin, lekin algebrada noma'lumni harflar bilan belgilash qabul qilingan. Shunga ko'ra tenglama yechganda noma'lumni ko'pincha x harfi bilan belgilaymiz. Tenglamalar va ularning yechimlari haqida esa batafsil keying mavzularimizda tanishib o'tamiz.",
  },
  {
    kind: "MA'LUMOT",
    text: "2. Tengsizliklar va ularni yechishni o'rganish. Yuqoridagi misolni boshqacha talqinda ko'rib chiqamiz:",
  },
  {
    kind: 'MASALAN',
    text: "Qaysi songa 5 ni qo'shsak, natija 9 dan katta bo'ladi?",
  },
  {
    kind: 'YECHISH',
    text: "Yuqoridagi tenglik kabi yana masala shartiga ko'ra quyidagi tengsizliklarni tuzib olamiz:  ? + 5 > 9;   (har qanday belgi) + 5 > 9;   x + 5 > 9",
  },
  {
    kind: "MA'LUMOT",
    text: "Ushbu tengsizliklarda ham noma'lumni hohlagan ko'rinishda ifodalab olishimiz mumkin edi, ammo algebrada tengsizliklarda ham noma'lum ifodani harflar bilan belgilash qabul qilingan.",
  },
  {
    kind: "MA'LUMOT",
    text: "3. Umumlashtirishlar, qonuniyatlar va formulalarni keltirib chiqarish. Algebraning ushbu vazifasini masalalarni berilgan shartidan kelib chiqqan holda ular uchun umumiy formula keltirib chiqarishdan iborat. Keling uni quyidagi masalalar orqali ko'rib chiqsak:",
  },
  {
    kind: 'MASALAN',
    text: "MASALA-1: Siz bankdan 1 yil muddatga kredit olish uchun shartnoma tuzdingiz. Shartnoma shartlari quyidagicha: agar siz 500 $ olsangiz 600 $ qilib, 1000 $ olsangiz 1100 $, 5000 $ olsangiz 5100 $ qilib qaytarishingiz kerak. Xullas, qancha olsangiz ham, 100 $ qo'shib qaytarishga majbursiz. Yuqoridagi qonuniyatdan foydalanib, banking taklifini ifodalovchi formula keltirib chiqaring.",
  },
  {
    kind: 'YECHISH',
    text: "Masala shartida ko'rsatilgan qonuniyatdan kelib chiqib umumiy formula keltiradigan bo'lsak u quyidagi ko'rinishdan iborat bo'ladi: avval sizning bankdan oladigan summangizni x deb, bankka qaytaradigan summangizni esa y deb belgilab olib, quyidagi formulani keltirib chiqaramiz:  y = x + 100",
  },
  {
    kind: 'MASALAN',
    text: "MASALA-2: Avtomobil 60 km/soat tezlik bilan harakatlansa 1 soatda qancha masofa bosib o'tadi? 2 soatdachi? a soatdachi? Berilgan ma'lumotlardan foydalanib bosib o'tilgan yo'lni topish uchun formula tuzing va masalani yeching.",
  },
  {
    kind: 'YECHISH',
    text: "Avtomobilning 60 km/soat tezlik bilan 1 soatda bosib o'tgan masofasini topish uchun 60 ni 1 ga, 2 soatda bosib o'tgan masofasini topish uchun 2 ga, a soatda bosib o'tgan masofasini topish uchun a ko'paytirib, quyidagi natijalarga ega bo'lamiz:  60 · 1 = 60;   60 · 2 = 120;   60 · a = 60a",
  },
  {
    kind: "MA'LUMOT",
    text: "Endi ushbu ifodaga mos formula tuzamiz. Formula tuzishdan oldin vaziyatga ta'sir qiluvchi omillarni quyidagi tartibda harflar bilan belgilab olamiz: bosib o'tilgan yo'l davomida sarflagan vaqtni t (inglizcha time so'zidan olingan), tezligini v harfi bilan, bosib o'tilgan masofasini esa S harfi bilan belgilaymiz. Natijani v tezlik bilan t vaqtda bosib o'tilgan yo'lni topuvchi S = v · t formulaga ega bo'lamiz.",
  },
  {
    kind: "MA'LUMOT",
    text: "4. So'zlar bilan berilgan ifodalarni matematik tilga o'tkazish. Algebraning ushbu vazifasida so'zlar bilan berilgan ifodalarni matematik ko'rinishga, ya'ni sonlar yoki harfiy birikmalar ko'rinishiga keltirishdan iborat.",
  },
  {
    kind: 'MASALAN',
    text: "Quyidagi jumlalarni matematik tilda yozing:  1) a va b sonlarining yig'indisini   2) a va b sonlarining yig'indisining ular ayirmasiga ko'paytmasini.",
  },
  {
    kind: 'XULOSA',
    text: "Matematika faning “Algebra” bo'limining asosiy vazifasi yuqorida sanab o'tilgan holatlardan iborat bo'lib, nima bo'lganda ham algebraning asosiy vazifalari matematikaning bo'limi bo'lganligi uchun “osonlashtirish” va “tasavvur qilishni o'rgatish” dir.",
  },
]

const EXAMPLE_10_2: WorkedItem = {
  prompt: "Qaysi songa 5 ni qo'shsak 9 hosil bo'ladi?",
  steps: [
    "Masala shartiga ko'ra quyidagi tengliklarni tuzib olamiz:",
    '? + 5 = 9;   (har qanday belgi) + 5 = 9;   x + 5 = 9',
    'x = 9 − 5',
    'Tekshiramiz: 4 + 5 = 9',
  ],
  answer: 'x = 4',
}

const EX_10_2: TopicExercise[] = [
  {
    prompt:
      "Piyoda 5 km/soat tezlik bilan 2 soatda qancha masofa bosadi? Xuddi shu tezlik bilan u 3 soatda qancha masofani bosib o'tadi?",
    steps: ['S = v · t', '5 · 2 = 10', '5 · 3 = 15'],
    answer: '2 soatda 10 km, 3 soatda 15 km',
  },
  {
    prompt:
      "Velosipedchining tezligi 15 km/soat. Uning t soatda bosib o'tadigan masofasini topadigan formula tuzing. Formuladan foydalanib, t = 2,5 soat bo'lgandagi masofani toping.",
    steps: ['S = v · t, bunda v = 15', 'S = 15t', 'S = 15 · 2,5 = 37,5'],
    answer: 'S = 15t;  37,5 km',
  },
  {
    prompt:
      "Avtomobilning v tezlik bilan 3 soatda bosib o'tgan masofasini topadigan formula tuzing. Formuladan foydalanib, uning v = 80 km/soat bo'lgandagi bosib o'tgan masofasini toping.",
    steps: ['S = v · t, bunda t = 3', 'S = 3v', 'S = 3 · 80 = 240'],
    answer: 'S = 3v;  240 km',
  },
  {
    prompt: "Jumlalarni matematik tilda yozing: a va b sonlarining ayirmasining ikklangani",
    answer: '2(a − b)',
  },
  {
    prompt:
      "Jumlalarni matematik tilda yozing: a va b sonlari yig'indisini ular ayirmasiga bo'linmasi",
    answer: '(a + b) : (a − b)',
  },
  {
    prompt:
      "Jumlalarni matematik tilda yozing: a va b sonlari yig'indisini ular ayirmasiga ko'paytmasi",
    answer: '(a + b) · (a − b)',
  },
]

/* ─────────── 10.3 ─────────── */

const THEORY_10_3: TheoryBlock[] = [
  {
    kind: "TA'RIF",
    text: "Ma'lum mulohaza doirasida turli qiymatlarni qabul qiluvchi miqdorlarga o'zgaruvchan miqdorlar, faqat bitta qiymatni qabul qiladigan miqdorlarga esa o'zgarmas miqdorlar deyiladi.",
  },
  {
    kind: "MA'LUMOT",
    text: "O'zgaruvchan miqdorlar haqida tushuncha. Tasavvur qiling siz restaranda ishlaysiz va 1 soatda 10 $ va yana bir qancha choy chaqa topasz. Xullas sizning 1 soatda topadigan pulingizni quyidagicha yozib olsak bo'ladi:  10 + choychaqalar",
  },
  {
    kind: "MA'LUMOT",
    text: "Choychaqalarning qiymati mijoz oqimiga qarab o'zgarib turadi. Aytaylik, restaranga mijoz ko'p kelgan paytda siz 30 $ choychaqa topdingiz va endi choychaqa bilan qo'shib hisoblaganda 1 soatlik maoshingiz 40 $ bo'ldi. Keyingi safar esa mijoz oqimi kam bo'lganligi sababli choychaqangiz atigi 5 $ ni tashkil etdi va bu safar 1 soatda topgan pulingiz 15 $ bo'ldi. Demak, xulosa qilib aytadigan bo'lsak sizning 1 soatda topadigan pulingiz choychaqalarizga bog'liq, choychaqa esa har soatda o'zgarib turadi. Ana shu o'zgarib turuvchi choychaqa siz uchun o'zgaruvchi hisoblanadi.",
  },
  {
    kind: "MA'LUMOT",
    text: "Algebraik ifodalarning asosini ham ana shu o'zgaruvchilar tashkil etadi. O'zgaruvchilarni har safar so'zlar bilan yozib yurish noqulay bo'lganligi uchun ularni harflar bilan ifodalab ketsak ham bo'laveradi. Masalan choychaqa so'zi o'rniga uni ch deb ifodalab ketsak ham bo'lar edi. Shunday qilib belgilaydigan bo'lsak sizning 1 soatda topadigan pulingiz 10+ ch ko'rinishida bo'ladi. Bir so'z bilan aytganda, algebrada o'zgaruvchilarni belgilashning qat'iy bir qoidasi yo'q, ya'ni biz o'zgaruvchilarni hohlagancha belgilashimiz mumkin. O'zgaruvchilarni belgilashning eng ko'p ishlatiladigan usuli esa bu harflar orqali ifodalashdir.",
  },
  {
    kind: "TA'RIF",
    text: "O'zgarmas miqdorlar haqida tushuncha. Qiymati avvaldan belgilangan, ya'ni har doim bir xil qiymatni qabul qiluvchi miqdorlarga o'zgarmas miqdorlar deyiladi. Matematikada juda ko'plab o'zgarmas miqdorlar mavjud.",
  },
]

const EX_10_3: TopicExercise[] = [
  {
    prompt:
      "Fransiyalik futbol yulduzi Kylian Mbappe PSJ dan Real Madrid klubiga yiliga 200 million yevro va yana +bonuslar evaziga ko'chib o'tdi. Futbolchining bonuslari bilan hisoblaganda yillik maoshini hisoblovchi ifoda tuzing, tuzilgan ifodadan foydalanib bonuslari miqdori 15 million yevro bo'lganda uning yillik maoshini hisoblang.",
    steps: ['Bonusni b deb belgilaymiz', 'Maosh = 200 + b (million yevro)', '200 + 15 = 215'],
    answer: '200 + b;  215 million yevro',
  },
  {
    prompt:
      "x = 3a + 5 ifodada a ni o'zgaruvchan miqdor deb qarab: 1) a = 1   2) a = 7   3) a = −2,5   4) a = 1/3 bo'lganda x ning qiymatini toping.",
    steps: [
      '1) x = 3 · 1 + 5 = 8',
      '2) x = 3 · 7 + 5 = 26',
      '3) x = 3 · (−2,5) + 5 = −7,5 + 5 = −2,5',
      '4) x = 3 · (1/3) + 5 = 1 + 5 = 6',
    ],
    answer: '1) 8   2) 26   3) −2,5   4) 6',
  },
]

/* ─────────── 10.4 ─────────── */

const THEORY_10_4: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: 'Quyidagi masalani qaraymiz.',
  },
  {
    kind: 'MASALAN',
    text: "Biror son o'ylang, uni 3 ga ko'paytiring, hosil bo'lgan natijaga 6 ni qo'shing, topligan yig'indini 3 ga bo'ling va o'ylangan sonni airing. Qanday son hosil bo'ladi?",
  },
  {
    kind: "MA'LUMOT",
    text: "Aytaylik, o'ylangan son 8 bo'lsin. Barcha amallarni masala shartida ko'rsatilgan tartibda bajaramiz:  1) 8 · 3 = 24   2) 24 + 6 = 30   3) 30 : 3 = 10   4) 10 − 8 = 2",
  },
  {
    kind: "MA'LUMOT",
    text: "Bu yechimni qiymati 2 ga teng bo'lgan (8 · 3 + 6) : 3 − 8 sonli ifoda shaklida yozish mumkin.",
  },
  {
    kind: "MA'LUMOT",
    text: "Bordiyu, agar 5 soni o'ylangan bo'lsa, u holda yana qiymati 2 ga teng bo'lgan (5 · 3 + 6) : 3 − 5 sonli ifoda hosil qilingan bo'lar edi.",
  },
  {
    kind: "MA'LUMOT",
    text: "Biz qanday sonni o'ylamaylik, natijada baribir 2 soni hosil bo'laveradi. Buni tekshirib ko'ramiz. O'ylangan sonni a harfi bilan belgilaymiz va amallarni yana masala shartida ko'rsatilgan tartibda yozamiz: (a · 3 + 6) : 3 − a. Ushbu ifodani soddalashtiramiz:  (a · 3 + 6) : 3 − a = a + 2 − a = 2.",
  },
  {
    kind: "MA'LUMOT",
    text: "Masalani yechishda istalgan sonni bildiruvchi a harfi, 3 va 6 sonlari, amallar belgilari va qavslardan iborat (a · 3 + 6) : 3 − a ifoda hosil qilindi. Bu algebraik ifodaga misoldir va u masala shartini matematik tilga o'tkazish namunasidir.",
  },
  {
    kind: "TA'RIF",
    text: "Sonlar va harflardan tuzilib, amallar belgilari bilan birlashtirilgan ifodalarga algebraik ifodalar deyiladi.",
  },
  {
    kind: 'MASALAN',
    text: '2(m + n),   3a + 2ab − 7,   (a + b)(a − b),   (x + y)/a',
  },
  {
    kind: "TA'RIF",
    text: "Agar algebraik ifodaga kirgan harflar o'rniga biror son qo'yilsa va ko'rsatilgan amallar bajarilsa, natijada, hosil bo'lgan son berilgan algebraik ifodaning son qiymati deyiladi.",
  },
  {
    kind: 'MASALAN',
    text: "a = 2, b = 3 bo'lganda 3a + 2b − 7 algebraik ifodaning qiymati 5 ga teng, chunki 3 · 2 + 2 · 3 − 7 = 5.",
  },
]

const EXAMPLE_10_4: WorkedItem = {
  prompt: "(3a + 7)b/(a − b) ifodaning a = 10, b = 5 bo'lgandagi qiymatini toping",
  steps: [
    '(3 · 10 + 7) · 5 / (10 − 5)',
    '= 37 · 5 / 5',
    '= 37',
  ],
  answer: '37',
}

const EX_10_4: TopicExercise[] = [
  {
    prompt: 'Algebraik ifodaning qiymatini toping: 3a − 2b, bunda a = 1/3, b = 1',
    steps: ['3 · (1/3) − 2 · 1 = 1 − 2'],
    answer: '−1',
  },
  {
    prompt: 'Algebraik ifodaning qiymatini toping: 2a + 3b, bunda a = 3, b = −2',
    steps: ['2 · 3 + 3 · (−2) = 6 − 6'],
    answer: '0',
  },
  {
    prompt: 'Algebraik ifodaning qiymatini toping: 0,25a − 4c², bunda a = 4, c = 3',
    steps: ['0,25 · 4 − 4 · 3² = 1 − 36'],
    answer: '−35',
  },
  {
    prompt:
      'Algebraik ifodaning qiymatini toping: (2a² − (1/3)b), bunda a = 2, b = 9',
    steps: ['2 · 2² − (1/3) · 9 = 8 − 3'],
    answer: '5',
  },
  {
    prompt: "Algebraik ifodaning qiymatini toping: a + b · c, bunda a = −1, b = 3, c = 0",
    steps: ['−1 + 3 · 0 = −1 + 0'],
    answer: '−1',
  },
  {
    prompt:
      "Algebraik ifodaning qiymatini toping: (a + b) · c, bunda a = 1, b = −3, c = 2",
    steps: ['(1 + (−3)) · 2 = −2 · 2'],
    answer: '−4',
  },
  {
    prompt:
      'Algebraik ifodaning qiymatini toping: 2((a − b)² + 1), bunda a = 2, b = −3',
    steps: ['(2 − (−3))² = 5² = 25', '2 · (25 + 1) = 2 · 26'],
    answer: '52',
  },
  {
    prompt:
      "Algebraik ifodaning qiymatini toping: 3(a + b) − 2ab, bunda a = 2,5 va b = 1,5",
    steps: ['a + b = 4,  a · b = 3,75', '3 · 4 − 2 · 3,75 = 12 − 7,5'],
    answer: '4,5',
  },
  {
    prompt:
      "y = k/(1011k + 1) uchun k = 2 bo'lsa, x = (1 − 2021/2023) : y + 2021 ning qiymatini hisoblang.",
    steps: [
      'y = 2/(1011 · 2 + 1) = 2/2023',
      '1 − 2021/2023 = 2/2023',
      'x = (2/2023) : (2/2023) + 2021 = 1 + 2021',
    ],
    answer: '2022',
  },
  {
    prompt: "x = 2 va y = −1 bo'lganda jadvalni to'ldiring: x + 2y,  4x − y,  2(x + y),  2x − xy + 5,  x + y − 1,  (3x − 2y)/(4(x + y))",
    steps: [
      'x + 2y = 2 + 2 · (−1) = 0',
      '4x − y = 8 − (−1) = 9',
      '2(x + y) = 2 · 1 = 2',
      '2x − xy + 5 = 4 − (−2) + 5 = 11',
      'x + y − 1 = 2 − 1 − 1 = 0',
      '(3x − 2y)/(4(x + y)) = (6 + 2)/(4 · 1) = 8/4 = 2',
    ],
    answer: '0;  9;  2;  11;  0;  2',
  },
]

/* ─────────── 10.5 ─────────── */

const THEORY_10_5: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Nega algebraik ifodaning hadlarini yozganda son va harf orasiga ko'paytirish belgisi qo'yilmasligini bilasizmi? Keling buning bir nechta sabablarini ko'rib chiqamiz:",
  },
  {
    kind: "MA'LUMOT",
    text: "1) 2 ni 3 ga quyidagicha ko'paytiramiz: 2 × 3. Endi shu yo'l bilan 2 ni x ga ko'paytiramiz: 2 × x. E'tibor beradigan bo'lsak bu yerda ko'paytirish belgisi x bilan deyarli bir xil bo'lib qoldi va bu ko'pchilikni chalg'itadi. Shuning uchun sonlarni harflar bilan ko'paytmasini yozganda ko'paytirish belgisini ishlatmasdan to'g'ridan to'g'ri 2x deb yozish qabul qilingan.",
  },
  {
    kind: "MA'LUMOT",
    text: "2) Ko'paytirish belgisining tushirib qoldirilishining yana bir sababi ifodalarni tez va qisqa qilib yozish. Masalan, s = v · t ifodani har safar ishlatganda ko'paytirish belgisi “ · ” ni yozib o'tirmasdan, s = vt ko'rinishida yozish qulayroq bo'lgani uchun shunday qilib yozish qabul qilingan.",
  },
]

/* ─────────── 10.6 ─────────── */

const THEORY_10_6: TheoryBlock[] = [
  {
    kind: "TA'RIF",
    text: "Algebraik ifodaning bir xil harflardan yoki bir xil harflar birikmalaridan tuzilgan hadlariga o'xshash hadlari deyiladi. Anashu o'xshash hadlari ustida amal bajarish orqali ularni sodda ko'rinishga keltirishga o'xshash hadlarni ixchamlash deyiladi.",
  },
  {
    kind: 'MASALAN',
    text: "3a + 4b − a + 5b ifodada 3a bilan −a hadlar va 4b bilan 5b hadlar harflari bir xil bo'lganligi uchun o'xshash hadlardir. Ularni ixchamlagan paytda harflari bir xil bo'lgan ifodalarni ishorasini saqlagan holda yonma-yon yozib olamiz va o'xshash harflar oldidagi sonlar ustida amal bajarib, natija yoniga o'z harfini yozib qo'yaveramiz:  3a + 4b − a + 5b = 3a − a + 4b + 5b = 2a + 9b",
  },
]

const EXAMPLE_10_6: WorkedItem = {
  prompt: "O'xshash hadlarni ixchamlang: 3a + 7b + a − 9b",
  steps: ['3a + 7b + a − 9b = 3a + a + 7b − 9b', '= 4a − 2b'],
  answer: '4a − 2b',
}

const EX_10_6: TopicExercise[] = [
  {
    prompt: "O'xshash hadlarni ixchamlang: 4a + 2b + a − b",
    steps: ['4a + a = 5a', '2b − b = b'],
    answer: '5a + b',
  },
  {
    prompt: "O'xshash hadlarni ixchamlang: 5a − 3b + 4b − 7a",
    steps: ['5a − 7a = −2a', '−3b + 4b = b'],
    answer: '−2a + b',
  },
  {
    prompt: "O'xshash hadlarni ixchamlang: 3a + 27 + 2a − 22",
    steps: ['3a + 2a = 5a', '27 − 22 = 5'],
    answer: '5a + 5',
  },
  {
    prompt: "O'xshash hadlarni ixchamlang: 5x − 4y + 17x − 4y",
    steps: ['5x + 17x = 22x', '−4y − 4y = −8y'],
    answer: '22x − 8y',
  },
  {
    prompt: "O'xshash hadlarni ixchamlang: 5x + 8y − 9y + x",
    steps: ['5x + x = 6x', '8y − 9y = −y'],
    answer: '6x − y',
  },
  {
    prompt: "O'xshash hadlarni ixchamlang: 7b + 7a − 4b + 3b",
    steps: ['7b − 4b + 3b = 6b'],
    answer: '6b + 7a',
  },
  {
    prompt: "O'xshash hadlarni ixchamlang: 11x² + 4x − x² − 4x",
    steps: ['11x² − x² = 10x²', '4x − 4x = 0'],
    answer: '10x²',
  },
  {
    prompt: "O'xshash hadlarni ixchamlang: 5a² − 4b² − 3a² + b²",
    steps: ['5a² − 3a² = 2a²', '−4b² + b² = −3b²'],
    answer: '2a² − 3b²',
  },
  {
    prompt: "O'xshash hadlarni ixchamlang: 3a² − 5ab − a² + 2ab",
    steps: ['3a² − a² = 2a²', '−5ab + 2ab = −3ab'],
    answer: '2a² − 3ab',
  },
  {
    prompt:
      "Hadlari ratsional sonlardan iborat bo'lgan ifodalarni soddalashtiring: −a + b + 1,4b − 1,4a",
    steps: ['−a − 1,4a = −2,4a', 'b + 1,4b = 2,4b'],
    answer: '−2,4a + 2,4b',
  },
  {
    prompt:
      "Hadlari ratsional sonlardan iborat bo'lgan ifodalarni soddalashtiring: 1,3n − 4,3n − 5,7n − 2,9n",
    steps: ['1,3 − 4,3 − 5,7 − 2,9 = −11,6'],
    answer: '−11,6n',
  },
  {
    prompt:
      "Hadlari ratsional sonlardan iborat bo'lgan ifodalarni soddalashtiring: (5/7)x − (2/7)x + (1/7)x − (3/7)x",
    steps: ['(5 − 2 + 1 − 3)/7 = 1/7'],
    answer: '(1/7)x',
  },
  {
    prompt:
      "Hadlari ratsional sonlardan iborat bo'lgan ifodalarni soddalashtiring: (1/2)x + (1/3)y + (1/3)x − (1/6)x − (1/2)y",
    steps: [
      'x bo\'yicha: 1/2 + 1/3 − 1/6 = 3/6 + 2/6 − 1/6 = 4/6 = 2/3',
      'y bo\'yicha: 1/3 − 1/2 = 2/6 − 3/6 = −1/6',
    ],
    answer: '(2/3)x − (1/6)y',
  },
]

/* ─────────── 10.7 ─────────── */

const THEORY_10_7: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: 'Qavs oldida " − " yoki " + " ishoralari yoki biron bir son bo\'lsa, qavslarni ochish ketma-ketligi quyidagicha amalga oshiriladi:',
  },
  {
    kind: "MA'LUMOT",
    text: '1) Agar qavs oldidagi ishora " + " bo\'lsa, qavsni ochganda qavs ichidagi har bir ifoda o\'z ishorasi bilan yoziladi.',
  },
  {
    kind: 'MASALAN',
    text: '1) +(a − 2b) = a − 2b      2) +(b − a) = b − a',
  },
  {
    kind: "MA'LUMOT",
    text: '2) Agar qavs oldidagi ishora " − " bo\'lsa, qavsni ochganda qavs ichidagi har bir ifoda qarama-qarshi ishora bilan yoziladi.',
  },
  {
    kind: 'MASALAN',
    text: '1) −(a − 2b) = −a + 2b      2) −(a + b) = −a − b',
  },
  {
    kind: "MA'LUMOT",
    text: "3) Agar qavs oldida son ko'payib kelsa, qavsni ochgan payda berilgan son qavs ichidagi har bir ifodaga ko'paytiriladi.",
  },
  {
    kind: 'MASALAN',
    text: '1) 2(4a − 9b) = 8a − 18b      2) −5(b − 5a) = −5b + 25a',
  },
  {
    kind: "MA'LUMOT",
    text: "4) Agar qavsdan keyin biron bir son bo'luvchi bo'lib kelsa, qavsni ochgan payda berilgan son qavs ichidagi har bir ifodaga bo'linadi.",
  },
  {
    kind: 'MASALAN',
    text: '1) (9a + 12b − 21) : 3 = 3a + 4b − 7',
  },
]

const EX_10_7: TopicExercise[] = [
  {
    prompt: 'Qavslarni oching: a + (2b − 3c)',
    answer: 'a + 2b − 3c',
  },
  {
    prompt: 'Qavslarni oching: a − (2b − 3c)',
    answer: 'a − 2b + 3c',
  },
  {
    prompt: 'Qavslarni oching: −(a − 2b + 3c)',
    answer: '−a + 2b − 3c',
  },
  {
    prompt: 'Qavslarni oching: (−a + b) − (a − b)',
    steps: ['−a + b − a + b'],
    answer: '−2a + 2b',
  },
  {
    prompt: 'Qavslarni oching: x − (x + y)',
    steps: ['x − x − y'],
    answer: '−y',
  },
  {
    prompt: 'Qavslarni oching: (−a + b) + (2a − b)',
    steps: ['−a + b + 2a − b'],
    answer: 'a',
  },
  {
    prompt: 'Qavslarni oching: a + (b − (c − d))',
    steps: ['Ichki qavs: (b − (c − d))'],
    answer: 'a + b − c + d',
  },
  {
    prompt: 'Qavslarni oching: a − ((b − c) − d)',
    steps: ['(b − c) − d = b − c − d', 'a − (b − c − d)'],
    answer: 'a − b + c + d',
  },
  {
    prompt: 'Qavslarni oching: a − (b − (c − d))',
    steps: ['b − (c − d) = b − c + d', 'a − (b − c + d)'],
    answer: 'a − b + c − d',
  },
  {
    prompt: 'Qavslarni ochib, ifodani soddalashtiring: (5a − 2b) − (3b − 5a)',
    steps: ['5a − 2b − 3b + 5a'],
    answer: '10a − 5b',
  },
  {
    prompt: 'Qavslarni ochib, ifodani soddalashtiring: 7x + 3y − (−3x + 3y)',
    steps: ['7x + 3y + 3x − 3y'],
    answer: '10x',
  },
  {
    prompt: 'Qavslarni ochib, ifodani soddalashtiring: 8x − (3x − 2y) − 5y',
    steps: ['8x − 3x + 2y − 5y'],
    answer: '5x − 3y',
  },
  {
    prompt: 'Ifodani soddalashtiring: 5(3x − 7) + 2(1 − x)',
    steps: ['15x − 35 + 2 − 2x'],
    answer: '13x − 33',
  },
  {
    prompt: 'Ifodani soddalashtiring: 7(10 − x) − 3(2x − 1)',
    steps: ['70 − 7x − 6x + 3'],
    answer: '73 − 13x',
  },
  {
    prompt: 'Ifodani soddalashtiring: (1/3)(6x − 3) + (2/5)(5x − 15)',
    steps: ['2x − 1 + 2x − 6'],
    answer: '4x − 7',
  },
  {
    prompt:
      'm yoki (−m) sonlardan boshlab, barcha qo\'shiluvchilarni qavs oldiga " + " ishorasini qo\'ygan holda qavs ichiga oling: a + 2b + m − c',
    answer: 'a + 2b + (m − c)',
  },
  {
    prompt:
      'm yoki (−m) sonlardan boshlab, barcha qo\'shiluvchilarni qavs oldiga " + " ishorasini qo\'ygan holda qavs ichiga oling: a − m + 3c + 4d',
    answer: 'a + (−m + 3c + 4d)',
  },
  {
    prompt:
      'm yoki (−m) sonlardan boshlab, barcha qo\'shiluvchilarni qavs oldiga " + " ishorasini qo\'ygan holda qavs ichiga oling: a − 2b + m + c',
    answer: 'a − 2b + (m + c)',
  },
  {
    prompt:
      'm yoki (−m) sonlardan boshlab, barcha qo\'shiluvchilarni qavs oldiga " − " ishorasini qo\'ygan holda qavs ichiga oling: a + 2b + m − c',
    answer: 'a + 2b − (−m + c)',
  },
  {
    prompt:
      'm yoki (−m) sonlardan boshlab, barcha qo\'shiluvchilarni qavs oldiga " − " ishorasini qo\'ygan holda qavs ichiga oling: a − m + 3c + 4d',
    steps: ['Tekshirish: a − (m − 3c − 4d) = a − m + 3c + 4d'],
    answer: 'a − (m − 3c − 4d)',
  },
  {
    prompt:
      'm yoki (−m) sonlardan boshlab, barcha qo\'shiluvchilarni qavs oldiga " − " ishorasini qo\'ygan holda qavs ichiga oling: a − 2b + m + c',
    steps: ['Tekshirish: a − 2b − (−m − c) = a − 2b + m + c'],
    answer: 'a − 2b − (−m − c)',
  },
]

/* ─────────── 10.8 ─────────── */

const THEORY_10_8: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Ko'pgina amaliy masalalarni yechishda sonlarni belgilash uchun harflardan foydalanish qulaydir. Buni quyidagi masalalar orqali ko'rib chiqsak:",
  },
  {
    kind: "MA'LUMOT",
    text: "1. Masalan, agar a va b lar to'g'ri to'rtburchak tomonlarining uzunliklari bo'lsa, u holda a · b uning yuzi, 2 · (a + b) uning perimetridir.",
  },
  {
    kind: 'MASALAN',
    text: 'a · b — to\'g\'ri to\'rtburchakning yuzi (S = a · b);   2 · (a + b) — uning perimetri (P = 2 · (a + b))',
  },
  {
    kind: "MA'LUMOT",
    text: "Bu yerda a va b harflari bilan musbat sonlar—to'g'ri to'rtburchakning tomonlarining uzunliklari belgilangan. Agar to'g'ri to'rtburchakning yuzini S harfi bilan, perimetrini esa P bilan belgilasak, u holda quyidagi formulalarni hosil qilamiz:  S = a · b,   P = 2 · (a + b)",
  },
  {
    kind: 'ESLATISH',
    text: "Ixtiyoriy geometrik yopiq shaklning perimetri uning barcha tomonlari yig'indisiga teng.",
  },
]

const EXAMPLE_10_8: WorkedItem = {
  prompt:
    "To'g'ri to'rtburchak shaklidagi ekin maydonining bo'yi 12 m, eni esa 8 m. Uning perimetrini toping",
  steps: ['P = 2(a + b)', 'P = 2 · (12 + 8) = 2 · 20'],
  answer: '40 m',
}

export const TOPIC_10_LESSONS: TopicLesson[] = [
  {
    id: '10.1',
    n: 1,
    title: 'Algebraga kirish. Algebraning kelib chiqishi',
    goal: "Algebra tarixini o'rganish",
    minutes: 10,
    videos: [
      {
        id: 'dIKQPBT0ZMk',
        title: 'Algebraga kirish. Algebraning kelib chiqishi (Nazariy qism)',
      },
    ],
    theory: THEORY_10_1,
    practice: [],
  },

  {
    id: '10.2',
    n: 2,
    title: "Matematika fanining Algebra bo'limining asosiy vazifalari",
    goal: "Algebra bo'limining asosiy vazifalarini o'rganish",
    minutes: 15,
    videos: [
      {
        id: 'DqBeMSFq2yY',
        title:
          "Matematika fanining Algebra bo'limining asosiy vazifalari (Nazariy qism)",
      },
    ],
    theory: THEORY_10_2,
    example: EXAMPLE_10_2,
    practice: [],
    exercises: EX_10_2,
  },

  {
    id: '10.3',
    n: 3,
    title: "O'zgaruvchan va o'zgarmas miqdorlar",
    goal: "O'zgaruvchan va o'zgarmas miqdorlar haqida tushunchaga ega bo'lish",
    minutes: 14,
    videos: [
      {
        id: '1ZhrbHUPMEM',
        title: "O'zgaruvchan va o'zgarmas miqdorlar (Nazariy qism)",
      },
    ],
    theory: THEORY_10_3,
    practice: [],
    exercises: EX_10_3,
  },

  {
    id: '10.4',
    n: 4,
    title: 'Algebraik ifodalar haqida tushuncha',
    goal: "Algebraik ifodalar haqida tushunchaga ega bo'lish",
    minutes: 15,
    videos: [
      {
        id: 'bm_5hJOVaH4',
        title: 'Algebraik ifodalar haqida tushuncha (Nazariy qism)',
      },
    ],
    theory: THEORY_10_4,
    example: EXAMPLE_10_4,
    practice: [],
    exercises: EX_10_4,
  },

  {
    id: '10.5',
    n: 5,
    title:
      "Algebraik ifodalarni yozganda son va harf orasida ko'paytirish belgisining qo'llanilmasligi.",
    goal: "Ko'paytirish belgisini nega yozilmasligini o'rganish",
    minutes: 10,
    videos: [
      {
        id: 'vizRbJ8fEfY',
        title:
          "Algebraik ifodalarni yozganda son va harf orasida ko'paytirish belgisining qo'llanilmasligi (Nazariy qism)",
      },
    ],
    theory: THEORY_10_5,
    practice: [],
  },

  {
    id: '10.6',
    n: 6,
    title: "O'xshash hadlarni ixchamlash",
    goal: "O'xshash hadlarni ixchamlashni o'rganish",
    minutes: 14,
    videos: [
      {
        id: 'oqIpU69fl10',
        title: "O'xshash hadlarni ixchamlash (Nazariy qism)",
      },
    ],
    theory: THEORY_10_6,
    example: EXAMPLE_10_6,
    practice: [],
    exercises: EX_10_6,
  },

  {
    id: '10.7',
    n: 7,
    title: 'Qavslarni ochish qoidalari',
    goal: "Qavslarni ochishni o'rganish",
    minutes: 15,
    videos: [
      {
        id: 'AfLZmxa0Fzo',
        title: 'Qavslarni ochish qoidalari (Nazariy qism)',
      },
    ],
    theory: THEORY_10_7,
    practice: [],
    exercises: EX_10_7,
  },

  {
    id: '10.8',
    n: 8,
    title: 'Masalalarni formulalar yordamida ifodalash',
    goal: "O'zimizdan formula keltirib chiqarishni o'rganamiz",
    minutes: 12,
    videos: [
      {
        id: 'gJjWr_spCaw',
        title: 'Masalalarni formulalar yordamida ifodalash (Nazariy qism)',
      },
    ],
    theory: THEORY_10_8,
    example: EXAMPLE_10_8,
    practice: [],
  },
]

/* ─────────── Yakuniy test ─────────── */

export const TOPIC_10_TEST: TopicTest = {
  id: '10.9',
  n: 9,
  title: 'Mavzu 10 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't10-01',
      prompt: "Algebra so'zi qaysi so'zdan olingan?",
      options: ['al-jabr', 'al-muqobala', 'algoritm', 'al-hisob'],
      correct: 0,
      explain:
        "Kitobda aytilishicha, algebra so'zi al-Xorazmiyning “Kitob al-Muxtasar fi hisob al-jabr val-muqobala” asaridagi “al-jabr” so'zidan olingan.",
    },
    {
      id: 't10-02',
      prompt: "“al-jabr” so'zi arabchada qanday ma'nolarni anglatadi?",
      options: [
        'hisoblash yoki o\'lchash',
        'tiklash yoki to\'ldirish',
        'bo\'lish yoki taqsimlash',
        'qo\'shish yoki ayirish',
      ],
      correct: 1,
      explain:
        "Kitobda “bu so'z arabcha so'z bo'lib, tiklash yoki to'ldirish degan ma'nolarni anglatadi” deb yozilgan.",
    },
    {
      id: 't10-03',
      prompt: "Algebrani to'liq fanga olib kirgan olim kim?",
      options: ['Diofant', 'Brahmagupta', 'Al-Xorazmiy', 'Pifagor'],
      correct: 2,
      explain:
        "Kitobda “algebrani to'liq fanga bobokalonimiz al-Xorazmiy olib kirgan” deyilgan.",
    },
    {
      id: 't10-04',
      prompt:
        "Sonlar va harflardan tuzilib, amallar belgilari bilan birlashtirilgan ifodalarga nima deyiladi?",
      options: ['sonli ifoda', 'algebraik ifoda', 'tenglama', 'tengsizlik'],
      correct: 1,
      explain:
        "Ta'rifga ko'ra, sonlar va harflardan tuzilib, amallar belgilari bilan birlashtirilgan ifodalarga algebraik ifodalar deyiladi.",
    },
    {
      id: 't10-05',
      prompt: "Algebraik ifodaning son qiymati deb nimaga aytiladi?",
      options: [
        "Ifodadagi harflar soni",
        "Harflar o'rniga son qo'yib, ko'rsatilgan amallar bajarilganda hosil bo'lgan son",
        'Ifodadagi eng katta son',
        "Ifodani qavslardan xalos qilish natijasi",
      ],
      correct: 1,
      explain:
        "Kitobda: agar algebraik ifodaga kirgan harflar o'rniga biror son qo'yilsa va ko'rsatilgan amallar bajarilsa, hosil bo'lgan son berilgan algebraik ifodaning son qiymati deyiladi.",
    },
    {
      id: 't10-06',
      prompt: "a = 2, b = 3 bo'lganda 3a + 2b − 7 ifodaning qiymati nechaga teng?",
      options: ['5', '3', '7', '11'],
      correct: 0,
      explain: "3 · 2 + 2 · 3 − 7 = 6 + 6 − 7 = 5, kitobdagi MASALAN shu natijani beradi.",
    },
    {
      id: 't10-07',
      prompt: "O'zgaruvchan miqdor deb nimaga aytiladi?",
      options: [
        "Qiymati avvaldan belgilangan miqdorga",
        "Faqat bitta qiymatni qabul qiladigan miqdorga",
        'Malum mulohaza doirasida turli qiymatlarni qabul qiluvchi miqdorga',
        'Har doim nolga teng bo\'lgan miqdorga',
      ],
      correct: 2,
      explain:
        "Kitobda ma'lum mulohaza doirasida turli qiymatlarni qabul qiluvchi miqdorlar o'zgaruvchan miqdorlar deb ataladi.",
    },
    {
      id: 't10-08',
      prompt: "Son va harf orasiga ko'paytirish belgisi nima uchun yozilmaydi?",
      options: [
        "Ko'paytirish belgisi umuman mavjud emas",
        "«2 × x» dagi belgi x harfi bilan chalkashadi, ifoda esa qisqa yoziladi",
        "Chunki son harfdan kichik",
        "Chunki bunday ifoda algebraik ifoda hisoblanmaydi",
      ],
      correct: 1,
      explain:
        "10.5 da ikki sabab keltiriladi: ko'paytirish belgisi x harfiga o'xshab chalkashlik tug'diradi va ifodani tez hamda qisqa yozish qulay.",
    },
    {
      id: 't10-09',
      prompt: "O'xshash hadlar deb nimaga aytiladi?",
      options: [
        "Bir xil sonlardan tuzilgan hadlarga",
        "Bir xil harflardan yoki bir xil harflar birikmalaridan tuzilgan hadlarga",
        "Qavs ichida turgan hadlarga",
        "Ishorasi bir xil bo'lgan hadlarga",
      ],
      correct: 1,
      explain:
        "Ta'rifga ko'ra, algebraik ifodaning bir xil harflardan yoki bir xil harflar birikmalaridan tuzilgan hadlariga o'xshash hadlari deyiladi.",
    },
    {
      id: 't10-10',
      prompt: "3a + 7b + a − 9b ifodani ixchamlang.",
      options: ['4a − 2b', '4a + 2b', '2a − 2b', '4a − 16b'],
      correct: 0,
      explain:
        "3a + a = 4a, 7b − 9b = −2b — kitobdagi MISOL aynan 4a − 2b natijasini beradi.",
    },
    {
      id: 't10-11',
      prompt:
        'Qavs oldida " − " ishorasi bo\'lsa, qavs ochilganda qavs ichidagi ifodalar qanday yoziladi?',
      options: [
        "O'z ishorasi bilan",
        'Qarama-qarshi ishora bilan',
        'Faqat musbat ishora bilan',
        'Ishora umuman yozilmaydi',
      ],
      correct: 1,
      explain:
        '10.7 qoidasiga ko\'ra, qavs oldidagi ishora " − " bo\'lsa, qavs ichidagi har bir ifoda qarama-qarshi ishora bilan yoziladi.',
    },
    {
      id: 't10-12',
      prompt: '−(a − 2b) ifodani qavsdan chiqaring.',
      options: ['−a + 2b', '−a − 2b', 'a − 2b', 'a + 2b'],
      correct: 0,
      explain:
        'Kitobdagi MASALAN: −(a − 2b) = −a + 2b, chunki qavs oldidagi " − " har bir hadning ishorasini o\'zgartiradi.',
    },
  ],
}

export const TOPIC_10_PASS = 7
