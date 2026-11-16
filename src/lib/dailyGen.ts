import { findTopic, shortTitle } from '../data/curriculum'
import type { AiDifficulty } from './ai'
import type { StudyPlan } from './daily'

/**
 * Kunlik savol generatori — AI'siz, ilova ichida ishlaydi.
 * Har mavzu × daraja uchun darslik mazmuniga mos shablon; sonlar seed
 * bo'yicha tanlanadi, javob esa kodda hisoblanadi — xato bo'lishi mumkin emas.
 */

export interface GeneratedQuestion {
  prompt: string
  options: string[]
  correct: number
  explain: string
  topic: string
  topicNum: number
  difficulty: AiDifficulty
}

type Task = {
  prompt: string
  answer: number
  /** javobni kasr/o'nli ko'rinishda yozish (masalan 8 → «8/11») */
  text?: (value: number) => string
  explain: string
}
type Rng = { int: (min: number, max: number) => number; pick: <T>(list: T[]) => T }
type Template = (r: Rng) => Task

/** 12000 → «12 000», −6 → «−6» */
const fmt = (n: number) =>
  String(n)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    .replace('-', '−')

/** surat/maxraj ko'rinishi */
const frac = (den: number) => (n: number) => `${fmt(n)}/${den}`

/** o'nli kasr: 465, 2 → «4,65» */
const dec = (places: number) => (n: number) => {
  const fixed = (n / 10 ** places).toFixed(places)
  const trimmed = fixed.includes('.') ? fixed.replace(/0+$/, '').replace(/\.$/, '') : fixed
  return trimmed.replace('.', ',').replace('-', '−')
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/** shu oraliqdan `other` bilan o'zaro tub son — kasr qisqarmay qoladi */
const coprime = (r: Rng, min: number, max: number, other: number) => {
  let value = r.int(min, max)
  for (let guard = 0; guard < 40 && gcd(value, other) !== 1; guard += 1) {
    value = r.int(min, max)
  }
  return gcd(value, other) === 1 ? value : 1
}

const hash = (text: string) => {
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const makeRng = (seed: number): Rng => {
  let state = seed >>> 0
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: list => list[Math.floor(next() * list.length)] ?? list[0],
  }
}

const TEMPLATES: Record<number, Record<AiDifficulty, Template[]>> = {
  /** 1 — Matematikaga kirish: son, raqam, to'rt amal, daraja, xona birliklari */
  1: {
    oson: [
      r => {
        const tens = r.int(2, 9)
        const ones = r.int(0, 9)
        const a = tens * 10 + ones
        return {
          prompt: `Sonning raqamlari yig'indisini toping: ${a}.`,
          answer: tens + ones,
          explain: `${tens} + ${ones} = ${tens + ones}.`,
        }
      },
      r => {
        const tens = r.int(3, 9)
        const ones = r.int(0, tens - 1)
        const a = tens * 10 + ones
        return {
          prompt: `Sonning o'nlar raqamidan birlar raqamini ayiring: ${a}.`,
          answer: tens - ones,
          explain: `${tens} − ${ones} = ${tens - ones}.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const h = r.int(1, 9)
        const o = r.int(0, 9)
        const u = r.int(0, 9)
        const a = h * 100 + o * 10 + u
        const max = Math.max(h, o, u)
        const min = Math.min(h, o, u)
        return {
          prompt: `Uch xonali ${a} sonidagi eng katta va eng kichik raqamlarning ayirmasini toping.`,
          answer: max - min,
          explain: `Eng katta raqam ${max}, eng kichigi ${min}: ${max} − ${min} = ${max - min}.`,
        }
      },
      r => {
        const h = r.int(1, 9)
        const o = r.int(1, 9)
        const u = r.int(1, 9)
        const a = h * 100 + o * 10 + u
        return {
          prompt: `Sonning raqamlari ko'paytmasini toping: ${a}.`,
          answer: h * o * u,
          explain: `${h} · ${o} · ${u} = ${h * o * u}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const h = r.int(1, 9)
        const o = r.int(1, 9)
        const u = r.int(0, 9)
        const a = h * 100 + o * 10 + u
        return {
          prompt: `Uch xonali ${a} sonida yuzlar raqamini o'nlar raqamiga ko'paytirib, birlar raqamini qo'shing.`,
          answer: h * o + u,
          explain: `${h} · ${o} + ${u} = ${h * o + u}.`,
        }
      },
      r => {
        const a = r.int(2, 5)
        const p = r.int(2, 4)
        return {
          prompt: `${a}^${p} ni hisoblang.`,
          answer: a ** p,
          explain: `${a} ni ${p} marta ko'paytiramiz: ${a ** p}.`,
        }
      },
    ],
  },

  /** 2 — Bo'lishni oxiriga yetkazish: qoldiqli bo'lish, bo'linish belgilari, qisqartirish */
  2: {
    oson: [
      r => {
        const d = r.int(3, 9)
        const q = r.int(4, 20)
        const rem = r.int(1, d - 1)
        return {
          prompt: `${d * q + rem} ni ${d} ga bo'lganda qoldiq nechaga teng?`,
          answer: rem,
          explain: `${d} · ${q} = ${d * q}, ${d * q + rem} − ${d * q} = ${rem}.`,
        }
      },
      r => {
        const d = r.int(3, 9)
        const q = r.int(4, 20)
        const rem = r.int(1, d - 1)
        return {
          prompt: `${d * q + rem} ni ${d} ga bo'lgandagi bo'linma nechaga teng?`,
          answer: q,
          explain: `${d} · ${q} = ${d * q}, qoldiq ${rem} qoladi.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const h = r.int(1, 9)
        const o = r.int(1, 9)
        const u = (9 - ((h + o) % 9)) % 9
        return {
          prompt: `${h}*${o} soni 9 ga bo'linishi uchun * o'rniga qanday raqam qo'yiladi?`,
          answer: u,
          explain: `${h} + ${o} + ${u} = ${h + o + u}, raqamlar yig'indisi 9 ga bo'linadi.`,
        }
      },
      r => {
        let u = r.int(1, 7)
        let v = r.int(u + 1, 8)
        while (gcd(u, v) !== 1) {
          u = r.int(1, 7)
          v = r.int(u + 1, 8)
        }
        const k = r.int(2, 9)
        return {
          prompt: `${k * u}/${k * v} kasrni eng katta umumiy bo'luvchiga qisqartiring. Qanday songa bo'linadi?`,
          answer: k,
          explain: `${k * u} va ${k * v} sonlari ${k} ga bo'linadi, demak javob ${u}/${v}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const d = r.int(3, 9)
        const q = r.int(12, 30)
        const rem = r.int(1, d - 1)
        return {
          prompt: `Bo'linuvchini toping: bo'luvchi ${d}, bo'linma ${q}, qoldiq ${rem}.`,
          answer: d * q + rem,
          explain: `${d} · ${q} + ${rem} = ${d * q + rem}.`,
        }
      },
      r => {
        let u = r.int(1, 7)
        let v = r.int(u + 1, 9)
        while (gcd(u, v) !== 1) {
          u = r.int(1, 7)
          v = r.int(u + 1, 9)
        }
        const k = r.int(2, 9)
        return {
          prompt: `${k * u}/${k * v} kasrni qisqartiring. Hosil bo'lgan kasrning surati nechaga teng?`,
          answer: u,
          explain: `${k * u} : ${k} = ${u}, ${k * v} : ${k} = ${v}, demak ${u}/${v}.`,
        }
      },
    ],
  },

  /** 3 — Kasrlarni qo'shish va ayirish: aralash sonlar, umumiy maxraj, taqqoslash */
  3: {
    oson: [
      r => {
        const d = r.pick([5, 7, 11, 13])
        const a = r.int(1, d - 3)
        const b = r.int(1, d - 2 - a)
        return {
          prompt: `Hisoblang: ${a}/${d} + ${b}/${d}.`,
          answer: a + b,
          text: frac(d),
          explain: `Maxraj bir xil: ${a} + ${b} = ${a + b}, demak ${a + b}/${d}.`,
        }
      },
      r => {
        const d = r.int(3, 9)
        const q = r.int(1, 6)
        const rem = r.int(1, d - 1)
        return {
          prompt: `Noto'g'ri kasrni aralash songa aylantiring: ${d * q + rem}/${d}. Butun qismi nechaga teng?`,
          answer: q,
          explain: `${d * q + rem} = ${q} · ${d} + ${rem}, demak butun qismi ${q}.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const [d1, d2] = r.pick([[3, 4], [4, 5], [3, 5], [5, 6], [4, 7], [5, 7]])
        const a = coprime(r, 1, d1 - 1, d1)
        const b = coprime(r, 1, d2 - 1, d2)
        const lcm = d1 * d2
        const n = a * d2 + b * d1
        return {
          prompt: `Hisoblang: ${a}/${d1} + ${b}/${d2}.`,
          answer: n,
          text: frac(lcm),
          explain: `Umumiy maxraj ${lcm}: ${a * d2}/${lcm} + ${b * d1}/${lcm} = ${n}/${lcm}.`,
        }
      },
      r => {
        const d = r.int(3, 9)
        const w = r.int(1, 5)
        const a = r.int(1, d - 1)
        return {
          prompt: `Aralash sonni noto'g'ri kasrga aylantiring: ${w} ${a}/${d}. Surati nechaga teng?`,
          answer: w * d + a,
          explain: `${w} · ${d} + ${a} = ${w * d + a}, demak ${w * d + a}/${d}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const [d1, d2] = r.pick([[2, 3], [3, 4], [3, 5], [4, 5], [5, 7]])
        const w1 = r.int(2, 6)
        const a = coprime(r, 1, d1 - 1, d1)
        const w2 = r.int(1, w1 - 1)
        const b = d2 > 1 ? coprime(r, 0, d2 - 1, d2) : 0
        const lcm = d1 * d2
        const n1 = w1 * d1 + a
        const n2 = w2 * d2 + b
        return {
          prompt: `Hisoblang: ${w1} ${a}/${d1} − ${w2} ${b}/${d2}.`,
          answer: n1 * d2 - n2 * d1,
          text: frac(lcm),
          explain: `Noto'g'ri kasrlar: ${n1}/${d1} va ${n2}/${d2}. Umumiy maxraj ${lcm}: ${n1 * d2} − ${n2 * d1} = ${n1 * d2 - n2 * d1}.`,
        }
      },
      r => {
        const d = r.int(4, 9)
        const a = coprime(r, 1, d - 1, d)
        const w = r.int(2, 9)
        return {
          prompt: `Hisoblang: ${w} − ${a}/${d}.`,
          answer: w * d - a,
          text: frac(d),
          explain: `${w} = ${w * d}/${d}, ${w * d}/${d} − ${a}/${d} = ${w * d - a}/${d}.`,
        }
      },
    ],
  },

  /** 4 — Kasrlarni ko'paytirish va bo'lish: teskari sonlar, aralash kasrlar */
  4: {
    oson: [
      r => {
        const b = r.pick([5, 7, 11])
        const d = r.pick([3, 5, 7].filter(x => x !== b))
        const a = coprime(r, 1, Math.min(b - 1, d - 1), d)
        const c = coprime(r, 1, Math.min(d - 1, b - 1), b)
        return {
          prompt: `Hisoblang: ${a}/${b} · ${c}/${d}.`,
          answer: a * c,
          text: frac(b * d),
          explain: `Suratlar: ${a} · ${c} = ${a * c}, maxrajlar: ${b} · ${d} = ${b * d}, demak ${a * c}/${b * d}.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const b = r.pick([5, 7, 11])
        const k = r.int(2, 4)
        const a = r.int(1, Math.max(1, Math.floor((b - 1) / k)))
        return {
          prompt: `Hisoblang: ${k} · ${a}/${b}.`,
          answer: k * a,
          text: frac(b),
          explain: `${k} · ${a} = ${k * a}, demak ${k * a}/${b}.`,
        }
      },
      r => {
        let a = r.int(1, 8)
        let b = r.int(a + 1, 9)
        while (gcd(a, b) !== 1) {
          a = r.int(1, 8)
          b = r.int(a + 1, 9)
        }
        return {
          prompt: `${a}/${b} kasrning teskarisini toping. Teskarisining surati nechaga teng?`,
          answer: b,
          explain: `Teskari kasr ${b}/${a}, demak surati ${b}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const b = r.pick([5, 7, 11])
        const d = r.pick([3, 5, 7].filter(x => x !== b))
        const a = coprime(r, 1, Math.min(b - 1, d - 1), d)
        const c = coprime(r, 1, Math.min(d - 1, b - 1), b)
        return {
          prompt: `Hisoblang: ${a}/${b} : ${c}/${d}.`,
          answer: a * d,
          text: frac(b * c),
          explain: `${a}/${b} : ${c}/${d} = ${a}/${b} · ${d}/${c} = ${a * d}/${b * c}.`,
        }
      },
      r => {
        const d = r.int(3, 7)
        const w = r.int(1, 4)
        const a = coprime(r, 1, d - 1, d)
        const k = r.int(2, 5)
        return {
          prompt: `Hisoblang: ${w} ${a}/${d} · ${k}.`,
          answer: (w * d + a) * k,
          text: frac(d),
          explain: `${w} ${a}/${d} = ${w * d + a}/${d}, ${w * d + a} · ${k} = ${(w * d + a) * k}, demak ${(w * d + a) * k}/${d}.`,
        }
      },
    ],
  },

  /** 5 — O'nli kasrlar: o'qilishi, taqqoslash, qo'shish va ayirish, oddiy kasrga o'tish */
  5: {
    oson: [
      r => {
        const a = r.int(1, 9)
        const b = r.int(1, 9)
        return {
          prompt: `Hisoblang: 0,${a} + 0,${b}.`,
          answer: a + b,
          text: dec(1),
          explain: `${a} + ${b} = ${a + b} o'ndan birlik, demak ${dec(1)(a + b)}.`,
        }
      },
      r => {
        const o = r.int(1, 9)
        const u = r.int(1, 9)
        return {
          prompt: `0,${o}${u} sonida yuzdan birlar raqami nechaga teng?`,
          answer: u,
          explain: `0,${o}${u} = ${o} o'ndan + ${u} yuzdan birlik, demak yuzdan birlar raqami ${u}.`,
        }
      },
    ],
    "o'rta": [
      r => {
        let x = r.int(101, 899)
        if (x % 10 === 0) x += 1
        const y = r.int(1, 9)
        return {
          prompt: `Hisoblang: ${dec(2)(x)} + ${dec(1)(y)}.`,
          answer: x + y * 10,
          text: dec(2),
          explain: `Yuzdan birlikda: ${x} + ${y * 10} = ${x + y * 10}, demak ${dec(2)(x + y * 10)}.`,
        }
      },
      r => {
        const [h, n, d] = r.pick([
          [25, 1, 4],
          [50, 1, 2],
          [75, 3, 4],
          [20, 1, 5],
          [40, 2, 5],
          [60, 3, 5],
          [80, 4, 5],
        ])
        const shown = `0,${String(h).padStart(2, '0')}`
        return {
          prompt: `${shown} sonini oddiy kasrga aylantirib qisqartiring. Surati nechaga teng?`,
          answer: n,
          explain: `${shown} = ${h}/100 = ${n}/${d}, demak surati ${n}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const x = r.int(300, 899)
        const y = r.int(101, x - 50)
        return {
          prompt: `Hisoblang: ${dec(2)(x)} − ${dec(2)(y)}.`,
          answer: x - y,
          text: dec(2),
          explain: `Yuzdan birlikda: ${x} − ${y} = ${x - y}, demak ${dec(2)(x - y)}.`,
        }
      },
      r => {
        const x = r.int(101, 299)
        const y = r.int(101, 299)
        const z = r.int(50, x + y - 50)
        return {
          prompt: `Hisoblang: ${dec(2)(x)} + ${dec(2)(y)} − ${dec(2)(z)}.`,
          answer: x + y - z,
          text: dec(2),
          explain: `${x} + ${y} = ${x + y}, ${x + y} − ${z} = ${x + y - z}, demak ${dec(2)(x + y - z)}.`,
        }
      },
    ],
  },

  /** 6 — Chekli va cheksiz o'nli kasrlar: ko'paytirish, bo'lish, davriy kasrlar */
  6: {
    oson: [
      r => {
        const a = r.int(2, 9)
        const k = r.int(2, 9)
        return {
          prompt: `Hisoblang: 0,${a} · ${k}.`,
          answer: a * k,
          text: dec(1),
          explain: `${a} · ${k} = ${a * k} o'ndan birlik, demak ${dec(1)(a * k)}.`,
        }
      },
      r => {
        const a = r.int(11, 49)
        const k = r.pick([2, 3, 4])
        return {
          prompt: `Hisoblang: ${dec(1)(a * k)} : ${k}.`,
          answer: a,
          text: dec(1),
          explain: `${dec(1)(a * k)} : ${k} = ${dec(1)(a)}.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const a = r.pick([2, 3, 4, 6, 7, 8, 9])
        const b = r.pick([2, 3, 4, 6, 7, 8, 9])
        return {
          prompt: `Hisoblang: 0,${a} · 0,${b}.`,
          answer: a * b,
          text: dec(2),
          explain: `${a} · ${b} = ${a * b} yuzdan birlik, demak ${dec(2)(a * b)}.`,
        }
      },
      r => {
        const b = r.int(2, 3)
        const q = r.int(2, Math.floor(9 / b))
        return {
          prompt: `Hisoblang: 0,${b * q} : 0,${b}.`,
          answer: q,
          explain: `0,${b * q} : 0,${b} = ${b * q} : ${b} = ${q}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const x = r.int(105, 499)
        const t = r.int(2, 9)
        return {
          prompt: `Hisoblang: ${dec(2)(x)} · 0,${t}.`,
          answer: x * t,
          text: dec(3),
          explain: `${x} · ${t} = ${x * t} mingdan birlik, demak ${dec(3)(x * t)}.`,
        }
      },
      r => {
        const item = r.pick([
          { q: '1/3', a: 3, e: '1/3 = 0,(3)' },
          { q: '2/3', a: 6, e: '2/3 = 0,(6)' },
          { q: '1/6', a: 6, e: '1/6 = 0,1(6)' },
          { q: '5/6', a: 3, e: '5/6 = 0,8(3)' },
          { q: '1/9', a: 1, e: '1/9 = 0,(1)' },
          { q: '4/9', a: 4, e: '4/9 = 0,(4)' },
          { q: '7/9', a: 7, e: '7/9 = 0,(7)' },
        ])
        return {
          prompt: `${item.q} ni o'nli kasrga aylantirganda davriy qismdagi raqam nechaga teng?`,
          answer: item.a,
          explain: item.e,
        }
      },
    ],
  },

  /** 7 — To'rt amalga oid misollar: amallar tartibi */
  7: {
    oson: [
      r => {
        const a = r.int(20, 80)
        const b = r.int(2, 9)
        const c = r.int(10, 90)
        return {
          prompt: `Hisoblang: ${a} + ${b} · ${c}.`,
          answer: a + b * c,
          explain: `Avval ko'paytirish: ${b} · ${c} = ${b * c}, keyin ${a} + ${b * c} = ${fmt(a + b * c)}.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const a = r.int(5, 12)
        const b = r.int(4, 9)
        const c = r.int(20, 90)
        return {
          prompt: `Hisoblang: ${a} · ${b} + ${c}.`,
          answer: a * b + c,
          explain: `${a} · ${b} = ${a * b}, ${a * b} + ${c} = ${fmt(a * b + c)}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const a = r.int(2, 9)
        const b = r.int(3, 9)
        const c = r.int(4, 9)
        const base = (a + b) * c
        const d = r.int(10, base - 1)
        return {
          prompt: `Hisoblang: (${a} + ${b}) · ${c} − ${d}.`,
          answer: base - d,
          explain: `Qavs: ${a} + ${b} = ${a + b}, ${a + b} · ${c} = ${base}, ${base} − ${d} = ${base - d}.`,
        }
      },
    ],
  },

  /** 8 — Musbat va manfiy sonlar: qarama-qarshi son, modul, amallar */
  8: {
    oson: [
      r => {
        const a = r.int(3, 20)
        return {
          prompt: `−${a} soniga qarama-qarshi sonni toping.`,
          answer: a,
          explain: `Qarama-qarshi son faqat ishorasi bilan farq qiladi: ${a}.`,
        }
      },
      r => {
        const a = r.int(3, 30)
        return {
          prompt: `|−${a}| ni hisoblang.`,
          answer: a,
          explain: `Modul — songacha bo'lgan masofa: ${a}.`,
        }
      },
      r => {
        const b = r.int(2, 9)
        const a = r.int(b + 1, 20)
        return {
          prompt: `Hisoblang: −${a} + ${b}.`,
          answer: b - a,
          explain: `Manfiy son moduli katta: ${b} − ${a} = ${b - a}.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const a = r.int(5, 18)
        const b = r.int(2, a)
        const c = r.int(2, 12)
        return {
          prompt: `Hisoblang: −${a} + ${b} − ${c}.`,
          answer: b - a - c,
          explain: `−${a} + ${b} = ${b - a}, ${b - a} − ${c} = ${b - a - c}.`,
        }
      },
      r => {
        const a = r.int(2, 9)
        const b = r.int(2, 9)
        return {
          prompt: `Hisoblang: (−${a}) · ${b}.`,
          answer: -a * b,
          explain: `Manfiy · musbat = manfiy: ${fmt(-a * b)}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const a = r.int(6, 20)
        const b = r.int(2, a - 1)
        return {
          prompt: `Hisoblang: |−${a}| − |−${b}|.`,
          answer: a - b,
          explain: `${a} − ${b} = ${a - b}.`,
        }
      },
      r => {
        const a = r.int(2, 9)
        const b = r.int(2, 9)
        const c = r.int(2, 12)
        return {
          prompt: `Hisoblang: −${a} · ${b} + ${c}.`,
          answer: c - a * b,
          explain: `−${a} · ${b} = ${fmt(-a * b)}, ${fmt(-a * b)} + ${c} = ${fmt(c - a * b)}.`,
        }
      },
      r => {
        const a = r.int(2, 9)
        const b = r.int(2, 9)
        return {
          prompt: `Hisoblang: (−${a * b}) : (−${b}).`,
          answer: a,
          explain: `Manfiy : manfiy = musbat: ${a * b} : ${b} = ${a}.`,
        }
      },
    ],
  },

  /** 9 — Ratsional sonlar: qo'shish, ayirish, ko'paytirish, bo'lish */
  9: {
    oson: [
      r => {
        const d = r.pick([5, 7, 11])
        const a = r.int(1, d - 2)
        const b = r.int(a + 1, d - 1)
        return {
          prompt: `Hisoblang: −${a}/${d} + ${b}/${d}.`,
          answer: b - a,
          text: frac(d),
          explain: `Maxraj bir xil: −${a} + ${b} = ${b - a}, demak ${b - a}/${d}.`,
        }
      },
      r => {
        const d = r.int(3, 9)
        const a = coprime(r, 1, d - 1, d)
        return {
          prompt: `−${a}/${d} ga qarama-qarshi kasrning surati nechaga teng?`,
          answer: a,
          explain: `Qarama-qarshi kasr ${a}/${d}, demak surati ${a}.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const b = r.pick([5, 7])
        const d = r.pick([3, 4, 7].filter(x => x !== b))
        const a = r.int(1, b - 1)
        const c = coprime(r, 1, d - 1, d)
        return {
          prompt: `Hisoblang: (−${a}/${b}) · ${c}/${d}.`,
          answer: -a * c,
          text: frac(b * d),
          explain: `Suratlar: −${a} · ${c} = ${fmt(-a * c)}, maxrajlar: ${b} · ${d} = ${b * d}, demak ${fmt(-a * c)}/${b * d}.`,
        }
      },
      r => {
        const [d1, d2] = r.pick([[3, 4], [3, 5], [4, 5], [4, 7], [5, 7]])
        const a = coprime(r, 1, d1 - 1, d1)
        const b = coprime(r, 1, d2 - 1, d2)
        const lcm = d1 * d2
        const n = b * d1 - a * d2
        return {
          prompt: `Hisoblang: −${a}/${d1} + ${b}/${d2}.`,
          answer: n,
          text: frac(lcm),
          explain: `Umumiy maxraj ${lcm}: ${fmt(-a * d2)} + ${b * d1} = ${fmt(n)}, demak ${fmt(n)}/${lcm}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const b = r.pick([5, 7])
        const d = r.pick([3, 4, 7].filter(x => x !== b))
        const a = r.int(1, b - 1)
        const c = r.int(1, d - 1)
        return {
          prompt: `Hisoblang: (−${a}/${b}) : (−${c}/${d}).`,
          answer: a * d,
          text: frac(b * c),
          explain: `(−${a}/${b}) : (−${c}/${d}) = ${a}/${b} · ${d}/${c} = ${a * d}/${b * c}.`,
        }
      },
      r => {
        const [b, d] = r.pick([[3, 4], [3, 5], [4, 5], [4, 7], [5, 7]])
        const a = r.int(1, b - 1)
        const c = r.int(1, d - 1)
        return {
          prompt: `Hisoblang: (${a}/${b} + ${c}/${d}) · ${b * d}.`,
          answer: a * d + c * b,
          explain: `Qavs ichida umumiy maxraj ${b * d}: ${a * d} + ${c * b} = ${a * d + c * b}.`,
        }
      },
    ],
  },

  /** 10 — Algebraik ifodalar: o'xshash hadlar, qavslar, koeffitsiyent */
  10: {
    oson: [
      r => {
        const k1 = r.int(1, 8)
        const k2 = r.int(1, 9)
        return {
          prompt: `${k1}x + ${k2}x ifodani soddalashtiring. x oldidagi koeffitsiyent nechaga teng?`,
          answer: k1 + k2,
          explain: `${k1} + ${k2} = ${k1 + k2}, demak ${k1 + k2}x.`,
        }
      },
      r => {
        const k1 = r.int(3, 9)
        const k2 = r.int(1, k1 - 2)
        return {
          prompt: `${k1}a − ${k2}a ifodani soddalashtiring. a oldidagi koeffitsiyent nechaga teng?`,
          answer: k1 - k2,
          explain: `${k1} − ${k2} = ${k1 - k2}, demak ${k1 - k2}a.`,
        }
      },
    ],
    "o'rta": [
      r => {
        const k = r.int(2, 6)
        const c = r.int(2, 9)
        return {
          prompt: `Qavslarni oching: ${k}(x + ${c}). Ozod had nechaga teng?`,
          answer: k * c,
          explain: `${k} · ${c} = ${k * c}, demak ${k}x + ${k * c}.`,
        }
      },
      r => {
        const k1 = r.int(2, 6)
        const c1 = r.int(1, 9)
        const k2 = r.int(2, 6)
        const c2 = r.int(1, 9)
        return {
          prompt: `${k1}x + ${c1} + ${k2}x + ${c2} ifodani soddalashtiring. Ozod had nechaga teng?`,
          answer: c1 + c2,
          explain: `${c1} + ${c2} = ${c1 + c2}.`,
        }
      },
    ],
    qiyin: [
      r => {
        const k = r.int(2, 5)
        const c = r.int(2, 8)
        const m = r.int(1, 6)
        return {
          prompt: `Qavslarni oching va ixchamlang: ${k}(x + ${c}) + ${m}x. x oldidagi koeffitsiyent nechaga teng?`,
          answer: k + m,
          explain: `${k}x + ${m}x = ${k + m}x, demak koeffitsiyent ${k + m}.`,
        }
      },
      r => {
        const k = r.int(2, 5)
        const c = r.int(2, 8)
        const m = r.int(2, 4)
        const d = r.int(2, 9)
        return {
          prompt: `Qavslarni oching: ${k}(x − ${c}) − ${m}(x − ${d}). Ozod had nechaga teng?`,
          answer: m * d - k * c,
          explain: `Ozod had: ${fmt(-k * c)} + ${m * d} = ${fmt(m * d - k * c)}.`,
        }
      },
    ],
  },
}

const buildOptions = (task: Task, r: Rng) => {
  const text = (value: number) => (task.text ? task.text(value) : fmt(value))
  const mag = Math.abs(task.answer)
  const steps = mag < 30 ? [1, 2, 3, 5, 10] : mag < 400 ? [1, 2, 9, 10, 20, 100] : [1, 2, 10, 100, 1000]

  const wrong = new Set<number>()
  for (let guard = 0; guard < 60 && wrong.size < 3; guard += 1) {
    const step = steps[r.int(0, steps.length - 1)]
    const value = task.answer + (r.int(0, 1) ? step : -step)
    if (value !== task.answer) wrong.add(value)
  }
  let pad = 1
  while (wrong.size < 3) {
    if (!wrong.has(task.answer + pad)) wrong.add(task.answer + pad)
    pad += 1
  }

  const values = [task.answer, ...wrong]
  const shift = r.int(0, 3)
  const ordered = values.map((_, i) => values[(i + shift) % values.length])
  return { options: ordered.map(text), correct: ordered.indexOf(task.answer) }
}

/**
 * Kunlik savolni generatsiya qiladi; `nonce` qayta so'rashda yangi variant beradi.
 * `publicId` — har o'quvchiga o'z savoli chiqishi uchun.
 */
export function generateDaily(input: {
  plan: StudyPlan
  day: string
  publicId?: string
  nonce?: number
}): GeneratedQuestion | null {
  const { plan, day, publicId, nonce = 0 } = input
  const num = plan.nums[plan.nums.length - 1] ?? 1
  const topic = findTopic(num)
  const pool = TEMPLATES[num]?.[plan.difficulty]
  if (!topic || !pool?.length) return null

  const seed = hash([publicId ?? 'hdp', day, num, plan.difficulty, nonce].join('|'))
  const r = makeRng(seed)
  const task = r.pick(pool)(r)
  const { options, correct } = buildOptions(task, r)

  return {
    prompt: task.prompt,
    options,
    correct,
    explain: task.explain,
    topic: shortTitle(topic.meta.title),
    topicNum: num,
    difficulty: plan.difficulty,
  }
}
