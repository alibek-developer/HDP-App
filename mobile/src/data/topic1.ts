import type { Question } from './content'

/**
 * MAVZU 1 — «Matematikaga kirish. Raqamlar va sonlar. Natural sonlar va
 * ularning ustida turli matematik amallar».
 *
 * Butun mazmun HDP Akademiyasining o'z materiallaridan (1-mavzu papkasidagi
 * nazariya fayllari va YouTube ma'ruzalaridan) ko'chirilgan: biror ta'rif,
 * misol yoki javob qo'shilmagan, birortasi tushirib qoldirilmagan.
 *
 * Videolar lokal mp4 fayllar (`1-mavzu`) bo'lib, `/videos/<id>.mp4` orqali
 * beriladi; `videos[].id` — fayl nomidagi YouTube id (kalit shu).
 * `1.11` — mavzuning yakuniy 30 savolli testi (TOPIC_1_TEST).
 */

export interface TopicVideo {
  /** Lokal fayl va YouTube'dagi bitta kalit: `<oldish>+<id>.mp4` */
  id: string
  /** Kanaldagi haqiqiy sarlavha */
  title: string
}

export type TheoryKind = "TA'RIF" | "MA'LUMOT" | 'MASALAN' | 'ESLATISH' | 'SAVOL' | 'YEHISH' | 'MAQSAQ'

export interface TheoryBlock {
  kind: TheoryKind
  text: string
}

export interface TheoryList {
  caption: string
  items: string[]
}

/** Ustun shaklidagi hisob: 8567 / + 1129 / 9696 */
export interface Stack {
  op: '+' | '−' | '·' | ':'
  rows: string[]
  result: string
}

export interface WorkedItem {
  prompt: string
  stack?: Stack
  steps?: string[]
  answer: string
}

export interface TopicProperty {
  name: string
  detail: string
  example: string
}

export interface TopicLesson {
  /** '1.1' … '1.10' */
  id: string
  n: number
  title: string
  goal: string
  /** taxminiy daqiqa */
  minutes: number
  videos: TopicVideo[]
  theory: TheoryBlock[]
  lists?: TheoryList[]
  example?: WorkedItem
  properties?: TopicProperty[]
  practice: WorkedItem[]
  /** nazariya faqat video darsda (manba faylda matn bo'lmagan bo'lim) */
  videoOnly?: boolean
}

export const TOPIC_1_META = {
  id: 'mavzu-1',
  num: 1,
  chapter: 'Matematikaga kirish. Raqamlar va sonlar. Natural sonlar va ularning ustida turli matematik amallar',
  title: 'Mavzu 1. Matematikaga kirish',
  lessonCount: 10,
}

export const TOPIC_1_LESSONS: TopicLesson[] = [
  {
    id: '1.1',
    n: 1,
    title: 'Matematikaga kirish',
    goal: "Matematika evolyutsiyasini o'rganish",
    minutes: 12,
    videos: [
      { id: '2MGetEnqjH0', title: '1.1 Raqamlar va ular haqida tushuncha (Nazariy qism)' },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Matematika fan sifatida 3000 yildan ortiq vaqt davomida o'rganiladi. Ko'pchilik matematika fanini hisob-kitobni va turli hayotda umuman kerak bo'lmaydigan shakllar (uchburchak, to'rtburchak, aylana...) bilan bog'liq vazifalarni yechishni o'rgatadigan fan sifatida biladi. Bu ham qisman to'g'ri qarash, lekin bizningcha Matematika insonga eng avvalo osonlashtirishni va vaziyatlarni oldindan tasavvur qilishni o'rgatadi. Matematika o'z evolyutsiyasida bir nechta yuzlab fanlarga (taxminan 800 dan ortiq) ajralib ketgan bo'lib (Arifmetika, Algebra, Geometriya, Analiz asoslari, Ekonometrika, Fizika, Buxgalteriya, Moliya, Stereometriya, Planimetriya, Ehtimollar nazariyasi, Statistika), bu fanlar u yoki bu shaklda matematika bilan bog'liqdir.",
      },
    ],
    lists: [
      {
        caption: 'Xulosa qiladigan bo\'lsak, matematika bizga eng avvalo ikki narsani o\'rgatadi:',
        items: ['Osonlashtirish', 'Tasavvur qilish'],
      },
      {
        caption: 'Bu kitoblar turkumi sizga matematikaning quyidagi bo\'limlarini tushunib olishingizga yordam beradi:',
        items: [
          'Arifmetika',
          'Algebra',
          'Analiz asoslari',
          'Geometriya',
          'Stereometriya',
          'Kombinatorika va ehtimollar nazariyasi',
          'Ma\'lumotlar bilan ishlash va ularni tahlil qilish',
        ],
      },
    ],
    practice: [],
  },

  {
    id: '1.2',
    n: 2,
    title: 'Son va ular haqida tushuncha. Son bilan raqamning farqi',
    goal: 'Nazariy qismni video darsdan o\'zlashtirish',
    minutes: 18,
    videos: [
      { id: 'LBURU5cp7F8', title: '1.2 Son va ular haqida tushuncha. Son bilan raqamning farqi (Nazariy qism)' },
    ],
    theory: [],
    practice: [],
    videoOnly: true,
  },

  {
    id: '1.3',
    n: 3,
    title: 'Son va ular haqida tushuncha. Son bilan raqamning farqi',
    goal: "Sonlar haqida tushuncha | Son bilan raqamni bir-biridan farqlash",
    minutes: 22,
    videos: [
      { id: 'h8Exe2N0Yp0', title: '1.3 Natural sonlar va ular haqida tushuncha (Nazariy qism)' },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: "Son — raqamlardan tashkil topgan ifoda bo'lib, miqdor nomini ifodalaydi. Harflardan so'zlar yasalgani kabi, sonlar raqamlardan yasaladi.",
      },
      {
        kind: 'MASALAN',
        text: 'Son: 567 — bu yerda 567 soni 5, 6 va 7 raqamlaridan tuzilgan. So\'z: Ona — bu yerda ona so\'zi o, n va a harflaridan tuzilgan.',
      },
    ],
    example: {
      prompt: 'ABC + MN = FEDP. Bu yerda MN – ikki xonali, ABC – uch xonali, FEDP – to\'rt xonali son, A, B, C, M, N, F, D, E, P lar raqamlar bo\'lsa, A + F ning qiymatini toping.',
      steps: [
        'Uch xonali songa ikki xonali sonni qo\'shganda yig\'indi to\'rt xonali bo\'lishi uchun uch xonali sonning birinchi xonasi eng katta raqam, ya\'ni 9 bilan boshlanishi kerak → A = 9.',
        'To\'rt xonali natijaning birinchi xonasi 1 raqamidan oshib keta olmaydi → F = 1.',
        'A + F = 9 + 1 = 10.',
      ],
      answer: '10',
    },
    practice: [
      {
        prompt: 'abc + dec = fkmc. Bu yerda abc va dec – uch xonali sonlar, fkmc esa to\'rt xonali son, a, b, c, d, e, f, m, k lar raqamlar bo\'lsa, c + f ning qiymatini toping.',
        steps: [
          'c + c yig\'indi c bilan tugaydi (c + c = ...c). Bu faqat c = 0 bo\'lgandagina o\'rinli (0 + 0 = 0).',
          'Uch xonali sonlar yig\'indisi to\'rt xonali son bergani uchun f eng birinchi raqam bo\'lib, u 1 ga teng (f = 1).',
          'Demak, c + f = 0 + 1 = 1.',
        ],
        answer: '1',
      },
      {
        prompt: '7 raqami ishtirok etgan ikki xonali sonlar nechta?',
        steps: [
          '7 o\'nliklar xonasida kelganlar (70, 71, 72, 73, 74, 75, 76, 77, 78, 79) → 10 ta.',
          '7 birliklar xonasida kelganlar (17, 27, 37, 47, 57, 67, 77, 87, 97) → 9 ta.',
          '77 ikkala joyda ham bor. Jami: 10 + 9 − 1 = 18 ta.',
        ],
        answer: '18 ta',
      },
      {
        prompt: 'Ikki xonali sonlar tarkibida nechta 7 raqami bor?',
        steps: [
          '70 dan 79 gacha 11 ta (77 da 2 ta 7 bor) va boshqa 8 ta ikki xonali sonda bittadan (17, 27, 37, 47, 57, 67, 87, 97).',
          'Jami: 11 + 8 = 19 ta 7 raqami ishlatilgan.',
        ],
        answer: '19 ta',
      },
      {
        prompt: '9 raqami ishtirok etgan ikki xonali sonlar nechta?',
        steps: [
          '7 raqamiga o\'xshash mantiq bo\'yicha: 90–99 oralig\'ida 10 ta, boshqa birliklarda 9 ta (19, 29... 89).',
          'Jami 18 ta son.',
        ],
        answer: '18 ta',
      },
      {
        prompt: 'Ikki xonali sonlar tarkibida nechta 9 raqami bor?',
        steps: ['90 dan 99 gacha 11 ta hamda 19, 29... 89 larda 8 ta.', 'Jami 19 ta 9 raqami bor.'],
        answer: '19 ta',
      },
      {
        prompt: "605568 sonning raqamlari o'rnini almashtirib, eng katta sonni hosil qiling.",
        steps: ['Eng katta son hosil qilish uchun raqamlarni kamayish tartibida joylashtiramiz: 8, 6, 6, 5, 5, 0.'],
        answer: '866550',
      },
      {
        prompt: "605568 sonning raqamlari o'rnini almashtirib, eng kichik sonni hosil qiling.",
        steps: [
          'Son 0 bilan boshlana olmaydi, shuning uchun eng kichik nol bo\'lmagan raqam (5) ni birinchi qo\'yamiz, keyin 0 va qolgan raqamlarni o\'sish tartibida joylashtiramiz.',
        ],
        answer: '505668',
      },
      {
        prompt: 'Raqamlari ayirmasi nolga teng bo\'lgan ikki xonali sonlar nechta?',
        steps: [
          'Raqamlari ayirmasi 0 bo\'lishi uchun ikkala raqami bir xil bo\'lishi kerak: 11, 22, 33, 44, 55, 66, 77, 88, 99.',
          'Jami 9 ta.',
        ],
        answer: '9 ta',
      },
      {
        prompt: 'Raqamlari yig\'indisi 8 ga teng bo\'lgan ikki xonali sonlar nechta?',
        steps: ['Ular: 17, 26, 35, 44, 53, 62, 71, 80.'],
        answer: '8 ta',
      },
    ],
  },

  {
    id: '1.4',
    n: 4,
    title: 'Natural sonlar va ular haqida tushuncha',
    goal: "Natural sonlar haqida tushunchaga ega bo'lish",
    minutes: 16,
    videos: [
      { id: 'ccUXp9nM8mg', title: '1.4 Natural sonlar ustida turli amallar. Natural sonlarni qo\'shish va ayirish (Nazariy qism)' },
      { id: 'KM_Ku5PA6LE', title: '1.4 Natural sonlar va ular haqida tushuncha (Nazariy qism)' },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: 'Sanoqda ishlatiladigan sonlarga natural sonlar deyiladi. Natural sonlardan tashkil topgan ketma-ketlik esa natural sonlar qatori deyiladi va natural sonlar qatori N harfi bilan belgilanadi. Eng kichik natural son 1, eng katta natural son esa mavjud emas!',
      },
      {
        kind: 'MASALAN',
        text: 'Natural sonlar: 3, 7, 18, 23, 458, ...',
      },
      {
        kind: 'ESLATISH',
        text: 'Natural sonlar qatori: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ...',
      },
      {
        kind: 'SAVOL',
        text: 'Nima deb o\'ylaysiz natural sonlar nima uchun paydo bo\'lgan va aynan nega natural sonlar insoniyat tomonidan ishlatilgan birinchi sonlar hisoblanadi?',
      },
    ],
    example: {
      prompt: 'Quyidagi sonlardan qaysilari natural sonlar: −8; 0; 1; 7; 49,5; 1/2; 13',
      steps: [
        '−8 — manfiy son, natural emas.',
        '0 — natural son emas.',
        '49,5 va 1/2 — kasr sonlar, natural emas.',
        'Qolganlari natural.',
      ],
      answer: '1, 7 va 13',
    },
    practice: [],
  },

  {
    id: '1.5',
    n: 5,
    title: "Natural sonlar ustida arifmetik amallar. Natural sonlarni qo'shish",
    goal: "Natural sonlarni qo'shishni o'rganish",
    minutes: 20,
    videos: [
      { id: 'HyvzrOg8LGs', title: "1.5 Natural sonlar ustida turli amallar. Natural sonlarni ko'paytirish (Nazariy qism)" },
      { id: '8Mbf-9KnH4c', title: '1.5 Natural sonlar ustida arifmetik amallar. Natural sonlarni qo\'shish (Nazariy qism)' },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: 'a sonni b soniga qo\'shish deb, natijasi c bo\'ladigan a + b = c ifodaga aytiladi. Bu yerda a – birinchi qo\'shiluvchi, b – ikkinchi qo\'shiluvchi, c esa yig\'indi deyiladi. Ixtiyoriy ikki va undan ortiq natural sonlarni qo\'shishda eng keng tarqalgan usul bu albatta «ustun shakli» usulidir.',
      },
    ],
    example: {
      prompt: "Qo'shish amalini bajaring: 8567 + 1129",
      stack: { op: '+', rows: ['8567', '1129'], result: '9696' },
      answer: '9696',
    },
    practice: [
      {
        prompt: "Qo'shish amalini bajaring: 5738831014 + 3232711884",
        stack: { op: '+', rows: ['5738831014', '3232711884'], result: '8971542898' },
        answer: '8971542898',
      },
      {
        prompt: "Qo'shiluvchilardan biri 35 taga ortib, ikkinchisi 15 taga kamaysa, yig'indi qanday o'zgaradi?",
        steps: ['+35 − 15 = +20.'],
        answer: 'Yig\'indi 20 taga ortadi',
      },
      {
        prompt: "Qo'shiluvchilardan birining qiymati 25 ga teng. Yig'indining qiymati 40 bo'lishi uchun ikkinchi qo'shiluvchining qiymati qanchaga teng bo'lishi kerak?",
        steps: ['25 + x = 40 ⇒ x = 40 − 25 = 15.'],
        answer: '15',
      },
    ],
  },

  {
    id: '1.6',
    n: 6,
    title: "Natural sonlar ustida arifmetik amallar. Natural sonlarni ayirish",
    goal: "Natural sonlarni ayirishni o'rganish",
    minutes: 18,
    videos: [
      { id: 'Zij9buDPbQU', title: '1.6 Natural sonlar ustida arifmetik amallar. Natural sonlarni ayirish (Nazariy qism)' },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: 'a sonidan b sonini ayirish deb, natijasi c bo\'ladigan a − b = c ifodaga aytiladi. Bu yerda a – kamayuvchi, b – ayriluvchi, c esa ayirma deyiladi. Sonlarni ayirishda ham ustun shaklidan foydalaniladi.',
      },
    ],
    example: {
      prompt: 'Ayirish amalini bajaring: 35147 − 2391',
      stack: { op: '−', rows: ['35147', '2391'], result: '32756' },
      answer: '32756',
    },
    practice: [
      {
        prompt: 'Ayirish amalini bajaring: 106202601413 − 33555660546',
        steps: ['106202601413 − 33555660546 = 72646940867'],
        answer: '72646940867',
      },
      {
        prompt: 'Kamayuvchi 36 taga ortib, ayriluvchi 20 taga ortsa, ayirma qanday o\'zgaradi?',
        steps: ['+36 − 20 = +16.'],
        answer: 'Ayirma 16 taga ortadi',
      },
      {
        prompt: "Ayirma 25 ga teng bo'lishi uchun 87 dan qaysi sonni ayirish kerak?",
        steps: ['87 − x = 25 ⇒ x = 87 − 25 = 62.'],
        answer: '62',
      },
    ],
  },

  {
    id: '1.7',
    n: 7,
    title: "Natural sonlar ustida arifmetik amallar. Natural sonlarni ko'paytirish",
    goal: "Natural sonlarni ko'paytirishni o'rganish",
    minutes: 24,
    videos: [
      { id: 'n6jQxtH5K98', title: '1.7 Natural sonlar ustida arifmetik amallar. Natural sonlarni ko\'paytirish (Nazariy qism)' },
    ],
    theory: [
      {
        kind: 'SAVOL',
        text: 'Shohjahon matematikadan bilimini oshirish uchun har kuni 30 ta misol yechar edi. U bu ishni 5 kun mashq qilishni rejalashtirdi. Shohjahon shu 5 kunda jami qancha misol yechadi?',
      },
      {
        kind: 'MASALAN',
        text: '1-usul — qo\'shish usuli: 30 + 30 + 30 + 30 + 30 = 150. 2-usul — ko\'paytirish usuli: 30 · 5 = 150. Javob: 150.',
      },
      {
        kind: "TA'RIF",
        text: 'Biron bir a sonini o\'z-o\'ziga b marta qo\'shish amaliga a ni b ga ko\'paytirish deyiladi va a · b ko\'rinishda ifodalanadi.',
      },
    ],
    properties: [
      {
        name: '1-xossa',
        detail: 'Har qanday son 0 ga ko\'paytirilsa, 0 hosil bo\'ladi.',
        example: '18 · 0 = 0',
      },
      {
        name: '2-xossa',
        detail: 'Har qanday son 1 ga ko\'paytirilsa, shu sonning o\'zi hosil bo\'ladi.',
        example: '23 · 1 = 23',
      },
      {
        name: '3-xossa',
        detail: "Har qanday son 10 ga, 100 ga, 1000 ga... ko'paytirilsa, oxiriga mos ravishda 1 ta, 2 ta, 3 ta... nollar qo'yiladi.",
        example: '683 · 10 = 6830 · 683 · 100 = 68300 · 683 · 1000 = 683000',
      },
    ],
    practice: [
      {
        prompt: "Ko'paytirishning xossasidan foydalanib, ko'paytmani hisoblang: 406 · 12 · 0",
        steps: ['Har qanday sonni 0 ga ko\'paytirganda natija 0 bo\'ladi.'],
        answer: '0',
      },
      {
        prompt: 'Birinchi uskuna 1 minutda 17 ta, ikkinchisida esa 19 ta detalga ishlov berish mumkin. Agar birinchi uskuna 13 minut va ikkinchi uskuna 15 minut ishlatilsa, jami nechta detalga ishlov beriladi?',
        steps: ['(17 · 13) + (19 · 15) = 221 + 285 = 506.'],
        answer: '506 detal',
      },
    ],
  },

  {
    id: '1.8',
    n: 8,
    title: "Natural sonlar ustida arifmetik amallar. Natural sonlarni bo'lish",
    goal: "Natural sonlarni bo'lishni o'rganish",
    minutes: 22,
    videos: [
      { id: 'Lr276doY7m8', title: '1.8 Natural sonlar ustida arifmetik amallar. Natural sonlarni bo\'lish (Nazariy qism)' },
    ],
    theory: [
      {
        kind: 'SAVOL',
        text: "Abbosda 30 ta olma bor edi. U olmalarni 5 ta do'stiga teng miqdorda taqsimlab berdi. Har bir do'sti nechtadan olma olgan?",
      },
      {
        kind: 'YEHISH',
        text: '30 ta olmani 5 ta guruhga ajratamiz: 30 : 5 = 6. Abbosning har bir do\'sti 6 tadan olma olgan.',
      },
      {
        kind: "TA'RIF",
        text: 'a sonini b tadan teng bo\'laklarga ajratishga a ni b ga bo\'lish deyiladi va a : b = c ko\'rinishida yoziladi. Bu yerda a – bo\'linuvchi, b – bo\'luvchi, c esa bo\'linma deyiladi.',
      },
    ],
    properties: [
      {
        name: '1-xossa',
        detail: 'Har qanday son 0 ga bo\'linsa, javob bo\'sh to\'plam bo\'ladi (nolga bo\'lish mumkin emas!).',
        example: '18 : 0 = ∅',
      },
      {
        name: '2-xossa',
        detail: "Har qanday son 1 ga bo'linsa, shu sonning o'zi hosil bo'ladi.",
        example: '23 : 1 = 23',
      },
      {
        name: '3-xossa',
        detail: '0 ni har qanday songa (0 dan tashqari) bo\'lsa, natija 0 bo\'ladi.',
        example: '0 : a = 0',
      },
    ],
    practice: [],
  },

  {
    id: '1.9',
    n: 9,
    title: "Natural sonlar ustida to'rt amalga oid misollar",
    goal: 'Natural sonlar ustida barcha amallarni bajarish',
    minutes: 15,
    videos: [],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Bir ifodada bir nechta amallar birgalikda kelsa, amallarni bajarish ketma-ketligi quyidagi darajalarga bo'linadi:",
      },
    ],
    lists: [
      {
        caption: 'Amallar darajasi',
        items: [
          '1-darajali amallar — qavs ichi',
          '2-darajali amallar — ko\'paytirish va bo\'lish',
          '3-darajali amallar — qo\'shish va ayirish',
        ],
      },
    ],
    example: {
      prompt: 'Hisoblang: 42 − (6 · 4 + 32 : 4)',
      steps: ['1) 6 · 4 = 24', '2) 32 : 4 = 8', '3) 24 + 8 = 32', '4) 42 − 32 = 10'],
      answer: '10',
    },
    practice: [
      {
        prompt: 'Amallarni bajaring: 12 · 2 + 48 : (36 − 24 : 2)',
        steps: [
          '1) 24 : 2 = 12 (qavs ichi)',
          '2) 36 − 12 = 24',
          '3) 12 · 2 = 24 va 48 : 24 = 2',
          '4) 24 + 2 = 26',
        ],
        answer: '26',
      },
    ],
  },

  {
    id: '1.10',
    n: 10,
    title: "Sonlarni darajaga ko'tarish",
    goal: "Sonlarni darajaga ko'tarishni o'rganish",
    minutes: 17,
    videos: [
      { id: 'zs94ggwQvsw', title: "1.10 Sonlarni darajaga ko'tarish (Nazariy qism)" },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: 'a sonini n-darajaga ko\'tarish deb, a ni o\'z-o\'ziga n marta ko\'paytirishga aytiladi va a · a · a ... a = aⁿ ko\'rinishda ifodalanadi.',
      },
    ],
    practice: [],
  },
]

/* ─────────── 1.11 — mavzuning yakuniy testi (30 savol) ─────────── */

export const TOPIC_1_TEST = {
  id: '1.11',
  n: 11,
  title: "Mavzu 1 yakuniy testi",
  goal: "Bo'lim bo'yicha bilimni sinash",
  /** 30 savol — manbada aytilgan hajm */
  total: 30,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't1-01',
      prompt: 'Son va raqam haqida qaysi fikr to\'g\'ri?',
      options: [
        'Son — raqamlardan tuzilgan ifoda, raqam — sonni yozishdagi belgi',
        'Raqam — sonning o\'zi, son — faqat katta miqdor',
        'Har qanday son bitta raqamdan iborat',
        '0 raqam emas, chunki hech narsani bildiradi',
      ],
      correct: 0,
      explain: 'Harflardan so\'z yasalgani kabi sonlar raqamlardan yasaladi: 567 soni 5, 6, 7 raqamlaridan tuzilgan. 0 ham raqam.',
    },
    {
      id: 't1-02',
      prompt: 'ABC + MN = FEDP (ABC — uch xonali, MN — ikki xonali, FEDP — to\'rt xonali son). A + F = ?',
      options: ['8', '9', '10', '11'],
      correct: 2,
      explain: 'Yig\'indi to\'rt xonali bo\'lishi uchun A = 9 bo\'lishi shart, natijaning birinchi raqami esa 1 dan oshmaydi: F = 1. A + F = 10.',
    },
    {
      id: 't1-03',
      prompt: 'abc + dec = fkmc (ikkita uch xonali sonning yig\'indi to\'rt xonali). c + f = ?',
      options: ['0', '1', '2', '10'],
      correct: 1,
      explain: 'c + c yig\'indi c bilan tugashi uchun c = 0. To\'rt xonali natijaning birinchi raqami f = 1. c + f = 1.',
    },
    {
      id: 't1-04',
      prompt: '7 raqami ishtirok etgan ikki xonali sonlar nechta?',
      options: ['17', '18', '19', '20'],
      correct: 1,
      explain: 'O\'nliklar xonasida 10 ta (70–79), birliklar xonasida 9 ta (17, 27 ... 97), 77 ikki marta sanalgani uchun 10 + 9 − 1 = 18.',
    },
    {
      id: 't1-05',
      prompt: 'Barcha ikki xonali sonlarni yozishda nechta 7 raqami ishlatiladi?',
      options: ['18', '19', '20', '11'],
      correct: 1,
      explain: '70–79 oralig\'ida 11 ta (77 da ikkita 7 bor) va 17, 27, 37, 47, 57, 67, 87, 97 da 8 ta. Jami 19 ta.',
    },
    {
      id: 't1-06',
      prompt: 'Barcha ikki xonali sonlarni yozishda nechta 9 raqami ishlatiladi?',
      options: ['17', '18', '19', '20'],
      correct: 2,
      explain: '90–99 oralig\'ida 11 ta (99 da ikkita 9 bor) va 19, 29 ... 89 da 8 ta. Jami 19 ta.',
    },
    {
      id: 't1-07',
      prompt: '605568 sonining raqamlari o\'rnini almashtirib hosil qilinadigan eng katta son qaysi?',
      options: ['866550', '865650', '686550', '866055'],
      correct: 0,
      explain: 'Raqamlarni kamayish tartibida joylashtiramiz: 8, 6, 6, 5, 5, 0 → 866550.',
    },
    {
      id: 't1-08',
      prompt: '605568 sonining raqamlari o\'rnini almashtirib hosil qilinadigan eng kichik son qaysi?',
      options: ['055668', '505668', '550668', '506568'],
      correct: 1,
      explain: 'Son 0 bilan boshlanmaydi: eng kichik nol bo\'lmagan raqam (5) boshga, keyin 0 va qolganlari o\'sish tartibida → 505668.',
    },
    {
      id: 't1-09',
      prompt: 'Raqamlari ayirmasi 0 ga teng bo\'lgan ikki xonali sonlar nechta?',
      options: ['8', '9', '10', '11'],
      correct: 1,
      explain: 'Ayirma 0 bo\'lishi uchun raqamlar teng bo\'lishi kerak: 11, 22, 33, 44, 55, 66, 77, 88, 99 → 9 ta.',
    },
    {
      id: 't1-10',
      prompt: 'Raqamlari yig\'indisi 8 ga teng bo\'lgan ikki xonali sonlar nechta?',
      options: ['7', '8', '9', '10'],
      correct: 1,
      explain: 'Ular: 17, 26, 35, 44, 53, 62, 71, 80 → 8 ta (08 ikki xonali son emas).',
    },
    {
      id: 't1-11',
      prompt: '−8; 0; 1; 7; 49,5; 1/2; 13 sonlaridan qaysilari natural sonlar?',
      options: ['1; 7; 13', '0; 1; 7; 13', '1; 7; 13; 49,5', '−8; 1; 7; 13'],
      correct: 0,
      explain: '−8 manfiy, 0 natural emas, 49,5 va 1/2 kasr sonlar. Natural: 1, 7, 13.',
    },
    {
      id: 't1-12',
      prompt: 'Natural sonlar qatori haqida qaysi fikr to\'g\'ri?',
      options: [
        'Eng kichik natural son 1, eng katta natural son mavjud emas',
        'Eng kichik natural son 0, eng katta natural son 9',
        'Eng kichik natural son 1, eng katta natural son 10^100',
        'Natural sonlar qatorida eng kichik va eng katta sonlar mavjud emas',
      ],
      correct: 0,
      explain: 'Sanoq 1 dan boshlanadi va qator cheksiz davom etadi — eng katta natural son yo\'q.',
    },
    {
      id: 't1-13',
      prompt: 'Natural sonlar qatori qaysi harf bilan belgilanadi?',
      options: ['N', 'Z', 'Q', 'R'],
      correct: 0,
      explain: 'Natural sonlar qatori N harfi bilan belgilanadi.',
    },
    {
      id: 't1-14',
      prompt: '8567 + 1129 = ?',
      options: ['9686', '9696', '9796', '9606'],
      correct: 1,
      explain: 'Ustun shaklida: 8567 + 1129 = 9696.',
    },
    {
      id: 't1-15',
      prompt: 'a + b = c ifodada b qanday ataladi?',
      options: ['Birinchi qo\'shiluvchi', 'Ikkinchi qo\'shiluvchi', 'Yig\'indi', 'Ayirma'],
      correct: 1,
      explain: 'a — birinchi, b — ikkinchi qo\'shiluvchi, c — yig\'indi.',
    },
    {
      id: 't1-16',
      prompt: 'Qo\'shiluvchilardan biri 35 taga ortib, ikkinchisi 15 taga kamaysa, yig\'indi qanday o\'zgaradi?',
      options: ['20 taga ortadi', '50 taga ortadi', '20 taga kamayadi', 'O\'zgarmaydi'],
      correct: 0,
      explain: '+35 − 15 = +20, ya\'ni yig\'indi 20 taga ortadi.',
    },
    {
      id: 't1-17',
      prompt: 'Bir qo\'shiluvchi 25 ga teng. Yig\'indi 40 bo\'lishi uchun ikkinchi qo\'shiluvchi nechaga teng bo\'lishi kerak?',
      options: ['15', '20', '25', '65'],
      correct: 0,
      explain: '25 + x = 40 ⇒ x = 40 − 25 = 15.',
    },
    {
      id: 't1-18',
      prompt: '35147 − 2391 = ?',
      options: ['32756', '32856', '33756', '32746'],
      correct: 0,
      explain: 'Ustun shaklida ayirish: 35147 − 2391 = 32756.',
    },
    {
      id: 't1-19',
      prompt: 'a − b = c ifodada a qanday ataladi?',
      options: ['Kamayuvchi', 'Ayriluvchi', 'Ayirma', 'Qo\'shiluvchi'],
      correct: 0,
      explain: 'a — kamayuvchi, b — ayriluvchi, c — ayirma.',
    },
    {
      id: 't1-20',
      prompt: 'Kamayuvchi 36 taga ortib, ayriluvchi 20 taga ortsa, ayirma qanday o\'zgaradi?',
      options: ['16 taga ortadi', '16 taga kamayadi', '56 taga ortadi', 'O\'zgarmaydi'],
      correct: 0,
      explain: '+36 − 20 = +16, ayirma 16 taga ortadi.',
    },
    {
      id: 't1-21',
      prompt: 'Ayirma 25 ga teng bo\'lishi uchun 87 dan qaysi sonni ayirish kerak?',
      options: ['62', '63', '112', '25'],
      correct: 0,
      explain: '87 − x = 25 ⇒ x = 87 − 25 = 62.',
    },
    {
      id: 't1-22',
      prompt: '106202601413 − 33555660546 = ?',
      options: ['72646940867', '72646941867', '72746940867', '72645940867'],
      correct: 0,
      explain: 'Katta sonlarni ustun shaklida ayirganda 72646940867 hosil bo\'ladi.',
    },
    {
      id: 't1-23',
      prompt: 'a ni b ga ko\'paytirish deb nimaga aytiladi?',
      options: [
        'a sonini o\'z-o\'ziga b marta qo\'shishga',
        'a sonini b marta ikki baravar oshirishga',
        'a va b yig\'indisini topishga',
        'a sonini b ga bo\'lishga',
      ],
      correct: 0,
      explain: 'Ko\'paytirish — bir xil qo\'shiluvchini bir necha marta qo\'shishning qisqacha yozuvi: 30 · 5 = 30+30+30+30+30 = 150.',
    },
    {
      id: 't1-24',
      prompt: '406 · 12 · 0 = ?',
      options: ['0', '4872', '48720', '406'],
      correct: 0,
      explain: '1-xossa: har qanday son 0 ga ko\'paytirilsa, natija 0 bo\'ladi.',
    },
    {
      id: 't1-25',
      prompt: '683 · 100 = ?',
      options: ['6830', '68300', '683000', '683100'],
      correct: 1,
      explain: '3-xossa: 100 ga ko\'paytirganda oxiriga 2 ta nol qo\'yiladi → 68300.',
    },
    {
      id: 't1-26',
      prompt: 'Birinchi uskuna 1 daqiqada 17 ta, ikkinchisi 19 ta detalga ishlov beradi. Birinchi uskuna 13 daqiqa, ikkinchisi 15 daqiqa ishlasa, jami nechta detal ishlanadi?',
      options: ['486', '496', '506', '516'],
      correct: 2,
      explain: '(17 · 13) + (19 · 15) = 221 + 285 = 506 detal.',
    },
    {
      id: 't1-27',
      prompt: 'Abbosda 30 ta olma bor. U 5 ta do\'stiga teng taqsimlab berdi. Har bir do\'sti nechta olma oldi?',
      options: ['5', '6', '15', '25'],
      correct: 1,
      explain: '30 : 5 = 6 — har biriga 6 tadan olma.',
    },
    {
      id: 't1-28',
      prompt: '18 : 0 va 0 : 18 ifodalar haqida qaysi fikr to\'g\'ri?',
      options: [
        'Birinchi ifoda aniqlanmagan (0 ga bo\'lish mumkin emas), ikkinchisi 0',
        'Ikkalasi ham 0 ga teng',
        'Birinchi 18, ikkinchi aniqlanmagan',
        'Ikkalasi ham aniqlanmagan',
      ],
      correct: 0,
      explain: '18 : 0 = ∅ (nolga bo\'lish mumkin emas), 0 : a = 0 (a ≠ 0) — 0 ni har qanday songa bo\'lsa natija 0.',
    },
    {
      id: 't1-29',
      prompt: 'Hisoblang: 42 − (6 · 4 + 32 : 4)',
      options: ['10', '26', '34', '58'],
      correct: 0,
      explain: 'Qavs ichida avval ko\'paytirish va bo\'lish: 24 + 8 = 32, keyin 42 − 32 = 10.',
    },
    {
      id: 't1-30',
      prompt: 'Hisoblang: 2⁵ + 3²',
      options: ['34', '40', '41', '49'],
      correct: 2,
      explain: 'Daraja — o\'z-o\'ziga ko\'paytirish: 2⁵ = 32, 3² = 9, yig\'indi 41.',
    },
  ] as Question[],
}

/* ─────────── yordamchilar ─────────── */

export const TOPIC_1_ALL: { id: string; n: number; title: string; kind: 'lesson' | 'test' }[] = [
  ...TOPIC_1_LESSONS.map(l => ({ id: l.id, n: l.n, title: l.title, kind: 'lesson' as const })),
  { id: TOPIC_1_TEST.id, n: TOPIC_1_TEST.n, title: TOPIC_1_TEST.title, kind: 'test' as const },
]

export const findTopicLesson = (id: string) =>
  TOPIC_1_LESSONS.find(l => l.id === id)

export const topicLessonIds = TOPIC_1_LESSONS.map(l => l.id)

/** 30 savolda o'tish chegarasi — «mavzu yechilgan» hisoblashi shundan */
export const TOPIC_1_PASS = 18
