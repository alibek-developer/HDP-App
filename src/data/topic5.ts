import type { TopicLesson, TopicTest, TheoryBlock, WorkedItem, TopicExercise } from './topicTypes'

/**
 * MAVZU 5 — «O'nli kasrlar haqida tushuncha» (5.1–5.7).
 *
 * Manba: darslikning 5-bob nazariy qismi (5.1–5.7) va «Amaliy qism».
 * Har bir bo'lim sarlavhasi, «Maqsad», TA'RIF / MA'LUMOT / MASALAN /
 * ESLATMA / XULOSA bloklari, MISOL / YECHISH va mashqlar kitobdagi matn
 * bo'yicha ko'chirilgan. Mashq javobi faqat aniq hisob-kitob bilan
 * tasdiqlangan holatda qo'shilgan.
 *
 * `TOPIC_5_TEST` — 5.8, mavzu yakuniy 12 savolli testi.
 */

export const TOPIC_5_META = {
  id: 'mavzu-5',
  num: 5,
  chapter: "O'nli kasrlar haqida tushuncha",
  title: "Mavzu 5. O'nli kasrlar",
  lessonCount: 7,
}

/* ─────────── 5.1 ─────────── */

const THEORY_5_1: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "O'nli(vergulli) kasrlar oddiy va aralash kasrlar singari kasrning bir turi bo'lib, o'z navbatida o'zi ham chekli va cheksiz o'nli kasrlar turlariga bo'linadi.",
  },
  {
    kind: "TA'RIF",
    text: "Chekli o'nli kasrlar. Maxraji faqat 2 va 5 ning ko'paytmasidan (2 ning yoki 5 ning darajasi bo'lsa ham) tashkil topgan o'nli kasrlarga chekli o'nli kasrlar deyiladi.",
  },
  {
    kind: 'MASALAN',
    text: '1) 1/10 = 1/(2¹·5¹);   2) 1/40 = 1/(2³·5¹);   3) 1/8 = 1/2³;   4) 2/125 = 2/5³',
  },
  {
    kind: "TA'RIF",
    text: "Cheksiz o'nli kasrlar. Maxrajida 2 va 5 ning darajalaridan tashqari boshqa tub sonlarning ko'paytmasi qatnashgan o'nli kasrlarga cheksiz o'nli kasrlar deyiladi.",
  },
  {
    kind: 'MASALAN',
    text: '1) 1/12 = 1/(2²·3);   2) 1/15 = 1/(3¹·5¹);   3) 5/28 = 5/(2²·7¹)',
  },
  {
    kind: 'ESLATISH',
    text: "Kasrlarni chekli yoki cheksiz kasrlarga ajratishdan oldin, ularni qisqartirib (agar qisqarsa), keyin ajratish kerak.",
  },
  {
    kind: 'XULOSA',
    text: "Xulosa qilib aytadigan bo'lsak, verguldan keyingi qismi chekli sonlardan tashkil topgan o'nli kasr chekli, verguldan keyingi qismi cheksiz davom etadigan o'nli kasrlar esa cheksiz o'nli kasrlar deyiladi.",
  },
]

const EX_5_1: TopicExercise[] = [
  {
    prompt: "Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 3/12",
    answer: 'Chekli (3/12 = 1/4)',
  },
  {
    prompt: "Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 7/28",
    answer: 'Chekli (7/28 = 1/4)',
  },
  {
    prompt: "Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 1/3",
    answer: 'Cheksiz',
  },
  {
    prompt: "Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 1/16",
    answer: 'Chekli (1/16 = 1/2⁴)',
  },
  {
    prompt: "Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 4/80",
    answer: 'Chekli (4/80 = 1/20 = 1/(2²·5))',
  },
  {
    prompt: "Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 4/5",
    answer: 'Chekli',
  },
  {
    prompt: "Amaliy qism. Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 1/3",
    answer: 'Cheksiz',
  },
  {
    prompt: "Amaliy qism. Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 4/28",
    answer: 'Cheksiz (4/28 = 1/7)',
  },
  {
    prompt: "Amaliy qism. Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 12/24",
    answer: 'Chekli (12/24 = 1/2)',
  },
  {
    prompt: "Amaliy qism. Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 5/16",
    answer: 'Chekli (5/16 = 5/2⁴)',
  },
  {
    prompt: "Amaliy qism. Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 5/80",
    answer: 'Chekli (5/80 = 1/16)',
  },
  {
    prompt: "Amaliy qism. Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 4/25",
    answer: 'Chekli (4/25 = 4/5²)',
  },
  {
    prompt: "Amaliy qism. Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 8/9",
    answer: 'Cheksiz',
  },
  {
    prompt: "Amaliy qism. Quyidagi kasrlarni chekli va cheksiz kasrlarga ajrating: 1/10",
    answer: 'Chekli',
  },
]

/* ─────────── 5.2 ─────────── */

const THEORY_5_2: TheoryBlock[] = [
  {
    kind: "TA'RIF",
    text: "Maxraji 10 va uning darajalaridan tashkil topgan kasrlarga chekli o'nli(vergulli) kasrlar deyiladi.",
  },
  {
    kind: 'MASALAN',
    text: '3/10 = 0,3;   8/100 = 0,08;   1/1000 = 0,001',
  },
  {
    kind: "MA'LUMOT",
    text: "Chekli o'nli kasrlar yozuvda butun va kasr qismlari vergul bilan ajratilib yoziladi.",
  },
  {
    kind: 'MASALAN',
    text: '0,03;   0,45;   2,5;   17,25',
  },
  {
    kind: "MA'LUMOT",
    text: "Chekli o'nli kasrlar o'qilganda quyidagicha o'qiladi. Misol uchun 0,03 soni nol butun yuzdan uch, 0,45 soni nol butun yuzdan qirq besh, 2,5 soni ikki butun o'ndan besh yoki ikki yarim deb o'qiladi.",
  },
]

const EX_5_2: TopicExercise[] = [
  {
    prompt: "So'z bilan berilgan kasrni sonlar bilan yozing: nol butun yuzdan qirq uch",
    answer: '0,43',
  },
  {
    prompt: "So'z bilan berilgan kasrni sonlar bilan yozing: yeti butun o'ndan ikki",
    answer: '7,2',
  },
  {
    prompt: "So'z bilan berilgan kasrni sonlar bilan yozing: besh butun mingdan bir",
    answer: '5,001',
  },
  {
    prompt: "So'z bilan berilgan kasrni sonlar bilan yozing: ikki butun yuzdan yigirma besh",
    answer: '2,25',
  },
  {
    prompt: "Amaliy qism. So'z bilan berilgan kasrni sonlar bilan yozing: nol butun yuzdan uch",
    answer: '0,03',
  },
  {
    prompt: "Amaliy qism. So'z bilan berilgan kasrni sonlar bilan yozing: qirq uch butun yuzdan ikki",
    answer: '43,02',
  },
  {
    prompt:
      "Amaliy qism. So'z bilan berilgan kasrni sonlar bilan yozing: besh butun o'n mingdan o'ttiz bir",
    answer: '5,0031',
  },
  {
    prompt: "Amaliy qism. So'z bilan berilgan kasrni sonlar bilan yozing: ikki butun yuzdan besh",
    answer: '2,05',
  },
]

/* ─────────── 5.3 ─────────── */

const THEORY_5_3: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Chekli o'nli kasrlarni oddiy kasrga aylantirish uchun verguldan keyin qancha xona bo'lsa, oddiy kasrning maxrajida 10 ning shuncha darajasi bo'ladi.",
  },
  {
    kind: 'MASALAN',
    text: '1) 0,9 = 9/10¹   2) 0,28 = 28/10² = 28/100   3) 1,228 = 1 228/10³ = 1228/1000',
  },
]

const EX_5_3: TopicExercise[] = [
  {
    prompt: "Berilgan chekli o'nli kasrni oddiy kasrga o'tkazing: 0,23",
    answer: '23/100',
  },
  {
    prompt: "Berilgan chekli o'nli kasrni oddiy kasrga o'tkazing: 1,09",
    answer: '1 9/100',
  },
  {
    prompt: "Berilgan chekli o'nli kasrni oddiy kasrga o'tkazing: 17,25",
    answer: '17 25/100',
  },
  {
    prompt: "Berilgan chekli o'nli kasrni oddiy kasrga o'tkazing: 5,2",
    answer: '5 2/10',
  },
  {
    prompt: "Berilgan chekli o'nli kasrni oddiy kasrga o'tkazing: 0,000032",
    answer: '32/1000000',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 2,5",
    answer: '2 5/10',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 0,24",
    answer: '24/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 1,15",
    answer: '1 15/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 24,125",
    answer: '24 125/1000',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 0,12",
    answer: '12/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 0,96",
    answer: '96/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 0,11",
    answer: '11/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 11,2",
    answer: '11 2/10',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 16,02",
    answer: '16 2/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 30,11",
    answer: '30 11/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 23,12",
    answer: '23 12/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 95,90",
    answer: '95 90/100',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 0,7558",
    answer: '7558/10000',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 0,008",
    answer: '8/1000',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrni oddiy kasrga aylantiring: 18,0066",
    answer: '18 66/10000',
  },
]

/* ─────────── 5.4 ─────────── */

const THEORY_5_4: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Oddiy kasrlarni quyidagi usullar orqali o'nli kasrga o'tkazamiz.",
  },
  {
    kind: "MA'LUMOT",
    text: "1. Kasrning maxrajini o'nning darajalariga keltirish orqali. Kasrning maxrajini quyidagi uch xil usulda o'nning darajalariga keltirib, oddiy kasrlarni chekli o'nli kasrga keltirish mumkin.",
  },
  {
    kind: 'MASALAN',
    text: "Kasrning surat va maxrajini bir xil songa ko'paytirish orqali: 1) 1/5 = (1·2)/(5·2) = 2/10 = 0,2   2) 3/4 = (3·25)/(4·25) = 75/100 = 0,75",
  },
  {
    kind: 'MASALAN',
    text: "Kasrning surat va maxrajini bir xil songa bo'lish orqali: 1) 15/300 = (15:3)/(300:3) = 5/100 = 0,05   2) 72/90 = (72:9)/(90:9) = 8/10 = 0,8",
  },
  {
    kind: 'MASALAN',
    text: "Ko'paytirish va bo'lishning aralash usuli orqali: 1) 3/24 = (3:3)/(24:3) = 1/8 = (1·125)/(8·125) = 125/1000 = 0,125   2) 54/72 = (54:18)/(72:18) = 3/4 = (3·25)/(4·25) = 75/100 = 0,75",
  },
  {
    kind: "MA'LUMOT",
    text: "2. Kasrning suratini maxrajiga bo'lish orqali. Ushbu usulda berilgan oddiy kasrning suratini to'g'ridan-to'g'ri maxrajiga bo'lish orqali o'nli kasrga o'tkazamiz.",
  },
  {
    kind: 'MASALAN',
    text: '1) 15/8 = 15:8 = 1,875   2) 36/25 = 36:25 = 1,44',
  },
  {
    kind: "MA'LUMOT",
    text: "3. Odatiy, ko'p ishlatiladigan holatlarni yod olish orqali.",
  },
]

const LISTS_5_4 = [
  {
    caption: "Odatiy, ko'p ishlatiladigan holatlar:",
    items: [
      '1) 1/2 = 0,5',
      '2) 1/4 = 0,25',
      '3) 1/8 = 0,125',
      '4) 3/2 = 1,5',
      '5) 3/4 = 0,75',
      '6) 1/5 = 0,2',
      '7) 2/5 = 0,4',
      '8) 3/5 = 0,6',
      '9) 4/5 = 0,8',
    ],
  },
]

const EX_5_4: TopicExercise[] = [
  {
    prompt: "Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 1/2",
    answer: '0,5',
  },
  {
    prompt: "Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 7/4",
    answer: '1,75',
  },
  {
    prompt: "Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 1/25",
    answer: '0,04',
  },
  {
    prompt: "Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 1/8",
    answer: '0,125',
  },
  {
    prompt: "Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 1/125",
    answer: '0,008',
  },
  {
    prompt: "Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 75/1500",
    answer: '0,05',
  },
  {
    prompt: "Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 333/900",
    answer: '0,37',
  },
  {
    prompt: "Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 72/180",
    answer: '0,4',
  },
  {
    prompt: "Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 81/270",
    answer: '0,3',
  },
  {
    prompt: "Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 44/1100",
    answer: '0,04',
  },
  {
    prompt:
      "Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 24/120",
    answer: '0,2',
  },
  {
    prompt:
      "Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 12/48",
    answer: '0,25',
  },
  {
    prompt:
      "Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 9/72",
    answer: '0,125',
  },
  {
    prompt:
      "Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 15/75",
    answer: '0,2',
  },
  {
    prompt:
      "Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 5/80",
    answer: '0,0625',
  },
  {
    prompt: "Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 1/2",
    answer: '0,5',
  },
  {
    prompt: "Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 7/4",
    answer: '1,75',
  },
  {
    prompt: "Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 1/25",
    answer: '0,04',
  },
  {
    prompt: "Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 1/8",
    answer: '0,125',
  },
  {
    prompt: "Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 1/125",
    answer: '0,008',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 5/8",
    answer: '0,625',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 1/16",
    answer: '0,0625',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 23/25",
    answer: '0,92',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 3 3/4",
    answer: '3,75',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa ko'paytirish orqali chekli o'nli kasrga o'tkazing: 7 31/500",
    answer: '7,062',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 54/180",
    answer: '0,3',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 144/12000",
    answer: '0,012',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 125/250",
    answer: '0,5',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 6 30/500",
    answer: '6,06',
  },
  {
    prompt:
      "Amaliy qism. Surat va maxrajini bir xil songa bo'lish orqali chekli o'nli kasrga o'tkazing: 12 2/20",
    answer: '12,1',
  },
  {
    prompt:
      "Amaliy qism. Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 5/20",
    answer: '0,25',
  },
  {
    prompt:
      "Amaliy qism. Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 2 17/68",
    answer: '2,25',
  },
  {
    prompt:
      "Amaliy qism. Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 3/75",
    answer: '0,04',
  },
  {
    prompt:
      "Amaliy qism. Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 11 16/80",
    answer: '11,2',
  },
  {
    prompt:
      "Amaliy qism. Ko'paytirish va bo'lishning aralash usuli orqali chekli o'nli kasrga o'tkazing: 15/240",
    answer: '0,0625',
  },
  {
    prompt: "Amaliy qism. Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 1/2",
    answer: '0,5',
  },
  {
    prompt: "Amaliy qism. Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 1/4",
    answer: '0,25',
  },
  {
    prompt: "Amaliy qism. Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 1/5",
    answer: '0,2',
  },
  {
    prompt: "Amaliy qism. Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 3/4",
    answer: '0,75',
  },
  {
    prompt: "Amaliy qism. Suratini maxrajiga bo'lish orqali chekli o'nli kasrga o'tkazing: 1/8",
    answer: '0,125',
  },
]

/* ─────────── 5.5 ─────────── */

const THEORY_5_5: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "O'nli kasrlar quyidagi na'muna kabi yuqori xona birligidan boshlab taqqoslanadi.",
  },
  {
    kind: 'MASALAN',
    text: "5,876 > 5,869 — butun qismlar (5 = 5) va verguldan keyingi birinchi xonalar (8 = 8) teng, ikkinchi xonada 7 > 6 bo'lgani uchun birinchi kasr katta.",
  },
  {
    kind: 'XULOSA',
    text: "O'nli kasrlarni taqqoslaganda avval butun qismlari taqqoslanadi. Agar butun qismlari teng bo'lsa, verguldan keyingi qismining har bir xonasi alohida taqqoslanib, qaysi kasrning xonasidagi son katta bo'lsa, o'sha kasr katta bo'ladi. Shunga ko'ra, yuqoridagi misolda butun qismlari hamda verguldan keyingi birinchi xonalari o'zaro teng, lekin verguldan keyingi ikkinchi xonasidagi son katta bo'lgani uchun birinchi kasrning qiymati katta bo'ldi.",
  },
  {
    kind: 'MASALAN',
    text: '1) 0,16 = 0,160 = 0,16000   2) 1,8 = 1,80 = 1,800 = 1,8000',
  },
  {
    kind: "MA'LUMOT",
    text: "Shunga ko'ra, kasr qismlari har xil bo'lgan chekli o'nli kasrlarni, bir necha nollar yozish orqali verguldan keyingi xonalar sonini bir xil qiymatga keltiramiz va yuqori xona birliklaridan boshlab taqqoslaymiz.",
  },
]

const EXAMPLE_5_5: WorkedItem = {
  prompt: 'Berilgan kasrlarni taqqoslang: 1) 0,8 va 0,24   2) 10,05 va 10,0483',
  steps: [
    "Avval nollar yozish orqali verguldan keyingi qismining xonalari sonini tenglashtirib olamiz va keyin taqqoslaymiz.",
    '1) 0,8 = 0,80, demak 0,80 > 0,24',
    '2) 10,05 = 10,0500, demak 10,0500 > 10,0483',
  ],
  answer: '1) 0,80 > 0,24   2) 10,0500 > 10,0483',
}

const EX_5_5: TopicExercise[] = [
  {
    prompt: "Chekli o'nli kasrlarni taqqoslang: 21,45 va 22,98",
    answer: '21,45 < 22,98',
  },
  {
    prompt: "Chekli o'nli kasrlarni taqqoslang: 6,123 va 6,234",
    answer: '6,123 < 6,234',
  },
  {
    prompt: "Chekli o'nli kasrlarni taqqoslang: 46,1238 va 46,234",
    answer: '46,1238 < 46,234',
  },
  {
    prompt: "Chekli o'nli kasrlarni taqqoslang: 55,00001 va 54,999",
    answer: '55,00001 > 54,999',
  },
  {
    prompt:
      "Berilgan chekli o'nli kasrlarni o'sib borish tartibida yozing: 1,708; 0,98; 4,708; 0,99; 1,123; 20,3; 3,02",
    answer: '0,98; 0,99; 1,123; 1,708; 3,02; 4,708; 20,3',
  },
  {
    prompt:
      "To'g'ri tengsizlik hosil bo'lishi uchun yulduzcha o'rniga qo'yish mumkin bo'lgan barcha raqamlarni toping: 0,*3 > 0,71",
    answer: '7, 8, 9',
  },
  {
    prompt:
      "To'g'ri tengsizlik hosil bo'lishi uchun yulduzcha o'rniga qo'yish mumkin bo'lgan barcha raqamlarni toping: 0,1* < 0,18",
    answer: '0, 1, 2, 3, 4, 5, 6, 7',
  },
  {
    prompt:
      "To'g'ri tengsizlik hosil bo'lishi uchun yulduzcha o'rniga qo'yish mumkin bo'lgan barcha raqamlarni toping: 5,64 > 5,*3",
    answer: '0, 1, 2, 3, 4, 5, 6',
  },
  {
    prompt:
      "To'g'ri tengsizlik hosil bo'lishi uchun yulduzcha o'rniga qo'yish mumkin bo'lgan barcha raqamlarni toping: 3,51 < 3,*1",
    answer: '6, 7, 8, 9',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni taqqoslang: 85,09 va 67,99",
    answer: '85,09 > 67,99',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni taqqoslang: 55,7 va 55,7000",
    answer: '55,7 = 55,7000',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni taqqoslang: 0,908 va 0,918",
    answer: '0,908 < 0,918',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni taqqoslang: 7,6431 va 7,6429",
    answer: '7,6431 > 7,6429',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni taqqoslang: 0,5 va 0,724",
    answer: '0,5 < 0,724',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni taqqoslang: 0,0025 va 0,00247",
    answer: '0,0025 > 0,00247',
  },
  {
    prompt: "Amaliy qism. Sonlarni o'sish tartibida yozing: 3,456; 3,465; 8,149; 8,079; 0,453; 0,4532",
    answer: '0,453; 0,4532; 3,456; 3,465; 8,079; 8,149',
  },
  {
    prompt:
      "Amaliy qism. Sonlarni kamayish tartibida yozing: 0,456; 0,065; 0,009; 0,079; 0,0093; 0,0502",
    answer: '0,456; 0,079; 0,065; 0,0502; 0,0093; 0,009',
  },
]

/* ─────────── 5.6 ─────────── */

const THEORY_5_6: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Chekli o'nli kasrni quyidagi ikki xil usulda qo'shish mumkin:",
  },
  {
    kind: "MA'LUMOT",
    text: "1. Ustun shaklida qo'shish. Ushbu usulda chekli o'nli kasrlarning butun qismi butun qismiga, verguldan keyingi kasr qismi kasr qismiga qo'shiladi. Agar verguldan keyingi xonalari soni teng bo'lmasa, nollar yozish orqali tenglanib, keyin qo'shiladi.",
  },
  {
    kind: "MA'LUMOT",
    text: "2. Oddiy kasrga o'tkazib qo'shish. Ushbu usulda chekli o'nli kasr avval oddiy kasrga o'tkazilib, keyin qo'shiladi.",
  },
  {
    kind: 'MASALAN',
    text: '3,8 + 6,1 = 3 8/10 + 6 1/10 = 3 + 6 + 8/10 + 1/10 = 9 + 9/10 = 9 9/10 = 9,9',
  },
]

const EXAMPLE_5_6: WorkedItem = {
  prompt: "Berilgan chekli o'nli kasrlarni qo'shing: 1) 3,8 + 6,1   2) 1,3 + 6,47   3) 11,35 + 3,8",
  steps: [
    '1) 3,8 + 6,1 — ustun shaklida: 3,8 + 6,1 = 9,9',
    '2) 1,3 + 6,47 — xonalar soni tenglanadi: 1,30 + 6,47 = 7,77',
    '3) 11,35 + 3,8 — xonalar soni tenglanadi: 11,35 + 3,80 = 14,15',
  ],
  answer: '1) 9,9   2) 7,77   3) 14,15',
}

const EX_5_6: TopicExercise[] = [
  {
    prompt: "Chekli o'nli kasrlarni ustun shaklida qo'shing: 6,5+3,5",
    answer: '10',
  },
  {
    prompt: "Chekli o'nli kasrlarni ustun shaklida qo'shing: 3,56+2,1",
    answer: '5,66',
  },
  {
    prompt: "Chekli o'nli kasrlarni ustun shaklida qo'shing: 4,7+5,32",
    answer: '10,02',
  },
  {
    prompt: "Chekli o'nli kasrlarni ustun shaklida qo'shing: 7,824+2,18",
    answer: '10,004',
  },
  {
    prompt: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish orqali qo'shing: 0,75 + 0,125",
    answer: '0,875',
  },
  {
    prompt: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish orqali qo'shing: 1,5 + 2,7",
    answer: '4,2',
  },
  {
    prompt: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish orqali qo'shing: 24,2 + 0,8",
    answer: '25',
  },
  {
    prompt: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish orqali qo'shing: 19,25 + 8,5",
    answer: '27,75',
  },
  { prompt: "Amaliy qism. Chekli o'nli kasrlarni qo'shing: 0,43+7,24+34,1", answer: '41,77' },
  { prompt: "Amaliy qism. Chekli o'nli kasrlarni qo'shing: 4,05+3,2+8,9", answer: '16,15' },
  { prompt: "Amaliy qism. Chekli o'nli kasrlarni qo'shing: 4,15+20,7+18,5", answer: '43,35' },
  { prompt: "Amaliy qism. Chekli o'nli kasrlarni qo'shing: 29,06+71,904+11,37", answer: '112,334' },
  { prompt: "Amaliy qism. Chekli o'nli kasrlarni qo'shing: 1,29+40,1+2,3", answer: '43,69' },
  { prompt: "Amaliy qism. Chekli o'nli kasrlarni qo'shing: 20,9+15,7+10,71", answer: '47,31' },
]

/* ─────────── 5.7 ─────────── */

const THEORY_5_7: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Chekli o'nli kasrni quyidagi ikki xil usulda ayirish mumkin:",
  },
  {
    kind: "MA'LUMOT",
    text: "1. Ustun shaklida ayirish. Ushbu usulda chekli o'nli kasrlarning butun qismidan butun qismi, verguldan keyingi kasr qismidan kasr qismi ayiriladi. Agar verguldan keyingi xonalari soni teng bo'lmasa, nollar yozish orqali tenglanib, keyin ayiriladi.",
  },
  {
    kind: "MA'LUMOT",
    text: "2. Oddiy kasrga o'tkazib ayirish. Ushbu usulda chekli o'nli kasr avval oddiy kasrga o'tkazilib, keyin ayiriladi.",
  },
  {
    kind: 'MASALAN',
    text: '9,5 − 6,1 = 9 5/10 − 6 1/10 = (9 − 6) + (5/10 − 1/10) = 3 + 4/10 = 3 4/10 = 3,4',
  },
]

/* Kitobda 2-misolning ustuni «27,30 − 9,52 = 14,15» deb bosilgan (xato:
   27,30 − 9,52 = 17,78), 3-misolning ustunida esa «27,45» deb bosilgan
   (masala shartida 24,75). Quyida shartlar kitobdagidek, natijalar esa
   hisob-kitob bilan tekshirilgan holda berilgan. */
const EXAMPLE_5_7: WorkedItem = {
  prompt: "Berilgan chekli o'nli kasrlarni ayiring: 1) 8,9 − 3,6   2) 27,3 − 9,52   3) 24,75 − 0,9",
  steps: [
    '1) 8,9 − 3,6 = 5,3',
    '2) 27,3 − 9,52 — xonalar soni tenglanadi: 27,30 − 9,52 = 17,78',
    '3) 24,75 − 0,9 — xonalar soni tenglanadi: 24,75 − 0,90 = 23,85',
  ],
  answer: '1) 5,3   2) 17,78   3) 23,85',
}

const EX_5_7: TopicExercise[] = [
  {
    prompt: "Chekli o'nli kasrlarni ustun shaklida ayiring: 6,79 − 2,99",
    answer: '3,8',
  },
  {
    prompt: "Chekli o'nli kasrlarni ustun shaklida ayiring: 10,32 − 10,012",
    answer: '0,308',
  },
  {
    prompt: "Chekli o'nli kasrlarni ustun shaklida ayiring: 54,56 − 27,37",
    answer: '27,19',
  },
  {
    prompt: "Chekli o'nli kasrlarni ustun shaklida ayiring: 6,05 − 2,87",
    answer: '3,18',
  },
  {
    prompt: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish orqali ayiring: 7,45 − 4,45",
    answer: '3',
  },
  {
    prompt: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish orqali ayiring: 206,48 − 90,57",
    answer: '115,91',
  },
  {
    prompt: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish orqali ayiring: 11,4 − 6,7",
    answer: '4,7',
  },
  {
    prompt: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish orqali ayiring: 0,343 − 0,051",
    answer: '0,292',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni ayiring: 45,073-16,29",
    answer: '28,783',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni ayiring: 37,496-31,507",
    answer: '5,989',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni ayiring: 161,05-115,0707",
    answer: '45,9793',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni ayiring: 25,2-(16,7-13,9)",
    answer: '22,4',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni ayiring: 3,15-(25,4-24,96)",
    answer: '2,71',
  },
  {
    prompt: "Amaliy qism. Chekli o'nli kasrlarni ayiring: (13,1-9,25)-(4,9-3,15)",
    answer: '2,1',
  },
  {
    prompt: "Amaliy qism. Hisoblang: 73,12-(5,34+13,12)",
    answer: '54,66',
  },
  {
    prompt: "Amaliy qism. Hisoblang: 101,3+(84,7+34,23)",
    answer: '220,23',
  },
  {
    prompt: "Amaliy qism. Hisoblang: (47,28-34,98)+(55,2+3,8)",
    answer: '71,3',
  },
  {
    prompt: "Amaliy qism. Hisoblang: (46,83+15,77)-16,83",
    answer: '45,77',
  },
  {
    prompt: "Amaliy qism. Hisoblang: (3,09+4,08)-(23-20,7)",
    answer: '4,87',
  },
  {
    prompt: "Amaliy qism. Hisoblang: 18-(1,5+0,04)-6,56",
    answer: '9,9',
  },
]

/* ─────────── Bo'limlar ─────────── */

export const TOPIC_5_LESSONS: TopicLesson[] = [
  {
    id: '5.1',
    n: 1,
    title: "O'nli kasrlar va ularning turlari. Chekli va cheksiz o'nli kasrlar",
    goal: "O'nli kasrlar haqida tushunchaga ega bo'lish",
    minutes: 16,
    videos: [
      {
        id: 'Y7vkEwP7HRM',
        title: "O'nli kasrlar va ularning turlari. Chekli va cheksiz o'nli kasrlar (Nazariy qism)",
      },
      {
        id: 'SMURoOsiSgE',
        title: "O'nli kasrlar va ularning turlari. Chekli va cheksiz o'nli kasrlar (Amaliy qism)",
      },
    ],
    theory: THEORY_5_1,
    practice: [],
    exercises: EX_5_1,
  },

  {
    id: '5.2',
    n: 2,
    title: "Chekli o'nli kasrlar. Chekli o'nli kasrlarning yozilishi va o'qilishi",
    goal: "Chekli o'nli kasrlar haqida tushunchaga ega bo'lish",
    minutes: 12,
    videos: [
      {
        id: 'ydWFzq9SGrg',
        title:
          "Chekli o'nli kasrlar. Chekli o'nli kasrlarning yozilishi va o'qilishi (Nazariy qism)",
      },
      {
        id: '5BbaZGnx1kk',
        title:
          "Chekli o'nli kasrlar. Chekli o'nli kasrlarning yozilishi va o'qilishi (Amaliy qism)",
      },
    ],
    theory: THEORY_5_2,
    practice: [],
    exercises: EX_5_2,
  },

  {
    id: '5.3',
    n: 3,
    title: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish",
    goal: "Chekli o'nli kasrlarni oddiy kasrga o'tkazishni o'rganish",
    minutes: 12,
    videos: [
      {
        id: 'RizB_4u1zr0',
        title: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish (Nazariy qism)",
      },
      {
        id: 'tWPCuvf-194',
        title: "Chekli o'nli kasrlarni oddiy kasrga o'tkazish (Amaliy qism)",
      },
    ],
    theory: THEORY_5_3,
    practice: [],
    exercises: EX_5_3,
  },

  {
    id: '5.4',
    n: 4,
    title: "Oddiy kasrlarni chekli o'nli kasrga o'tkazish",
    goal: "Oddiy kasrlarni chekli o'nli kasrga o'tkazishni o'rganish",
    minutes: 20,
    videos: [
      {
        id: 'dX7IhWbsG50',
        title: "Oddiy kasrlarni chekli o'nli kasrga o'tkazish (Nazariy qism)",
      },
      {
        id: 'F9US3E8ul1Q',
        title: "Oddiy kasrlarni chekli o'nli kasrga o'tkazish (Amaliy qism)",
      },
    ],
    theory: THEORY_5_4,
    lists: LISTS_5_4,
    practice: [],
    exercises: EX_5_4,
  },

  {
    id: '5.5',
    n: 5,
    title: "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni taqqoslash",
    goal: "Chekli o'nli kasrlarni taqqoslashni o'rganish",
    minutes: 18,
    videos: [
      {
        id: '2C0fnbumRMY',
        title:
          "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni taqqoslash (Nazariy qism)",
      },
      {
        id: 'dU5r8qjIVqI',
        title:
          "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni taqqoslash (Amaliy qism)",
      },
    ],
    theory: THEORY_5_5,
    properties: [
      {
        name: 'Xossa',
        detail:
          "Har qanday o'nli kasrning kasr qismining o'ng tomoniga bir yoki bir necha nol yozilsa yoki o'chirilsa, uning qiymati o'zgarmaydi.",
        example: '1) 0,16 = 0,160 = 0,16000   2) 1,8 = 1,80 = 1,800 = 1,8000',
      },
    ],
    example: EXAMPLE_5_5,
    practice: [],
    exercises: EX_5_5,
  },

  {
    id: '5.6',
    n: 6,
    title: "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni qo'shish",
    goal: "Chekli o'nli kasrlarni qo'shishni o'rganish",
    minutes: 14,
    videos: [
      {
        id: 'TjbMRVaDSg0',
        title:
          "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni qo'shish (Nazariy qism)",
      },
      {
        id: 'P7S7jSECEqk',
        title:
          "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni qo'shish (Amaliy qism)",
      },
    ],
    theory: THEORY_5_6,
    example: EXAMPLE_5_6,
    practice: [],
    exercises: EX_5_6,
  },

  {
    id: '5.7',
    n: 7,
    title: "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni ayirish",
    goal: "Chekli o'nli kasrlarni ayirishni o'rganish",
    minutes: 16,
    videos: [
      {
        id: 'Ar-JuSx67uc',
        title:
          "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni ayirish (Nazariy qism)",
      },
      {
        id: '_MU52Dyb2AI',
        title:
          "Chekli o'nli kasrlar ustida amallar. Chekli o'nli kasrlarni ayirish (Amaliy qism)",
      },
    ],
    theory: THEORY_5_7,
    example: EXAMPLE_5_7,
    practice: [],
    exercises: EX_5_7,
  },
]

/* ─────────── Yakuniy test ─────────── */

export const TOPIC_5_TEST: TopicTest = {
  id: '5.8',
  n: 8,
  title: 'Mavzu 5 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't5-01',
      prompt: "Qanday o'nli kasrlar chekli o'nli kasrlar deyiladi?",
      options: [
        "Maxrajida 2 va 5 dan tashqari boshqa tub sonlar qatnashgan kasrlar",
        "Maxraji faqat 2 va 5 ning ko'paytmasidan (2 ning yoki 5 ning darajasi bo'lsa ham) tashkil topgan kasrlar",
        'Surati 10 ga bo\'linadigan kasrlar',
        "Verguldan keyin cheksiz davom etadigan kasrlar",
      ],
      correct: 1,
      explain:
        "Ta'rifga ko'ra, maxraji faqat 2 va 5 ning ko'paytmasidan tashkil topgan o'nli kasrlar chekli o'nli kasrlar deyiladi. Maxrajda 2 va 5 dan boshqa tub son qatnashsa, kasr cheksiz o'nli kasr bo'ladi.",
    },
    {
      id: 't5-02',
      prompt: "Qaysi kasr chekli o'nli kasrga aylanadi?",
      options: ['1/3', '1/6', '1/20', '1/7'],
      correct: 2,
      explain:
        "1/20 = 1/(2²·5), ya'ni maxrajda faqat 2 va 5 qatnashadi — chekli. 1/3, 1/6 va 1/7 ning maxrajlarida 2 va 5 dan boshqa tub son bor, ular cheksiz o'nli kasrlardir.",
    },
    {
      id: 't5-03',
      prompt: '0,45 soni qanday o\'qiladi?',
      options: [
        "nol butun o'ndan qirq besh",
        "nol butun yuzdan qirq besh",
        'qirq besh butun yuzdan',
        "nol butun mingdan qirq besh",
      ],
      correct: 1,
      explain:
        "Verguldan keyin ikki xona bo'lgani uchun kasr qismi «yuzdan» deb o'qiladi: 0,45 — nol butun yuzdan qirq besh.",
    },
    {
      id: 't5-04',
      prompt: "0,36 chekli o'nli kasrni oddiy kasrga o'tkazing.",
      options: ['36/10', '36/100', '3/6', '36/1000'],
      correct: 1,
      explain:
        "Verguldan keyin ikki xona bor, demak maxrajda 10 ning ikkinchi darajasi bo'ladi: 0,36 = 36/100.",
    },
    {
      id: 't5-05',
      prompt: "0,008 chekli o'nli kasrni oddiy kasrga o'tkazing.",
      options: ['8/10', '8/100', '8/1000', '800/1000'],
      correct: 2,
      explain:
        "Verguldan keyin uch xona bor, shuning uchun maxraj 1000 bo'ladi: 0,008 = 8/1000.",
    },
    {
      id: 't5-06',
      prompt: "3/4 oddiy kasrni chekli o'nli kasrga o'tkazing.",
      options: ['0,34', '0,75', '0,43', '0,35'],
      correct: 1,
      explain:
        "Surat va maxrajni 25 ga ko'paytiramiz: 3/4 = (3·25)/(4·25) = 75/100 = 0,75.",
    },
    {
      id: 't5-07',
      prompt: "1/8 oddiy kasrni chekli o'nli kasrga o'tkazing.",
      options: ['0,18', '0,8', '0,125', '1,8'],
      correct: 2,
      explain:
        "Surat va maxrajni 125 ga ko'paytiramiz: 1/8 = (1·125)/(8·125) = 125/1000 = 0,125.",
    },
    {
      id: 't5-08',
      prompt: "Taqqoslang: 5,876 va 5,869",
      options: ['5,876 < 5,869', '5,876 > 5,869', '5,876 = 5,869', "Taqqoslab bo'lmaydi"],
      correct: 1,
      explain:
        "Butun qismlar (5 = 5) va verguldan keyingi birinchi xonalar (8 = 8) teng, ikkinchi xonada 7 > 6, demak 5,876 > 5,869.",
    },
    {
      id: 't5-09',
      prompt: "0,16 = 0,160 = 0,16000 tenglik qaysi xossaga asoslanadi?",
      options: [
        "Kasr qismining o'ng tomoniga nol yozilsa yoki o'chirilsa, kasrning qiymati o'zgarmaydi",
        "Nol qo'shilsa, kasrning qiymati 10 marta ortadi",
        "Verguldan keyingi nollar faqat butun qismga ta'sir qiladi",
        "Har qanday o'nli kasr faqat bitta ko'rinishda yoziladi",
      ],
      correct: 0,
      explain:
        "Xossaga ko'ra, o'nli kasrning kasr qismining o'ng tomoniga bir yoki bir necha nol yozilsa yoki o'chirilsa, uning qiymati o'zgarmaydi.",
    },
    {
      id: 't5-10',
      prompt: "Hisoblang: 3,8 + 6,1",
      options: ['9,9', '10,9', '9,19', '99'],
      correct: 0,
      explain:
        "Butun qismlar: 3 + 6 = 9, kasr qismlar: 8/10 + 1/10 = 9/10, demak 3,8 + 6,1 = 9,9.",
    },
    {
      id: 't5-11',
      prompt: "Hisoblang: 27,3 − 9,52",
      options: ['17,78', '18,22', '17,68', '16,78'],
      correct: 0,
      explain:
        "Xonalar sonini tenglaymiz: 27,30 − 9,52. Butun qism: 27 − 9 = 18, kasr qism: 30 − 52 o'tish bilan 17,78 hosil bo'ladi.",
    },
    {
      id: 't5-12',
      prompt: "Hisoblang: 0,43 + 7,24 + 34,1",
      options: ['41,77', '40,77', '42,77', '41,67'],
      correct: 0,
      explain:
        "0,43 + 7,24 = 7,67; 7,67 + 34,10 = 41,77. Xonalar sonini tenglab, ustun shaklida qo'shiladi.",
    },
  ],
}

export const TOPIC_5_PASS = 7
