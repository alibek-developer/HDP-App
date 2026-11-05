import type { TopicLesson, TopicTest } from './topicTypes'

/**
 * MAVZU 3 — «Kasrlar va ular ustida amallar. Kasrlarni qo'shish va ayirish».
 *
 * Mazmun kitobning 3.1–3.11 bo'limlaridan (Nazariy qism) va Amaliy qismdan
 * so'zma-so'z ko'chirilgan. Javoblar faqat kitobda berilgan yoki aniq
 * hisoblanadigan hollarda yozilgan.
 *
 * Videolar YouTube'da; `videos[].id` — havoladagi id.
 * `3.12` — mavzuning yakuniy 12 savolli testi (TOPIC_3_TEST).
 */

export const TOPIC_3_META = {
  id: 'mavzu-3',
  num: 3,
  chapter: "Kasrlar va ular ustida amallar. Kasrlarni qo'shish va ayirish",
  title: "Mavzu 3. Kasrlarni qo'shish va ayirish",
  lessonCount: 11,
}

export const TOPIC_3_LESSONS: TopicLesson[] = [
  {
    id: '3.1',
    n: 1,
    title: "Oddiy kasrning turlari: To'g'ri va noto'g'ri kasrlar",
    goal: "To'g'ri va noto'g'ri kasrlar haqida ma'lumotga ega bo'lish",
    minutes: 12,
    videos: [
      {
        id: 'RjtTWK4rkv4',
        title: "Oddiy kasrning turlari: To'g'ri va noto'g'ri kasrlar (Nazariy qism)",
      },
      {
        id: 'xtgf5WYBbDM',
        title: "Oddiy kasrning turlari: To'g'ri va noto'g'ri kasrlar (Amaliy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Oddiy kasrning ikkita turi mavjud: to'g'ri va noto'g'ri kasrlar.",
      },
      {
        kind: 'MASALAN',
        text: "2 sonini 2/1 ko'rinishidagi qiymati 2 ga teng bo'lgan noto'g'ri kasr ko'rinishida ifodalash mumkin.",
      },
      {
        kind: 'ESLATISH',
        text: "Har qanday natural sonni maxraji 1 ga teng bo'lgan noto'g'ri kasr ko'rinishida yozish mumkin!",
      },
      {
        kind: 'XULOSA',
        text: "Demak, to'g'ri kasrlarning qiymati 1 dan kichik, noto'g'ri kasrlarning qiymati esa 1 dan katta yoki 1 ga teng bo'lar ekan.",
      },
    ],
    lists: [
      {
        caption: 'Oddiy kasr turlari',
        items: [
          "To'g'ri kasrlar — surati maxrajidan kichik bo'lgan kasrlar. Misol: 8/18 — o'qilishi: 8 taqsim 18 yoki 18 dan 8",
          "Noto'g'ri kasrlar — surati maxrajidan katta yoki surati va maxraji teng bo'lgan kasrlar. Misol: 27/5 — o'qilishi: 27 taqsim 5 yoki 5 dan 27",
        ],
      },
    ],
    example: {
      prompt: "Quyidagi kasrlarni to'g'ri va noto'g'ri kasrlarga ajrating: 13/12; 2/3; 4/33; 17/29; 5/5; 3",
      steps: [
        "Surati maxrajidan kichik bo'lgan kasrlar — to'g'ri kasrlar.",
        "Surati maxrajidan katta yoki maxrajiga teng bo'lgan kasrlar — noto'g'ri kasrlar.",
        "Natural son 3 ni maxraji 1 ga teng kasr (3 = 3/1) ko'rinishida yozish mumkin, shuning uchun u ham noto'g'ri kasr.",
      ],
      answer: "To'g'ri kasrlar: 2/3; 4/33; 17/29. Noto'g'ri kasrlar: 13/12; 5/5; 3",
    },
    practice: [],
    exercises: [
      {
        prompt:
          "Berilgan kasrlarni to'g'ri va noto'g'ri kasrlarga ajrating: 1/3; 23/43; 22/4; 4/4; 7; 132/422; 101/3; 1",
        answer:
          "To'g'ri kasrlar: 1/3; 23/43; 132/422. Noto'g'ri kasrlar: 22/4; 4/4; 7; 101/3; 1",
      },
      {
        prompt: "a ning qanday natural qiymatlarida a/6 kasr to'g'ri kasr bo'ladi?",
        answer: "a = 1; 2; 3; 4; 5 (surat maxrajdan kichik bo'lishi kerak: a < 6)",
      },
      {
        prompt: "a ning qanday natural qiymatlarida 6/a kasr noto'g'ri kasr bo'ladi?",
        answer: "a = 1; 2; 3; 4; 5; 6 (surat maxrajdan kichik bo'lmasligi kerak: 6 ≥ a)",
      },
      {
        prompt:
          "Berilgan kasrlarni to'g'ri va noto'g'ri kasrlarga ajrating: 54/15; 8/7; 6/14; 5/5; 2; 8/32",
        answer: "To'g'ri kasrlar: 6/14; 8/32. Noto'g'ri kasrlar: 54/15; 8/7; 5/5; 2",
      },
      {
        prompt: "n ning qanday natural qiymatlarida (n−1)/5 kasr to'g'ri kasr bo'ladi?",
      },
      {
        prompt: "n ning qanday natural qiymatlarida 7/(n+1) kasr noto'g'ri kasr bo'ladi?",
        answer: "n = 1; 2; 3; 4; 5; 6 (7 ≥ n + 1 bo'lishi kerak)",
      },
    ],
  },

  {
    id: '3.2',
    n: 2,
    title: "Noto'g'ri kasrlarning tadbiqi. Aralash kasrlar",
    goal: "Noto'g'ri kasrdan aralash kasrga o'tkazishni",
    minutes: 14,
    videos: [
      {
        id: 'FHPjA7jJU3s',
        title: "Noto'g'ri kasrlarning tadbiqi. Aralash kasrlar (Nazariy qism)",
      },
      {
        id: 'fsaCvFrQT-g',
        title: "Noto'g'ri kasrlarning tadbiqi. Aralash kasrlar (Amaliy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Noto'g'ri kasr bu tarkibida 1 ga teng yoki 1 dan katta butun sonni saqlovchi oddiy kasr. Agar tarkibidagi 1 dan katta butun sonni ajratsak, aralash kasr hosil bo'ladi. Noto'g'ri kasrdan ajralib chiqqan ushbu aralash kasrning butun qismi natural sondan, kasr qismi esa to'g'ri kasrdan iborat bo'ladi.",
      },
      {
        kind: "TA'RIF",
        text: "Butun va kasr sonlarning aralashmasidan tashkil topgan kasrlarga aralash kasrlar deyiladi. Aralash kasrlar quyidagicha o'qiladi: 3 2/5 — uch butun beshdan ikki yoki uch butun ikki taqsim besh.",
      },
      {
        kind: "MA'LUMOT",
        text: "Noto'g'ri kasrlarni aralash kasr ko'rinishida ifodalash. Noto'g'ri kasrlar quyidagi ko'rinishda aralash kasrlarga aylantiriladi: noto'g'ri kasrning surati maxrajiga bo'linadi. Natijada hosil bo'lgan to'liqsiz bo'linma aralash kasrning butun qismi, qoldiq aralash kasrning surati, bo'luvchi esa aralash kasrning maxrajiga yoziladi.",
      },
      {
        kind: 'XULOSA',
        text: "Demak, aralash kasrning butun qismi to'liqsiz bo'linmadan, kasr qismining maxraji bo'luvchidan, surati esa qoldiqdan iborat bo'lar ekan.",
      },
    ],
    example: {
      prompt: "23/7 noto'g'ri kasrni aralash kasr ko'rinishida ifodalang.",
      steps: [
        'Suratni maxrajga bo\'lamiz: 23 : 7 = 3, qoldiq 2 (23 = 7 · 3 + 2).',
        '7 — maxraj, 3 — butun qism (to\'liqsiz bo\'linma), 2 — surat (qoldiq).',
      ],
      answer: '23/7 = 3 2/7',
    },
    practice: [],
    exercises: [
      { prompt: "Noto'g'ri kasrni aralash kasr ko'rinishida ifodalang: 77/4", answer: '19 1/4' },
      { prompt: "Noto'g'ri kasrni aralash kasr ko'rinishida ifodalang: 12/5", answer: '2 2/5' },
      { prompt: "Noto'g'ri kasrni aralash kasr ko'rinishida ifodalang: 32/17", answer: '1 15/17' },
      { prompt: "Noto'g'ri kasrni aralash kasr ko'rinishida ifodalang: 53/17", answer: '3 2/17' },
      { prompt: "Noto'g'ri kasrni aralash kasr ko'rinishida ifodalang: 7/4", answer: '1 3/4' },
      { prompt: "Noto'g'ri kasrni aralash kasr ko'rinishida ifodalang: 22/5", answer: '4 2/5' },
      {
        prompt: "Noto'g'ri kasrni aralash kasr ko'rinishida ifodalang: 20/15",
        answer: '1 5/15 = 1 1/3',
      },
      { prompt: "Noto'g'ri kasrni aralash kasr ko'rinishida ifodalang: 43/9", answer: '4 7/9' },
    ],
  },

  {
    id: '3.3',
    n: 3,
    title: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalash",
    goal: "Aralash kasrdan noto'g'ri kasrga o'tkazishni o'rganish",
    minutes: 12,
    videos: [
      {
        id: 'beQ-rnGdSms',
        title: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalash (Nazariy qism)",
      },
      {
        id: '5ItJM7NUSyY',
        title: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalash (Amaliy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Aralash kasrning maxrajini butun qismiga ko'paytirib, ko'paytmaga suratini qo'shish natijasida aralash kasrlar noto'g'ri kasr ko'rinishiga keltiriladi, maxraji esa o'zgarishsiz qoladi.",
      },
    ],
    example: {
      prompt: "2 3/5 aralash kasrni noto'g'ri kasr ko'rinishida ifodalang.",
      steps: [
        "Maxrajni butun qismiga ko'paytiramiz: 5 · 2 = 10.",
        "Ko'paytmaga suratni qo'shamiz: 10 + 3 = 13.",
        "Maxraj o'zgarishsiz qoladi: 5.",
      ],
      answer: '2 3/5 = (2·5 + 3)/5 = 13/5',
    },
    practice: [],
    exercises: [
      { prompt: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalang: 3 3/4", answer: '15/4' },
      { prompt: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalang: 4 6/7", answer: '34/7' },
      { prompt: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalang: 12 5/7", answer: '89/7' },
      {
        prompt: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalang: 5 67/87",
        answer: '502/87',
      },
      { prompt: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalang: 5 3/6", answer: '33/6 = 11/2' },
      { prompt: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalang: 14 1/2", answer: '29/2' },
      { prompt: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalang: 1 5/7", answer: '12/7' },
      { prompt: "Aralash kasrlarni noto'g'ri kasr ko'rinishida ifodalang: 4 7/8", answer: '39/8' },
    ],
  },

  {
    id: '3.4',
    n: 4,
    title: 'Kasrlarni umumiy maxrajga keltirish',
    goal: 'Kasrlarni umumiy maxrajga keltirib bilish',
    minutes: 16,
    videos: [
      { id: '196UkBdZFyM', title: 'Kasrlarni umumiy maxrajga keltirish (Nazariy qism)' },
      { id: 'VRAod4rv4T8', title: 'Kasrlarni umumiy maxrajga keltirish (Amaliy qism)' },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Kitoblardan iqtibos: Aziz matematiklar siz bilan matematika fanini o'rganish fonida (dunyo qarashimizni kengaytirish maqsadida) o'zimizga foydasi tekkan yoki yaxshi deb bilgan bir qancha bestseller kitoblardan iqtiboslar keltirib o'tishni niyat qildik. Birinchi bo'lib Simon Sinekning “Start with WHY” kitobi haqida ma'lumot berib o'tamiz. Bu kitob o'rganishni o'rgatadigan kitob, ya'ni har bir o'rganuvchi qandaydir narsa yoki fanni o'rganishdan qat'iy nazar bu kitob unga o'rganish tezligini va eslab qolish muddatini eng kamida 2 marta yaxshilashga xizmat qilishi mumkin bo'lgan kitobdir. Kitobga ko'ra o'rganilayotgan obektningiz bo'yicha (tushunishni osonlashtirish maqsadida) Simon Sinek quyidagi uchta savolni berish kerakligini aytadi (Sinekning oltin doirasi).",
      },
      {
        kind: "MA'LUMOT",
        text: "Yuqoridagi savollarga to'liq javob berishga harakat qila turib, siz har qanday narsani oldingiga nisbatan 2 barobar yaxshiroq o'zlashtirishingiz haqida kitobda aytib o'tilgan. Keling Muallifning shu maslahati qanchalik to'g'ri ekanligini bugungi mavzumizda sinab ko'ramiz.",
      },
      {
        kind: 'SAVOL',
        text: 'Kasrlarni umumiy maxrajga keltirish deganda nimani tushunasiz?',
      },
      {
        kind: "TA'RIF",
        text: "Maxrajlari har xil bo'lgan kasrlarni bir xil maxrajga keltirishga kasrlarni umumiy maxrajga keltirish deyiladi.",
      },
      {
        kind: 'SAVOL',
        text: 'Kasrlarni umumiy maxrajga keltirish nima uchun kerak?',
      },
      {
        kind: "MA'LUMOT",
        text: "Maxrajlari har xil bo'lgan kasrlarni bir-biriga qo'shish, ayirish va taqqoslash uchun kerak.",
      },
      {
        kind: 'SAVOL',
        text: 'Qanday qilib kasrlar umumiy maxrajga keltiriladi?',
      },
      {
        kind: "MA'LUMOT",
        text: "Kasrning asosiy xossasidan foydalanib, surat va maxrajini bir xil songa ko'paytirish mumkin. Shunga ko'ra, bizga berilgan qandaydir maxrajlari har xil bo'lgan kasrlarni, barchasining maxrajidagi sonlarni bo'la oladigan eng kichik sonni topib, shu songa barchasining maxrajini keltiramiz.",
      },
      {
        kind: 'ESLATISH',
        text: "Kasrning asosiy xossasi 2.5-mavzuda keltirib o'tilgan.",
      },
      {
        kind: 'MASALAN',
        text: "4/5 va 3/20 sonlarini olaylik. Birinchi kasrning surat va maxrajini 4 ga ko'paytirsak, qiymati 16/20 va maxraji ikkinchi kasrning maxraji bilan bir xil bo'ladigan kasr paydo bo'ladi.",
      },
    ],
    lists: [
      {
        caption: 'Sinekning oltin doirasi — uchta savol',
        items: [
          "What — ya'ni bu o'rganilayotgan narsa nima?",
          "Why — ya'ni bu narsa nimaga kerak?",
          "How — ya'ni buni qanday qilish mumkin?",
        ],
      },
    ],
    example: {
      prompt: 'Berilgan kasrlarni umumiy maxrajga keltiring: 1) 3/4 va 2/12; 2) 8/9 va 12/54; 3) 7/25 va 6/75',
      steps: [
        '1) 3/4 = (3·3)/(4·3) = 9/12, ikkinchi kasr o\'zgarishsiz qoladi: 2/12.',
        '2) 8/9 = (8·6)/(9·6) = 48/54, ikkinchi kasr o\'zgarishsiz qoladi: 12/54.',
        '3) 7/25 = (7·5)/(25·5) = 35/75, ikkinchi kasr o\'zgarishsiz qoladi: 6/75.',
      ],
      answer: '1) 9/12 va 2/12; 2) 48/54 va 12/54; 3) 35/75 va 6/75',
    },
    practice: [],
    exercises: [
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 2/6 va 4/18" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 2/27 va 5/9" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 7/25 va 13/50" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 3/25 va 4/50" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 3/11 va 4/12" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 3/8 va 4/9" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 7/15 va 3/35" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 6/17 va 10/51" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 7/10 va 3/20" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 1/4 va 1/12" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 6/13 va 2/39" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 4/35 va 2/5" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 9/22 va 1/2" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 3/10 va 2/3" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 1/7 va 1/2" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 5/8 va 7/11" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 5/6 va 4/9" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 4/5 va 4/9" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 3/20 va 2/15" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 8/21 va 11/14" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 3/25 va 17/300" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 13/45 va 1/90" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 12/108 va 70/180" },
      { prompt: "Kasrlarni umumiy maxrajga keltiring: 3/8 va 15/16" },
    ],
  },

  {
    id: '3.5',
    n: 5,
    title: 'Kasrlarni taqqoslash',
    goal: 'Kasrlarni taqqoslab bilish',
    minutes: 14,
    videos: [
      { id: 'Ub5gmCN253M', title: 'Kasrlarni taqqoslash (Nazariy qism)' },
      { id: 'd8_iZL24z4w', title: 'Kasrlarni taqqoslash (Amaliy qism)' },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Taqqoslash usullari: maxrajlari bir xil bo'lgan kasrlarni taqqoslash; suratlari bir xil bo'lgan kasrlarni taqqoslash; suratlari ham, maxrajlari ham har xil bo'lgan kasrlarni taqqoslash.",
      },
    ],
    lists: [
      {
        caption: 'Taqqoslash usullari',
        items: [
          "Maxrajlari bir xil bo'lgan kasrlarni taqqoslash — agar kasrlarning maxrajlari bir xil bo'lsa, surati katta bo'lgan kasrning qiymati katta bo'ladi. Misol: 7/4 > 5/4",
          "Suratlari bir xil bo'lgan kasrlarni taqqoslash — agar kasrlarning suratlari bir xil bo'lsa, maxraji kichik bo'lgan kasrning qiymati katta bo'ladi. Misol: 4/11 > 4/23",
          "Suratlari ham, maxrajlari ham har xil bo'lgan kasrlarni taqqoslash — agar kasrlarning suratlari ham, maxrajlari ham turlicha bo'lsa, avval ular umumiy maxrajga yoki suratga keltirib, keyin taqqoslanadi. Misol: 2/3 va 5/6 → 4/6 < 5/6; 2/7 va 1/3 → 2/7 < 2/6",
        ],
      },
    ],
    practice: [],
    exercises: [
      { prompt: "Maxrajlari bir xil bo'lgan kasrlarni taqqoslang: 10/6 va 3/6", answer: '10/6 > 3/6' },
      { prompt: "Maxrajlari bir xil bo'lgan kasrlarni taqqoslang: 5/12 va 15/12", answer: '5/12 < 15/12' },
      {
        prompt: "Maxrajlari bir xil bo'lgan kasrlarni taqqoslang: 101/67 va 43/67",
        answer: '101/67 > 43/67',
      },
      {
        prompt: "Maxrajlari bir xil bo'lgan kasrlarni taqqoslang: 13/28 va 11/28",
        answer: '13/28 > 11/28',
      },
      { prompt: "Suratlari bir xil bo'lgan kasrlarni taqqoslang: 3/14 va 3/6", answer: '3/14 < 3/6' },
      { prompt: "Suratlari bir xil bo'lgan kasrlarni taqqoslang: 9/23 va 9/22", answer: '9/23 < 9/22' },
      { prompt: "Suratlari bir xil bo'lgan kasrlarni taqqoslang: 5/10 va 5/25", answer: '5/10 > 5/25' },
      {
        prompt: "Suratlari bir xil bo'lgan kasrlarni taqqoslang: 17/36 va 17/89",
        answer: '17/36 > 17/89',
      },
      {
        prompt: "Suratlari ham, maxrajlari ham har xil bo'lgan kasrlarni taqqoslang: 2/3 va 3/4",
        answer: '2/3 < 3/4 (8/12 < 9/12)',
      },
      {
        prompt: "Suratlari ham, maxrajlari ham har xil bo'lgan kasrlarni taqqoslang: 6/7 va 9/28",
        answer: '6/7 > 9/28 (24/28 > 9/28)',
      },
      {
        prompt: "Suratlari ham, maxrajlari ham har xil bo'lgan kasrlarni taqqoslang: 8/100 va 2/25",
        answer: '8/100 = 2/25 (2/25 = 8/100)',
      },
      {
        prompt: "Suratlari ham, maxrajlari ham har xil bo'lgan kasrlarni taqqoslang: 6/7 va 23/84",
        answer: '6/7 > 23/84 (72/84 > 23/84)',
      },
      {
        prompt: "Mantiqiy yo'l bilan kasrlarni taqqoslang: 5/7 va 7/3",
        answer: '5/7 < 7/3 (5/7 < 1, 7/3 > 1)',
      },
      {
        prompt: "Mantiqiy yo'l bilan kasrlarni taqqoslang: 99/100 va 100/99",
        answer: '99/100 < 100/99 (99/100 < 1, 100/99 > 1)',
      },
      {
        prompt: "Mantiqiy yo'l bilan kasrlarni taqqoslang: 22/3 va 3/22",
        answer: '22/3 > 3/22 (22/3 > 1, 3/22 < 1)',
      },
      { prompt: "Mantiqiy yo'l bilan kasrlarni taqqoslang: 1 va 3/4", answer: '1 > 3/4' },
      {
        prompt: "a = 3/4; b = 1/4 va c = 7/4 kasrlarni o'sib borish tartibida joylashtiring.",
        answer: 'b < a < c, ya\'ni 1/4; 3/4; 7/4',
      },
      { prompt: 'Kasrlarni taqqoslang: 1/3 va 1/4', answer: '1/3 > 1/4' },
      { prompt: 'Kasrlarni taqqoslang: 49/50 va 50/51', answer: '49/50 < 50/51' },
      { prompt: 'Kasrlarni taqqoslang: 67/99 va 67/100', answer: '67/99 > 67/100' },
      { prompt: 'Kasrlarni taqqoslang: 4/3 va 17/16', answer: '4/3 > 17/16' },
      { prompt: 'Kasrlarni taqqoslang: 5/13 va 5/11', answer: '5/13 < 5/11' },
      { prompt: 'Kasrlarni taqqoslang: 9/10 va 17/18', answer: '9/10 < 17/18 (81/90 < 85/90)' },
      {
        prompt: 'Kasrlarni taqqoslang: 33/34 va 34/35',
        answer: '33/34 < 34/35 (1155/1190 < 1156/1190)',
      },
      {
        prompt: 'Kasrlarni taqqoslang: 28/29 va 7/8',
        answer: '28/29 > 7/8 (224/232 > 203/232)',
      },
      { prompt: "Mantiqiy yo'l bilan kasrlarni taqqoslang: 3/4 va 4/3", answer: '3/4 < 4/3' },
      { prompt: "Mantiqiy yo'l bilan kasrlarni taqqoslang: 13/28 va 44/23", answer: '13/28 < 44/23' },
      { prompt: "Mantiqiy yo'l bilan kasrlarni taqqoslang: 6 va 42/18", answer: '6 > 42/18' },
      { prompt: "Mantiqiy yo'l bilan kasrlarni taqqoslang: 1 va 2/6", answer: '1 > 2/6' },
    ],
  },

  {
    id: '3.6',
    n: 6,
    title: "Kasrlar ustida amallar. Oddiy kasrlarni qo'shish va ayirish",
    goal: "Oddiy kasrlarni qo'shish va ayirishni o'rganish",
    minutes: 16,
    videos: [
      {
        id: 'YxHecc2HTpQ',
        title: "Kasrlar ustida amallar. Oddiy kasrlarni qo'shish va ayirish (Nazariy qism)",
      },
      {
        id: 'Aw6kk5HK5QE',
        title: "Kasrlar ustida amallar. Oddiy kasrlarni qo'shish va ayirish (Amaliy qism)",
      },
    ],
    theory: [
      {
        kind: 'ESLATISH',
        text: "Kasrlarni qo'shgan yoki ayirgan paytda, natijani (agar mumkin bo'lsa) qisqartirib olish lozim. Sababi ko'p hollarda testlarda sizning javobingiz emas, balkim shu javobingizning qisqartirilgan ko'rinishi berilgan bo'lishi mumkin.",
      },
    ],
    lists: [
      {
        caption: "Oddiy kasrlarni quyidagi usullarda qo'shamiz va ayiramiz",
        items: [
          "Bir xil maxrajli kasrlarni qo'shish — bir xil maxrajli kasrlarni qo'shganda, faqat suratlarini qo'shamiz, maxrajlari esa o'zgarishsiz qoladi. Misol: 12/18 + 3/18 = 15/18",
          "Har xil maxrajli kasrlarni qo'shish — har xil maxrajli kasrlarni qo'shganda, avval ular umumiy maxrajga keltiriladi, so'ngra suratlari qo'shilib, maxrajlari o'zgarishsiz qoladi. Misol: 3/7 + 5/14 = 6/14 + 5/14 = 11/14",
          "Bir xil maxrajli kasrlarni ayirish — bir xil maxrajli kasrlarni ayirganda, faqat suratlarini ayiramiz, maxrajlari esa o'zgarishsiz qoladi. Misol: 12/18 − 3/18 = 9/18",
          "Har xil maxrajli kasrlarni ayirish — har xil maxrajli kasrlarni ayirganda, avval ular umumiy maxrajga keltiriladi, so'ngra suratlari ayirilib, maxrajlari o'zgarishsiz qoladi. Misol: 3/7 − 5/14 = 6/14 − 5/14 = 1/14",
        ],
      },
    ],
    practice: [],
    exercises: [
      {
        prompt:
          "Bir xil maxrajli kasrlarni qo'shing, agar mumkin bo'lsa, natijani qisqartiring: 3/15 + 2/15 + 5/15",
        answer: '10/15 = 2/3',
      },
      {
        prompt:
          "Har xil maxrajli kasrlarni qo'shing, agar mumkin bo'lsa, natijani qisqartiring: 3/7 + 4/28 + 5/4",
        answer: '12/28 + 4/28 + 35/28 = 51/28 = 1 23/28',
      },
      {
        prompt:
          "Bir xil maxrajli kasrlarni ayiring, agar mumkin bo'lsa, natijani qisqartiring: 7/8 − 1/8 − 4/8",
        answer: '2/8 = 1/4',
      },
      {
        prompt:
          "Har xil maxrajli kasrlarni ayiring, agar mumkin bo'lsa, natijani qisqartiring: 5/8 − 4/56 − 3/7",
        answer: '35/56 − 4/56 − 24/56 = 7/56 = 1/8',
      },
      { prompt: "Oddiy kasrlarni qo'shing: 1/8 + 5/8", answer: '6/8 = 3/4' },
      { prompt: "Oddiy kasrlarni qo'shing: 5/14 + 3/14", answer: '8/14 = 4/7' },
      { prompt: "Oddiy kasrlarni qo'shing: 7/25 + 13/25", answer: '20/25 = 4/5' },
      { prompt: "Oddiy kasrlarni qo'shing: 10/35 + 2/70", answer: '20/70 + 2/70 = 22/70 = 11/35' },
      { prompt: "Oddiy kasrlarni qo'shing: 5/28 + 3/70", answer: '25/140 + 6/140 = 31/140' },
      { prompt: "Oddiy kasrlarni qo'shing: 4/5 + 8/75", answer: '60/75 + 8/75 = 68/75' },
      {
        prompt: "Oddiy kasrlarni qo'shing: 2/7 + 1/5 + 3/11",
        answer: '110/385 + 77/385 + 105/385 = 292/385',
      },
      {
        prompt: "Oddiy kasrlarni qo'shing: 5/17 + 1/34 + 7/68",
        answer: '20/68 + 2/68 + 7/68 = 29/68',
      },
      { prompt: 'Oddiy kasrlarni ayiring: 7/8 − 5/8', answer: '2/8 = 1/4' },
      { prompt: 'Oddiy kasrlarni ayiring: 5/14 − 3/14', answer: '2/14 = 1/7' },
      { prompt: 'Oddiy kasrlarni ayiring: 17/25 − 13/25', answer: '4/25' },
      { prompt: 'Oddiy kasrlarni ayiring: 10/35 − 2/70', answer: '20/70 − 2/70 = 18/70 = 9/35' },
      { prompt: 'Oddiy kasrlarni ayiring: 5/28 − 3/70', answer: '25/140 − 6/140 = 19/140' },
      { prompt: 'Oddiy kasrlarni ayiring: 4/5 − 8/75', answer: '60/75 − 8/75 = 52/75' },
      {
        prompt: 'Oddiy kasrlarni ayiring: 52/55 − 1/5 − 3/11',
        answer: '52/55 − 11/55 − 15/55 = 26/55',
      },
      {
        prompt: 'Oddiy kasrlarni ayiring: 5/17 − 1/34 − 7/68',
        answer: '20/68 − 2/68 − 7/68 = 11/68',
      },
    ],
  },

  {
    id: '3.7',
    n: 7,
    title: "Natural son va to'g'ri kasrlarning yig'indisi",
    goal: "Natural son va to'g'ri kasrlarni qo'shishni o'rganish",
    minutes: 12,
    videos: [
      {
        id: 'nRRfS_MyaK8',
        title: "Natural son va to'g'ri kasrlarning yig'indisi (Nazariy qism)",
      },
      {
        id: 'tQSstYfIupY',
        title: "Natural son va to'g'ri kasrlarning yig'indisi (Amaliy qism)",
      },
    ],
    theory: [
      {
        kind: 'XULOSA',
        text: "Natural son va to'g'ri kasrning yig'indisini quyidagicha ifodalash mumkin: a + b/c = a b/c.",
      },
      {
        kind: "MA'LUMOT",
        text: "Bu yerda a natural son, b/c esa to'g'ri kasr.",
      },
      {
        kind: 'ESLATISH',
        text: "Odatiy xato: 5 + 3/2 ni hisoblaganda ko'pchilik o'quvchilar natural sonni noto'g'ri kasr bilan to'g'ridan-to'g'ri birlashtirib, 5 3/2 ko'rinishida aralash kasr sifatida yozib ketishadi (natural son va to'g'ri kasrni birlashtirish xossasi bilan chalkashtirishadi). Lekin bu xato — bunday misol 3.8-mavzuda o'rgatiladigan usul orqali yechiladi.",
      },
    ],
    example: {
      prompt: "5 + 2/3 yig'indini hisoblang.",
      steps: [
        "1-usul. Har qanday natural sonni maxraji 1 bo'lgan noto'g'ri kasr ko'rinishida yozish mumkin. Shunga ko'ra 5 ni 5/1 deb yozib olamiz: 5/1 + 2/3 = 15/3 + 2/3 = 17/3 = 5 2/3.",
        "2-usul. To'g'ridan to'g'ri natural son bilan to'g'ri kasrni birlashtirib yozish, ya'ni aralash kasr ko'rinishida yozish: 5 + 2/3 = 5 2/3.",
      ],
      answer: '5 + 2/3 = 5 2/3',
    },
    practice: [],
    exercises: [
      {
        prompt: "Natural son va to'g'ri kasrning yig'indisini hisoblang: 6 + 5/7",
        answer: '6 5/7',
      },
      {
        prompt: "Natural son va to'g'ri kasrning yig'indisini hisoblang: 8 + 4/9",
        answer: '8 4/9',
      },
      {
        prompt: "Natural son va to'g'ri kasrning yig'indisini hisoblang: 12 + 47/93",
        answer: '12 47/93',
      },
      {
        prompt: "Natural son va to'g'ri kasrning yig'indisini hisoblang: 101 + 344/2346",
        answer: '101 344/2346 (qisqartirilganda 101 172/1173)',
      },
      { prompt: 'Hisoblang: 3 + 3/4', answer: '3 3/4' },
      { prompt: 'Hisoblang: 4 + 7/14', answer: '4 7/14 = 4 1/2' },
      { prompt: 'Hisoblang: 10 + 3/10', answer: '10 3/10' },
      { prompt: 'Hisoblang: 7 + 15/25', answer: '7 15/25 = 7 3/5' },
    ],
  },

  {
    id: '3.8',
    n: 8,
    title: "Natural son va noto'g'ri kasrlarning yig'indisi",
    goal: "Natural son va noto'g'ri kasrlarni qo'shishni o'rganish",
    minutes: 14,
    videos: [
      {
        id: 'k_eJRgsVSEI',
        title: "Natural son va noto'g'ri kasrlarning yig'indisi (Nazariy qism)",
      },
      {
        id: 'myMGfdxEBrI',
        title: "Natural son va noto'g'ri kasrlarning yig'indisi (Amaliy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "2-usul. Noto'g'ri kasrni aralash kasrga aylantirib, keyin qo'shish. Ushbu usul quyidagi ketma-ketlikda amalga oshiriladi: noto'g'ri kasr avval aralash kasrga o'tkaziladi; hosil bo'lgan aralash kasrning butun qismi natural songa qo'shilib, yig'indi bilan kasr qism birlashtirilib yoziladi.",
      },
    ],
    example: {
      prompt: "7 + 12/5 yig'indini hisoblang.",
      steps: [
        "1-usul. Natural sonni ham noto'g'ri kasr ko'rinishiga keltirib qo'shish: 7 + 12/5 = 7/1 + 12/5 = 35/5 + 12/5 = 47/5 = 9 2/5.",
        "2-usul. Noto'g'ri kasrni aralash kasrga aylantirib, keyin qo'shish: 12/5 = 2 2/5, so'ngra 7 + 2 2/5 = 7 + 2 + 2/5 = 9 + 2/5 = 9 2/5.",
      ],
      answer: '7 + 12/5 = 47/5 = 9 2/5',
    },
    practice: [],
    exercises: [
      {
        prompt: "Natural sonni noto'g'ri kasr ko'rinishiga keltirib, qo'shishni bajaring: 6 + 7/4",
        answer: '24/4 + 7/4 = 31/4 = 7 3/4',
      },
      {
        prompt: "Natural sonni noto'g'ri kasr ko'rinishiga keltirib, qo'shishni bajaring: 3 + 10/3",
        answer: '9/3 + 10/3 = 19/3 = 6 1/3',
      },
      {
        prompt: "Natural sonni noto'g'ri kasr ko'rinishiga keltirib, qo'shishni bajaring: 20 + 5/4",
        answer: '80/4 + 5/4 = 85/4 = 21 1/4',
      },
      {
        prompt: "Natural sonni noto'g'ri kasr ko'rinishiga keltirib, qo'shishni bajaring: 23 + 35/8",
        answer: '184/8 + 35/8 = 219/8 = 27 3/8',
      },
      {
        prompt: "Noto'g'ri kasrni aralash kasr ko'rinishiga keltirib, qo'shishni bajaring: 6 + 7/4",
        answer: "7/4 = 1 3/4; 6 + 1 3/4 = 7 3/4",
      },
      {
        prompt: "Noto'g'ri kasrni aralash kasr ko'rinishiga keltirib, qo'shishni bajaring: 3 + 10/3",
        answer: '10/3 = 3 1/3; 3 + 3 1/3 = 6 1/3',
      },
      {
        prompt: "Noto'g'ri kasrni aralash kasr ko'rinishiga keltirib, qo'shishni bajaring: 20 + 5/4",
        answer: '5/4 = 1 1/4; 20 + 1 1/4 = 21 1/4',
      },
      {
        prompt: "Noto'g'ri kasrni aralash kasr ko'rinishiga keltirib, qo'shishni bajaring: 23 + 35/8",
        answer: '35/8 = 4 3/8; 23 + 4 3/8 = 27 3/8',
      },
      { prompt: 'Hisoblang: 5 + 13/4', answer: '5/1 + 13/4 = 20/4 + 13/4 = 33/4 = 8 1/4' },
      { prompt: 'Hisoblang: 1 + 17/14', answer: '14/14 + 17/14 = 31/14 = 2 3/14' },
      { prompt: 'Hisoblang: 20 + 33/10', answer: '200/10 + 33/10 = 233/10 = 23 3/10' },
      { prompt: 'Hisoblang: 7 + 15/5', answer: '35/5 + 15/5 = 50/5 = 10' },
    ],
  },

  {
    id: '3.9',
    n: 9,
    title: 'Natural son va oddiy kasrlarning ayirmasi',
    goal: "Natural son va oddiy kasrlarni ayirishni o'rganish",
    minutes: 13,
    videos: [
      { id: 'ETMd2pcTx8E', title: 'Natural son va oddiy kasrlarning ayirmasi (Nazariy qism)' },
      { id: 'h07oJpBVWWg', title: 'Natural son va oddiy kasrlarning ayirmasi (Amaliy qism)' },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Natural son hamda oddiy kasrlar quyidagicha ayiriladi: 1. Natural son maxraji 1 bo'lgan noto'g'ri kasr ko'rinishiga keltiriladi va kasrlarni ayirish qoidasiga ko'ra ayiriladi.",
      },
      {
        kind: "MA'LUMOT",
        text: "2. Katta sonlardan kasrlarni ayirish. Buni quyidagi ko'rinishda amalga oshiramiz.",
      },
      {
        kind: 'MASALAN',
        text: '189 − 2/5 = 188 + 1 − 2/5 = 188 + 5/5 − 2/5 = 188 + 3/5 = 188 3/5',
      },
    ],
    example: {
      prompt: '8 − 5/6 ayirmani hisoblang.',
      steps: [
        "Natural sonni maxraji 1 bo'lgan noto'g'ri kasr ko'rinishida yozamiz: 8 = 8/1.",
        'Umumiy maxraj 6: 8/1 = 48/6.',
        '48/6 − 5/6 = (48 − 5)/6 = 43/6.',
        '43/6 = 7 1/6.',
      ],
      answer: '8 − 5/6 = 43/6 = 7 1/6',
    },
    practice: [],
    exercises: [
      {
        prompt: "Natural sonni noto'g'ri kasrga o'tkazib, ayirishni bajaring: 7 − 1/3",
        answer: '21/3 − 1/3 = 20/3 = 6 2/3',
      },
      {
        prompt: "Natural sonni noto'g'ri kasrga o'tkazib, ayirishni bajaring: 3 − 1/2",
        answer: '6/2 − 1/2 = 5/2 = 2 1/2',
      },
      {
        prompt: "Natural sonni noto'g'ri kasrga o'tkazib, ayirishni bajaring: 10 − 10/8",
        answer: '80/8 − 10/8 = 70/8 = 35/4 = 8 3/4',
      },
      {
        prompt: "Natural sonni noto'g'ri kasrga o'tkazib, ayirishni bajaring: 24 − 7/8",
        answer: '192/8 − 7/8 = 185/8 = 23 1/8',
      },
      {
        prompt:
          "Katta sonlardan kasrlarni ayirish qoidasidan foydalanib, ayirishni bajaring: 7 − 1/3",
        answer: '6 + 3/3 − 1/3 = 6 + 2/3 = 6 2/3',
      },
      {
        prompt:
          "Katta sonlardan kasrlarni ayirish qoidasidan foydalanib, ayirishni bajaring: 3 − 1/2",
        answer: '2 + 2/2 − 1/2 = 2 1/2',
      },
      {
        prompt:
          "Katta sonlardan kasrlarni ayirish qoidasidan foydalanib, ayirishni bajaring: 10 − 10/8",
        answer: '9 + 8/8 − 10/8 = 9 − 2/8 = 8 6/8 = 8 3/4',
      },
      {
        prompt:
          "Katta sonlardan kasrlarni ayirish qoidasidan foydalanib, ayirishni bajaring: 24 − 7/8",
        answer: '23 + 8/8 − 7/8 = 23 1/8',
      },
      { prompt: 'Hisoblang: 3 − 3/4', answer: '12/4 − 3/4 = 9/4 = 2 1/4' },
      { prompt: 'Hisoblang: 4 − 7/14', answer: '4 − 1/2 = 8/2 − 1/2 = 7/2 = 3 1/2' },
      { prompt: 'Hisoblang: 10 − 3/10', answer: '100/10 − 3/10 = 97/10 = 9 7/10' },
      { prompt: 'Hisoblang: 7 − 15/25', answer: '7 − 3/5 = 35/5 − 3/5 = 32/5 = 6 2/5' },
    ],
  },

  {
    id: '3.10',
    n: 10,
    title: "Natural son va aralash kasrlarning yig'indisi va ayirmasi",
    goal: "Natural son va aralash kasrlarni ayirishni o'rganish",
    minutes: 15,
    videos: [
      {
        id: 'UtPRe4jWRJo',
        title: "Natural son va aralash kasrlarning yig'indisi va ayirmasi (Nazariy qism)",
      },
      {
        id: 'buxe2QRSj2s',
        title: "Natural son va aralash kasrlarning yig'indisi va ayirmasi (Amaliy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Natural son va aralash kasrning yig'indisi. Natural sonni aralash kasrga qo'shgan paytda, natural son aralash kasrning butun qismiga qo'shilib, hosil bo'lgan yig'indi kasr qism bilan birlashtirib yoziladi.",
      },
      {
        kind: 'MASALAN',
        text: '17 + 3 24/57 = 17 + 3 + 24/57 = 20 + 24/57 = 20 24/57',
      },
      {
        kind: "MA'LUMOT",
        text: "Natural son va aralash kasrning ayirmasi. 2. Aralash kasrdan natural sonni ayirish. Aralash kasrlardan natural sonni ayirish quyidagicha amalga oshiriladi.",
      },
      {
        kind: 'MASALAN',
        text: '12 4/7 − 8 = 12 + 4/7 − 8 = 12 − 8 + 4/7 = 4 + 4/7 = 4 4/7',
      },
      {
        kind: 'ESLATISH',
        text: "Odatiy xato: natural sondan aralash kasrni ayirishda yo'l qo'yiladigan xatolardan biri — 6 − 3 3/4 = (6 − 3) + 3/4 = 3 + 3/4 = 3 3/4 deb yozish. O'quvchilar natural sondan aralash kasrning butun qismini ayirib, ayirmani to'g'ri kasr bilan birlashtirib ketishadi va shu yerda xatolik paydo bo'ladi: minus faqat 3 ning oldiga qo'yilishi, aslida esa minus 3 ga ham, kasrga ham tegishli. Misol quyidagicha yechish mumkin: avval natural sonni aralash kasr ko'rinishiga keltirib olib, keyin butun qismlarini alohida, kasr qismlarini alohida ayirib, natijada hosil bo'lgan butun va kasr sonlarni qo'shamiz: 6 − 3 3/4 = 5 4/4 − 3 3/4 = (5 − 3) + (4/4 − 3/4) = 2 + 1/4 = 2 1/4.",
      },
    ],
    example: {
      prompt: '4 − 2 3/7 ayirmani hisoblang.',
      steps: [
        'Natural sondan 1 ni ajratamiz: 4 − 2 3/7 = 3 + 1 − 2 3/7.',
        '1 ni 7/7 ko\'rinishida yozamiz: 3 + 7/7 − 2 3/7 = 3 7/7 − 2 3/7.',
        'Butun qismlarni va kasr qismlarni alohida ayiramiz: (3 − 2) + (7/7 − 3/7) = 1 + 4/7.',
      ],
      answer: '4 − 2 3/7 = 1 4/7',
    },
    practice: [],
    exercises: [
      { prompt: "Yig'indini hisoblang: 7 5/17 + 5", answer: '12 5/17' },
      { prompt: "Yig'indini hisoblang: 20 12/15 + 3", answer: '23 12/15 = 23 4/5' },
      { prompt: 'Ayirmani hisoblang: 25 12/32 − 15', answer: '10 12/32 = 10 3/8' },
      { prompt: 'Ayirmani hisoblang: 5 2/3 − 2', answer: '3 2/3' },
      { prompt: 'Ayirmani hisoblang: 3 − 2 5/8', answer: '3/8' },
      { prompt: 'Ayirmani hisoblang: 7 − 5 5/9', answer: '1 4/9' },
      { prompt: "Yig'indini hisoblang: 13 + 7 19/20", answer: '20 19/20' },
      { prompt: "Yig'indini hisoblang: 7 + 23 3/7", answer: '30 3/7' },
      { prompt: "Yig'indini hisoblang: 8 2/7 + 56", answer: '64 2/7' },
      { prompt: "Yig'indini hisoblang: 4 16/35 + 21", answer: '25 16/35' },
      { prompt: 'Ayirmani hisoblang: 8 − 7 9/20', answer: '11/20' },
      { prompt: 'Ayirmani hisoblang: 20 − 11 2/3', answer: '8 1/3' },
      { prompt: 'Ayirmani hisoblang: 5 5/6 − 3', answer: '2 5/6' },
      { prompt: 'Ayirmani hisoblang: 17 4/7 − 8', answer: '9 4/7' },
    ],
  },

  {
    id: '3.11',
    n: 11,
    title: "Aralash kasrlarni qo'shish va ayirish",
    goal: "Aralash kasrlarni qo'shish va ayirish",
    minutes: 18,
    videos: [
      { id: 'G8UDezaxRC0', title: "Aralash kasrlarni qo'shish va ayirish (Nazariy qism)" },
      { id: '0SKs_AtINAM', title: "Aralash kasrlarni qo'shish va ayirish (Amaliy qism)" },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Aralash kasrlar quyidagi ikki usulda qo'shib ayiriladi. 1-usul. Butun va kasr qismlarni alohida hisoblash. Ushbu usulda, avval aralash kasrlarning butun son qismlari, keyin esa kasr son qismlari yig'indisi yoki ayirmasi hisoblanadi, oxirida esa butun va kasr qismlardan olingan natijalar qo'shiladi.",
      },
      {
        kind: 'MASALAN',
        text: '1-usul, ayirish: 13 7/13 − 8 3/13 = (13 − 8) + (7/13 − 3/13) = 5 + 4/13 = 5 4/13',
      },
      {
        kind: "MA'LUMOT",
        text: "2-usul. Aralash kasrlarni noto'g'ri kasr ko'rinishiga keltirib hisoblash.",
      },
      {
        kind: 'MASALAN',
        text: '2-usul, ayirish: 13 7/13 − 8 3/13 = 176/13 − 107/13 = 69/13 = 5 4/13',
      },
      {
        kind: "MA'LUMOT",
        text: "Kasr qismi kichik bo'lgan sondan kasr qismi katta bo'lgan sonni ayirish. Kasr qismi kichik bo'lgan sondan kasr qismi katta bo'lgan sonni ayirish quyidagi tartibda bajariladi.",
      },
      {
        kind: 'MASALAN',
        text: '4 1/8 − 1 5/8 = (4 − 1) + (1/8 − 5/8) = 3 + 1/8 − 5/8 = 2 + 1 + 1/8 − 5/8 = 2 + (8 + 1 − 5)/8 = 2 + 4/8 = 2 4/8',
      },
    ],
    example: {
      prompt: '7 3/4 + 9 2/12 yig\'indini hisoblang.',
      steps: [
        "1-usul. Butun va kasr qismlarni alohida hisoblaymiz: (7 + 9) + (3/4 + 2/12) = 16 + (9/12 + 2/12) = 16 + 11/12.",
        "2-usul. Aralash kasrlarni noto'g'ri kasr ko'rinishiga keltiramiz: 7 3/4 = 31/4, 9 2/12 = 110/12.",
        'Umumiy maxraj 12: 31/4 = 93/12, so\'ngra 93/12 + 110/12 = 203/12.',
        '203/12 = 16 11/12 — ikkala usulda natija bir xil.',
      ],
      answer: '7 3/4 + 9 2/12 = 16 11/12',
    },
    practice: [],
    exercises: [
      {
        prompt: "Aralash kasrlarning yig'indisini hisoblang: 22 17/25 + 77 8/25",
        answer: '99 25/25 = 100',
      },
      {
        prompt: "Aralash kasrlarning yig'indisini hisoblang: 3 9/10 + 9 17/20",
        answer: '12 + 35/20 = 13 15/20 = 13 3/4',
      },
      {
        prompt: "Aralash kasrlarning yig'indisini hisoblang: 3 1/6 + 2 2/3",
        answer: '5 + (1/6 + 4/6) = 5 5/6',
      },
      {
        prompt: "Aralash kasrlarning yig'indisini hisoblang: 1 5/16 + 1 1/2",
        answer: '2 + (5/16 + 8/16) = 2 13/16',
      },
      {
        prompt: "Aralash kasrlarning yig'indisini hisoblang: 5 11/20 + 4 3/20",
        answer: '9 14/20 = 9 7/10',
      },
      {
        prompt: "Aralash kasrlarning yig'indisini hisoblang: 12 37/50 + 7 13/50",
        answer: '19 50/50 = 20',
      },
      {
        prompt: "Aralash kasrlarning yig'indisini hisoblang: 13 13/15 + 6 7/30",
        answer: '19 + 33/30 = 20 3/30 = 20 1/10',
      },
      {
        prompt: "Aralash kasrlarning ayirmasini hisoblang: 21 8/70 − 3 1/70",
        answer: '18 7/70 = 18 1/10',
      },
      {
        prompt: "Aralash kasrlarning ayirmasini hisoblang: 9 3/10 − 3 1/20",
        answer: '6 + (6/20 − 1/20) = 6 5/20 = 6 1/4',
      },
      {
        prompt: "Aralash kasrlarning ayirmasini hisoblang: 3 5/6 − 2 2/3",
        answer: '1 + (5/6 − 4/6) = 1 1/6',
      },
      {
        prompt: "Aralash kasrlarning ayirmasini hisoblang: 1 15/16 − 1 1/2",
        answer: '15/16 − 8/16 = 7/16',
      },
      {
        prompt: "Aralash kasrlarning ayirmasini hisoblang: 5 11/20 − 4 3/20",
        answer: '1 8/20 = 1 2/5',
      },
      {
        prompt: "Aralash kasrlarning ayirmasini hisoblang: 12 37/50 − 7 13/50",
        answer: '5 24/50 = 5 12/25',
      },
      {
        prompt: "Aralash kasrlarning ayirmasini hisoblang: 3 5/6 − 2 2/6",
        answer: '1 3/6 = 1 1/2',
      },
      {
        prompt: "Aralash kasrlarning ayirmasini hisoblang: 13 13/15 − 6 7/30",
        answer: '7 + (26/30 − 7/30) = 7 19/30',
      },
      {
        prompt: 'Aralash kasrlar ustida amallarni bajaring: 5 4/6 + 4 1/3',
        answer: '9 + (4/6 + 2/6) = 9 + 1 = 10',
      },
      {
        prompt: 'Aralash kasrlar ustida amallarni bajaring: 7 3/4 + 3 7/8 + 4 1/3',
        answer: '14 + 47/24 = 15 23/24',
      },
      {
        prompt: 'Aralash kasrlar ustida amallarni bajaring: 20 3/12 − 12 3/24',
        answer: '8 + (2/8 − 1/8) = 8 1/8',
      },
      {
        prompt: 'Aralash kasrlar ustida amallarni bajaring: 6 3/6 − 2 1/4 − 1 5/36',
        answer: '3 + (18/36 − 9/36 − 5/36) = 3 4/36 = 3 1/9',
      },
      {
        prompt: 'Aralash kasrlar ustida amallarni bajaring: 9 23/60 − 4 11/12',
        answer: '9 23/60 − 4 55/60 = 8 83/60 − 4 55/60 = 4 28/60 = 4 7/15',
      },
      {
        prompt:
          'Aralash kasrlar ustida amallarni bajaring: (3 5/8 + 1/4 + 2 7/12) − (4 8/15 + 11/30 + 17/45)',
        answer:
          '6 11/24 − 5 5/18 = 1 + (33/72 − 20/72) = 1 13/72',
      },
    ],
  },
]

export const TOPIC_3_TEST: TopicTest = {
  id: '3.12',
  n: 12,
  title: 'Mavzu 3 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't3-01',
      prompt: "To'g'ri kasr qanday kasr?",
      options: [
        "Surati maxrajidan katta bo'lgan kasr",
        "Surati maxrajidan kichik bo'lgan kasr",
        'Surati maxrajiga teng bo\'lgan kasr',
        'Butun qismi bor kasr',
      ],
      correct: 1,
      explain:
        "Kitobda: surati maxrajidan kichik bo'lgan kasrlar to'g'ri kasrlar deyiladi, ularning qiymati 1 dan kichik bo'ladi.",
    },
    {
      id: 't3-02',
      prompt: "Qaysi kasr noto'g'ri kasr?",
      options: ['8/18', '4/33', '27/5', '17/29'],
      correct: 2,
      explain:
        "27/5 da surat maxrajdan katta (27 > 5), shuning uchun u noto'g'ri kasr. Qolganlarida surat maxrajdan kichik.",
    },
    {
      id: 't3-03',
      prompt: "Har qanday natural sonni qanday ko'rinishda noto'g'ri kasr sifatida yozish mumkin?",
      options: [
        "Maxraji 1 ga teng bo'lgan kasr ko'rinishida",
        "Surati 1 ga teng bo'lgan kasr ko'rinishida",
        "Maxraji 0 ga teng bo'lgan kasr ko'rinishida",
        'Faqat aralash kasr ko\'rinishida',
      ],
      correct: 0,
      explain:
        "Eslatmada aytilgan: har qanday natural sonni maxraji 1 ga teng bo'lgan noto'g'ri kasr ko'rinishida yozish mumkin, masalan 2 = 2/1.",
    },
    {
      id: 't3-04',
      prompt: "23/7 kasrni aralash kasr ko'rinishida ifodalang.",
      options: ['2 3/7', '3 1/7', '3 9/7', '3 2/7'],
      correct: 3,
      explain:
        "23 : 7 = 3 (to'liqsiz bo'linma), qoldiq 2, maxraj 7 → 23/7 = 3 2/7. Butun qism to'liqsiz bo'linmadan, surat qoldiqdan olinadi.",
    },
    {
      id: 't3-05',
      prompt: "4 5/7 aralash kasrni noto'g'ri kasr ko'rinishida ifodalang.",
      options: ['33/7', '32/7', '45/7', '23/7'],
      correct: 0,
      explain: "Maxraj butun qismga ko'paytiriladi va surat qo'shiladi: 7·4 + 5 = 33, maxraj o'zgarishsiz qoladi → 33/7.",
    },
    {
      id: 't3-06',
      prompt: 'Kasrlarni umumiy maxrajga keltirish nima uchun kerak?',
      options: [
        'Kasrlarni qisqartirish uchun',
        'Kasrlarni aralash kasrga aylantirish uchun',
        "Maxrajlari har xil bo'lgan kasrlarni qo'shish, ayirish va taqqoslash uchun",
        'Kasrning butun qismini ajratish uchun',
      ],
      correct: 2,
      explain:
        "Kitobda: maxrajlari har xil bo'lgan kasrlarni bir-biriga qo'shish, ayirish va taqqoslash uchun kerak.",
    },
    {
      id: 't3-07',
      prompt: "Suratlari bir xil bo'lgan 4/11 va 4/23 kasrlardan qaysi biri katta?",
      options: [
        '4/23, chunki maxraji katta',
        '4/11, chunki maxraji kichik',
        'Ular teng, chunki suratlari bir xil',
        'Bunday kasrlarni taqqoslab bo\'lmaydi',
      ],
      correct: 1,
      explain:
        "Suratlar bir xil bo'lsa, maxraji kichik bo'lgan kasrning qiymati katta bo'ladi: 4/11 > 4/23.",
    },
    {
      id: 't3-08',
      prompt: "Bir xil maxrajli kasrlarni qo'shganda nima qilinadi?",
      options: [
        "Maxrajlar qo'shiladi, suratlar o'zgarishsiz qoladi",
        "Suratlar ham, maxrajlar ham qo'shiladi",
        'Avval kasrlar qisqartiriladi',
        "Suratlar qo'shiladi, maxrajlar o'zgarishsiz qoladi",
      ],
      correct: 3,
      explain:
        "Bir xil maxrajli kasrlarni qo'shganda faqat suratlar qo'shiladi, maxraj esa o'zgarishsiz qoladi: 12/18 + 3/18 = 15/18.",
    },
    {
      id: 't3-09',
      prompt: '3/7 + 5/14 = ?',
      options: ['11/14', '8/21', '15/14', '11/21'],
      correct: 0,
      explain: "Har xil maxrajli kasrlar umumiy maxraj 14 ga keltiriladi: 3/7 = 6/14, 6/14 + 5/14 = 11/14.",
    },
    {
      id: 't3-10',
      prompt: "5 + 2/3 yig'indini hisoblang.",
      options: ['7/3', '5 3/2', '5 2/3', '10/3'],
      correct: 2,
      explain:
        "Natural son to'g'ri kasr bilan birlashtirib yoziladi: 5 + 2/3 = 5 2/3. (Tekshirish: 5/1 + 2/3 = 17/3 = 5 2/3.)",
    },
    {
      id: 't3-11',
      prompt: '8 − 5/6 ayirmani hisoblang.',
      options: ['7 5/6', '7 1/6', '3 1/6', '3/6'],
      correct: 1,
      explain: "Natural son maxraji 1 bo'lgan kasr sifatida yoziladi: 8/1 − 5/6 = 48/6 − 5/6 = 43/6 = 7 1/6.",
    },
    {
      id: 't3-12',
      prompt: "5 4/6 + 4 1/3 yig'indini hisoblang.",
      options: ['9 5/9', '9 1/2', '10 1/3', '10'],
      correct: 3,
      explain:
        "Kasr qismlar: 4/6 = 2/3, 2/3 + 1/3 = 1. Butun qismlar: 5 + 4 = 9, 9 + 1 = 10.",
    },
  ],
}

export const TOPIC_3_PASS = 7
