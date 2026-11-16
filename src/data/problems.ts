import type { ProblemSet, Question } from './content'

/**
 * Masalalar bo'limining o'quv xaritasi: fan → daraja → 10 masalalik sessiya.
 * Har daraja 3 yulduzgacha baholanadi (6/8/10 to'g'ri javob), yulduzlar
 * faqat shu yerda — javob to'g'riligi sessiya ichida ko'rsatilmaydi.
 */

export type ProblemSubjectId = 'algebra' | 'geometriya' | 'stereometriya'
export type LevelKey = 'oson' | "o'rta" | 'qiyin'

export interface ProblemSubject {
  id: ProblemSubjectId
  name: string
  /** MaterialCommunityIcons nomi — ekran tomonda cast qiladi */
  icon: string
  note: string
}

export interface ProblemLevel {
  id: string
  subjectId: ProblemSubjectId
  subjectName: string
  level: LevelKey
  label: string
  brief: string
  coinPerSolve: number
  xpPerSolve: number
  questions: Question[]
}

export const PROBLEM_SUBJECTS: ProblemSubject[] = [
  { id: 'algebra', name: 'Algebra', icon: 'calculator-variant', note: 'Ifodalar, tenglama, progressiya' },
  { id: 'geometriya', name: 'Geometriya', icon: 'vector-triangle', note: 'Uchburchak, aylana, shakllar' },
  { id: 'stereometriya', name: 'Stereometriya', icon: 'cube-outline', note: "Prizma, silindr, shar" },
]

interface LevelMeta {
  label: string
  brief: string
  coinPerSolve: number
  xpPerSolve: number
}

const LEVEL_META: Record<LevelKey, LevelMeta> = {
  oson: { label: 'Oson', brief: 'Asosiy tushunchalar', coinPerSolve: 10, xpPerSolve: 15 },
  "o'rta": { label: "O'rta", brief: 'Formulalar amalda', coinPerSolve: 15, xpPerSolve: 20 },
  qiyin: { label: 'Qiyin', brief: 'Chuqurroq masalalar', coinPerSolve: 25, xpPerSolve: 35 },
}

export const LEVELS: LevelKey[] = ['oson', "o'rta", 'qiyin']

const q = (prefix: string, items: Omit<Question, 'id'>[]): Question[] =>
  items.map((item, i) => ({ id: `${prefix}-${i + 1}`, ...item }))

/* ─────────────────── ALGEBRA ─────────────────── */

const ALGEBRA_OSON = q('a-oson', [
  { prompt: '2x + 6 = 14 tenglamada x nechaga teng?', options: ['2', '4', '8', '10'], correct: 1, explain: '2x = 14 − 6 = 8, demak x = 4.' },
  { prompt: '3(x − 2) = 12 → x = ?', options: ['4', '6', '8', '10'], correct: 1, explain: 'x − 2 = 4, demak x = 6.' },
  { prompt: '(−5) + 8 − 3 = ?', options: ['0', '6', '−16', '10'], correct: 0, explain: '8 − 5 = 3, 3 − 3 = 0.' },
  { prompt: '7² − 3² = ?', options: ['16', '40', '58', '4'], correct: 1, explain: '49 − 9 = 40.' },
  { prompt: 'a = 3, b = −2 bo‘lsa, a − 2b = ?', options: ['−1', '7', '1', '−7'], correct: 1, explain: '2b = −4, 3 − (−4) = 7.' },
  { prompt: '2⁵ = ?', options: ['10', '25', '32', '64'], correct: 2, explain: '2·2·2·2·2 = 32.' },
  { prompt: '5x = 45 → x = ?', options: ['5', '9', '40', '50'], correct: 1, explain: '45 : 5 = 9.' },
  { prompt: '12 : 4 + 3 · 2 = ?', options: ['9', '12', '8', '6'], correct: 0, explain: 'Bo‘lish va ko‘paytirish avval: 3 + 6 = 9.' },
  { prompt: 'x/4 = 7 → x = ?', options: ['3', '11', '28', '24'], correct: 2, explain: 'x = 7 · 4 = 28.' },
  { prompt: '0,5 + 0,25 = ?', options: ['0,75', '0,30', '0,5', '0,55'], correct: 0, explain: 'Yuzdan birlar ustunida qo‘shiladi: 0,75.' },
  { prompt: '9 + 4 · 3 = ?', options: ['21', '36', '39', '13'], correct: 0, explain: 'Ko‘paytirish avval: 9 + 12 = 21.' },
  { prompt: 'x + 7 = 3 → x = ?', options: ['4', '−4', '10', '−10'], correct: 1, explain: 'x = 3 − 7 = −4.' },
  { prompt: '48 : 6 = ?', options: ['6', '7', '8', '9'], correct: 2, explain: '6 · 8 = 48.' },
  { prompt: '2x − 4 = 0 → x = ?', options: ['0', '4', '−2', '2'], correct: 3, explain: '2x = 4 → x = 2.' },
  { prompt: '100 ning 20% i nechaga teng?', options: ['20', '80', '2', '40'], correct: 0, explain: '100 · 0,2 = 20.' },
])

const ALGEBRA_ORTA = q('a-orta', [
  { prompt: '4x − 5 = 2x + 11 → x = ?', options: ['6', '8', '3', '9'], correct: 1, explain: '2x = 16, demak x = 8.' },
  { prompt: 'x² − 16 = 0 tenglamaning ildizlari:', options: ['4', '−4', '±4', '16'], correct: 2, explain: 'x² = 16 → x = ±4.' },
  { prompt: '(a + b)² qanday yoyiladi?', options: ['a² + b²', 'a² + 2ab + b²', 'a² − 2ab + b²', 'a² + ab + b²'], correct: 1, explain: 'Yig‘indi kvadrati: a² + 2ab + b².' },
  { prompt: '2³ · 2⁴ = ?', options: ['2⁷ = 128', '2¹² = 4096', '64', '32'], correct: 0, explain: 'Darajalar ko‘paytganda ko‘rsatkichlar qo‘shiladi: 2⁷.' },
  { prompt: '6x²y / (3xy) = ?', options: ['2x', '2y', '3x', '2xy'], correct: 0, explain: '6 : 3 = 2, x² : x = x, y : y = 1 → 2x.' },
  { prompt: '240 ning 15% i nechaga teng?', options: ['24', '36', '30', '42'], correct: 1, explain: '240 · 0,15 = 36.' },
  { prompt: '√49 + √16 = ?', options: ['11', '65', '7', '9'], correct: 0, explain: '7 + 4 = 11.' },
  { prompt: '3x + 2y = 16 va x = 4 bo‘lsa, y = ?', options: ['1', '2', '3', '4'], correct: 1, explain: '12 + 2y = 16 → 2y = 4 → y = 2.' },
  { prompt: 'a = 3, b = 1 bo‘lsa, a³ − b³ = ?', options: ['26', '28', '18', '24'], correct: 0, explain: '27 − 1 = 26.' },
  { prompt: '0,3 · 0,4 = ?', options: ['0,12', '0,7', '0,012', '1,2'], correct: 0, explain: '3 · 4 = 12, o‘nli verguldan keyin ikki xona: 0,12.' },
  { prompt: 'x² = 81 tenglamaning ildizlari:', options: ['9', '−9', '±9', '81'], correct: 2, explain: 'x² = 81 → x = ±9.' },
  { prompt: '5x − 3 = 2x + 9 → x = ?', options: ['3', '4', '2', '6'], correct: 1, explain: '3x = 12 → x = 4.' },
  { prompt: '(2a)³ qanday yoziladi?', options: ['6a³', '2a³', '8a³', '4a³'], correct: 2, explain: '2³ · a³ = 8a³.' },
  { prompt: '√64 − √25 = ?', options: ['3', '√39', '13', '1'], correct: 0, explain: '8 − 5 = 3.' },
  { prompt: '0,6 : 0,2 = ?', options: ['0,3', '1,2', '3', '0,12'], correct: 2, explain: '6 : 2 = 3.' },
])

const ALGEBRA_QIYIN = q('a-qiyin', [
  { prompt: 'x² − 5x + 6 = 0 tenglamaning ildizlari:', options: ['2 va 3', '−2 va −3', '1 va 6', '−1 va −6'], correct: 0, explain: 'Yig‘indi 5, ko‘paytma 6: x₁ = 2, x₂ = 3.' },
  { prompt: 'x² − 7x + 10 = 0 uchun x₁ + x₂ = ?', options: ['7', '−7', '10', '−10'], correct: 0, explain: 'Viyet: x₁ + x₂ = −b/a = 7.' },
  { prompt: 'a = 7, b = 3 bo‘lsa, a² − b² = ?', options: ['40', '58', '21', '16'], correct: 0, explain: '49 − 9 = 40.' },
  { prompt: 'Arifmetik progressiyada a₁ = 2, d = 3. a₁₀ = ?', options: ['29', '32', '30', '27'], correct: 0, explain: 'a₁₀ = a₁ + 9d = 2 + 27 = 29.' },
  { prompt: 'Geometrik progressiyada b₁ = 3, q = 2. b₅ = ?', options: ['48', '24', '96', '32'], correct: 0, explain: 'b₅ = b₁ · q⁴ = 3 · 16 = 48.' },
  { prompt: 'log₂ 32 = ?', options: ['5', '6', '4', '16'], correct: 0, explain: '2⁵ = 32, demak log₂32 = 5.' },
  { prompt: '(x − 3)² = 0 tenglamaning ildizi:', options: ['3', '−3', '0', '9'], correct: 0, explain: 'Kvadrat nolga teng bo‘lishi uchun x − 3 = 0.' },
  { prompt: '2^(x + 1) = 16 → x = ?', options: ['3', '4', '2', '8'], correct: 0, explain: '16 = 2⁴, demak x + 1 = 4 → x = 3.' },
  { prompt: 'a + b = 10, ab = 21 bo‘lsa, a² + b² = ?', options: ['58', '79', '100', '42'], correct: 0, explain: 'a² + b² = (a + b)² − 2ab = 100 − 42 = 58.' },
  { prompt: 'x² + 4x + 4 ni ko‘paytuvchilarga ajrating:', options: ['(x + 2)²', '(x − 2)²', '(x + 4)(x + 1)', '(x + 2)(x − 2)'], correct: 0, explain: 'To‘liq kvadrat: x² + 4x + 4 = (x + 2)².' },
  { prompt: 'x² − 9x + 20 = 0 tenglamaning ildizlari:', options: ['4 va 5', '−4 va −5', '2 va 10', '−2 va −10'], correct: 0, explain: 'Yig‘indi 9, ko‘paytma 20: 4 va 5.' },
  { prompt: '3^x = 81 → x = ?', options: ['3', '4', '27', '9'], correct: 1, explain: '81 = 3⁴.' },
  { prompt: 'a = 5, b = 2 bo‘lsa, a² + b² = ?', options: ['49', '21', '29', '14'], correct: 2, explain: '25 + 4 = 29.' },
  { prompt: 'Arifmetik progressiyada a₁ = 5, d = 4. a₈ = ?', options: ['33', '37', '29', '32'], correct: 0, explain: 'a₈ = 5 + 7 · 4 = 33.' },
  { prompt: 'log₃ 27 = ?', options: ['9', '3', '27', '1/3'], correct: 1, explain: '3³ = 27.' },
])

/* ─────────────────── GEOMETRIYA ─────────────────── */

const GEOMETRIYA_OSON = q('g-oson', [
  { prompt: "Uchburchakning ichki burchaklari yig'indisi necha gradus?", options: ['90°', '180°', '270°', '360°'], correct: 1, explain: 'Har qanday uchburchakda 180°.' },
  { prompt: "Teng tomonli uchburchakning har bir burchagi:", options: ['30°', '45°', '60°', '90°'], correct: 2, explain: '180° : 3 = 60°.' },
  { prompt: "To'g'ri burchakli uchburchakning o'tkir burchaklari yig'indisi:", options: ['90°', '120°', '180°', '360°'], correct: 0, explain: '180° − 90° = 90°.' },
  { prompt: "Qo'shni burchaklardan biri 40° bo'lsa, ikkinchisi:", options: ['40°', '50°', '140°', '150°'], correct: 2, explain: '180° − 40° = 140°.' },
  { prompt: 'Vertikal burchaklar haqidagi to‘g‘ri fikr:', options: ['Ular teng', 'Yig‘indisi 180°', 'Yig‘indisi 90°', 'Biri doim katta'], correct: 0, explain: 'Vertikal burchaklar teng.' },
  { prompt: "Tomoni 6 sm bo'lgan kvadratning perimetri:", options: ['12 sm', '24 sm', '36 sm', '6 sm'], correct: 1, explain: '4 · 6 = 24 sm.' },
  { prompt: "To'g'ri to'rtburchakning tomonlari 7 va 4 sm. Yuzi:", options: ['11 sm²', '22 sm²', '28 sm²', '14 sm²'], correct: 2, explain: '7 · 4 = 28 sm².' },
  { prompt: 'Uchburchakning asosi 8, balandligi 5. Yuzi:', options: ['13', '20', '40', '32'], correct: 1, explain: 'S = ½ · 8 · 5 = 20.' },
  { prompt: "Radiusi 3 bo'lgan aylana uzunligi:", options: ['3π', '6π', '9π', '12π'], correct: 1, explain: 'C = 2πr = 6π.' },
  { prompt: "Radiusi 4 bo'lgan doira yuzi:", options: ['4π', '8π', '16π', '64π'], correct: 2, explain: 'S = πr² = 16π.' },
  { prompt: 'Uchburchakning tashqi burchagi 120°, unga qo‘shni bo‘lmagan ichki burchaklardan biri 50°. Ikkinchisi:', options: ['70°', '60°', '80°', '50°'], correct: 0, explain: 'Tashqi burchak = qo‘shni bo‘lmagan ikki ichki burchak yig‘indisi: 120 − 50 = 70°.' },
  { prompt: "Perimetri 20 bo'lgan kvadratning tomoni:", options: ['4', '5', '10', '2,5'], correct: 1, explain: '20 : 4 = 5.' },
  { prompt: "To'g'ri to'rtburchakning tomonlari 5 va 3. Perimetri:", options: ['15', '8', '16', '30'], correct: 2, explain: '2 · (5 + 3) = 16.' },
  { prompt: "45° li burchak to'g'ri burchakning qanday qismi?", options: ['Yarmi', 'Uchdan biri', "To'rtdan biri", 'Beshdan biri'], correct: 0, explain: '45° = 90° : 2.' },
  { prompt: "Diametri 10 bo'lgan aylananing radiusi:", options: ['20', '5', '10', '2,5'], correct: 1, explain: 'r = d : 2 = 5.' },
])

const GEOMETRIYA_ORTA = q('g-orta', [
  { prompt: "Katetlari 6 va 8 bo'lgan to'g'ri burchakli uchburchakning gipotenuzasi:", options: ['10', '12', '14', '7'], correct: 0, explain: '√(36 + 64) = 10.' },
  { prompt: 'Gipotenuzasi 13, bir kateti 5 bo‘lsa, ikkinchi katet:', options: ['12', '8', '6', '14'], correct: 0, explain: '√(169 − 25) = 12.' },
  { prompt: "Tomoni 6 bo'lgan teng tomonli uchburchakning yuzi:", options: ['9√3', '6√3', '18', '3√3'], correct: 0, explain: 'S = a²√3/4 = 36√3/4 = 9√3.' },
  { prompt: 'Parallelogrammning asosi 9, balandligi 4. Yuzi:', options: ['13', '36', '18', '26'], correct: 1, explain: 'S = a · h = 36.' },
  { prompt: 'Rombning diagonallari 6 va 8. Yuzi:', options: ['14', '24', '48', '12'], correct: 1, explain: 'S = d₁d₂/2 = 48/2 = 24.' },
  { prompt: 'Trapetsiyaning asoslari 6 va 10, balandligi 4. Yuzi:', options: ['32', '40', '64', '16'], correct: 0, explain: 'S = (a + b)/2 · h = 8 · 4 = 32.' },
  { prompt: "Uchburchakning o'rta chizig'i 6 bo'lsa, mos tomon:", options: ['3', '6', '12', '18'], correct: 2, explain: "O'rta chiziq tomonning yarmi: 6 · 2 = 12." },
  { prompt: "30° li burchak qarshisidagi katet 7 bo'lsa, gipotenuza:", options: ['7', '14', '3,5', '12'], correct: 1, explain: '30° qarshisidagi katet gipotenuzaning yarmi.' },
  { prompt: "Radiusi 5 bo'lgan aylanada markazdan 3 uzoqlikdagi vatarning uzunligi:", options: ['8', '4', '√34', '6'], correct: 0, explain: 'Yarim vatar √(25 − 9) = 4, to‘liq vatar 8.' },
  { prompt: 'Aylanaga ichki chizilgan to‘rtburchakning qarama-qarshi burchaklari yig‘indisi:', options: ['90°', '120°', '180°', '360°'], correct: 2, explain: 'Ichki chizilgan to‘rtburchakda qarama-qarshi burchaklar yig‘indisi 180°.' },
  { prompt: "Katetlari 5 va 12 bo'lgan to'g'ri burchakli uchburchakning gipotenuzasi:", options: ['13', '17', '12', '√119'], correct: 0, explain: '√(25 + 144) = 13.' },
  { prompt: "Aylana uzunligi 10π bo'lsa, uning radiusi:", options: ['10', '5', '20', '2,5'], correct: 1, explain: '2πr = 10π → r = 5.' },
  { prompt: 'Uchburchakning yuzi 24, asosi 8. Balandligi:', options: ['3', '12', '6', '4'], correct: 2, explain: '½ · 8 · h = 24 → h = 6.' },
  { prompt: 'Muntazam oltiburchakning ichki burchagi:', options: ['108°', '90°', '135°', '120°'], correct: 3, explain: '(6 − 2) · 180° : 6 = 120°.' },
  { prompt: "Tomoni 5, o'tkir burchagi 30° bo'lgan rombning yuzi:", options: ['12,5', '25', '6,25', '50'], correct: 0, explain: 'S = a² · sin30° = 25 · 0,5 = 12,5.' },
])

const GEOMETRIYA_QIYIN = q('g-qiyin', [
  { prompt: "Tomonlari 7, 8, 9 bo'lgan uchburchakning yuzi:", options: ['12√5', '24', '12√3', '6√5'], correct: 0, explain: 'Geron: p = 12, S = √(12·5·4·3) = √720 = 12√5.' },
  { prompt: 'Tomonlari 5 va 7, ular orasidagi burchak 60°. Uchinchi tomon:', options: ['√39', '√29', '8', '6'], correct: 0, explain: 'Kosinuslar: a² = 25 + 49 − 35 = 39.' },
  { prompt: "Markazdan 10 uzoqlikdagi nuqtadan radiusi 6 aylanaga o'tkazilgan urinma uzunligi:", options: ['8', '6', '4', '10'], correct: 0, explain: '√(100 − 36) = 8.' },
  { prompt: "Ikki vatar kesishadi. Birinchisining bo'laklari 4 va 6, ikkinchisining biri 3. Ikkinchi bo'lak:", options: ['8', '6', '5', '12'], correct: 0, explain: 'Vatarlar xossasi: 4 · 6 = 3 · x → x = 8.' },
  { prompt: "Tomonlari 6 va 9 bo'lgan uchburchakda ular orasidagi burchak bissektrisasi uchinchi tomonni qanday nisbatda bo'ladi?", options: ['2 : 3', '3 : 2', '1 : 1', '3 : 4'], correct: 0, explain: 'Bissektrisa qo‘shni tomonlarga proporsional: 6 : 9 = 2 : 3.' },
  { prompt: "Perimetri 36 bo'lgan teng tomonli uchburchakning yuzi:", options: ['36√3', '9√3', '108', '36'], correct: 0, explain: 'Tomon 12, S = 144√3/4 = 36√3.' },
  { prompt: "Radiusi 4 bo'lgan aylanaga tashqi chizilgan kvadratning yuzi:", options: ['64', '32', '16', '128'], correct: 0, explain: 'Kvadrat tomoni 2r = 8, yuzi 64.' },
  { prompt: "Radiusi 4 bo'lgan aylanaga ichki chizilgan kvadratning yuzi:", options: ['32', '16', '64', '8'], correct: 0, explain: 'Diagonal 8, S = d²/2 = 32.' },
  { prompt: 'Uchburchak medianalari uchidan hisoblaganda qanday nisbatda bo‘linadi?', options: ['2 : 1', '1 : 2', '1 : 1', '3 : 1'], correct: 0, explain: 'Medianalar kesishish nuqtasida 2 : 1 nisbatda bo‘linadi.' },
  { prompt: "To'g'ri burchakli uchburchakda gipotenuzaga tushirilgan balandlik gipotenuzani 8 va 2 bo'laklarga ajratadi. Balandlik:", options: ['4', '5', '16', '6'], correct: 0, explain: 'h² = 8 · 2 = 16 → h = 4.' },
  { prompt: 'Tomonlari 3, 4, 5 bo‘lgan uchburchakning yuzi:', options: ['6', '12', '7', '10'], correct: 0, explain: 'To‘g‘ri burchakli: ½ · 3 · 4 = 6.' },
  { prompt: 'Aylanaga ichki chizilgan muntazam uchburchakning tomoni 6√3. Aylana radiusi:', options: ['3', '6', '12', '6√3'], correct: 1, explain: 'a = R√3 → R = 6.' },
  { prompt: "Katetlari 9 va 12 bo'lgan to'g'ri burchakli uchburchakda gipotenuzaga tushirilgan mediana:", options: ['15', '6', '7,5', '10,5'], correct: 2, explain: 'Mediana gipotenuzaning yarmi: 15 : 2 = 7,5.' },
  { prompt: 'Radiuslari 4 va 6 bo‘lgan ikki aylana tashqi urinadi. Markazlari orasidagi masofa:', options: ['2', '10', '24', '√52'], correct: 1, explain: 'r₁ + r₂ = 10.' },
  { prompt: 'Radiusi 6, markaziy burchagi 60° bo‘lgan sektorning yuzi:', options: ['6π', '12π', '36π', '3π'], correct: 0, explain: 'πr² · 60/360 = 36π : 6 = 6π.' },
])

/* ─────────────────── STEREOMETRIYA ─────────────────── */

const STEREOMETRIYA_OSON = q('s-oson', [
  { prompt: 'Kubning qirrasi 3. Hajmi:', options: ['9', '27', '54', '6'], correct: 1, explain: 'V = a³ = 27.' },
  { prompt: "Kubning qirrasi 2. To'la sirt yuzi:", options: ['8', '16', '24', '12'], correct: 2, explain: 'S = 6a² = 24.' },
  { prompt: "To'g'ri burchakli parallelepipedning o'lchamlari 2, 3, 4. Hajmi:", options: ['9', '24', '12', '36'], correct: 1, explain: 'V = abc = 24.' },
  { prompt: 'Asos yuzi 10, balandligi 6 bo‘lgan prizma hajmi:', options: ['16', '30', '60', '120'], correct: 2, explain: 'V = S · h = 60.' },
  { prompt: 'Asos yuzi 18, balandligi 5 bo‘lgan piramida hajmi:', options: ['90', '45', '30', '54'], correct: 2, explain: 'V = ⅓ · S · h = 30.' },
  { prompt: 'Silindr asosining radiusi 2, balandligi 5. Hajmi:', options: ['10π', '20π', '25π', '40π'], correct: 1, explain: 'V = πr²h = 20π.' },
  { prompt: 'Silindrning yon sirti (r = 3, h = 4):', options: ['12π', '24π', '21π', '36π'], correct: 1, explain: 'S = 2πrh = 24π.' },
  { prompt: 'Konus asosining radiusi 3, balandligi 4. Hajmi:', options: ['12π', '36π', '16π', '48π'], correct: 0, explain: 'V = ⅓πr²h = 12π.' },
  { prompt: 'Shar radiusi 3. Hajmi:', options: ['9π', '36π', '12π', '27π'], correct: 1, explain: 'V = 4/3 πr³ = 36π.' },
  { prompt: 'Shar radiusi 2. Sirt yuzi:', options: ['4π', '8π', '16π', '12π'], correct: 2, explain: 'S = 4πr² = 16π.' },
  { prompt: 'Kubning qirrasi 4. Hajmi:', options: ['16', '64', '96', '12'], correct: 1, explain: 'V = 4³ = 64.' },
  { prompt: "Kubning qirrasi 5. To'la sirt yuzi:", options: ['25', '100', '150', '125'], correct: 2, explain: '6 · 25 = 150.' },
  { prompt: "To'g'ri burchakli parallelepipedning o'lchamlari 3, 4, 5. Hajmi:", options: ['120', '60', '94', '47'], correct: 1, explain: 'V = 3 · 4 · 5 = 60.' },
  { prompt: 'Silindr asosining radiusi 4, balandligi 2. Hajmi:', options: ['8π', '16π', '32π', '64π'], correct: 2, explain: 'V = π · 16 · 2 = 32π.' },
  { prompt: 'Shar radiusi 6. Hajmi:', options: ['288π', '72π', '36π', '144π'], correct: 0, explain: 'V = 4/3 · π · 216 = 288π.' },
])

const STEREOMETRIYA_ORTA = q('s-orta', [
  { prompt: 'Kubning qirrasi 2. Diagonali:', options: ['2√2', '2√3', '3', '4'], correct: 1, explain: 'd = a√3 = 2√3.' },
  { prompt: "O'lchamlari 1, 2, 2 bo'lgan to'g'ri burchakli parallelepipedning diagonali:", options: ['3', '√8', '5', '√6'], correct: 0, explain: '√(1 + 4 + 4) = 3.' },
  { prompt: "Silindrning radiusi 2, balandligi 3. To'la sirt yuzi:", options: ['12π', '20π', '16π', '24π'], correct: 1, explain: 'S = 2πr(r + h) = 4π · 5 = 20π.' },
  { prompt: 'Konusning radiusi 3, yasovchisi 5. Yon sirt yuzi:', options: ['15π', '24π', '9π', '30π'], correct: 0, explain: 'S = πrl = 15π.' },
  { prompt: "Radiusi 5 bo'lgan sharning markazidan 3 masofada o'tkazilgan kesim radiusi:", options: ['4', '√34', '2', '3'], correct: 0, explain: '√(25 − 9) = 4.' },
  { prompt: 'Asosi 6×6 kvadrat, balandligi 4 bo‘lgan muntazam piramidaning yon qirrasi:', options: ['5', '6', '√52', '7'], correct: 0, explain: '√(3² + 4²) = 5.' },
  { prompt: "Asosi katetlari 3 va 4 bo'lgan to'g'ri burchakli uchburchak, balandligi 10 bo'lgan prizma hajmi:", options: ['60', '120', '30', '24'], correct: 0, explain: 'S = ½ · 3 · 4 = 6, V = 60.' },
  { prompt: "Kubning to'la sirt yuzi 54. Hajmi:", options: ['27', '54', '9', '36'], correct: 0, explain: '6a² = 54 → a = 3, V = 27.' },
  { prompt: 'Silindr hajmi 45π, radiusi 3. Balandligi:', options: ['5', '15', '9', '3'], correct: 0, explain: '9πh = 45π → h = 5.' },
  { prompt: 'Konus hajmi 12π, radiusi 3. Balandligi:', options: ['4', '12', '9', '3'], correct: 0, explain: '⅓π · 9 · h = 12π → h = 4.' },
  { prompt: 'Kubning qirrasi 5. Diagonali:', options: ['5√2', '5√3', '10', '25'], correct: 1, explain: 'd = a√3 = 5√3.' },
  { prompt: 'Prizma asosining yuzi 12, balandligi 7. Hajmi:', options: ['19', '42', '84', '168'], correct: 2, explain: 'V = 12 · 7 = 84.' },
  { prompt: 'Silindrning radiusi 3, balandligi 5. To‘la sirt yuzi:', options: ['48π', '30π', '24π', '45π'], correct: 0, explain: '2πr(r + h) = 6π · 8 = 48π.' },
  { prompt: 'Konusning radiusi 6, yasovchisi 10. Yon sirt yuzi:', options: ['36π', '60π', '16π', '96π'], correct: 1, explain: 'S = πrl = 60π.' },
  { prompt: "Radiusi 5 bo'lgan sharning markazidan 4 masofada o'tkazilgan kesim radiusi:", options: ['3', '√41', '1', '4'], correct: 0, explain: '√(25 − 16) = 3.' },
])

const STEREOMETRIYA_QIYIN = q('s-qiyin', [
  { prompt: "Muntazam to'rtburchak piramidaning asos tomoni 6, balandligi 4. Apotemasi:", options: ['5', '√43', '7', '√52'], correct: 0, explain: '√(4² + 3²) = 5.' },
  { prompt: 'Kubning qirrasi 2. Ichki chizilgan sharning hajmi:', options: ['4π/3', '8π/3', '2π/3', '32π/3'], correct: 0, explain: 'R = 1, V = 4/3 π.' },
  { prompt: 'Konusning yasovchisi 10, radiusi 6. Hajmi:', options: ['96π', '288π', '60π', '144π'], correct: 0, explain: 'h = 8, V = ⅓π · 36 · 8 = 96π.' },
  { prompt: 'Silindrga ichki chizilgan sharning radiusi 3. Silindr hajmi:', options: ['54π', '27π', '36π', '18π'], correct: 0, explain: 'r = 3, h = 6, V = π · 9 · 6 = 54π.' },
  { prompt: 'Qirrasi 6 bo‘lgan muntazam tetraedrning hajmi:', options: ['18√2', '36√2', '9√2', '72√2'], correct: 0, explain: 'V = a³/(6√2) = 216/(6√2) = 18√2.' },
  { prompt: 'Radiusi 3 bo‘lgan sharning sirt yuzi:', options: ['36π', '32π', '16π', '48π'], correct: 0, explain: 'S = 4πr² = 36π.' },
  { prompt: 'Konusning yon sirti 65π, radiusi 5. Balandligi:', options: ['12', '13', '8', '10'], correct: 0, explain: 'πrl = 65π → l = 13, h = √(169 − 25) = 12.' },
  { prompt: "To'g'ri burchakli parallelepiped hajmi 120, asos tomonlari 4 va 5. Diagonali:", options: ['√77', '√61', '9', '13'], correct: 0, explain: 'h = 120/20 = 6, d = √(16 + 25 + 36) = √77.' },
  { prompt: 'Asos tomoni 5, balandligi 6 bo‘lgan muntazam uchburchak prizmaning hajmi:', options: ['75√3/2', '25√3/2', '150√3', '75√3'], correct: 0, explain: 'S = 25√3/4, V = S · 6 = 75√3/2.' },
  { prompt: 'Sharning sirt yuzi 64π. Hajmi:', options: ['256π/3', '64π/3', '512π/3', '128π/3'], correct: 0, explain: '4πr² = 64π → r = 4, V = 4/3π · 64 = 256π/3.' },
  { prompt: "Muntazam to'rtburchak piramidaning asos tomoni 8, balandligi 3. Apotemasi:", options: ['5', '√73', '7', '4'], correct: 0, explain: '√(3² + 4²) = 5.' },
  { prompt: 'Kubning qirrasi 4. Tashqi chizilgan sharning radiusi:', options: ['2', '2√2', '2√3', '4'], correct: 2, explain: 'R = a√3/2 = 2√3.' },
  { prompt: 'Konusning radiusi 6, balandligi 8. To‘la sirt yuzi:', options: ['60π', '96π', '36π', '120π'], correct: 1, explain: 'l = 10, πr(r + l) = 6π · 16 = 96π.' },
  { prompt: 'Sharning hajmi 36π. Sirt yuzi:', options: ['9π', '18π', '27π', '36π'], correct: 3, explain: 'r = 3, S = 4π · 9 = 36π.' },
  { prompt: 'Asos tomoni 6, balandligi 4 bo‘lgan muntazam uchburchak piramidaning hajmi:', options: ['12√3', '36√3', '9√3', '24√3'], correct: 0, explain: 'S = 9√3, V = ⅓ · 9√3 · 4 = 12√3.' },
])

const make = (
  subjectId: ProblemSubjectId,
  subjectName: string,
  level: LevelKey,
  questions: Question[],
): ProblemLevel => ({
  id: `${subjectId}-${level === "o'rta" ? 'orta' : level}`,
  subjectId,
  subjectName,
  level,
  ...LEVEL_META[level],
  questions,
})

export const PROBLEM_LEVELS: ProblemLevel[] = [
  make('algebra', 'Algebra', 'oson', ALGEBRA_OSON),
  make('algebra', 'Algebra', "o'rta", ALGEBRA_ORTA),
  make('algebra', 'Algebra', 'qiyin', ALGEBRA_QIYIN),
  make('geometriya', 'Geometriya', 'oson', GEOMETRIYA_OSON),
  make('geometriya', 'Geometriya', "o'rta", GEOMETRIYA_ORTA),
  make('geometriya', 'Geometriya', 'qiyin', GEOMETRIYA_QIYIN),
  make('stereometriya', 'Stereometriya', 'oson', STEREOMETRIYA_OSON),
  make('stereometriya', 'Stereometriya', "o'rta", STEREOMETRIYA_ORTA),
  make('stereometriya', 'Stereometriya', 'qiyin', STEREOMETRIYA_QIYIN),
]

export const findLevel = (id: string) => PROBLEM_LEVELS.find(l => l.id === id)

export const levelsOf = (subjectId: string) => PROBLEM_LEVELS.filter(l => l.subjectId === subjectId)

export const findSubjectProblems = (subjectId: string) =>
  PROBLEM_SUBJECTS.find(s => s.id === subjectId)

export const STARS_PER_LEVEL = 3
export const TOTAL_STARS = PROBLEM_LEVELS.length * STARS_PER_LEVEL
export const WEEKLY_STAR_GOAL = 5

/** 10 masalada: 6 → 1, 8 → 2, 10 → 3 yulduz */
export const STAR_THRESHOLDS = [6, 8, 10] as const

export const starsForLevel = (correct: number, total: number): number => {
  if (total <= 0) return 0
  const ratio = correct / total
  if (ratio >= 1) return 3
  if (ratio >= 0.8) return 2
  if (ratio >= 0.6) return 1
  return 0
}

/** Daraja kaliti -> yulduz (0..3) yig'indisi */
export const starsOf = (stars: Record<string, number>, subjectId?: string) =>
  (subjectId ? levelsOf(subjectId) : PROBLEM_LEVELS).reduce((n, l) => n + (stars[l.id] ?? 0), 0)

/** Dushanba bilan boshlanadigan hafta kaliti */
export const weekStartKey = (base = new Date()) => {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate())
  const shift = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - shift)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Yechish dvigateli uchun daraja sessiyalari — boshqa to'plamlar bilan bir xil shakl */
export const LEVEL_SETS: ProblemSet[] = PROBLEM_LEVELS.map(level => ({
  id: level.id,
  title: `${level.subjectName} · ${level.label}`,
  topic: level.subjectName,
  difficulty: level.level,
  grade: '10 masala',
  coinPerSolve: level.coinPerSolve,
  xpPerSolve: level.xpPerSolve,
  free: true,
  levelSet: true,
  questions: level.questions,
}))

/** Bitta sessiyadagi masalalar soni — bank undan katta, shuning uchun takrorlashda savollar almashadi */
export const SESSION_SIZE = 10

/**
 * Har urinishda bankdan tasodifiy `SESSION_SIZE` ta masala.
 * Demo bosqichida bank 15 ta: qayta ishlaganda ro'yxat bir xil bo'lib qolmaydi.
 */
export const drawLevelQuestions = (level: ProblemLevel): Question[] => {
  const pool = [...level.questions]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const swap = pool[i]
    pool[i] = pool[j]
    pool[j] = swap
  }
  return pool.slice(0, Math.min(SESSION_SIZE, pool.length))
}
