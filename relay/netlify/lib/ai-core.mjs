/**
 * Kunlik AI savol — umumiy yadro: prompt, OpenRouter chaqiruvi, tekshiruvchi.
 * `ai-question` (onlayn so'rov) va `ai-pool-background` (oldindan tayyorlash) shundan foydalanadi.
 */

export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

export const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: CORS })

/**
 * Model kaskadi: hisobda kredit tugasa yoki model limitga tushsa — keyingisiga o'tadi.
 * `:free` modellar reasoning uchun ko'p token sarflaydi, shuning uchun limit katta.
 */
export const MODELS = [
  { id: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash', tokens: 1200 },
  { id: 'nvidia/nemotron-3.5-super-vl:free', tokens: 6000 },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', tokens: 6000 },
].filter((m, i, all) => all.findIndex(x => x.id === m.id) === i)

export const VERIFIER_MODEL =
  process.env.OPENROUTER_VERIFIER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free'

export const LEVELS = {
  oson: "bitta amal (qo'shish, ayirish, ko'paytirish yoki bo'lish) — 5–6 sinf darajasi",
  "o'rta": "ikki qadamli hisob (masalan avval ulush, keyin ayirish) yoki oddiy foiz — 7–8 sinf darajasi",
  qiyin: 'kamida uch qadam: kasr, foiz yoki tenglama qatnashsin, javob son bilan chiqsin — 9–11 sinf darajasi',
}

export const LEVEL_KEYS = Object.keys(LEVELS)

/** O'quv dasturidagi 10 mavzu — pool shu kalitlar bo'yicha tayyorlanadi */
export const TOPICS = [
  { num: 1, title: 'Matematikaga kirish' },
  { num: 2, title: 'Son va ular haqida tushuncha. Son bilan raqamning farqi' },
  { num: 3, title: "Son va raqamning farqi — amaliyot" },
  { num: 4, title: 'Natural sonlar va ular haqida tushuncha' },
  { num: 5, title: "Natural sonlar ustida arifmetik amallar. Natural sonlarni qo'shish" },
  { num: 6, title: "Natural sonlar ustida arifmetik amallar. Natural sonlarni ayirish" },
  { num: 7, title: "Natural sonlar ustida arifmetik amallar. Natural sonlarni ko'paytirish" },
  { num: 8, title: "Natural sonlar ustida arifmetik amallar. Natural sonlarni bo'lish" },
  { num: 9, title: "Natural sonlar ustida to'rt amalga oid misollar" },
  { num: 10, title: "Sonlarni darajaga ko'tarish" },
]

/** Har so'rovda boshqa kontekst — bir xil shablon takrorlanmasin */
const CONTEXTS = [
  'bozor va xarid',
  'maktab va sinf',
  'sport musobaqasi',
  "sayohat va yo'l",
  'oshxona va taom',
  "bog' va hosil",
  'tejamkorlik va pul',
  'vaqt va ish rejasi',
  "geometrik shakl o'lchamlari",
  "suv va idish hajmi",
]

const stripFence = (text) => {
  const match = String(text).match(/```(?:json)?\s*([\s\S]*?)```/i)
  return (match ? match[1] : String(text)).trim()
}

/** Model ba'zan LaTeX va variant harflarini qo'shadi — ilova oddiy matn ko'rsatadi */
const plain = (value) =>
  String(value)
    .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\$|\\\(|\\\)|\\\[|\\\]/g, '')
    .replace(/^(?:[A-Da-d]|[1-4])[).]\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()

export const clean = (value, max) =>
  typeof value === 'string' ? plain(value).slice(0, max) : ''

const same = (a, b) => a.localeCompare(b, 'uz', { sensitivity: 'accent' }) === 0

/** Model javobini qat'iy shaklga keltirish — yaroqsiz bo'lsa null */
export const shape = (raw, fallbackTopic) => {
  let value
  try {
    value = JSON.parse(stripFence(raw))
  } catch {
    return null
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const prompt = clean(value.prompt, 300)
  const explain = clean(value.explain, 400)
  const options = Array.isArray(value.options)
    ? value.options.map(o => clean(o, 80)).filter(Boolean).slice(0, 4)
    : []
  /** Indeksni modeldan emas, javob matnidan hisoblaymiz — indeks ko'p adashadi */
  const answer = clean(value.answer, 80)
  const correct = answer ? options.findIndex(o => same(o, answer)) : -1

  if (!prompt || !explain || options.length !== 4) return null
  if (new Set(options.map(o => o.toLowerCase())).size !== 4) return null
  if (correct < 0) return null

  return { prompt, options, correct, explain, topic: clean(value.topic, 60) || fallbackTopic }
}

export const buildPrompt = (topics, difficulty, avoid = []) => {
  const list = topics.map(t => `- Mavzu ${t.num}. ${t.title}`).join('\n')
  const context = CONTEXTS[Math.floor(Math.random() * CONTEXTS.length)]
  const avoidBlock = avoid.length
    ? `\nBu savollarni takrorlama:\n${avoid.map(a => `- ${a}`).join('\n')}`
    : ''

  return `Sen O'zbekiston maktab o'quvchilariga matematikadan dars beradigan o'qituvchisan.

O'quvchi yaqinda quyidagi mavzularni o'rgandi:
${list}

Shu mavzular doirasida bitta test savolini tuz.
Daraja: ${LEVELS[difficulty]}.
Kontekst: ${context} (mavzu bilan bog'liq bo'lsa shundan foydalan, mos kelmasa boshqa hayotiy kontekst tanla).

Qoidalar:
- Savol hisoblashga asoslangan masala bo'lsin: sonlar, kattaliklar yoki ifoda beriladi va javob hisoblanadi. Ta'rif, xossa yoki yodlash savoli bo'lmasin.
- Daraja talabiga qat'iy rioya qil: daraja "qiyin" bo'lsa, bir amalli masala berma.
- Savol va variantlar o'zbek tilida, lotin yozuvida.
- To'rt variant; faqat bittasi to'g'ri; qolganlari ishonarli, lekin xato.
- Variantlar takrorlanmasin; har biri 30 belgidan oshmasin.
- Variant boshiga harf yoki raqam qo'shma: faqat javob matni ("5/8", "12 nafar").
- Savol matni qisqa (ko'pi bilan 2 gap).
- Formulalar oddiy matnda: 3/4, x^2, √2. LaTeX, $, \\frac, \\( \\) ishlatma.
- Avval yechimni hisoblab tekshir, keyin to'g'ri variant matnini "answer"ga aynan ko'chir.
- "explain" — 1–2 gapdagi yechim izohi.
- Faqat JSON qaytar, boshqa matn yozma:
{"prompt":"…","options":["…","…","…","…"],"answer":"…","explain":"…","topic":"Mavzu nomi"}${avoidBlock}`
}

/** Bitta OpenRouter chaqiruvi — natija doim obyekt: { status, content, finish } */
export const ask = async (apiKey, messages, opts) => {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), opts.timeout)
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://hdp-academy-auth.netlify.app',
        'X-Title': 'HDP Academy',
      },
      body: JSON.stringify({
        model: opts.model,
        temperature: opts.temperature,
        max_tokens: opts.max_tokens,
        response_format: { type: 'json_object' },
        messages,
      }),
      signal: ctrl.signal,
    })
    if (!res.ok) return { status: res.status, content: null, finish: null }
    const data = await res.json()
    const choice = data?.choices?.[0]
    return {
      status: 200,
      content: choice?.message?.content ?? null,
      finish: choice?.finish_reason ?? null,
    }
  } catch (e) {
    return { status: e?.name === 'AbortError' ? 'abort' : 'net', content: null, finish: null }
  } finally {
    clearTimeout(timer)
  }
}

const verifyPrompt = (q, difficulty) => {
  const options = q.options.map((o, i) => `${i + 1}) ${o}`).join('\n')
  return `Sen matematika o'qituvchisisan. Quyidagi test savolini o'zing yechib chiq.

Savol: ${q.prompt}

Variantlar:
${options}

Qoidalar:
- Masalani qadamma-qadam hisobla, arifmetikani qayta tekshir.
- To'g'ri javob qaysi variant bo'lsa, uning raqamini "pick"ga yoz (1–4).
- To'g'ri javob variantlar orasida bo'lmasa, masala shartida aniqlik yo'q bo'lsa yoki bir nechta variant to'g'ri bo'lsa, "pick": null qaytar.
- Savol hisoblashga asoslanmagan bo'lsa (faqat ta'rif yoki yodlash), "pick": null qaytar.
- Savol quyidagi darajaga mos bo'lsa "level_ok": true, mos kelmasa false. Daraja: ${LEVELS[difficulty]}.
- "work" — hisobning qisqa izohi (1–2 gap).
- Faqat JSON qaytar: {"pick":1|2|3|4|null,"level_ok":true|false,"work":"…"}`
}

/** 'ok' — tekshiruvchi xuddi shu variantni tanladi; 'bad' — mos kelmadi; 'error' — javob yo'q */
export const verify = async (apiKey, question, difficulty, timeout) => {
  const res = await ask(
    apiKey,
    [
      { role: 'system', content: "Sen faqat JSON qaytaradigan qattiqqo'l matematika o'qituvchisisan." },
      { role: 'user', content: verifyPrompt(question, difficulty) },
    ],
    { model: VERIFIER_MODEL, temperature: 0, max_tokens: 6000, timeout },
  )
  if (!res.content) return { verdict: 'error', why: res.status ?? res.finish }

  let value
  try {
    value = JSON.parse(stripFence(res.content))
  } catch {
    return { verdict: 'error', why: 'json', finish: res.finish }
  }
  if (!value || typeof value !== 'object') return { verdict: 'error', why: 'json' }

  const pick = Number(value.pick)
  if (!Number.isInteger(pick) || pick < 1 || pick > 4) return { verdict: 'bad', why: 'null' }
  if (pick - 1 !== question.correct) return { verdict: 'bad', why: `${pick - 1}/${question.correct}` }
  if (difficulty === 'qiyin' && value.level_ok === false) return { verdict: 'bad', why: 'level' }
  return { verdict: 'ok' }
}

/** Model bergan mavzu nomi kesilgan bo'lishi mumkin — o'rgangan mavzu nomiga moslashtiramiz */
export const matchTopic = (value, topics, fallback) => {
  const given = clean(value, 80).toLowerCase()
  if (given) {
    const hit = topics.find(t => {
      const title = t.title.toLowerCase()
      return title.startsWith(given) || given.startsWith(title)
    })
    if (hit) return hit.title
  }
  return clean(value, 80) || fallback
}

/**
 * Bitta savol: model kaskadi bo'ylab yurib, birinchi tekshiruvdan o'tganini qaytaradi.
 * `left()` — qolgan vaqt (ms); tugab borsa, keyingi modelga o'tmaydi.
 */
export const generate = async (apiKey, { topics, difficulty, avoid, left, trace, spend }) => {
  const prompt = buildPrompt(topics, difficulty, avoid)
  for (const model of MODELS) {
    if (left() < 3000) break
    if (spend && !spend()) break
    const gen = await ask(
      apiKey,
      [
        { role: 'system', content: "Sen faqat JSON qaytaradigan matematika o'qituvchisisan." },
        { role: 'user', content: prompt },
      ],
      { model: model.id, temperature: 0.7, max_tokens: model.tokens, timeout: Math.min(40000, left() - 2500) },
    )
    const question = gen.content ? shape(gen.content, topics[0].title) : null
    if (!question) {
      trace?.push({ m: model.id, gen: gen.content ? 'shape' : gen.status ?? gen.finish })
      continue
    }
    question.topic = matchTopic(question.topic, topics, topics[0].title)

    const verifyBudget = Math.min(40000, left() - 200)
    if (verifyBudget < 1200) {
      trace?.push({ m: model.id, verify: 'no_budget' })
      break
    }
    if (spend && !spend()) break
    const { verdict, ...detail } = await verify(apiKey, question, difficulty, verifyBudget)
    trace?.push({ m: model.id, verify: verdict, ...detail })
    if (verdict === 'ok') return { question, model: model.id }
  }
  return null
}

/* ── Pool: oldindan tayyorlangan savollar (Netlify Blobs) ── */

export const POOL_STORE = 'ai-questions'
export const poolKey = (num, difficulty) => `q/${num}/${difficulty}`
export const POOL_MAX = 4
