import type { TopicLesson, TopicTest } from './topicTypes'

/**
 * MAVZU 9 — «Ratsional sonlar va ular ustida amallar».
 *
 * Kitobning 75–78-betlari (fayldagi p78–p81) transkripsiyasi:
 * 9.1–9.4 nazariy qism, 9.1–9.4 amaliy qism va «O'zingizni sinab ko'ring!»
 * topshiriqlari. Hech bir ta'rif, misol yoki javob o'ylab qo'shilmagan.
 *
 * 9.2 bo'limining video havolasi kitobda bo'sh (chiziqli joy qoldirilgan),
 * shu sababli o'sha darsda `videos` bo'sh qoldirilgan — id o'ylab topilmagan.
 */

export const TOPIC_9_META = {
  id: 'mavzu-9',
  num: 9,
  chapter: "Ratsional sonlar va ular ustida amallar",
  title: 'Mavzu 9. Ratsional sonlar',
  lessonCount: 4,
}

export const TOPIC_9_LESSONS: TopicLesson[] = [
  {
    id: '9.1',
    n: 1,
    title: 'Ratsional sonlar haqida tushuncha',
    goal: "Ratsional sonlar haqida tushunchaga ega bo'lish",
    minutes: 12,
    videos: [
      { id: '-v5BeezsF2E', title: '9.1 Ratsional sonlar haqida tushuncha (Nazariy qism)' },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Ikkita butun sonning bo'linmasi ko'rinishida ifodalab bo'ladigan har qanday sonlarga ratsional sonlar deyiladi. Lekin maxrajdagi son albatta natural son bo'lishi kerak. Demak, shunga ko'ra ratsional sonlarga quyidagicha ta'rif berish mumkin:",
      },
      {
        kind: "TA'RIF",
        text: "m/n ko'rinishida ifodalab bo'ladigan sonlarga ratsional sonlar deyiladi. Bu yerda m — butun son, n esa natural son.",
      },
    ],
    example: {
      prompt: 'Quyidagi sonlarni ratsional son ko\'rinishida ifodalang: 1) 3   2) −0,3   3) 1,2(7)',
      steps: ['1) 3 = 3/1', '2) −0,3 = −3/10 = −3/10', '3) 1,2(7) = 1 25/90 = 1 5/18 = 23/18'],
      answer: '1) 3/1   2) −3/10   3) 23/18',
    },
    practice: [],
    exercises: [
      {
        prompt: "Quyidagi berilgan kasrlarni ratsional son ko'rinishida tasvirlang: 1) −0,(3)",
        answer: '−1/3',
      },
      {
        prompt: "Quyidagi berilgan kasrlarni ratsional son ko'rinishida tasvirlang: 2) 3 1/7",
        answer: '22/7',
      },
      {
        prompt: "Quyidagi berilgan kasrlarni ratsional son ko'rinishida tasvirlang: 3) 2,743",
        answer: '2743/1000',
      },
      {
        prompt: "Quyidagi berilgan kasrlarni ratsional son ko'rinishida tasvirlang: 4) −7 1/3",
        answer: '−22/3',
      },
      {
        prompt: "Quyidagi berilgan sonlarni ratsional son ko'rinishida tasvirlang: 1) −3 2/7",
        answer: '−23/7',
      },
      {
        prompt: "Quyidagi berilgan sonlarni ratsional son ko'rinishida tasvirlang: 2) −3,3",
        answer: '−33/10',
      },
      {
        prompt: "Quyidagi berilgan sonlarni ratsional son ko'rinishida tasvirlang: 3) 2 2/3",
        answer: '8/3',
      },
      {
        prompt: "Quyidagi berilgan sonlarni ratsional son ko'rinishida tasvirlang: 4) 3 1/7",
        answer: '22/7',
      },
      {
        prompt: "Quyidagi berilgan sonlarni ratsional son ko'rinishida tasvirlang: 5) 2,7(4)",
        answer: '247/90',
      },
      {
        prompt: "Quyidagi berilgan sonlarni ratsional son ko'rinishida tasvirlang: 6) −7,(3)",
        answer: '−22/3',
      },
    ],
  },

  {
    id: '9.2',
    n: 2,
    title: "Ratsional sonlar ustida amallar. Ratsional sonlarni qo'shish va ayirish",
    goal: "Ratsional sonlar ustida qo'shish va ayirish amalini bajarib bilish",
    minutes: 15,
    videos: [],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Ratsional sonlar ustida amal bajarish kasrlar ustida amal bajarish bilan bir xil bo'ladi, ya'ni: agar ifodadagi sonlar natural, aralash yoki chekli va cheksiz o'nli kasrlardan iborat bo'lsa, avval ular oddiy kasr ko'rinishiga keltirilib, keyin amallar bajariladi.",
      },
      {
        kind: 'MASALAN',
        text: "1. Ratsional sonlarni qo'shish: −5/7 + 8/21 = −5/7 + 8/21 = −15/21 + 8/21 = (−15+8)/21 = −7/21 = −1/3",
      },
    ],
    example: {
      prompt: 'Ifodaning qiymatini toping: −3/15 + 1/5 − 1/3',
      steps: [
        '−3/15 + 1/5 − 1/3 = −3/15 + 3/15 − 5/15',
        '= (−3+3−5)/15 = −5/15',
        '= −1/3',
      ],
      answer: '−1/3',
    },
    practice: [],
    exercises: [
      {
        prompt: 'Hisoblang: (6 2/7 − 2 1/2) − (−3 5/7)',
        answer: '15/2 = 7 1/2',
      },
      {
        prompt: 'Hisoblang: (5 9/10 − 7 4/5) − (−2,8)',
        answer: '9/10 = 0,9',
      },
      {
        prompt: "Qulay usul bilan hisoblang: 7 13/28 − (3 9/28 − 5 3/13)",
        answer: '853/91 = 9 34/91',
      },
      {
        prompt: 'Hisoblang: 1) −5/7 + 8/21',
        answer: '−1/3',
      },
      {
        prompt: 'Hisoblang: 2) 2 9/13 + (−3 4/13)',
        answer: '−8/13',
      },
      {
        prompt: 'Hisoblang: 3) 2/3 − 1/5 + 4/15',
        answer: '11/15',
      },
      {
        prompt: 'Hisoblang: 4) 7 13/28 − (3 9/28 − 5 3/13)',
        answer: '853/91 = 9 34/91',
      },
      {
        prompt: 'Hisoblang: 5) (6 2/7 − 2 1/2) − (−3 5/7)',
        answer: '15/2 = 7 1/2',
      },
      {
        prompt: 'Hisoblang: 6) (5 9/10 − 7 4/5) − (−2,8)',
        answer: '9/10 = 0,9',
      },
      {
        prompt: 'Hisoblang: 7) 16 9/10 − (3 11/24 − 1 1/10)',
        answer: '349/24 = 14 13/24',
      },
      {
        prompt: 'Hisoblang: 8) +5/42 − (+17/21) − (−11/84)',
        answer: '−47/84',
      },
      {
        prompt: 'Hisoblang: 9) (−2 1/2) + 5/6 + (−0,5) + 1/6',
        answer: '−2',
      },
    ],
  },

  {
    id: '9.3',
    n: 3,
    title: "Ratsional sonlar ustida amallar. Ratsional sonlarni ko'paytirish va bo'lish",
    goal: "Ratsional sonlar ustida ko'paytirish va bo'lish amalini bajarib bilish",
    minutes: 15,
    videos: [
      {
        id: 'KhWOZxZIAno',
        title: "9.3 Ratsional sonlar ustida amallar. Ratsional sonlarni ko'paytirish va bo'lish (Nazariy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Ratsional sonlar ustida ko'paytirish va bo'lish amali ham xuddi qo'shish va ayirish amallari kabi bajariladi, ya'ni oddiy kasr ko'rinishiga keltiriladi va keyin amallar bajariladi.",
      },
    ],
    example: {
      prompt: 'Hisoblang: 7/20 · (−6 2/3)',
      steps: ['7/20 · (−6 2/3) = 7/20 · (−20/3)', '= −7/3', '= −2 1/3'],
      answer: '−2 1/3',
    },
    practice: [],
    exercises: [
      {
        prompt: 'Hisoblang: −6 4/5 · 2 5/12 : (−3,4)',
        answer: '29/6 = 4 5/6',
      },
      {
        prompt: 'Hisoblang: 0,9 · (−2 1/3) · (−2 2/3)',
        answer: '28/5 = 5,6',
      },
      {
        prompt: 'Hisoblang: 3 1/3 · 2 1/4 : (−1/2) : (−1,5)',
        answer: '10',
      },
      {
        prompt: 'Hisoblang: 1) 3/9 · (−3/4)',
        answer: '−1/4',
      },
      {
        prompt: 'Hisoblang: 2) −2 2/3 · (−1 1/8)',
        answer: '3',
      },
      {
        prompt: 'Hisoblang: 3) 2/3 : (−5/9)',
        answer: '−6/5 = −1 1/5',
      },
      {
        prompt: 'Hisoblang: 4) 1/8 · (8 · (−3/11))',
        answer: '−3/11',
      },
      {
        prompt: 'Hisoblang: 5) −5/9 · 4/7 · (−9/5)',
        answer: '4/7',
      },
      {
        prompt: 'Hisoblang: 6) 2 1/8 · (−3/17) · 16',
        answer: '−6',
      },
      {
        prompt: 'Hisoblang: 7) 4/5 · 3 1/3 · (−7 1/2)',
        answer: '−20',
      },
      {
        prompt: 'Hisoblang: 8) −8 2/3 · 1 2/3 · 3/5',
        answer: '−26/3 = −8 2/3',
      },
      {
        prompt: 'Hisoblang: 9) 3/8 : (−9/16)',
        answer: '−2/3',
      },
      {
        prompt: 'Hisoblang: 10) −16 : (−4/9)',
        answer: '36',
      },
      {
        prompt: 'Hisoblang: 11) −3 1/2 · (−1 3/7)',
        answer: '5',
      },
      {
        prompt: 'Hisoblang: 12) 2 6/7 : (−1 3/7)',
        answer: '−2',
      },
    ],
  },

  {
    id: '9.4',
    n: 4,
    title: "Ratsional sonlar ustida amallar. Ratsional sonlar ustida to'rt amalga oid misollar yechish",
    goal: "Ratsional sonlar ustida barcha amallarga oid misollar yechib bilish",
    minutes: 20,
    videos: [
      {
        id: 'tDxu5a2AnfM',
        title:
          "9.4 Ratsional sonlar ustida amallar. Ratsional sonlar ustida to'rt amalga oid misollar yechish (Nazariy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Ratsional sonlar ustida amal bajarganida, bir ifodada barcha amallar birgalikda kelsa, amallarni bajarish ketma-ketligi quyidagi tarzda amalga oshiriladi:",
      },
    ],
    lists: [
      {
        caption: 'Amallarni bajarish ketma-ketligi:',
        items: [
          'Qavs ichidagi amallar',
          "Ketma-ketlikda qavsdan tashqaridagi ko'paytirish va bo'lish amallari",
          "Ketma-ketlikda qavsdan tashqaridagi qo'shish va ayirish amallari",
        ],
      },
    ],
    example: {
      prompt: 'Amallarni bajaring: (−3 4/5 − (+1/5)) : (−5,5 − (+14,5))',
      steps: [
        '1) Birinchi qavs ichidagi amallar: (−3 4/5 − (+1/5)) = −19/5 − 1/5 = (−19−1)/5 = −20/5 = −4',
        '2) Ikkinchi qavs ichidagi amallar: (−5,5 − (+14,5)) = −5,5 − 14,5 = −20',
        "3) Birinchi va ikkinchi qavslar orasidagi bo'lish amali: −4 : (−20) = 0,2",
      ],
      answer: '0,2',
    },
    practice: [],
    exercises: [
      {
        prompt: 'Amallarni bajaring: 12 · (−3/4) − (−15) · (−1 1/5)',
        answer: '−27',
      },
      {
        prompt: 'Amallarni bajaring: −8/9 · 12,25 · 1 1/8 − (−2,25)',
        answer: '−10',
      },
      {
        prompt: 'Amallarni bajaring: (−3 1/5) · (2 1/3 : 3,2 − 3) − 9,6',
        answer: '−7/3 = −2 1/3',
      },
      {
        prompt: 'Amallarni bajaring: 1) 3 · (−3/5) − (−4/5) : 2',
        answer: '−7/5 = −1,4',
      },
      {
        prompt: 'Amallarni bajaring: 2) 0,4 − 2/5 : (−2) + (−2) : (−1)',
        answer: '13/5 = 2,6',
      },
      {
        prompt: 'Amallarni bajaring: 3) ((−1 1/12) + (−2 1/2)) : (−2)',
        answer: '43/24 = 1 19/24',
      },
      {
        prompt: 'Amallarni bajaring: 4) ((−1 1/2) − (−2 1/2)) · (−2)',
        answer: '−2',
      },
      {
        prompt: 'Amallarni bajaring: 5) (−3/8) · (−16) + 1/2 · (−5) · (−4)',
        answer: '16',
      },
      {
        prompt: 'Amallarni bajaring: 6) 0,2 + 1,8 · (4/9 − 1 1/2 + 1/6)',
        answer: '−7/5 = −1,4',
      },
      {
        prompt: 'Amallarni bajaring: 7) (0,98 − 0,312 : 0,3) · 25 + 1/9',
        answer: '−25/18 = −1 7/18',
      },
      {
        prompt: 'Amallarni bajaring: 8) (0,215 − 1,6 · 0,215) / (3,45 − 3 12/25)',
        answer: '43/10 = 4,3',
      },
    ],
  },
]

export const TOPIC_9_TEST: TopicTest = {
  id: '9.5',
  n: 5,
  title: 'Mavzu 9 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't9-01',
      prompt: "Ratsional son ta'rifiga ko'ra m/n kasrda m va n qanday sonlar bo'lishi kerak?",
      options: [
        'm — butun son, n — natural son',
        'm — natural son, n — butun son',
        'm va n — natural sonlar',
        'm va n — butun sonlar',
      ],
      correct: 0,
      explain:
        "Ta'rifga ko'ra m/n ko'rinishidagi sonlar ratsional sonlar deyiladi, bunda m — butun son, n esa natural son bo'ladi.",
    },
    {
      id: 't9-02',
      prompt: '−0,3 sonini ratsional son ko\'rinishida (m/n shaklda) yozing.',
      options: ['−3/100', '−1/3', '−3/10', '−30/10'],
      correct: 2,
      explain:
        "−0,3 = −3/10: o'nli kasrda bitta raqam verguldan keyin turadi, shuning uchun maxraj 10 bo'ladi.",
    },
    {
      id: 't9-03',
      prompt: '1,2(7) davriy kasrni oddiy kasr ko\'rinishida ifodalang.',
      options: ['25/90', '23/18', '27/18', '1 2/7'],
      correct: 1,
      explain: 'Kitobdagi yechimga ko\'ra 1,2(7) = 1 25/90 = 1 5/18 = 23/18.',
    },
    {
      id: 't9-04',
      prompt: "Ratsional son ta'rifida maxrajdagi son qanday son bo'lishi shart?",
      options: ['Butun son', 'Tub son', "Musbat o'nli kasr", 'Natural son'],
      correct: 3,
      explain: "Maxrajdagi son albatta natural son bo'lishi kerak — aks holda son ratsional son hisoblanmaydi.",
    },
    {
      id: 't9-05',
      prompt: 'Hisoblang: −5/7 + 8/21',
      options: ['−1/7', '1/3', '−1/3', '−13/21'],
      correct: 2,
      explain:
        "Umumiy maxraj 21: −5/7 = −15/21, demak −15/21 + 8/21 = −7/21 = −1/3.",
    },
    {
      id: 't9-06',
      prompt: 'Ifodaning qiymatini toping: −3/15 + 1/5 − 1/3',
      options: ['−1/3', '1/3', '−1/5', '−1/15'],
      correct: 0,
      explain:
        "Umumiy maxraj 15: −3/15 + 3/15 − 5/15 = (−3+3−5)/15 = −5/15 = −1/3.",
    },
    {
      id: 't9-07',
      prompt: 'Hisoblang: 7/20 · (−6 2/3)',
      options: ['−3 1/3', '−2 1/3', '2 1/3', '−1 1/3'],
      correct: 1,
      explain:
        "Aralash kasrni noto'g'ri kasrga aylantiramiz: −6 2/3 = −20/3, keyin 7/20 · (−20/3) = −7/3 = −2 1/3.",
    },
    {
      id: 't9-08',
      prompt: "Bir ifodada barcha amallar birgalikda kelsa, amallar qanday ketma-ketlikda bajariladi?",
      options: [
        "Avval qavsdan tashqaridagi ko'paytirish va bo'lish",
        "Avval qavsdan tashqaridagi qo'shish va ayirish",
        'Avval eng chapdagi amal',
        'Avval qavs ichidagi amallar',
      ],
      correct: 3,
      explain:
        "Kitobda ketma-ketlik shunday: qavs ichidagi amallar, so'ngra qavsdan tashqaridagi ko'paytirish va bo'lish, oxirida qo'shish va ayirish.",
    },
    {
      id: 't9-09',
      prompt: 'Amallarni bajaring: (−3 4/5 − (+1/5)) : (−5,5 − (+14,5))',
      options: ['−0,2', '20', '0,2', '−20'],
      correct: 2,
      explain:
        "Birinchi qavs: −19/5 − 1/5 = −20/5 = −4. Ikkinchi qavs: −5,5 − 14,5 = −20. Demak −4 : (−20) = 0,2.",
    },
    {
      id: 't9-10',
      prompt: '−0,(3) sonini ratsional son ko\'rinishida tasvirlang.',
      options: ['−3/10', '−1/10', '−33/100', '−1/3'],
      correct: 3,
      explain: "0,(3) = 3/9 = 1/3, ishorasi bilan birga −0,(3) = −1/3 bo'ladi.",
    },
    {
      id: 't9-11',
      prompt: 'Hisoblang: 2 9/13 + (−3 4/13)',
      options: ['−8/13', '8/13', '−5/13', '−1 5/13'],
      correct: 0,
      explain:
        "Maxrajlar bir xil: 2 9/13 − 3 4/13 = (2 − 3) + (9 − 4)/13 = −1 + 5/13 = −8/13.",
    },
    {
      id: 't9-12',
      prompt: 'Hisoblang: 3/8 : (−9/16)',
      options: ['2/3', '−2/3', '−27/128', '−1 1/2'],
      correct: 1,
      explain:
        'Bo\'lishni ko\'paytirishga almashtiramiz: 3/8 · (−16/9) = −48/72 = −2/3.',
    },
  ],
}

export const TOPIC_9_PASS = 7
