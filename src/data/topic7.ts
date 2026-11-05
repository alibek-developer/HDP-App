import type { TopicLesson, TopicTest, TheoryBlock, WorkedItem, TopicExercise } from './topicTypes'

/**
 * MAVZU 7 — «Sonlar ustida to'rt amalga oid misollar» (7.1–7.5).
 *
 * Manba: kitobning 7-bob nazariy qismi (7.1–7.5) va «Amaliy qism».
 * Har bir bo'lim sarlavhasi, «Maqsad», «Amallar ketma-ketligi», «MISOL /
 * YECHISH» va mashqlar kitobdagi matn bo'yicha ko'chirilgan. Mashq javobi
 * faqat kitobda bosilgan yoki aniq hisob-kitob bilan tasdiqlangan holatda
 * qo'shilgan.
 *
 * `TOPIC_7_TEST` — 7.6, mavzu yakuniy 12 savolli testi.
 */

export const TOPIC_7_META = {
  id: 'mavzu-7',
  num: 7,
  chapter: "Sonlar ustida to'rt amalga oid misollar",
  title: "Mavzu 7. To'rt amalga oid misollar",
  lessonCount: 5,
}

/* ─────────── 7.1 ─────────── */

const EXAMPLE_7_1: WorkedItem = {
  prompt: 'Hisoblang: (510 : 17 + 24) : (38 − 80 : 4)',
  steps: [
    'Birinchi qavs ichidagi amallar: 510 : 17 = 30, 30 + 24 = 54',
    'Ikkinchi qavs ichidagi amallar: 80 : 4 = 20, 38 − 20 = 18',
    "Birinchi va ikkinchi qavs orasidagi bo'lish amali: 54 : 18 = 3",
  ],
  answer: '3',
}

const EX_7_1: TopicExercise[] = [
  { prompt: 'Amallarni bajaring: 7 · 8 + 24 : (81 − 69)', answer: '58' },
  { prompt: 'Amallarni bajaring: (6 · 3 − 3 · 4) : 2 − 2 · (5 · 4 − 4 · 3) : 8', answer: '1' },
  { prompt: 'Amallarni bajaring: 1027 − (428 + 17 · 18 + (78 − 56) · 9)', answer: '95' },
  { prompt: 'Hisoblang: 24 − 21 : 3 + 3 · 2', answer: '23' },
  { prompt: 'Hisoblang: 20 − 16 : 4 + 1 · 2', answer: '18' },
  { prompt: 'Hisoblang: 45 − 35 : 5 − 4 · 2', answer: '30' },
  { prompt: 'Hisoblang: 26 − 6 : 2 − 4 · 2', answer: '15' },
  { prompt: 'Hisoblang: 32 : 4² + 4 · 3 − 2 · 6', answer: '2' },
  { prompt: 'Hisoblang: 6² : 3² + 4 · 3 − 3 · 5', answer: '1' },
  { prompt: 'Amallarni bajaring: 831 + 5865 : (22 · 29 − 13 · 19) − 87', answer: '759' },
  { prompt: 'Amallarni bajaring: (3915 : 87 + 867) − (18 · 15 − 1305 : 29)', answer: '687' },
  { prompt: 'Amallarni bajaring: (24 · 7 − 676 : 13) · 13 − 238', answer: '1270' },
  { prompt: 'Amallarni bajaring: (31 · 9 − 754 : 29) · (1323 : 27 − 31)', answer: '4554' },
]

/* ─────────── 7.2 ─────────── */

const EXAMPLE_7_2: WorkedItem = {
  prompt: 'Amallarni bajaring: (1 8/13 · 13/42 + 5 5/7 : 8/21) : (8 1/8 + 3 1/2)',
  steps: [
    'Birinchi qavs ichidagi amallar: 1 8/13 · 13/42 = 21/13 · 13/42 = 1/2; 5 5/7 : 8/21 = 40/7 · 21/8 = 15; 1/2 + 15 = 15 1/2',
    'Ikkinchi qavs ichidagi amallar: (8 1/8 + 3 1/2) = (8 + 3) + (1/8 + 1/2) = 11 + 5/8 = 11 5/8',
    "Birinchi va ikkinchi qavs orasidagi bo'lish amali: 15 1/2 : 11 5/8 = 31/2 : 93/8 = 31/2 · 8/93 = 4/3 = 1 1/3",
  ],
  answer: '1 1/3',
}

const EX_7_2: TopicExercise[] = [
  { prompt: 'Hisoblang: 5 4/19 · 3 4/7 + 1 15/19 : 7/25 − 1 2/3', answer: '23 1/3' },
  {
    prompt: 'Hisoblang: (2020 7/8 − 2019 3/8) : (2019 1/3 − 2018 5/6)',
    answer: '3',
  },
  {
    prompt: 'Hisoblang: (251 2/5 − 249 1/2) : 1 4/15 + 2 3/5 : 2 4/11',
    answer: '2 3/5',
  },
  {
    prompt: 'Amallarni bajaring: 1 1/2 · 3 3/5 + 2 3/4 · 3 3/5 − 3 3/5 · 3 5/6 − 1 1/2',
    answer: '0',
  },
  { prompt: 'Amallarni bajaring: (4 1/10 − 3 4/15) : 5/6 + 4 1/10 : 8 1/5', answer: '1 1/2' },
  { prompt: 'Amallarni bajaring: (8 1/2 − 6 3/4) : 1/8 + 11 3/7', answer: '25 3/7' },
  {
    prompt: 'Amallarni bajaring: 10 − 2 1/2 : 3 3/4 + (2 1/2 − 1 4/9) · 6',
    answer: '15 2/3',
  },
  { prompt: 'Amallarni bajaring: (2 + 2/3 − 1/2) · 6 + (8/21 + 1/3 − 5/7) · 21', answer: '13' },
  {
    prompt: 'Amallarni bajaring: 2 3/5 : 6 1/15 + 1 1/14 − 1 39/73 · (5 5/7 − 5 1/16)',
    answer: '1/2',
  },
]

/* ─────────── 7.3 ─────────── */

const THEORY_7_3: TheoryBlock[] = [
  {
    kind: 'ESLATISH',
    text: "O'nli kasrlar ustida amal bajarganda ularni oddiy kasrlarga o'tkazib amal bajarilsa ishimiz yanada osonlashadi va xatolik kamayadi. Shuning uchun o'nli kasrlar ustida amal bajarishdan oldin, ularni oddiy kasr ko'rinishiga keltirib, keyin amal bajargan yaxshiroq.",
  },
]

const EXAMPLE_7_3: WorkedItem = {
  prompt:
    'Amallarni bajaring: (0,725 + 0,6 + 7/40 + 11/20) / (0,128 · 6 1/4 − 0,0345 : 3/25)',
  steps: [
    "Kasrning suratidagi o'nli kasrlarni qo'shib, natijani oddiy kasr ko'rinishiga keltiramiz va qolgan oddiy kasrlar bilan yig'indisini hisoblaymiz: 0,725 + 0,6 = 1,325 = 1 325/1000 = 1 13/40 = 53/40; 53/40 + 7/40 + 22/40 = 82/40 = 41/20 = 2 1/20",
    "Maxrajidagi o'nli hamda aralash kasrlarni oddiy kasrga o'tkazib, keyin amal bajaramiz: 0,128 · 6 1/4 = 128/1000 · 25/4 = 4/5; 0,0345 : 3/25 = 345/10000 : 3/25 = 69/2000 · 25/3 = 23/80; 4/5 − 23/80 = 64/80 − 23/80 = 41/80",
    "Suratning natijasini maxrajning natijasiga bo'lamiz: 41/20 : 41/80 = 41/20 · 80/41 = 4",
  ],
  answer: '4',
}

const EX_7_3: TopicExercise[] = [
  {
    prompt: 'Amallarni bajaring: (0,34 · 1,25 + 2,42 · 0,85) / (5,61 · 0,2 + 1,7 · 0,8)',
    answer: '1',
  },
  {
    prompt: 'Amallarni bajaring: 0,13/0,00013 + 0,02/0,0005 − 0,7/0,0014',
    answer: '540',
  },
  {
    prompt: 'Amallarni bajaring: (4,25 : 0,85 + 0,5) / ((5,56 − 4,06) : 3)',
    answer: '11',
  },
  {
    prompt: 'Qulay usul bilan hisoblang: (58,4 · 31,2 − 27,2) / (31,2 + 58,4 · 30,2)',
    answer: '1',
  },
  { prompt: 'Hisoblang: (0,11/0,2 + 0,2/0,11) · 22/52,1', answer: '1' },
  {
    prompt: 'Hisoblang: 0,429/0,03 + 0,128/0,08 + 0,0096/0,012',
    answer: '16,7',
  },
  {
    prompt: 'Hisoblang: (0,34 · 1,25 + 2,42 · 0,85) / (5,61 · 0,2 + 1,7 · 0,8)',
    answer: '1',
  },
  { prompt: 'Hisoblang: (3,2 · 1,4 · 5,4) / (4,2 · 7,2 · 1,2)', answer: '2/3' },
  {
    prompt: 'Hisoblang: 4,2 · 15,5 − 9,7 · 4,2 − 5,8 · 9,7 + 15,5 · 5,8',
    answer: '58',
  },
  {
    prompt: 'Hisoblang: 16 · 0,99 · 25 · 2,5 + 411 + 57 · 5 · 0,4 · 25 · 4/19',
    answer: '2001',
  },
]

/* ─────────── 7.4 ─────────── */

const THEORY_7_4: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Cheksiz davriy o'nli kasrlar ustida amal bajarishdan oldin, berilgan davriy kasrlar oddiy kasrlarga o'tkazilib, keyin amallar bajariladi. Amallar bajarilish ketma-ketligi esa boshqa turdagi kasrlarniki bilan bir xil bo'ladi.",
  },
]

const EXAMPLE_7_4: WorkedItem = {
  prompt: 'Hisoblang: (0,(2) + 3,6(1)) / (1,91(6) − 1,8(3)) · 1,4(9) − 69',
  steps: [
    'Kasrning suratidagi amallar: 0,(2) + 3,6(1) = 2/9 + 3 (61 − 6)/90 = 2/9 + 3 55/90 = 20/90 + 3 + 55/90 = 3 + 75/90 = 3 + 5/6 = 3 5/6',
    'Kasrning maxrajidagi amallar: 1,91(6) − 1,8(3) = 1 (916 − 91)/900 − 1 (83 − 8)/90 = 1 825/900 − 1 75/90 = 1 11/12 − 1 5/6 = (1 − 1) + (11/12 − 10/12) = 1/12',
    "Surat va maxraj orasidagi bo'lish amali: 3 5/6 : 1/12 = 23/6 · 12/1 = 46",
    "Ko'paytirish amali: 46 · 1 (49 − 4)/90 = 46 · 1 45/90 = 46 · 1 1/2 = 46 · 3/2 = 69",
    'Ayirish amali: 69 − 69 = 0',
  ],
  answer: '0',
}

const EX_7_4: TopicExercise[] = [
  {
    prompt:
      'Amallarni bajaring: 0,4(3) + 0,6(2) : 1,(5) − 1,8(3)/0,5(8) · 50/53',
  },
  { prompt: 'Amallarni bajaring: (0,(47) − 0,(31)) : 0,(2) + 2,(23)', answer: '2 95/99' },
  {
    prompt:
      'Amallarni bajaring: (0,(1) + 0,(13) + 0,(19)) / (0,(5) + 0,(65) + 0,(95)) + 0,(9)',
    answer: '1 1/5',
  },
  { prompt: 'Hisoblang: 0,(1)/0,(5) + 0,(13)/0,(65) + 0,(19)/0,(95)', answer: '3/5' },
  {
    prompt: 'Hisoblang: (0,(1) + 0,(13) + 0,(19)) / (0,(6) + 0,(55) + 0,(95))',
    answer: '43/216',
  },
  { prompt: 'Hisoblang: 0,(2) + 1/(1,(9) + 2 1/2)', answer: '4/9' },
  { prompt: 'Hisoblang: 1/0,(2) + 1/0,(4) + 1/0,(6)', answer: '8 1/4' },
  { prompt: 'Hisoblang: (2,(41) + 3,(14)) : 0,(5)', answer: '10' },
  { prompt: 'Hisoblang: (0,(8) − 0,(35)) : 0,(1)', answer: '4 9/11' },
]

/* ─────────── 7.5 ─────────── */

const EXAMPLE_7_5: WorkedItem = {
  prompt: 'Hisoblang: (1,75 · 8/9 − 1 3/4 · 0,(6)) : 7/12 + 2,8(3)',
  steps: [
    '1,75 · 8/9 − 1 3/4 · 0,(6) = 1 3/4 · 8/9 − 1 3/4 · 6/9 = 1 3/4 · (8/9 − 6/9) = 7/4 · 2/9 = 7/18',
    '7/18 : 7/12 = 7/18 · 12/7 = 2/3',
    '2/3 + 2 (83 − 8)/90 = 2/3 + 2 75/90 = 2/3 + 2 5/6 = 2 + 5/6 + 4/6 = 2 + 9/6 = 2 + 3/2 = 2 + 1 1/2 = 3 1/2 = 3,5',
  ],
  answer: '3 1/2 = 3,5',
}

const EX_7_5: TopicExercise[] = [
  {
    prompt:
      'Amallarni bajaring: 2,1 · (0,(3) + 0,(6)) / ((4 2/5 : 6 1/3 − 5 19/21 · 4,4) · 5/22)',
  },
  {
    prompt: 'Amallarni bajaring: 2,(3) + 5 1/3 : (6 3/4 · 1 1/3 − 8 1/9)',
    answer: '8 1/3',
  },
  {
    prompt:
      'Amallarni bajaring: ((2 38/45 − 1/15) : 13 8/9 + 3 3/65 · 0,(26)) / ((18 1/2 − 13,(7)) · 1/85)',
    answer: '18',
  },
  {
    prompt:
      'Amallarni bajaring: ((0,(5) + 0,(1)) / (2/3)) · 10 − 2 1/2 : 3 3/4 + (2 1/2 − 1 4/9) · 3',
    answer: '12 1/2',
  },
  {
    prompt:
      'Amallarni bajaring: (0,(4) · 0,525 · 6,3 + 2,7 · 0,24 · 0,(5)) / (4/5 · 2 1/2 + 8,3 · 0,2)',
    answer: '0,5',
  },
  {
    prompt:
      'Amallarni bajaring: ((0,(6) + 1/5) : 0,25) / (0,12(3) : 0,0925) + 12,5 · 0,64',
    answer: '10,6',
  },
  {
    prompt:
      'Amallarni bajaring: ((7 − 6,35) : 6,5 + 9,8(9)) · 1/128 / ((1,2 : 36 + 1 1/5 : 0,25 − 1,8(3)) · 1 1/4)',
    answer: '1/48',
  },
]

/* ─────────── Bo'limlar ─────────── */

export const TOPIC_7_LESSONS: TopicLesson[] = [
  {
    id: '7.1',
    n: 1,
    title: "Natural sonlar ustida to'rt amalga oid misollar yechish",
    goal: "Natural sonlar ustida to'rt amalga oid misollar yechishni o'rganish",
    minutes: 14,
    videos: [
      {
        id: 'FCowNU6eUro',
        title: "Natural sonlar ustida to'rt amalga oid misollar yechish (Nazariy qism)",
      },
      {
        id: 'KV-zeL47kIo',
        title: "Natural sonlar ustida to'rt amalga oid misollar yechish (Amaliy qism)",
      },
    ],
    theory: [],
    lists: [
      {
        caption:
          "Natural sonlar ustida amal bajarganda, bir ifodada bir necha amallar birgalikda kelsa, amallarni bajarish ketma-ketligi quyidagi darajalarga bo'linadi:",
        items: [
          "Qavs ichidagi amallar ketma-ketlikda bajariladi;",
          "Ketma-ketlikda ko'paytirish va bo'lish amallari bajariladi;",
          "Ketma-ketlikda qo'shish va ayirish amallari bajariladi",
        ],
      },
    ],
    example: EXAMPLE_7_1,
    practice: [],
    exercises: EX_7_1,
  },

  {
    id: '7.2',
    n: 2,
    title: "Oddiy kasrlar ustida to'rt amalga oid misollar yechish",
    goal: "Oddiy kasrlar ustida to'rt amalga oid misollar yechishni o'rganish",
    minutes: 18,
    videos: [
      {
        id: 'ru0eHEgEH9w',
        title: "Oddiy kasrlar ustida to'rt amalga oid misollar yechish (Nazariy qism)",
      },
    ],
    theory: [],
    lists: [
      {
        caption:
          "Oddiy kasrlar ustida amal bajarganda, bir ifodada bir necha amallar birgalikda kelsa, amallarni bajarish ketma-ketligi quyidagi darajalarga bo'linadi:",
        items: [
          "Qavs ichidagi amallar ketma-ketlikda bajariladi;",
          "Ketma-ketlikda ko'paytirish va bo'lish amallari bajariladi;",
          "Ketma-ketlikda qo'shish va ayirish amallari bajariladi",
        ],
      },
    ],
    example: EXAMPLE_7_2,
    practice: [],
    exercises: EX_7_2,
  },

  {
    id: '7.3',
    n: 3,
    title: "Chekli o'nli kasrlar ustida to'rt amalga oid misollar yechish",
    goal: "Chekli o'nli kasrlar ustida to'rt amalga oid misollar yechishni o'rganish",
    minutes: 16,
    videos: [
      {
        id: 'RXQVsKn45o0',
        title: "Chekli o'nli kasrlar ustida to'rt amalga oid misollar yechish (Nazariy qism)",
      },
      {
        id: 'KV-zeL47kIo',
        title: "Chekli o'nli kasrlar ustida to'rt amalga oid misollar yechish (Amaliy qism)",
      },
    ],
    theory: THEORY_7_3,
    lists: [
      {
        caption:
          "O'nli kasrlar ustida amal bajarganda, bir ifodada bir necha amallar birgalikda kelsa, amallarni bajarish ketma-ketligi quyidagi darajalarga bo'linadi:",
        items: [
          'Qavs ichidagi amallar ketma-ketlikda bajariladi;',
          "Ketma-ketlikda ko'paytirish va bo'lish amallari bajariladi;",
          "Ketma-ketlikda qo'shish va ayirish amallari bajariladi",
        ],
      },
    ],
    example: EXAMPLE_7_3,
    practice: [],
    exercises: EX_7_3,
  },

  {
    id: '7.4',
    n: 4,
    title: "Cheksiz davriy o'nli kasrlar ustida to'rt amalga oid misollar yechish",
    goal: "Davriy kasrlar ustida to'rt amalga oid misollar yechishni o'rganish",
    minutes: 20,
    videos: [
      {
        id: 'jOAAfsrbaX4',
        title:
          "Cheksiz davriy o'nli kasrlar ustida to'rt amalga oid misollar yechish (Nazariy qism)",
      },
      {
        id: 'XHPWq9bNUsU',
        title:
          "Cheksiz davriy o'nli kasrlar ustida to'rt amalga oid misollar yechish (Amaliy qism)",
      },
    ],
    theory: THEORY_7_4,
    example: EXAMPLE_7_4,
    practice: [],
    exercises: EX_7_4,
  },

  {
    id: '7.5',
    n: 5,
    title: "Barcha kasrlar ustida to'rt amalga oid misollar yechish",
    goal: "Barcha kasrlar ustida to'rt amalga oid misollar yechishni o'rganish",
    minutes: 20,
    videos: [
      {
        id: 'xJktJcUTqec',
        title: "Barcha kasrlar ustida to'rt amalga oid misollar yechish (Nazariy qism)",
      },
      {
        id: '9M1srEcVjKU',
        title: "Barcha kasrlar ustida to'rt amalga oid misollar yechish (Amaliy qism)",
      },
    ],
    theory: [],
    lists: [
      {
        caption:
          "Barcha turdagi kasrlar ustida bir vaqtning o'zida amal bajarganda, ifodada aralash, chekli o'nli va davriy kasrlar birgalikda kelsa, amallarni bajarish ketma-ketligi quyidagi tartibda amalga oshiriladi:",
        items: [
          "Aralash kasrlar noto'g'ri kasrlarga o'tkaziladi;",
          'Chekli o\'nli kasrlar oddiy kasrlarga o\'tkaziladi;',
          "Davriy o'nli kasrlar oddiy kasrlarga o'tkaziladi va keyin amallar bajariladi.",
        ],
      },
    ],
    example: EXAMPLE_7_5,
    practice: [],
    exercises: EX_7_5,
  },
]

/* ─────────── Yakuniy test ─────────── */

export const TOPIC_7_TEST: TopicTest = {
  id: '7.6',
  n: 6,
  title: 'Mavzu 7 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't7-01',
      prompt: 'Amallar bajarilish ketma-ketligida birinchi navbatda qanday amallar bajariladi?',
      options: [
        'Qavs ichidagi amallar',
        "Ko'paytirish va bo'lish amallari",
        "Qo'shish va ayirish amallari",
        "Barcha amallar chapdan o'ngga",
      ],
      correct: 0,
      explain:
        "Ketma-ketlik quyidagicha: avval qavs ichidagi amallar, so'ng ko'paytirish va bo'lish, oxirida qo'shish va ayirish amallari bajariladi.",
    },
    {
      id: 't7-02',
      prompt: 'Hisoblang: (510 : 17 + 24) : (38 − 80 : 4)',
      options: ['27', '3', '5', '18'],
      correct: 1,
      explain: '510 : 17 = 30, 30 + 24 = 54; 80 : 4 = 20, 38 − 20 = 18; 54 : 18 = 3.',
    },
    {
      id: 't7-03',
      prompt: 'Hisoblang: 7 · 8 + 24 : (81 − 69)',
      options: ['60', '112', '58', '68'],
      correct: 2,
      explain: "Avval qavs: 81 − 69 = 12, keyin 24 : 12 = 2 va 7 · 8 = 56; 56 + 2 = 58.",
    },
    {
      id: 't7-04',
      prompt: 'Hisoblang: 1027 − (428 + 17 · 18 + (78 − 56) · 9)',
      options: ['86', '105', '120', '95'],
      correct: 3,
      explain:
        '78 − 56 = 22, 22 · 9 = 198, 17 · 18 = 306; qavs ichida 428 + 306 + 198 = 932; 1027 − 932 = 95.',
    },
    {
      id: 't7-05',
      prompt: 'Hisoblang: 1 8/13 · 13/42 + 5 5/7 : 8/21',
      options: ['15 1/2', '16', '15', '15 1/3'],
      correct: 0,
      explain:
        '1 8/13 · 13/42 = 21/13 · 13/42 = 1/2; 5 5/7 : 8/21 = 40/7 · 21/8 = 15; 1/2 + 15 = 15 1/2.',
    },
    {
      id: 't7-06',
      prompt: 'Hisoblang: (2020 7/8 − 2019 3/8) : (2019 1/3 − 2018 5/6)',
      options: ['1/2', '3', '2', '1 1/2'],
      correct: 1,
      explain:
        '2020 7/8 − 2019 3/8 = 1 1/2 = 3/2, 2019 1/3 − 2018 5/6 = 1/2; 3/2 : 1/2 = 3.',
    },
    {
      id: 't7-07',
      prompt: "0,725 + 0,6 yig'indini oddiy kasr ko'rinishida yozing.",
      options: ['53/40', '13/40', '325/1000', '41/20'],
      correct: 0,
      explain: '0,725 + 0,6 = 1,325 = 1 325/1000 = 1 13/40 = 53/40.',
    },
    {
      id: 't7-08',
      prompt: 'Hisoblang: 0,0345 : 3/25',
      options: ['23/8', '23/80', '69/2000', '3/80'],
      correct: 1,
      explain: '0,0345 : 3/25 = 345/10000 : 3/25 = 69/2000 · 25/3 = 23/80.',
    },
    {
      id: 't7-09',
      prompt: "0,(2) davriy kasrni oddiy kasr ko'rinishida yozing.",
      options: ['2/10', '9/2', '2/9', '20/99'],
      correct: 2,
      explain: "Bir xonali davr uchun davr 9 ga bo'linadi: 0,(2) = 2/9.",
    },
    {
      id: 't7-10',
      prompt: "1,8(3) davriy kasrni oddiy kasr ko'rinishida yozing.",
      options: ['18/10', '83/45', '1 4/5', '11/6'],
      correct: 3,
      explain: "1,8(3) = 1 (83 − 8)/90 = 1 75/90 = 1 5/6 = 11/6.",
    },
    {
      id: 't7-11',
      prompt: 'Hisoblang: (0,(1) + 0,(13) + 0,(19)) / (0,(5) + 0,(65) + 0,(95))',
      options: ['1/5', '1/2', '3/5', '2/5'],
      correct: 0,
      explain:
        'Surat: 11/99 + 13/99 + 19/99 = 43/99; maxraj: 55/99 + 65/99 + 95/99 = 215/99; 43/215 = 1/5.',
    },
    {
      id: 't7-12',
      prompt: 'Hisoblang: 2,(3) + 5 1/3 : (6 3/4 · 1 1/3 − 8 1/9)',
      options: ['7 1/3', '9', '8 1/3', '6 1/3'],
      correct: 2,
      explain:
        '6 3/4 · 1 1/3 = 9, 9 − 8 1/9 = 8/9; 5 1/3 : 8/9 = 6; 2,(3) = 2 1/3; 6 + 2 1/3 = 8 1/3.',
    },
  ],
}

export const TOPIC_7_PASS = 7
