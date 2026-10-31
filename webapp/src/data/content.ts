/**
 * Yagona kontent manbasi.
 * Oqim: Lesson -> Video -> Example -> Test -> Result
 * Har bir dars o'z misoli va test to'plami bilan bog'langan.
 */

export interface Question {
  id: string
  prompt: string
  options: string[]
  /** options ichidagi to'g'ri javob indeksi */
  correct: number
  /** Natija ekranida xatoni qanday to'g'rilash kerakligi */
  explain: string
}

export interface Example {
  prompt: string
  steps: string[]
  answer: string
}

export interface Lesson {
  id: number
  title: string
  topic: string
  /** daqiqa */
  duration: number
  free: boolean
  summary: string
  example: Example
  questions: Question[]
  /** Formulalar bankidagi bog'liq formula id'lari */
  formulaIds: string[]
}

export interface FormulaItem {
  id: string
  title: string
  formula: string
  desc: string
}

export interface FormulaGroup {
  cat: string
  items: FormulaItem[]
}

export interface ProblemSet {
  id: string
  title: string
  topic: string
  difficulty: 'oson' | "o'rta" | 'qiyin'
  /** sinf — ro'yxat kartasida ko'rsatiladi */
  grade: string
  /** har bir to'g'ri yechilgan masala uchun */
  coinPerSolve: number
  xpPerSolve: number
  free: boolean
  /** Pro emas, lekin coin evaziga ochiladi */
  unlockPrice?: number
  /** barcha javoblar to'g'ri bo'lsa mukofot ikkilanadi */
  perfectBonus?: boolean
  questions: Question[]
}

/* ─────────────────── FORMULALAR BANKI ─────────────────── */

export const FORMULA_GROUPS: FormulaGroup[] = [
  {
    cat: 'Algebra',
    items: [
      { id: 'f-viet', title: 'Viyet teoremasi', formula: 'x₁ + x₂ = −b/a  ·  x₁ · x₂ = c/a', desc: 'Kvadrat tenglama ildizlari xossasi' },
      { id: 'f-disc', title: 'Diskriminant', formula: 'D = b² − 4ac', desc: 'Ildizlar sonini aniqlash' },
      { id: 'f-cube', title: "Kublar yig'indisi", formula: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)', desc: "Qisqa ko'paytirish formulasi" },
      { id: 'f-aprog', title: 'Arifmetik progressiya', formula: 'Sₙ = n(a₁ + aₙ)/2', desc: "n ta hadning yig'indisi" },
      { id: 'f-gprog', title: 'Geometrik progressiya', formula: 'bₙ = b₁ · qⁿ⁻¹', desc: "n-hadni topish" },
      { id: 'f-comb', title: "Kombinatorika", formula: 'C(n,k) = n! / (k!(n−k)!)', desc: "Terma (sanoq) formulasi" },
    ],
  },
  {
    cat: 'Trigonometriya',
    items: [
      { id: 'f-base', title: 'Asosiy tenglik', formula: 'sin²α + cos²α = 1', desc: 'Pythagorean identichlik' },
      { id: 'f-dbl', title: 'Ikkilangan burchak', formula: 'sin 2α = 2 sin α · cos α', desc: 'Ikkilangan burchak formulasi' },
      { id: 'f-reduce', title: 'Keltirish formulasi', formula: 'sin(π/2 − α) = cos α', desc: "π/2 bo'yicha reduksiya" },
      { id: 'f-tg', title: 'Tangens ta\'rifi', formula: 'tg α = sin α / cos α', desc: 'Asosiy nisbatlar bog\'lanishi' },
    ],
  },
  {
    cat: 'Analiz',
    items: [
      { id: 'f-chain', title: 'Zanjir qoidasi', formula: "(f(g(x)))′ = f′(g(x)) · g′(x)", desc: 'Murakkab funksiya hosilasi' },
      { id: 'f-pow', title: 'Daraja integrali', formula: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C', desc: 'n ≠ −1 uchun' },
      { id: 'f-deriv', title: 'Daraja hosilasi', formula: "(xⁿ)′ = n · xⁿ⁻¹", desc: 'Eng asosiy hosila qoidasi' },
    ],
  },
  {
    cat: 'Geometriya',
    items: [
      { id: 'f-cos', title: 'Kosinuslar teoremasi', formula: 'a² = b² + c² − 2bc · cos α', desc: 'Ixtiyoriy uchburchak uchun' },
      { id: 'f-circle', title: 'Aylana', formula: 'C = 2πr  ·  S = πr²', desc: 'Uzunlik va yuza' },
      { id: 'f-tri', title: 'Uchburchak yuzasi', formula: 'S = ½ · a · h', desc: 'Asos va balandlik orqali' },
    ],
  },
]

/** id bo'yicha formula topish */
export function findFormula(id: string): FormulaItem | undefined {
  for (const g of FORMULA_GROUPS) {
    const hit = g.items.find(i => i.id === id)
    if (hit) return hit
  }
  return undefined
}

/* ─────────────────── DARSLAR ─────────────────── */
/* 1–10 bepul, 11+ faqat Pro obunachilar uchun */

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Matematik mantiq asoslari',
    topic: 'Algebra',
    duration: 18,
    free: true,
    summary: 'Propozitsiyalar, ularning inkori va ekvivalentlik tushunchasi.',
    example: {
      prompt: "«Agar x > 5 bo'lsa, x² > 25» propsizitsiyasining inkorini yozing.",
      steps: [
        "Implikatsiya inkori: ¬(p → q) ≡ p ∧ ¬q",
        "Demak: «x > 5 bo'lsa-yu, x² ≤ 25 bo'lmasin»",
        "Ya'ni: x > 5 AND x² ≤ 25",
      ],
      answer: "x > 5 va x² ≤ 25",
    },
    questions: [
      { id: 'q1-1', prompt: "¬(p ∧ q) ga teng ifoda:", options: ['¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∨ q', '¬p → q'], correct: 1, explain: "De Morgan qonuni: ¬(p ∧ q) ≡ ¬p ∨ ¬q. Inkor bo'lganda ∧ → ∨ ga o'zgaradi." },
      { id: 'q1-2', prompt: "«x = 2» uchun «x² = 4» qanday shart:", options: ['Zarur va yetarli', 'Yetarli, lekin zarur emas', 'Zarur, lekin yetarli emas', 'Hech qanday aloqasi yo\'q'], correct: 1, explain: "x = 2 bo'lsa x² = 4 albatta. Lekin x² = 4 da x = −2 ham bo'lishi mumkin — shuning uchun yetarli, ammo zarur emas." },
      { id: 'q1-3', prompt: "p — yolg'on, q — rost. p → q qiymati:", options: ['Yolg\'on', 'Rost', 'Aniqlanmagan', 'Ikkalasi ham'], correct: 1, explain: "Implikatsiya faqat p rost, q yolg'on bo'lgandagina yolg'on bo'ladi. Barcha boshqa holatda rost." },
    ],
    formulaIds: [],
  },
  {
    id: 2,
    title: "Haqiqiy sonlar to'plami",
    topic: 'Algebra',
    duration: 24,
    free: true,
    summary: 'Ratsional va irratsional sonlar, moduly va oraliqlar.',
    example: {
      prompt: '|x − 3| < 5 tengsizlikni yeching.',
      steps: [
        "Modul ta'rifi: −5 < x − 3 < 5",
        "Har qismga 3 qo'shamiz",
        "−2 < x < 8",
      ],
      answer: 'x ∈ (−2; 8)',
    },
    questions: [
      { id: 'q2-1', prompt: "√50 ni soddalashtiring:", options: ['5√2', '2√5', '25√2', '10√5'], correct: 0, explain: "√50 = √(25·2) = √25 · √2 = 5√2. Ildiz ostidan to'liq kvadratni tashqariga chiqaramiz." },
      { id: 'q2-2', prompt: "Quyidagilardan irratsional son:", options: ['0.25', '√16', 'π', '2/3'], correct: 2, explain: "π — ratsional bo'lmagan, cheksiz o'nlik kasr. √16 = 4 esa ratsional." },
      { id: 'q2-3', prompt: "|−7| + |3| ifodaning qiymati:", options: ['−4', '4', '10', '−10'], correct: 2, explain: "Modul har doim musbat: |−7| = 7, |3| = 3, yig'indi 10." },
    ],
    formulaIds: [],
  },
  {
    id: 3,
    title: 'Chiziqli tenglamalar',
    topic: 'Algebra',
    duration: 32,
    free: true,
    summary: 'Bir nomalumli tenglamalar va ularni tekshirish usuli.',
    example: {
      prompt: '3(x − 2) + 4 = 2x + 5 tenglamani yeching.',
      steps: [
        'Qavslarni ochamiz: 3x − 6 + 4 = 2x + 5',
        'Ikkala tomonni ixchamlaymiz: 3x − 2 = 2x + 5',
        'x ni ajratamiz: 3x − 2x = 5 + 2  →  x = 7',
      ],
      answer: 'x = 7',
    },
    questions: [
      { id: 'q3-1', prompt: '2x + 6 = 0  →  x = ?', options: ['3', '−3', '6', '−6'], correct: 1, explain: "2x = −6, demak x = −6/2 = −3. Erkin had o'ng tomonga ishorasi almashtirilib o'tkaziladi." },
      { id: 'q3-2', prompt: '(x/3) = 4  →  x = ?', options: ['4/3', '12', '7', '16'], correct: 1, explain: "Maxrajga ko'paytiramiz: x = 4 · 3 = 12." },
      { id: 'q3-3', prompt: '5x − 2 = 3x + 8  →  x = ?', options: ['3', '5', '8', '2'], correct: 1, explain: "5x − 3x = 8 + 2 → 2x = 10 → x = 5. noma'lumlar bir tomonga, sonlar ikkinchi tomonga." },
    ],
    formulaIds: [],
  },
  {
    id: 4,
    title: 'Kvadrat tenglamalar va Viyet teoremasi',
    topic: 'Algebra',
    duration: 22,
    free: true,
    summary: 'Diskriminant, ildizlar va ularning yig\'indisi/ayirmasi.',
    example: {
      prompt: "x² − 7x + 12 = 0 tenglama ildizlarini toping.",
      steps: [
        'Viyet bo\'yicha: x₁ + x₂ = 7, x₁ · x₂ = 12',
        "Ko'paytmasi 12, yig'indisi 7 bo'lgan sonlar: 3 va 4",
        'Tekshirish: D = 49 − 48 = 1 > 0 — ikki ildiz tasdiqlandi',
      ],
      answer: 'x₁ = 3, x₂ = 4',
    },
    questions: [
      { id: 'q4-1', prompt: 'x² − 5x + 6 = 0 ildizlari yig\'indisi:', options: ['6', '5', '−5', '25'], correct: 1, explain: "Viyet teoremasi: yig'indi = −b/a = −(−5)/1 = 5." },
      { id: 'q4-2', prompt: 'D = b² − 4ac. Agar D < 0 bo\'lsa:', options: ['Ikkita ildiz', 'Bitta ildiz', 'Haqiqiy ildiz yo\'q', 'Cheksiz ildiz'], correct: 2, explain: "Diskriminant manfiy bo'lsa, kvadrat tenglamaning haqiqiy ildizi bo'lmaydi." },
      { id: 'q4-3', prompt: 'x² + 4x + 4 = 0 tenglama uchun D:', options: ['8', '0', '16', '−16'], correct: 1, explain: "D = 16 − 16 = 0. D = 0 bo'lsa tenglamaning bitta (ikki karrali) ildizi bor: x = −2." },
    ],
    formulaIds: ['f-viet', 'f-disc'],
  },
  {
    id: 5,
    title: 'Modulli tenglamalar va grafiklar',
    topic: 'Algebra',
    duration: 26,
    free: true,
    summary: 'Modul ta\'rifi, oraliqlarni ifodalash va grafik tahlili.',
    example: {
      prompt: '|2x − 1| = 5 tenglamani yeching.',
      steps: [
        'Modul ostidagi ifoda ikki holatda: 2x − 1 = 5 yoki 2x − 1 = −5',
        'Birinchi holat: 2x = 6 → x = 3',
        'Ikkinchi holat: 2x = −4 → x = −2',
      ],
      answer: 'x = 3; x = −2',
    },
    questions: [
      { id: 'q5-1', prompt: '|x| = 4  →  x = ?', options: ['4', '−4', '±4', '0'], correct: 2, explain: "Modul masofa — ikki yo'nalishda ham 4 ga teng nuqtalar bor: +4 va −4." },
      { id: 'q5-2', prompt: '|x| < 2 tengsizlik yechimi:', options: ['(−2; 2)', '(2; ∞)', '(−∞; 2)', '[2; ∞)'], correct: 0, explain: "0 dan masofasi 2 kichik sonlar — −2 va 2 oralig'i." },
      { id: 'q5-3', prompt: 'y = |x| grafigi shakli:', options: ['To\'g\'ri chiziq', 'Parabola', 'V shakli', 'Giperbola'], correct: 2, explain: "Modul grafigi uchida (0;0) qirrali V shaklini hosil qiladi." },
    ],
    formulaIds: [],
  },
  {
    id: 6,
    title: 'Funksiyalar va ularning grafigi',
    topic: 'Analiz',
    duration: 30,
    free: true,
    summary: 'Aniqlanish sohasi, qiymatlar to\'plami va funksiya o\'zgarishlari.',
    example: {
      prompt: 'f(x) = 1/(x − 3) funksiyaning aniqlanish sohasini toping.',
      steps: [
        "Maxraj nol bo'lmasligi kerak",
        'x − 3 ≠ 0',
        'x ≠ 3',
      ],
      answer: 'D(f) = ℝ ∖ {3}',
    },
    questions: [
      { id: 'q6-1', prompt: 'f(x) = x² − 2 bo\'lsa, f(3) = ?', options: ['7', '9', '5', '11'], correct: 0, explain: "O'rniga qo'yamiz: f(3) = 9 − 2 = 7." },
      { id: 'q6-2', prompt: '√(x − 4) funksiya aniqlanish sohasi:', options: ['x ≥ 4', 'x ≤ 4', 'x > 4', 'barcha ℝ'], correct: 0, explain: "Ildiz osti manfiy bo'lmasligi kerak: x − 4 ≥ 0 → x ≥ 4." },
      { id: 'q6-3', prompt: 'y = 2x + 1 grafigining og\'ish burchagi koeffitsienti:', options: ['1', '2', '−2', '0.5'], correct: 1, explain: "y = kx + b ko'rinishida k — og'ish koeffitsienti, bu yerda k = 2." },
    ],
    formulaIds: [],
  },
  {
    id: 7,
    title: 'Trigonometrik funksiyalar kirish',
    topic: 'Trigonometriya',
    duration: 25,
    free: true,
    summary: 'Sinus, kosinus, tangens va asosiy ayniyatlar.',
    example: {
      prompt: 'sin α = 3/5 (α — o\'tkinchi burchak). cos α ni toping.',
      steps: [
        'Asosiy tenglik: sin²α + cos²α = 1',
        'cos²α = 1 − 9/25 = 16/25',
        "α o'tkinchi burchak → cos α > 0 → cos α = 4/5",
      ],
      answer: 'cos α = 4/5',
    },
    questions: [
      { id: 'q7-1', prompt: 'sin 30° = ?', options: ['√3/2', '1/2', '1', '0'], correct: 1, explain: "sin 30° = 1/2 — bu asosiy qiymat, yodlash shart." },
      { id: 'q7-2', prompt: 'cos 0° = ?', options: ['0', '√2/2', '1', '−1'], correct: 2, explain: "Nol burchakda kosinus maksimal: cos 0° = 1." },
      { id: 'q7-3', prompt: 'Quyidagi tenglik NOTO\'G\'RI:', options: ['sin²x + cos²x = 1', 'tg x = sin x / cos x', 'sin 2x = 2 sin x', 'cos 2x = cos²x − sin²x'], correct: 2, explain: "To'g'ri formula: sin 2x = 2 sin x · cos x. cos x omili tushirib qoldirilgan." },
    ],
    formulaIds: ['f-base', 'f-dbl', 'f-reduce', 'f-tg'],
  },
  {
    id: 8,
    title: 'Sinuslar va kosinuslar teoremasi',
    topic: 'Geometriya',
    duration: 28,
    free: true,
    summary: 'Noma\'lum tomon va burchaklarni topish usullari.',
    example: {
      prompt: "Uchburchakda b = 5, c = 8, α = 60°. a tomonni toping.",
      steps: [
        'Kosinuslar teoremasi: a² = b² + c² − 2bc · cos α',
        'a² = 25 + 64 − 2·5·8·0.5 = 89 − 40 = 49',
        'a = √49 = 7',
      ],
      answer: 'a = 7',
    },
    questions: [
      { id: 'q8-1', prompt: 'Kosinuslar teoremasi qachon qo\'llanadi:', options: ['Faqat to\'g\'ri burchakli', 'Ixtiyoriy uchburchakda', 'Faqat teng tomonli', 'Doim faqat 2 tomonda'], correct: 1, explain: "Kosinuslar teoremasi ixtiyoriy uchburchak uchun o'rinli; Pifagor — faqat to'g'ri burchakli holatning xususiyati." },
      { id: 'q8-2', prompt: 'Sinuslar teoremasi nisbat:', options: ['a/sin A = b/sin B', 'a·sin A = b·sin B', 'a/sin B = b/sin A', 'sin A/sin B = b/a'], correct: 0, explain: "Har bir tomon o'z qarshisidagi burchak sinusiga nisbati o'zgarmas (2R ga teng)." },
      { id: 'q8-3', prompt: 'To\'g\'ri burchakli uchburchakda sin A = ?', options: ['qarshi/yaltoq', 'yaltoq/qarshi', 'qo\'shni/yaltoq', 'qarshi/qo\'shni'], correct: 0, explain: "Sinus — qarshi tomonning gipotenuzaga (yaltoq tomon) nisbati." },
    ],
    formulaIds: ['f-cos', 'f-tri'],
  },
  {
    id: 9,
    title: 'Progressiyalar',
    topic: 'Algebra',
    duration: 20,
    free: true,
    summary: 'Arifmetik va geometrik progressiya, yig\'indi formulalari.',
    example: {
      prompt: "a₁ = 4, d = 3 arifmetik progressiyada 10 ta had yig'indisini toping.",
      steps: [
        'a₁₀ = a₁ + 9d = 4 + 27 = 31',
        "S₁₀ = n(a₁ + a₁₀)/2 = 10(4 + 31)/2",
        'S₁₀ = 10 · 35 / 2 = 175',
      ],
      answer: 'S₁₀ = 175',
    },
    questions: [
      { id: 'q9-1', prompt: "Arifmetik progressiyada a₁=2, d=5. a₄ = ?", options: ['17', '20', '22', '12'], correct: 0, explain: "aₙ = a₁ + (n−1)d → a₄ = 2 + 3·5 = 17. 4 emas, 3 ga ko'paytiriladi." },
      { id: 'q9-2', prompt: 'Geometrik progressiyada b₁=3, q=2. b₃ = ?', options: ['6', '9', '12', '18'], correct: 2, explain: "bₙ = b₁·qⁿ⁻¹ → b₃ = 3·2² = 12." },
      { id: 'q9-3', prompt: "1 + 2 + 4 + ... + 64 yig'indi (q=2):", options: ['127', '128', '126', '255'], correct: 0, explain: "S = (qⁿ − 1)/(q − 1) = (128 − 1)/1 = 127. 64 = 2⁶, jami 7 ta had." },
    ],
    formulaIds: ['f-aprog', 'f-gprog'],
  },
  {
    id: 10,
    title: 'Hosila va uning geometrik ma\'nosi',
    topic: 'Analiz',
    duration: 35,
    free: true,
    summary: 'Hosila ta\'rifi, asosiy qoidalar va urinma.',
    example: {
      prompt: 'f(x) = x³ − 3x funksiyaning x = 2 dagi hosilasini toping.',
      steps: [
        "Hosila qoidasi: (xⁿ)′ = n·xⁿ⁻¹, (cx)′ = c",
        "f′(x) = 3x² − 3",
        "f′(2) = 3·4 − 3 = 9",
      ],
      answer: 'f′(2) = 9',
    },
    questions: [
      { id: 'q10-1', prompt: '(x⁵)′ = ?', options: ['x⁴', '5x⁴', '5x⁵', '4x⁵'], correct: 1, explain: "Daraja hosilasi: (xⁿ)′ = n·xⁿ⁻¹ → 5x⁴. Daraja oldinga chiqadi, daraja bittaga kamayadi." },
      { id: 'q10-2', prompt: "f′(x₀) funksiya grafigiga o'tkazilgan urinmaning...", options: ['Yuzasi', 'Burchak koeffitsienti', 'Uzunligi', 'Ortmasi'], correct: 1, explain: "Hosila — urinma burchak koeffitsienti (og'ish qiymati)." },
      { id: 'q10-3', prompt: '(3x² + 7)′ = ?', options: ['6x + 7', '6x', '3x', '6x²'], correct: 1, explain: "O'zgarmas son hosilasi 0: (7)′ = 0, javob 6x." },
    ],
    formulaIds: ['f-deriv', 'f-chain'],
  },

  /* ─── PRO DARSLAR (11–16) ─── */
  {
    id: 11,
    title: 'Murakkab funksiyalar tahlili',
    topic: 'Analiz',
    duration: 42,
    free: false,
    summary: 'Zanjir qoidasi va yuqori tartibli hosilalar.',
    example: {
      prompt: 'y = sin(x²) hosilasini toping.',
      steps: ['Tashqi funksiya: sin u → cos u', 'Ichki funksiya: x² → 2x', "Zanjir: y′ = cos(x²) · 2x"],
      answer: "y′ = 2x·cos(x²)",
    },
    questions: [
      { id: 'q11-1', prompt: '(e³ˣ)′ = ?', options: ['e³ˣ', '3e³ˣ', '3x·e³ˣ', 'eˣ'], correct: 1, explain: "Zanjir qoidasi: (eᵘ)′ = eᵘ·u′, u = 3x → u′ = 3." },
      { id: 'q11-2', prompt: "(ln x)′ = ?", options: ['1/x', 'ln x / x', 'x', 'eˣ'], correct: 0, explain: "Logarifm hosilasi: (ln x)′ = 1/x." },
    ],
    formulaIds: ['f-chain'],
  },
  {
    id: 12,
    title: 'IMO darajasidagi tenglamalar',
    topic: 'Olimpiada',
    duration: 55,
    free: false,
    summary: 'Diophant tenglamalari va butun son yechimlari.',
    example: {
      prompt: "x² + y² = 25 butun yechimlarini toping.",
      steps: ['0 dan 5 gacha kvadratlarni ko\'raylik', '25 = 0 + 25 = 9 + 16 = 16 + 9 = 25 + 0', '(±5, 0), (0, ±5), (±3, ±4), (±4, ±3)'],
      answer: '12 ta yechim',
    },
    questions: [
      { id: 'q12-1', prompt: '2x + 3y = 12 ning natural yechimlari soni:', options: ['1', '2', '3', '4'], correct: 0, explain: "x=3, y=2 — bitta natural yechim. Boshqalarida yoki 0 chiqadi, yoki kasr." },
      { id: 'q12-2', prompt: "Eng kichik tub son:", options: ['0', '1', '2', '3'], correct: 2, explain: "2 — eng kichik va yagona juft tub son. 1 tub son hisoblanmaydi." },
    ],
    formulaIds: [],
  },
  {
    id: 13,
    title: 'DTM 2025 tahlili va strategiyasi',
    topic: 'DTM Prep',
    duration: 48,
    free: false,
    summary: 'Oxirgi 3 yil testlari tahlili va vaqtni taqsimlash.',
    example: {
      prompt: "Testda 30 savol, 60 daqiqa. Optimal strategiya?",
      steps: ['Har savolga o\'rtacha 2 daqiqa', '1 daqiqada yechilmagan savolni belgilab o\'tamiz', 'Qaytib kelganda faqat "yarim" savollarga vaqt sarflaymiz'],
      answer: 'Avval osonlar, keyin qiyinlar',
    },
    questions: [
      { id: 'q13-1', prompt: "Ko'p variantli testda taxmin qilish strategiyasi:", options: ['Hech qachon taxmin qilma', 'Aniq noto\'g\'ri variantlarni chiqarib tashla', 'Har doim A ni tanla', 'Tasodifiy tanla'], correct: 1, explain: "1-2 variantni chiqarib tashlash ehtimolni 25% dan 50% ga ko'taradi." },
      { id: 'q13-2', prompt: 'DTM matematikada eng ko\'p uchraydigan blok:', options: ['Mantiq', 'Funksiyalar va hosila', 'Statistika', 'Kombinatorika'], correct: 1, explain: "Analiz boshqari (funksiya, hosila, integral) odatda eng katta ulushga ega." },
    ],
    formulaIds: [],
  },
  {
    id: 14,
    title: 'Vektorlar va koordinatalar',
    topic: 'Geometriya',
    duration: 38,
    free: false,
    summary: 'Fazoviy koordinatalar, skalyar ko\'paytma.',
    example: {
      prompt: 'a(1, 2) va b(3, −4) skalyar ko\'paytmasini toping.',
      steps: ['Skalyar ko\'paytma: a·b = x₁x₂ + y₁y₂', 'a·b = 1·3 + 2·(−4)', 'a·b = 3 − 8 = −5'],
      answer: '−5',
    },
    questions: [
      { id: 'q14-1', prompt: '|a| agar a = (3, 4):', options: ['7', '5', '12', '25'], correct: 1, explain: "|a| = √(9 + 16) = √25 = 5." },
      { id: 'q14-2', prompt: 'Ikki vektor perpendikulyar bo\'lsa ularning skalyar ko\'paytmasi:', options: ['1', 'Ularning yig\'indisi', '0', 'Manfiy'], correct: 2, explain: "Perpendikulyar vektorlarda cos 90° = 0 → skalyar ko'paytma 0." },
    ],
    formulaIds: [],
  },
  {
    id: 15,
    title: 'Aniq integral va yuzalar',
    topic: 'Analiz',
    duration: 44,
    free: false,
    summary: 'Nyuton-Leybniz formulasi, egri chiziqli soha yuzasi.',
    example: {
      prompt: '∫₀² x² dx ni hisoblang.',
      steps: ['Boshlangich funksiya: F(x) = x³/3', 'Nyuton-Leybniz: F(2) − F(0)', '= 8/3 − 0 = 8/3'],
      answer: '8/3',
    },
    questions: [
      { id: 'q15-1', prompt: '∫₁³ 2 dx = ?', options: ['2', '4', '6', '8'], correct: 1, explain: "O'zgarmas integral: 2·(3−1) = 4." },
      { id: 'q15-2', prompt: '∫₀¹ x dx = ?', options: ['1', '0.5', '2', '0'], correct: 1, explain: "x²/2 |₀¹ = 1/2 − 0 = 0.5." },
    ],
    formulaIds: ['f-pow'],
  },
  {
    id: 16,
    title: 'Murakkab trigonometrik tengsizliklar',
    topic: 'Trigonometriya',
    duration: 50,
    free: false,
    summary: 'Ishora metodasi va davriy oraliqlar.',
    example: {
      prompt: 'sin x > 1/2 tengsizlikni yeching.',
      steps: ['sin x = 1/2 → x = π/6 va x = 5π/6', '(π/6; 5π/6) oralig\'ida sin x > 1/2', "Davriylik: +2πk, k ∈ ℤ"],
      answer: 'x ∈ (π/6 + 2πk; 5π/6 + 2πk)',
    },
    questions: [
      { id: 'q16-1', prompt: 'cos x ning davri:', options: ['π', '2π', 'π/2', '4π'], correct: 1, explain: "Sinus va kosinus davri 2π; tangensniki π." },
      { id: 'q16-2', prompt: 'sin x = 0 yechimlari:', options: ['πk', '2πk', 'π/2 + πk', 'π/2 + 2πk'], correct: 0, explain: "Sinus har π da nolga aylanadi: x = πk, k ∈ ℤ." },
    ],
    formulaIds: ['f-base', 'f-reduce'],
  },
]

export const FREE_LESSON_COUNT = LESSONS.filter(l => l.free).length

export function findLesson(id: number): Lesson | undefined {
  return LESSONS.find(l => l.id === id)
}

/* ─────────────────── MASALA TO'PLAMLARI ─────────────────── */
/* Maqsad: ko'proq mashq. Har bir to'g'ri yechim coin keltiradi. */

export const PROBLEM_SETS: ProblemSet[] = [
  {
    id: 'ps-trig',
    title: 'Trigonometriya mashqlari',
    topic: 'Trigonometriya',
    difficulty: 'oson',
    grade: "9-sinf",
    coinPerSolve: 10,
    xpPerSolve: 15,
    free: true,
    questions: [
      { id: 't1', prompt: 'tg 45° = ?', options: ['0', '1', '√3', '1/2'], correct: 1, explain: 'tg 45° = sin45/cos45 = 1. 45° da sinus va kosinus teng.' },
      { id: 't2', prompt: 'sin 90° = ?', options: ['0', '1/2', '√2/2', '1'], correct: 3, explain: 'sin 90° = 1 — maksimal qiymat.' },
      { id: 't3', prompt: 'cos 60° = ?', options: ['1/2', '√3/2', '√2/2', '0'], correct: 0, explain: 'cos 60° = 1/2. sin 30° bilan bir xil, chunki 60° va 30° — qo\'shni burchaklar.' },
      { id: 't4', prompt: 'sin²30° + cos²30° = ?', options: ['0', '1/2', '1', '2'], correct: 2, explain: "Asosiy tenglik istalgan burchakda 1 ga teng — hisoblash shart emas." },
    ],
  },
  {
    id: 'ps-eq',
    title: 'Tenglamalar banki',
    topic: 'Algebra',
    difficulty: "o'rta",
    grade: "8-sinf",
    coinPerSolve: 15,
    xpPerSolve: 20,
    free: true,
    questions: [
      { id: 'e1', prompt: 'x² − 9 = 0  →  x = ?', options: ['3', '−3', '±3', '9'], correct: 2, explain: "x² = 9 → x = ±3. Manfiy ildizni ham unutma: (−3)² = 9." },
      { id: 'e2', prompt: 'log₂ 16 = ?', options: ['2', '4', '8', '16'], correct: 1, explain: "2⁴ = 16, demak log₂16 = 4." },
      { id: 'e3', prompt: '3^(x) = 27  →  x = ?', options: ['2', '3', '4', '9'], correct: 1, explain: "27 = 3³, asoslar teng bo'lsa ko'rsatkichlar teng: x = 3." },
      { id: 'e4', prompt: '2x² − 8 = 0 ning musbat ildizi:', options: ['2', '4', '√2', '8'], correct: 0, explain: 'x² = 4 → x = 2 (musbat ildiz so\'ralgan).' },
      { id: 'e5', prompt: '√(x + 5) = 4  →  x = ?', options: ['9', '11', '21', '16'], correct: 1, explain: 'Ikkala tomonni kvadratga: x + 5 = 16 → x = 11.' },
    ],
  },
  {
    id: 'ps-deriv',
    title: 'Hosila ustidan mashq',
    topic: 'Analiz',
    difficulty: 'qiyin',
    grade: "11-sinf",
    coinPerSolve: 25,
    xpPerSolve: 35,
    free: true,
    questions: [
      { id: 'd1', prompt: '(4x³)′ = ?', options: ['12x²', '4x²', '3x²', '12x³'], correct: 0, explain: "O'zgarmas chiqadi, daraja tushadi: 4·3x² = 12x²." },
      { id: 'd2', prompt: '(sin x)′ = ?', options: ['−sin x', 'cos x', '−cos x', 'tg x'], correct: 1, explain: "(sin x)′ = cos x — yodlash shart." },
      { id: 'd3', prompt: "(cos x)′ = ?", options: ['sin x', '−sin x', 'cos x', '−cos x'], correct: 1, explain: "(cos x)′ = −sin x. Manfiy ishora ko'p xatoga yo'l qo'yiladi." },
      { id: 'd4', prompt: 'f(x) = x², x = 3 dagi urinma burchak koeffitsienti:', options: ['3', '6', '9', '2'], correct: 1, explain: "f′(x) = 2x → f′(3) = 6." },
    ],
  },
  {
    id: 'ps-geo',
    title: 'Geometriya masalalari',
    topic: 'Geometriya',
    difficulty: "o'rta",
    grade: "9-sinf",
    coinPerSolve: 15,
    xpPerSolve: 20,
    free: false,
    unlockPrice: 200,
    questions: [
      { id: 'g1', prompt: 'r = 5 aylana yuzasi:', options: ['10π', '25π', '5π', '50π'], correct: 1, explain: 'S = πr² = 25π.' },
      { id: 'g2', prompt: 'Tomoni 6 bo\'lgan teng tomonli uchburchak yuzasi:', options: ['9√3', '6√3', '18', '3√3'], correct: 0, explain: 'S = a²√3/4 = 36√3/4 = 9√3.' },
      { id: 'g3', prompt: 'Katetlari 6 va 8 bo\'lgan uchburchak gipotenuzasi:', options: ['10', '12', '14', '7'], correct: 0, explain: 'Pifagor: √(36+64) = √100 = 10.' },
    ],
  },
  {
    id: 'ps-olymp',
    title: 'Olimpiada darajasi',
    topic: 'Olimpiada',
    difficulty: 'qiyin',
    grade: "10–11-sinf",
    coinPerSolve: 40,
    xpPerSolve: 60,
    free: false,
    unlockPrice: 200,
    questions: [
      { id: 'o1', prompt: '10 kishidan 3 kishili jamoa nechta usulda tanlanadi:', options: ['120', '720', '30', '300'], correct: 0, explain: 'C(10,3) = 10!/(3!·7!) = 120. Tartib muhim bo\'lmaganda — terma.' },
      { id: 'o2', prompt: '5 xatni 5 konvertga noto\'g\'ri joylashtirish (derangement) soni:', options: ['44', '24', '120', '12'], correct: 0, explain: "D₅ = 44. Formula: Dₙ = n!·Σ(−1)ᵏ/k!." },
    ],
  },
]

export function findProblemSet(id: string): ProblemSet | undefined {
  return ALL_SETS.find(s => s.id === id)
}

/* ─────────────────── MASHQ REJIMLARI ─────────────────── */
/* Streak va Sinov — mavjud savollardan yig'iladigan sintetik to'plamlar.
   Bitta yechish dvigateli (/problems/:setId) hammasini ko'taradi. */

const questionsByDifficulty = (d: ProblemSet['difficulty']) =>
  PROBLEM_SETS.filter(s => s.difficulty === d).flatMap(s => s.questions)

export const STREAK_SET: ProblemSet = {
  id: 'ps-streak',
  title: 'Streak Seriya',
  topic: 'Aralash',
  difficulty: 'oson',
  grade: '9–11-sinf',
  coinPerSolve: 10,
  xpPerSolve: 15,
  free: true,
  perfectBonus: true,
  questions: [...questionsByDifficulty('oson'), ...questionsByDifficulty("o'rta")].slice(0, 10),
}

export const EXAM_SET: ProblemSet = {
  id: 'ps-exam',
  title: 'Umumiy sinov',
  topic: 'Aralash',
  difficulty: 'qiyin',
  grade: '9–11-sinf',
  coinPerSolve: 20,
  xpPerSolve: 30,
  free: false,
  questions: [
    ...PROBLEM_SETS.flatMap(s => s.questions),
    ...LESSONS.filter(l => l.free).flatMap(l => l.questions),
  ].slice(0, 30),
}

export const ALL_SETS: ProblemSet[] = [...PROBLEM_SETS, STREAK_SET, EXAM_SET]

/**
 * Kunlik mega masala — kun raqamiga qarab bepul to'plamlardan biri aylanadi.
 * Yarim tunda yangilanadi; bonus bir marta beriladi.
 */
export function dailyProblem(date = new Date()) {
  const free = PROBLEM_SETS.filter(s => s.free)
  const start = new Date(date.getFullYear(), 0, 0)
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000)
  const set = free[day % free.length]
  return { set, question: set.questions[day % set.questions.length], day }
}
