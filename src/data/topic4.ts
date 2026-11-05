import type { TopicLesson, TopicTest } from './topicTypes'

/**
 * MAVZU 4 — «Kasrlar va ular ustida amallar. Kasrlarni ko'paytirish va bo'lish».
 *
 * Manba: darslikning 39–44-betlari (nazariy qism: 4.1–4.7, amaliy qism: 4.1–4.7).
 * Matn, misollar va javoblar kitobdan o'zgartirilmasdan ko'chirilgan.
 * Amaliy qism mashqlarida kitob javob bermagan — javoblar aniq hisoblab tekshirilgan.
 */

export const TOPIC_4_META = {
  id: 'mavzu-4',
  num: 4,
  chapter: "Kasrlar va ular ustida amallar. Kasrlarni ko'paytirish va bo'lish",
  title: "Mavzu 4. Kasrlarni ko'paytirish va bo'lish",
  lessonCount: 7,
}

export const TOPIC_4_LESSONS: TopicLesson[] = [
  {
    id: '4.1',
    n: 1,
    title: "Oddiy kasrlarni ko'paytirish",
    goal: "Oddiy kasrlarni ko'paytirishni o'rganish",
    minutes: 16,
    videos: [
      { id: '2QgHPMtyyug', title: "Oddiy kasrlarni ko'paytirish (Nazariy qism)" },
      { id: 'v5W66UKtDuk', title: "Oddiy kasrlarni ko'paytirish (Amaliy qism)" },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Oddiy kasrlarni bir-biriga quyidagi tartibda ko'paytiramiz: birinchi kasrning surati ikkinchi kasrning maxraji bilan, maxraji esa surati bilan qisqartirilib, qisqartirishdan olingan suratdagi natijalar suratga, maxrajdagi natijalar maxrajga ko'paytiriladi. Agar surat va maxraji qisqarmaydigan sonlardan tashkil topgan bo'lsa, unda surat suratga, maxraj maxrajga ko'paytiriladi.",
      },
      {
        kind: 'MASALAN',
        text: "1) 3/4 · 12/27 = (3·12)/(4·27) = (1·3)/(1·9) = 1/3;   2) 5/3 · 7/8 = (5·7)/(3·8) = 35/24",
      },
    ],
    example: {
      prompt: "Berilgan kasrlarni ko'paytiring: 1) 3/7 · 14/9   2) 2/5 · 5/7 · 21/6   3) 8/9 · 11/7",
      steps: [
        "1) 3/7 · 14/9 = (1·2)/(1·3) = 2/3",
        "2) 2/5 · 5/7 · 21/6 = 1/1 = 1",
        "3) 8/9 · 11/7 = (8·11)/(9·7) = 88/63",
      ],
      answer: "1) 2/3;   2) 1;   3) 88/63",
    },
    practice: [],
    exercises: [
      { prompt: "Kasrlarni ko'paytiring: 15/28 · 7/25", answer: '3/20' },
      { prompt: "Kasrlarni ko'paytiring: 13/24 · 12/39 · 2/3", answer: '1/9' },
      { prompt: "Kasrlarni ko'paytiring: 2/3 · 5/7", answer: '10/21' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 1/2 · 1/3", answer: '1/6' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 2/3 · 5/6", answer: '5/9' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 5/8 · 1/9", answer: '5/72' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 3/4 · 3/5", answer: '9/20' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 21/20 · 5/7", answer: '3/4' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 1/6 · 1/3 · 3/10", answer: '1/60' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 4/7 · 14/15 · 3/8", answer: '1/5' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 8/9 · 5/16 · 27/55", answer: '3/22' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 10/21 · 7/20 · 3/50", answer: '1/100' },
      { prompt: "Oddiy kasrlarni ko'paytiring: 2/3 · 7/25 · 9/8 · 15/28", answer: '9/80' },
    ],
  },

  {
    id: '4.2',
    n: 2,
    title: "Natural son va oddiy kasrning ko'paytmasi",
    goal: "Natural son va oddiy kasrlarni o'zaro ko'paytirishni o'rganish",
    minutes: 14,
    videos: [
      { id: 'v6-gG_czXYM', title: "Natural son va oddiy kasrning ko'paytmasi (Nazariy qism)" },
      { id: 'ZdErpSNXSDk', title: "Natural son va oddiy kasrning ko'paytmasi (Amaliy qism)" },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Natural sonni oddiy kasrga yoki oddiy kasrni natural songa quyidagi tartibda ko'paytiramiz: natural sonni oddiy kasrga ko'paytirganda, natural son berilgan kasrning maxraji bilan qisqartirilib, qisqargandan keyin hosil bo'lgan natija suratga ko'paytiriladi. Agar natural son bilan berilgan kasrning maxraji qisqarmasa, natural son kasrning suratiga ko'paytiriladi, maxraj esa o'zgarishsiz qoladi.",
      },
      {
        kind: 'MASALAN',
        text: "1) 12 · 4/18 = (2·4)/3 = 8/3;   2) 15/8 · 7 = (15·7)/8 = 105/8",
      },
    ],
    practice: [],
    exercises: [
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 5 · 3/15", answer: '1' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 8 · 4/5", answer: '32/5 = 6 2/5' },
      { prompt: "Natural son va oddiy kasrlarning ko'paytmasini hisoblang: 2/4 · 8 · 7/14", answer: '2' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 5 · 2/3", answer: '10/3 = 3 1/3' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 4 · 3/5", answer: '12/5 = 2 2/5' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 6 · 3/7", answer: '18/7 = 2 4/7' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 5/9 · 2", answer: '10/9 = 1 1/9' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 22 · 2/33", answer: '4/3 = 1 1/3' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 45 · 4/63", answer: '20/7 = 2 6/7' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 88 · 3/77", answer: '24/7 = 3 3/7' },
      { prompt: "Natural son va oddiy kasrning ko'paytmasini hisoblang: 8/45 · 9", answer: '8/5 = 1 3/5' },
    ],
  },

  {
    id: '4.3',
    n: 3,
    title: "Aralash kasrlarni ko'paytirish",
    goal: "Aralash kasrlarni ko'paytirishni o'rganish",
    minutes: 15,
    videos: [
      { id: 'Ft8CSLAiGx8', title: "Aralash kasrlarni ko'paytirish (Nazariy qism)" },
      { id: 'IAj1gOuHXno', title: "Aralash kasrlarni ko'paytirish (Amaliy qism)" },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Aralash kasrlarni ko'paytirganda, avval aralash kasrlar noto'g'ri kasr ko'rinishiga keltirilib, keyin ko'paytiriladi.",
      },
      {
        kind: 'MASALAN',
        text: '1 1/3 · 3 3/4 = 4/3 · 15/4 = (1·5)/(1·1) = 5',
      },
    ],
    example: {
      prompt: "Aralash kasrlarni ko'paytiring: 4 1/11 · 3 2/3",
      steps: ['4 1/11 · 3 2/3 = 45/11 · 11/3 = 15'],
      answer: '15',
    },
    practice: [],
    exercises: [
      { prompt: "Aralash kasrlarni ko'paytiring: 4 2/3 · 3 3/4", answer: '35/2 = 17 1/2' },
      { prompt: "Aralash kasrlar va natural sonning ko'paytmasini toping: 4 2/7 · 14 · 3/15", answer: '12' },
      { prompt: "Butun va kasr qismga ega bo'lgan sonlarni ko'paytiring: 2 1/4 · 1 1/3", answer: '3' },
      { prompt: "Butun va kasr qismga ega bo'lgan sonlarni ko'paytiring: 5 5/12 · 1 5/13", answer: '15/2 = 7 1/2' },
      { prompt: "Butun va kasr qismga ega bo'lgan sonlarni ko'paytiring: 4 3/8 · 1 1/7", answer: '5' },
      { prompt: "Butun va kasr qismga ega bo'lgan sonlarni ko'paytiring: 4 9/10 · 3 1/3", answer: '49/3 = 16 1/3' },
      { prompt: "Butun va kasr qismga ega bo'lgan sonlarni ko'paytiring: 7 1/2 · 12 1/4 · 8/49", answer: '15' },
    ],
  },

  {
    id: '4.4',
    n: 4,
    title: 'Teskari sonlar',
    goal: "Teskari sonlar haqida ma'lumot olish",
    minutes: 14,
    videos: [
      { id: 'Wyn3iPSdxXI', title: 'Teskari sonlar (Nazariy qism)' },
      { id: 'nDWTswu-Gz0', title: 'Teskari sonlar (Amaliy qism)' },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: "Ko'paytmasi 1 ga teng bo'lgan sonlarga o'zaro teskari sonlar deyiladi.",
      },
      {
        kind: 'MASALAN',
        text: "O'zaro teskari sonlar: 2 → 1/2;   13 → 1/13;   2/3 → 3/2;   45/67 → 67/45",
      },
    ],
    practice: [],
    exercises: [
      { prompt: "Berilgan sonlarga teskari sonlarni toping: 3", answer: '1/3' },
      { prompt: 'Berilgan sonlarga teskari sonlarni toping: 1/5', answer: '5' },
      { prompt: 'Berilgan sonlarga teskari sonlarni toping: 12/45', answer: '45/12 = 3 3/4' },
      { prompt: 'Berilgan sonlarga teskari sonlarni toping: 1', answer: '1' },
      { prompt: 'Berilgan sonlarga teskari sonlarni toping: 1 3/4', answer: '4/7' },
      { prompt: 'Berilgan sonlarga teskari sonlarni toping: 1/125', answer: '125' },
      {
        prompt: "Teskari sonlar ta'rifidan foydalanib, noma'lum ifoda x ning qiymatini toping: 2/3 · x = 1",
        answer: 'x = 3/2 = 1 1/2',
      },
      {
        prompt: "Teskari sonlar ta'rifidan foydalanib, noma'lum ifoda x ning qiymatini toping: x · 5 = 1",
        answer: 'x = 1/5',
      },
      {
        prompt: "Teskari sonlar ta'rifidan foydalanib, noma'lum ifoda x ning qiymatini toping: x · 1/2 = 1",
        answer: 'x = 2',
      },
      {
        prompt: "Teskari sonlar ta'rifidan foydalanib, noma'lum ifoda x ning qiymatini toping: 3 2/3 · x = 1",
        answer: 'x = 3/11',
      },
      { prompt: 'Quyidagi songa teskari sonni toping: 5/8', answer: '8/5 = 1 3/5' },
      { prompt: 'Quyidagi songa teskari sonni toping: 4/19', answer: '19/4 = 4 3/4' },
      { prompt: 'Quyidagi songa teskari sonni toping: 40/51', answer: '51/40 = 1 11/40' },
      { prompt: 'Quyidagi songa teskari sonni toping: 12/45', answer: '45/12 = 3 3/4' },
      { prompt: 'Quyidagi songa teskari sonni toping: 53/100', answer: '100/53 = 1 47/53' },
      { prompt: 'Quyidagi songa teskari sonni toping: 25', answer: '1/25' },
      {
        prompt:
          "Teskari sonning ta'rifidan foydalanib, noma'lum ifoda x ni toping: (2 8/9 : 1 4/9 − 2/3) · x = 1",
        steps: ['2 8/9 : 1 4/9 = 26/9 : 13/9 = 2', '2 − 2/3 = 4/3', "4/3 · x = 1, demak x — 4/3 ga teskari son"],
        answer: 'x = 3/4',
      },
    ],
  },

  {
    id: '4.5',
    n: 5,
    title: "Oddiy kasrlarni bo'lish. Oddiy kasr va natural sonning bo'linmasi",
    goal: "Oddiy kasrlarni o'zaro hamda natural son bilan bo'linmasini o'rganish",
    minutes: 18,
    videos: [
      {
        id: 'E2ummTZFoYg',
        title: "Oddiy kasrlarni bo'lish. Oddiy kasr va natural sonning bo'linmasi (Nazariy qism)",
      },
      {
        id: '2qKaFB4cbZY',
        title: "Oddiy kasrlarni bo'lish. Oddiy kasr va natural sonning bo'linmasi (Amaliy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "1. Oddiy kasrni oddiy kasrga bo'lish. Oddiy kasrni oddiy kasrga bo'lish uchun birinchi kasrni ikkinchi kasrning teskarisiga ko'paytirish kerak.",
      },
      {
        kind: 'MASALAN',
        text: '1) 6/13 : 18/39 = 6/13 · 39/18 = 3/3 = 1;   2) 7/9 : 2/5 = 7/9 · 5/2 = 35/18',
      },
      {
        kind: "MA'LUMOT",
        text: "2. Natural son va oddiy kasrning bo'linmasi. Natural sonni oddiy kasrga bo'lganda, natural sonni maxraji 1 bo'lgan noto'g'ri kasr ko'rinishiga keltirib, keyin bo'lamiz.",
      },
      {
        kind: 'MASALAN',
        text: '4 : 8/9 = 4/1 : 8/9 = 4/1 · 9/8 = 9/2',
      },
    ],
    practice: [],
    exercises: [
      { prompt: "Oddiy kasrlarni bo'ling: 5/12 : 15/18", answer: '1/2' },
      { prompt: "Oddiy kasrlarni bo'ling: 7/12 : 6/7", answer: '49/72' },
      { prompt: "Oddiy kasrlarni bo'ling: 6/14 : 9/7 : 1/2", answer: '2/3' },
      { prompt: "Oddiy kasrlarni bo'ling: 1/2 : 1/2 : 1/2", answer: '2' },
      { prompt: "Bo'lish amalini bajaring: 7 : 4/3", answer: '21/4 = 5 1/4' },
      { prompt: "Bo'lish amalini bajaring: 8 : 4/9", answer: '18' },
      { prompt: "Bo'lish amalini bajaring: 12/28 : 9", answer: '1/21' },
      { prompt: "Bo'lish amalini bajaring: 15/12 : 20", answer: '1/16' },
      { prompt: "Oddiy kasrlarni bo'ling: 2/5 : 3/7", answer: '14/15' },
      { prompt: "Oddiy kasrlarni bo'ling: 1/8 : 1/4", answer: '1/2' },
      { prompt: "Oddiy kasrlarni bo'ling: 1/2 : 4/5", answer: '5/8' },
      { prompt: "Oddiy kasrlarni bo'ling: 11/18 : 5/9", answer: '11/10 = 1 1/10' },
      { prompt: "Oddiy kasrlarni bo'ling: 25/6 : 20/36", answer: '15/2 = 7 1/2' },
      { prompt: "Oddiy kasrlarni bo'ling: 5/7 : 15/14 : 3/8", answer: '16/9 = 1 7/9' },
      { prompt: "Oddiy kasrlarni bo'ling: 8/9 : 16/5 : 55/27", answer: '3/22' },
      { prompt: "Oddiy kasrlarni bo'ling: 10/21 : 20/7 : 50/3", answer: '1/100' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 7/16 : 4", answer: '7/64' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 8 : 4/3", answer: '6' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 6 : 1/4", answer: '24' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 5 : 5/6", answer: '6' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 10 : 5/9", answer: '18' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 15 : 3/5", answer: '25' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 1 : 1/5", answer: '5' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 1 : 7/10", answer: '10/7 = 1 3/7' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 2 : 6/7", answer: '7/3 = 2 1/3' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 7/8 : 3", answer: '7/24' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 4/5 : 5", answer: '4/25' },
      { prompt: "Oddiy kasr va natural sonning bo'linmasini toping: 7/10 : 4", answer: '7/40' },
    ],
  },

  {
    id: '4.6',
    n: 6,
    title: "Aralash kasrlarni bo'lish",
    goal: "Aralash kasrlarni bo'lishni o'rganish",
    minutes: 16,
    videos: [
      { id: 'PNL8GNvaQo4', title: "Aralash kasrlarni bo'lish (Nazariy qism)" },
      { id: 'R87H8WAH-kc', title: "Aralash kasrlarni bo'lish (Amaliy qism)" },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Aralash kasrlarni avval noto'g'ri kasrga aylantirib, keyin bo'lamiz.",
      },
      {
        kind: 'MASALAN',
        text: '3 3/5 : 2 3/6 = 18/5 : 15/6 = 18/5 · 6/15 = 36/25',
      },
      {
        kind: "MA'LUMOT",
        text: "Aralash kasr va natural son hamda oddiy kasrlarning bo'linmasi ham xuddi shu tartibda, ya'ni aralash kasrni noto'g'ri kasrga o'tkazib amalga oshiriladi.",
      },
      {
        kind: 'MASALAN',
        text: '1) 2 5/6 : 17 = 17/6 : 17 = 17/6 · 1/17 = 1/6;   2) 9 1/2 : 19/20 = 19/2 : 19/20 = 19/2 · 20/19 = 10',
      },
    ],
    practice: [],
    exercises: [
      { prompt: "Aralash kasrlarni bo'ling: 2 1/3 : 3 1/2", answer: '2/3' },
      { prompt: "Aralash kasrlarni bo'ling: 3 1/8 : 6 2/3", answer: '15/32' },
      { prompt: "Aralash kasrlarni bo'ling: 4 1/2 : 2 1/4", answer: '2' },
      { prompt: "Aralash kasrlarni bo'ling: 2 4/5 : 1 2/5", answer: '2' },
      { prompt: "Aralash kasr va natural sonning bo'linmasini toping: 1 : 1 1/4", answer: '4/5' },
      { prompt: "Aralash kasr va natural sonning bo'linmasini toping: 1 5/7 : 8", answer: '3/14' },
      { prompt: "Aralash kasr va natural sonning bo'linmasini toping: 7/9 : 2 1/3", answer: '1/3' },
      { prompt: "Aralash kasr va natural sonning bo'linmasini toping: 1 8/9 : 17/27", answer: '3' },
      { prompt: "Aralash kasrlarni bo'ling: 3 1/2 : 2 1/3", answer: '3/2 = 1 1/2' },
      { prompt: "Aralash kasrlarni bo'ling: 2 5/8 : 1 3/4", answer: '3/2 = 1 1/2' },
      { prompt: "Aralash kasrlarni bo'ling: 5 1/9 : 7 2/3", answer: '2/3' },
      { prompt: "Aralash kasrlarni bo'ling: 4 1/9 : 3 2/3", answer: '37/33 = 1 4/33' },
    ],
  },

  {
    id: '4.7',
    n: 7,
    title: "Kasrlar ustida to'rt amalga doir misollar",
    goal: "Kasrlar ustida to'rt amalga doir misollarni yechishni o'rganish",
    minutes: 18,
    videos: [
      { id: 'l6SJNFmWevs', title: "Kasrlar ustida to'rt amalga doir misollar (Nazariy qism)" },
      { id: 'NC1LbxEJGZo', title: "Kasrlar ustida to'rt amalga doir misollar (Amaliy qism)" },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Bir ifodada bir nechta amallar birgalikda kelsa, amallarni bajarish ketma-ketligi quyidagi darajalarga bo'linadi.",
      },
    ],
    lists: [
      {
        caption: "Amallarni bajarish ketma-ketligi:",
        items: [
          'Qavs ichi',
          "Ketma-ketlikda ko'paytirish va bo'lish",
          "Ketma-ketlikda qo'shish va ayirish",
        ],
      },
    ],
    example: {
      prompt: 'Hisoblang: 12 5/6 + 2 7/9 · (15 9/10 − 12 9/10)',
      steps: [
        'Misolli yechishdan oldin amallar ketma-ketligini belgilab, shu ketma-ketlik bo\u2019yicha yechamiz.',
        '1) Qavs ichi: 15 9/10 − 12 9/10 = (15 − 12) + (9/10 − 9/10) = 3 + 0 = 3',
        "2) Ko'paytirish: 2 7/9 · 3 = 25/9 · 3 = 25/3 = 8 1/3",
        "3) Qo'shish: 12 5/6 + 8 1/3 = 20 + 5/6 + 2/6 = 20 + 7/6 = 20 + 1 1/6 = 21 1/6",
      ],
      answer: '21 1/6',
    },
    practice: [],
    exercises: [
      { prompt: 'Hisoblang: (12 : 3 3/5 + 2/3) · 2/3', answer: '8/3 = 2 2/3' },
      { prompt: 'Hisoblang: 13 3/8 + 4 5/7 · (19 3/17 − 5 3/17)', answer: '635/8 = 79 3/8' },
      { prompt: 'Hisoblang: 5 7/16 · 1 3/29 + 2 5/16 · 2 2/7', answer: '79/7 = 11 2/7' },
      { prompt: 'Hisoblang: (2007 3/5 − 2006 1/6) · 1 1/29', answer: '43/29 = 1 14/29' },
      { prompt: 'Amallarni bajaring: 9 1/6 : 11/24 − 3 1/9 · 1 2/7', answer: '16' },
      { prompt: 'Amallarni bajaring: 2 1/7 : 1 17/28 + 4 1/9 · 2 7/37', answer: '31/3 = 10 1/3' },
      { prompt: 'Amallarni bajaring: 2 1/10 · 4 1/6 + 5 · 3/8 − 9/20 · 6', answer: '317/40 = 7 37/40' },
      { prompt: 'Amallarni bajaring: 1 5/12 · 2 + 4 · 1 1/18 + 1 1/9 · 1 1/4', answer: '76/9 = 8 4/9' },
      { prompt: 'Amallarni bajaring: (8 7/15 − 6 13/60) · (11 3/4 − 9 7/8)', answer: '135/32 = 4 7/32' },
      { prompt: 'Amallarni bajaring: (5 3/8 + 18 1/2 − 7 5/24) : 16 2/3', answer: '1' },
    ],
  },
]

export const TOPIC_4_TEST: TopicTest = {
  id: '4.8',
  n: 8,
  title: 'Mavzu 4 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't4-01',
      prompt: 'Hisoblang: 3/4 · 12/27',
      options: ['3/9', '1/3', '4/9', '3/4'],
      correct: 1,
      explain:
        "Qisqartirish: 3 bilan 27, 4 bilan 12 qisqaradi: (1·3)/(1·9) = 3/9 = 1/3.",
    },
    {
      id: 't4-02',
      prompt: 'Hisoblang: 5/3 · 7/8',
      options: ['35/24', '12/11', '35/11', '24/35'],
      correct: 0,
      explain: "Surat suratga, maxraj maxrajga ko'paytiriladi: (5·7)/(3·8) = 35/24.",
    },
    {
      id: 't4-03',
      prompt: 'Hisoblang: 15/8 · 7',
      options: ['105/15', '105/8', '22/8', '105/56'],
      correct: 1,
      explain:
        "Maxraj qisqarmaydi, shuning uchun natural son suratga ko'paytiriladi, maxraj o'zgarishsiz qoladi: (15·7)/8 = 105/8.",
    },
    {
      id: 't4-04',
      prompt: 'Hisoblang: 12 · 4/18',
      options: ['48/18 = 8/3 emas, 4/3', '12/18', '4/3', '8/3'],
      correct: 3,
      explain:
        "12 bilan 18 ni 6 ga qisqartiramiz: 2 va 3 hosil bo'ladi, natija (2·4)/3 = 8/3.",
    },
    {
      id: 't4-05',
      prompt: 'Hisoblang: 4 1/11 · 3 2/3',
      options: ['12', '15', '14 2/33', '8 1/3'],
      correct: 1,
      explain:
        "Aralash kasrlar noto'g'ri kasrga keltiriladi: 45/11 · 11/3 = 45/3 = 15.",
    },
    {
      id: 't4-06',
      prompt: "Qanday sonlarga o'zaro teskari sonlar deyiladi?",
      options: [
        "Ko'paytmasi 1 ga teng bo'lgan sonlarga",
        "Yig'indisi 1 ga teng bo'lgan sonlarga",
        "Ayirmasi 1 ga teng bo'lgan sonlarga",
        "Bo'linmasi 1 ga teng bo'lgan sonlarga",
      ],
      correct: 0,
      explain: "Ta'rifga ko'ra ko'paytmasi 1 ga teng bo'lgan sonlar o'zaro teskari sonlar deyiladi.",
    },
    {
      id: 't4-07',
      prompt: 'Qaysi son 1 3/4 ga teskari?',
      options: ['3/4', '7/4', '4/7', '1 4/3'],
      correct: 2,
      explain: '1 3/4 = 7/4, unga teskari son 4/7, chunki 7/4 · 4/7 = 1.',
    },
    {
      id: 't4-08',
      prompt: "Teskari sonlar ta'rifidan foydalanib, x ni toping: 2/3 · x = 1",
      options: ['x = 2/3', 'x = 1/3', 'x = 3', 'x = 3/2'],
      correct: 3,
      explain: "Ko'paytma 1 ga teng, demak x — 2/3 ga teskari son: x = 3/2 = 1 1/2.",
    },
    {
      id: 't4-09',
      prompt: 'Hisoblang: 6/13 : 18/39',
      options: ['12/39', '1', '3/3 · 1/2', '9/13'],
      correct: 1,
      explain:
        "Bo'lishda birinchi kasr ikkinchisining teskarisiga ko'paytiriladi: 6/13 · 39/18 = 3/3 = 1.",
    },
    {
      id: 't4-10',
      prompt: 'Hisoblang: 3 3/5 : 2 3/6',
      options: ['36/25', '25/36', '6/5', '1 1/5'],
      correct: 0,
      explain:
        "Aralash kasrlar noto'g'ri kasrga aylantiriladi: 18/5 : 15/6 = 18/5 · 6/15 = 36/25.",
    },
    {
      id: 't4-11',
      prompt: 'Hisoblang: 2 5/6 : 17',
      options: ['1/6 · 17', '17/6', '1/6', '2 1/2'],
      correct: 2,
      explain:
        "2 5/6 = 17/6, natural son esa 17/1 ko'rinishida yoziladi: 17/6 · 1/17 = 1/6.",
    },
    {
      id: 't4-12',
      prompt: 'Amallar ketma-ketligini buzmasdan hisoblang: 12 5/6 + 2 7/9 · (15 9/10 − 12 9/10)',
      options: ['9 1/6', '3 1/2', '12 5/6', '21 1/6'],
      correct: 3,
      explain:
        "Avval qavs: 15 9/10 − 12 9/10 = 3. Keyin ko'paytirish: 2 7/9 · 3 = 8 1/3. Oxirida qo'shish: 12 5/6 + 8 1/3 = 21 1/6.",
    },
  ],
}

export const TOPIC_4_PASS = 7
