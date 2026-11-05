import type { TopicLesson, TopicTest } from './topicTypes'

/**
 * MAVZU 8 — «Musbat va manfiy sonlar haqida tushuncha. Butun va qarama-qarshi
 * sonlar. Sonning moduli. Musbat va manfiy sonlar ustida amallar».
 *
 * Matn kitobning 8.1–8.8 bo'limlaridan (Nazariy qism va Amaliy qism)
 * o'zgartirilmasdan ko'chirilgan. Formulalar matnga Unicode belgilar bilan
 * yozilgan, video id lar youtu.be havolasidan olingan.
 */

export const TOPIC_8_META = {
  id: 'mavzu-8',
  num: 8,
  chapter:
    "Musbat va manfiy sonlar haqida tushuncha. Butun va qarama-qarshi sonlar",
  title: 'Mavzu 8. Musbat va manfiy sonlar',
  lessonCount: 8,
}

export const TOPIC_8_LESSONS: TopicLesson[] = [
  {
    id: '8.1',
    n: 1,
    title: 'Musbat va manfiy sonlar haqida tushuncha',
    goal: "Musbat va manfiy sonlar haqida tushunchaga ega bo'lish",
    minutes: 14,
    videos: [
      {
        id: '0VDBggt5d9g',
        title: '8.1 Musbat va manfiy sonlar haqida tushuncha (Nazariy qism)',
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "O'tgan darslarda natural sonlar, oddiy va o'nli kasrlarni, ya'ni musbat sonlarni o'rgandik. Bu sonlarning barchasi 0 dan katta sonlardir ya'ni son o'qida 0 sondan o'ng tomonda joylashgan sonlardir. Son o'qida 1,5 va 3 1/2 kabi sonlar ham 0 dan o'ng tomonda turadi.",
      },
      {
        kind: "MA'LUMOT",
        text: "Turnushda shunday masalalar uchraydiki, ularni yechishda biz bilgan va shu paytgacha o'rgangan noldan katta sonlarni bilishimizning o'zi kifoya qilmaydi. Shunday holatlarda yangi sonlarni o'rganishga, ya'ni noldan ham kichik sonlarni o'rganishga ehtiyoj seziladi.",
      },
      {
        kind: "MA'LUMOT",
        text: "Faraz qiling, siz Dubayga sayohat qilmoqchisiz. Sayohatga borib kelish, ovqatlanish va mehmonxona xarajatlari jami 1000 $, ammo sizda 850 $ pul bor. Sizga esa yana 150 $ pul kerak. Sizga kerak bo'lgan ushbu pulni tanishlardan \"qarz\" olish orqali topdingiz va sayohatga yo'l oldingiz. Tanishlardan olgan 150 $ pul siz uchun qarz bo'lganligi uchun uni −150 $, o'zingizning 850 $ pulingizni esa +850 $ deb ifodalab olamiz.",
      },
      {
        kind: 'XULOSA',
        text: "Yuqoridagi holatlarni, ya'ni qarz kabi munosabatlarni ifodalash uchun manfiy sonlar paydo bo'lgan. Manfiy sonlar yozuvda \" − \" (minus) ishorasi bilan yoziladi.",
      },
      {
        kind: "TA'RIF",
        text: "Son o'qida 0 dan o'ng tarafda joylashgan barcha sonlar musbat(+) sonlar, chap tarafda joylashgan barcha sonlar esa manfiy(-) sonlar deyiladi. 0 sonining o'zi esa musbat ham, manfiy ham emas. U musbat va manfiy sonlarni ajratib turuvchi chegaradir.",
      },
    ],
    practice: [],
    exercises: [
      {
        prompt:
          'Sonlarni musbat va manfiy sonlarga ajratib yozing: 3; −1/2; 2,5; −0,(9); −23; 9; 1 1/2; 33/8; −6; −6,8',
        answer:
          'Musbat: 3; 2,5; 9; 1 1/2; 33/8. Manfiy: −1/2; −0,(9); −23; −6; −6,8',
      },
      {
        prompt:
          "Zafar do'sti Bunyod bilan darsdan chiqib ovqatlanishga borishdi. Ovqatlanib bo'lishgach, qarasalar umumiy hisob 50 000 bo'lgan va har biri 25 000 dan to'lashi kerak edi. Lekin Zafarning yonidagi bor puli 18 000 bo'lgani uchun uning qolgan pulini ham Bunyod to'lashga majbur bo'ldi. Savol? Zafar endi Bunyoddan necha so'm qarz bo'lib qoldi?",
        answer: "7 000 so'm",
        steps: [
          "Zafarning ulushi 25 000 so'm, yonida esa 18 000 so'm bor edi.",
          "Bunyod Zafar o'rniga 25 000 − 18 000 = 7 000 so'm to'ladi.",
          "Demak, Zafarning qarzi −7 000 so'm.",
        ],
      },
      {
        prompt:
          'Berilgan sonlarni musbat va manfiy sonlarga ajrating: 1) −6; 0; 3; −11 2/3; 3,5; 8  2) −1; 5; 3; 9; −3,(8); −3/4',
        answer:
          '1) Musbat: 3; 3,5; 8; manfiy: −6; −11 2/3; 0 esa na musbat, na manfiy. 2) Musbat: 5; 3; 9; manfiy: −1; −3,(8); −3/4',
      },
      {
        prompt:
          'Faqat manfiy sonlar berilgan qatorni toping: 1) 2, 5, 6, 17, 19  2) 1/4, 8 7/9, 13, −3  3) −1 3/4, −3, −3/5, −9',
        answer: '3)',
      },
    ],
  },

  {
    id: '8.2',
    n: 2,
    title: 'Qarama-qarshi sonlar',
    goal: "Qarama-qarshi sonlar haqida ma'lumotga ega bo'lish",
    minutes: 12,
    videos: [
      {
        id: 'YqaVuyXWzB8',
        title: '8.2 Qarama-qarshi sonlar (Nazariy qism)',
      },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: "Bir-biridan faqat ishorasi bilan farq qiluvchi sonlarga qarama-qarshi sonlar deyiladi. Qarama-qarshi sonlar son o'qida 0 dan bir xil masofada joylashadi.",
      },
      {
        kind: 'MASALAN',
        text: "1) 5 soniga qarama-qarshi son -5\n2) −9 soniga qarama-qarshi son 9 ga teng.",
      },
      {
        kind: 'ESLATISH',
        text: "- 0 soniga qarama-qarshi son mavjud emas!\n- Qarama-qarshi sonlar yig'indisi esa nolga teng.",
      },
    ],
    example: {
      prompt: 'Quyidagi sonlarga qarama-qarshi sonlarni toping: −4; 7/34; 8',
      steps: ['−4 → 4', '7/34 → −7/34', '8 → −8'],
      answer: '4; −7/34; −8',
    },
    practice: [],
    exercises: [
      {
        prompt: 'Quyidagi sonlarga qarama-qarshi sonlarni yozing: 1) 5  2) -2  3) 2 3/4  4) -0,3  5) 1,2',
        answer: '1) −5  2) 2  3) −2 3/4  4) 0,3  5) −1,2',
      },
      {
        prompt:
          'Berilgan sonlarga qarama-qarshi sonlarni toping: 1) 7/34  2) −0,8  3) 23423/4244  4) −5 7/9  5) 2,6',
        answer: '1) −7/34  2) 0,8  3) −23423/4244  4) 5 7/9  5) −2,6',
      },
    ],
  },

  {
    id: '8.3',
    n: 3,
    title: 'Butun sonlar',
    goal: "Butun sonlar haqida ma'lumotga ega bo'lish",
    minutes: 14,
    videos: [
      {
        id: '0eE3hauT1Uc',
        title: '8.3 Butun sonlar (Nazariy qism)',
      },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: "Barcha natural sonlar, natural sonlarga qarama-qarshi bo'lgan sonlar va 0 soni birgalikda butun sonlar deyiladi. Butun sonlardan tashkil topgan …-4, -3, -2, -1, 0, 1, 2, 3, 4 … ketma-ketlikka esa butun sonlar qatori deyiladi. Butun sonlar qatori Z harfi bilan belgilanadi.",
      },
    ],
    example: {
      prompt:
        "−3 dan 8 gacha bo'lgan barcha butun sonlarni son o'qida tasvirlang. Shunga asosan: a) manfiy butun sonlarni, b) musbat butun sonlarni ajratib yozing.",
      steps: [
        "Son o'qida −3, −2, −1, 0, 1, 2, 3, 4, 5, 6, 7, 8 nuqtalar belgilanadi.",
        'a) manfiy butun sonlar: -3, -2, -1',
        'b) musbat butun sonlar: 1, 2, 3, 4, 5, 6, 7, 8',
      ],
      answer: 'a) -3, -2, -1; b) 1, 2, 3, 4, 5, 6, 7, 8',
    },
    practice: [],
    exercises: [
      {
        prompt:
          '3; 1/3; 0,3; 4; 1 7/9; −8; −4,3; 0; 6; 0,(2) sonlari orasidan butun sonlarni ajratib yozing.',
        answer: '3; 4; −8; 0; 6',
      },
      {
        prompt:
          "−83, −18, −24, 4, 8, 0, −8, 3 1/2 sonlarini o'sish tartibida son o'qiga joylashtiring.",
        answer: '−83; −24; −18; −8; 0; 3 1/2; 4; 8',
      },
      {
        prompt: "Son o'qida −3,2 va 4,8 sonlari orasida nechta butun son bor?",
        answer: '8 ta (−3, −2, −1, 0, 1, 2, 3, 4)',
      },
      {
        prompt:
          'Berilgan sonlar ichidan butun sonlarni ajratib yozing: 0; 4; −7; 4/13; 0,(9); −9/3; 124; 42; −535; 53/543; −9667 23424/3652344',
        answer: '0; 4; −7; −3; 124; 42; −535',
        steps: ['−9/3 = −3 — bu butun son.', '4/13, 0,(9), 53/543 va −9667 23424/3652344 esa butun son emas.'],
      },
      {
        prompt:
          "Berilgan sonlarni ketma-ketlikda son o'qida tasvirlang: −8; 3; 0; 3 1/2; 3,2; −5,2; −1/2",
        steps: ["Eng kichigidan boshlab joylashtiramiz: −8 < −5,2 < −1/2 < 0 < 3 < 3,2 < 3 1/2."],
        answer: '−8; −5,2; −1/2; 0; 3; 3,2; 3 1/2',
      },
      {
        prompt: '−5 2/3 va 4 sonlari orasida joylashgan butun sonlarni yozing.',
        answer: '−5; −4; −3; −2; −1; 0; 1; 2; 3 (9 ta)',
      },
    ],
  },

  {
    id: '8.4',
    n: 4,
    title: 'Sonlarni qavslarsiz yozish',
    goal: "Sonlarni qavslarsiz yozishni o'rganish",
    minutes: 13,
    videos: [
      {
        id: '9X8v14hgdmo',
        title: '8.4 Sonlarni qavslarsiz yozish (Nazariy qism)',
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: 'Qavs oldida " − " yoki " + " ishoralari bo\'lsa, qavslarni ochish ketma-ketligi quyidagicha amalga oshiriladi:',
      },
      {
        kind: "MA'LUMOT",
        text: '1) Agar qavs oldidagi ishora " + " bo\'lsa, qavsni ochganda qavs ichidagi son o\'z ishorasi bilan yoziladi.',
      },
      {
        kind: 'MASALAN',
        text: '1) +(−3) = −3        2) +(3) = +3',
      },
      {
        kind: "MA'LUMOT",
        text: '2) Agar qavs oldidagi ishora " − " bo\'lsa, qavsni ochganda qavs ichidagi son qarama-qarshi ishora bilan yoziladi.',
      },
      {
        kind: 'MASALAN',
        text: '1) −(−3) = 3        2) −(+3) = −3',
      },
    ],
    practice: [],
    exercises: [
      {
        prompt:
          'Berilgan sonlarni qavssiz yozing: 1) −(+10)  2) −(−7)  3) −(+15)  4) +(−1 7/12)  5) +(+1,8)',
        answer: '1) −10  2) 7  3) −15  4) −1 7/12  5) 1,8',
      },
      {
        prompt:
          "Tenglik to'g'ri bo'lishi uchun nuqtalar o'rniga kerakli sonni qo'ying: 1) −(...) = −8  2) −(...) = 6  3) +(...) = 1,5  4) +(...) = −2",
        answer: '1) 8  2) −6  3) 1,5  4) −2',
      },
      {
        prompt:
          'Berilgan sonlarni qavssiz yozing: 1) −(+1)  2) −(+47)  3) −(−5)  4) +(−4/22)  5) +(+18)  6) −(12)  7) (−3)  8) −(−55)  9) (2)  10) −(10)',
        answer: '1) −1  2) −47  3) 5  4) −4/22  5) 18  6) −12  7) −3  8) 55  9) 2  10) −10',
      },
      {
        prompt:
          "Tenglik to'g'ri bo'lishi uchun nuqtalar o'rniga kerakli sonni qo'ying: 1) −(...) = 18  2) −(...) = −6  3) +(...) = 15  4) +(...) = −42",
        answer: '1) −18  2) 6  3) 15  4) −42',
      },
    ],
  },

  {
    id: '8.5',
    n: 5,
    title: 'Sonning moduli. Modul qatnashgan sonlar ustida amallar',
    goal: 'Sonning modulini topish va modul ustida amal bajarib bilish',
    minutes: 16,
    videos: [
      {
        id: 'XvDKhEhhjv4',
        title:
          '8.5 Sonning moduli. Modul qatnashgan sonlar ustida amallar (Nazariy qism)',
      },
    ],
    theory: [
      {
        kind: "TA'RIF",
        text: "Sonning moduli deb shunday belgiga aytiladiki, uning ichidagi har qanday musbat son ham, manfiy son ham modul ostidan chiqarilganda musbat bo'lib chiqadi.",
      },
      {
        kind: 'MASALAN',
        text: '1) |−3| = 3        2) |5| = 5        3) |−1,7| = 1,7',
      },
      {
        kind: "MA'LUMOT",
        text: "Modul qatnashgan sonlar ustida amallar. Modul qatnashgan sonlar ustida amal bajarishdan oldin, ifodada qatnashgan modul belgisi ostidagi sonlarni moduldan chiqarilib, keyin amallar tartibi belgilanib, bajariladi.",
      },
      {
        kind: 'YECHISH',
        text: 'Hisoblang: |−12|·2 + |8|:4 − |−15| = 12·2 + 8:4 − 15 = 24 + 2 − 15 = 11',
      },
    ],
    example: {
      prompt: 'Berilgan sonlarning modulini toping: −8; 9; −1,3; 4/23',
      steps: ['1) |−8| = 8', '2) |9| = 9', '3) |−1,3| = 1,3', '4) |4/23| = 4/23'],
      answer: '8; 9; 1,3; 4/23',
    },
    practice: [],
    exercises: [
      {
        prompt:
          'Berilgan sonlarning modullarini toping: −6; 9; 0; −9,8; 8/5; −7 5/8; 0,7(6)',
        answer: '6; 9; 0; 9,8; 8/5; 7 5/8; 0,7(6)',
      },
      {
        prompt:
          'Ifodaning son qiymatini toping: 1) |−8| + |−3|·6  2) |−13| − |15 − 7|  3) 2/3:|−6| + 1,5·|−4|',
        answer: '1) 26  2) 5  3) 6 1/9',
        steps: [
          '1) 8 + 3·6 = 8 + 18 = 26',
          '2) 13 − 8 = 5',
          '3) 2/3 : 6 + 1,5·4 = 1/9 + 6 = 6 1/9',
        ],
      },
      {
        prompt:
          'Quyidagi sonlarning modulini toping: 1) 7/34  2) −0,8  3) 23423/4244  4) −5 7/9  5) 2,6  6) 0',
        answer: '1) 7/34  2) 0,8  3) 23423/4244  4) 5 7/9  5) 2,6  6) 0',
      },
      {
        prompt:
          'Hisoblang: 1) |19| − |−19 + 8|  2) |−56|:|7| − |−15|:5  3) |−32| + |−32|:|8| − |7|  4) |−40|:|8| − |−12|:|−3|  5) |−15| + |−20| − |−3|·|−2|',
        answer: '1) 8  2) 5  3) 29  4) 1  5) 29',
        steps: [
          '1) 19 − 11 = 8',
          '2) 8 − 3 = 5',
          '3) 32 + 4 − 7 = 29',
          '4) 5 − 4 = 1',
          '5) 15 + 20 − 6 = 29',
        ],
      },
    ],
  },

  {
    id: '8.6',
    n: 6,
    title: "Musbat va manfiy sonlar ustida amallar. Musbat va manfiy sonlarni qo'shish",
    goal: "Musbat va manfiy sonlar ustida amal bajarishni o'rganish",
    minutes: 15,
    videos: [
      {
        id: 'zM-MpeP8qTQ',
        title:
          "8.6 Musbat va manfiy sonlar ustida amallar. Musbat va manfiy sonlarni qo'shish (Nazariy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Bir xil ishorali sonlarni qo'shish. Bir xil ishorali sonlar qo'shilganda ularning modullari qo'shilib, hosil bo'lgan yig'indi oldiga berilgan qo'shiluvchilarning umumiy ishorasi qo'yiladi.",
      },
      {
        kind: 'MASALAN',
        text: '1) +5 + 7 = +12        2) −5 − 7 = −12',
      },
      {
        kind: "MA'LUMOT",
        text: "Har xil ishorali sonlarni qo'shish. Har xil ishorali sonlarni qo'shganda, qo'shiluvchilarning moduli kattasidan moduli kichigi ayirilib, ayirma oldiga kattasining ishorasi qo'yiladi.",
      },
      {
        kind: 'MASALAN',
        text: '1) −5 + 9 = +4        2) −9 + 4 = −5',
      },
    ],
    practice: [],
    exercises: [
      {
        prompt:
          "Bir xil ishorali sonlar ustida amallarni bajaring: 1) (−20) + (−10)  2) (−20) − (−10)  3) 20 + 10",
        answer: '1) −30  2) −10  3) 30',
      },
      {
        prompt:
          'Har xil ishorali sonlar ustida amallarni bajaring: 1) −40 + 60  2) −60 + 40  3) 40 − (−60)',
        answer: '1) 20  2) −20  3) 100',
      },
      {
        prompt: 'Hisoblang: 1) -9+(-28)-(-27)  2) -80-(-80)  3) (-36)-(-24)',
        answer: '1) −10  2) 0  3) −12',
        steps: [
          '1) −9 − 28 + 27 = −10',
          '2) −80 + 80 = 0',
          '3) −36 + 24 = −12',
        ],
      },
      {
        prompt:
          'Hisoblang: 1) -69-88  2) -76-29  3) -96-88-44  4) -22-128-38  5) -69+48  6) -76+29  7) 96-88-44  8) 22-128-38',
        answer: '1) −157  2) −105  3) −228  4) −188  5) −21  6) −47  7) −36  8) −144',
      },
      {
        prompt:
          'Hisoblang: 1) -48-12  2) -9+(-28)-(-27)  3) -160-14  4) 29-(-1)  5) -80-(-80)  6) (-36)-(-24)  7) 72-(-12)-104  8) (-35)+(-45+10)',
        answer: '1) −60  2) −10  3) −174  4) 30  5) 0  6) −12  7) −20  8) −70',
      },
      {
        prompt:
          "Qo'shishni bajaring: 1) -54+(-16)  2) -9+(-31)  3) -55+(-45)  4) -4,5+(-3,5)  5) -1,5+(-7,3)  6) -2,76+(-1,24)  7) -92+(-8)  8) -73+(-17)",
        answer: '1) −70  2) −40  3) −100  4) −8  5) −8,8  6) −4  7) −100  8) −90',
      },
      {
        prompt:
          'Hisoblang: 1) -13-(-7)+(-7)  2) 72-(-12)-104  3) -3+(-8)-(-13)  4) -15-(-14)+(-24)  5) -9+(-28)-(-27)  6) -16-(-30)+(-30)  7) 20-(-9)-9  8) -12-8+(-10)',
        answer: '1) −13  2) −20  3) 2  4) −25  5) −10  6) −16  7) 20  8) −30',
      },
    ],
  },

  {
    id: '8.7',
    n: 7,
    title:
      "Musbat va manfiy sonlar ustida amallar. Musbat va manfiy sonlarni ko'paytirish va bo'lish",
    goal:
      "Musbat va manfiy sonlar ustida ko'paytirish va bo'lish amalini bajarish",
    minutes: 17,
    videos: [
      {
        id: 'AOLT7MBXUWg',
        title:
          "8.7 Musbat va manfiy sonlar ustida amallar. Musbat va manfiy sonlarni ko'paytirish va bo'lish (Nazariy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "1) Bir xil ishorali sonlarni ko'paytirish uchun ularning sonlari ko'paytiriladi va ko'paytma oldiga (+) ishorasi qo'yiladi: (+)·(+) = +, (−)·(−) = +.",
      },
      {
        kind: 'MASALAN',
        text: '1) (+7)·(+8) = +56        2) (−7)·(−8) = 56',
      },
      {
        kind: "MA'LUMOT",
        text: "2) Har xil ishorali sonlarni ko'paytirish uchun ularning sonlari ko'paytiriladi va ko'paytma oldiga (−) ishorasi qo'yiladi: (+)·(−) = −, (−)·(+) = −.",
      },
      {
        kind: 'MASALAN',
        text: '1) (+7)·(−8) = −56        2) (−7)·(+8) = −56',
      },
      {
        kind: "MA'LUMOT",
        text: "Musbat va manfiy sonlarni bo'lish. 1. Bir xil ishorali sonlarni bo'lish uchun ularning sonlari bo'linadi va bo'linma oldiga (+) ishorasi qo'yiladi: (+):(+) = +, (−):(−) = +.",
      },
      {
        kind: 'MASALAN',
        text: '1) (+20):(+4) = +5        2) (−20):(−4) = +5',
      },
      {
        kind: "MA'LUMOT",
        text: "2. Har xil ishorali sonlarni bo'lish uchun ularning sonlari bo'linadi va bo'linma oldiga (−) ishorasi qo'yiladi: (+):(−) = −, (−):(+) = −.",
      },
      {
        kind: 'MASALAN',
        text: '1) (+20):(−4) = (−5)        2) (−20):(+4) = −5',
      },
    ],
    practice: [],
    exercises: [
      {
        prompt:
          "Bir xil ishorali sonlarni ko'paytiring: 1) 8·5  2) (−11)·(−12)  3) (−25)·(−5)  4) 24·25",
        answer: '1) 40  2) 132  3) 125  4) 600',
      },
      {
        prompt:
          "Har xil ishorali sonlarni ko'paytiring: 1) (−18)·5  2) 32·(−4)  3) 10·(−81)  4) 7·(−28)",
        answer: '1) −90  2) −128  3) −810  4) −196',
      },
      {
        prompt:
          "Bir xil ishorali sonlarni bo'ling: 1) -100:(-25)  2) 56:7  3) -64:(-8)  4) 108:36",
        answer: '1) 4  2) 8  3) 8  4) 3',
      },
      {
        prompt:
          "Har xil ishorali sonlarni bo'ling: 1) 39:(-3)  2) -78:6  3) 100:(-25)  4) 56:(-7)",
        answer: '1) −13  2) −13  3) −4  4) −8',
      },
      {
        prompt:
          "Musbat va manfiy sonlarni ko'paytiring: 1) 64·12  2) −6·45  3) 70·(−66)  4) −4·(−24)",
        answer: '1) 768  2) −270  3) −4620  4) 96',
      },
      {
        prompt:
          "Hisoblashni bajarmasdan, natijaning ishorasini aniqlang: 1) (−….)·(−….)  2) (+….)·(−….)  3) (−….)·(+….)  4) (+….)·(+….)",
        answer: '1) +  2) −  3) −  4) +',
      },
      {
        prompt:
          "Musbat va manfiy sonlarni bo'ling: 1) 108:36  2) 144:(−9)  3) −156:24  4) −17:(−4)",
        answer: '1) 3  2) −16  3) −6,5  4) 4,25',
      },
      {
        prompt:
          "Hisoblashni bajarmasdan, natijaning ishorasini aniqlang: 1) (−….):(−….)  2) (+….):(−….)  3) (−….):(+….)  4) (+….):(+….)",
        answer: '1) +  2) −  3) −  4) +',
      },
    ],
  },

  {
    id: '8.8',
    n: 8,
    title:
      "Musbat va manfiy sonlar ustida amallar. Musbat va manfiy sonlar ustida to'rt amalga oid misollar",
    goal:
      "Musbat va manfiy sonlar ustida barcha amallarni bajarishni o'rganish",
    minutes: 18,
    videos: [
      {
        id: 'VMiWvY1Zoqg',
        title:
          "8.8 Musbat va manfiy sonlar ustida amallar. Musbat va manfiy sonlar ustida to'rt amalga oid misollar (Nazariy qism)",
      },
    ],
    theory: [
      {
        kind: "MA'LUMOT",
        text: "Musbat va manfiy sonlar ustida amal bajarish quyidagi ketma-ketlikda amalga oshiriladi:",
      },
    ],
    lists: [
      {
        caption: 'Amallar tartibi:',
        items: [
          'Qavs ichidagi amallar',
          "Qavsdan tashqaridagi ko'paytirish va bo'lish amallari",
          "Qavsdan tashqaridagi qo'shish va ayirish amallari",
        ],
      },
    ],
    example: {
      prompt: 'Amallarni bajaring: 8 + (6:(−2) − 2) − (−5)·(−1)',
      steps: [
        '1) Qavs ichidagi amallar: 6:(−2) − 2 = −3 − 2 = −5',
        "2) Qavsdan tashqaridagi ko'paytirish amali: (−5)·(−1) = 5",
        '3) Qolgan amallar: 8 + (−5) − 5 = 8 − 5 − 5 = −2',
      ],
      answer: '-2',
    },
    practice: [],
    exercises: [
      {
        prompt: 'Amallarni bajaring: (−12):((+3) + (−15)):(−5)',
        answer: '−0,2',
        steps: ['Qavs ichida: 3 + (−15) = −12', '(−12):(−12):(−5) = 1:(−5) = −0,2'],
      },
      {
        prompt: 'Amallarni bajaring: 9 + 12:(−3) + 5·(−8)',
        answer: '−35',
        steps: ['12:(−3) = −4; 5·(−8) = −40', '9 − 4 − 40 = −35'],
      },
      {
        prompt: 'Amallarni bajaring: 8 + 6:(−2) − 2·(−11)',
        answer: '27',
        steps: ['6:(−2) = −3; 2·(−11) = −22', '8 − 3 + 22 = 27'],
      },
      {
        prompt: 'Amallarni bajaring: (−8):((−3) + (+5))',
        answer: '−4',
        steps: ['Qavs ichida: −3 + 5 = 2', '(−8):2 = −4'],
      },
      {
        prompt: 'Amallarni bajaring: 1) ((+10) − (−3))·(−6)  2) ((−3)·(−4) − (+5))·((−8) − (+2)·(−6))',
        answer: '1) −78  2) 28',
        steps: [
          '1) (10 + 3)·(−6) = 13·(−6) = −78',
          '2) (12 − 5)·(−8 + 12) = 7·4 = 28',
        ],
      },
    ],
  },
]

export const TOPIC_8_TEST: TopicTest = {
  id: '8.9',
  n: 9,
  title: 'Mavzu 8 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't8-01',
      prompt: "Son o'qida 0 dan o'ng tarafda joylashgan barcha sonlar qanday sonlar deyiladi?",
      options: ['Musbat sonlar', 'Manfiy sonlar', 'Qarama-qarshi sonlar', 'Butun sonlar'],
      correct: 0,
      explain: "Ta'rifga ko'ra 0 dan o'ng tarafdagi barcha sonlar musbat sonlar deyiladi.",
    },
    {
      id: 't8-02',
      prompt: "0 soni haqida qaysi fikr to'g'ri?",
      options: [
        'Musbat ham, manfiy ham emas — ularni ajratib turuvchi chegara',
        'Faqat musbat son',
        'Faqat manfiy son',
        '0 natural sonlar qatoriga kiradi',
      ],
      correct: 0,
      explain: "Kitobda: 0 sonining o'zi musbat ham, manfiy ham emas, u musbat va manfiy sonlarni ajratib turuvchi chegaradir.",
    },
    {
      id: 't8-03',
      prompt: '5 soniga qarama-qarshi son qaysi?',
      options: ['−5', '5', '0', '1/5'],
      correct: 0,
      explain: "Qarama-qarshi sonlar faqat ishorasi bilan farq qiladi, shuning uchun 5 ga qarama-qarshi son −5.",
    },
    {
      id: 't8-04',
      prompt: '0 soniga qarama-qarshi son haqida nima deyish mumkin?',
      options: ['Bunday son mavjud emas', 'Bu yana 0 ning o\'zi', 'Bu 1', 'Bu −1'],
      correct: 0,
      explain: "Eslatmada aytilgan: 0 soniga qarama-qarshi son mavjud emas.",
    },
    {
      id: 't8-05',
      prompt: "Qarama-qarshi sonlar yig'indisi nechaga teng?",
      options: ['0 ga', '1 ga', 'Sonning moduliga', 'Har doim musbat songa'],
      correct: 0,
      explain: "Qarama-qarshi sonlar yig'indisi nolga teng, masalan 9 + (−9) = 0.",
    },
    {
      id: 't8-06',
      prompt: 'Qaysi qator faqat butun sonlardan tashkil topgan?',
      options: ['−3; 0; 7', '0,5; 2; −1', '1/3; 4; −5', '2,5; 0; 6'],
      correct: 0,
      explain: "Butun sonlar — natural sonlar, ularga qarama-qarshi sonlar va 0. −3; 0; 7 shu shartni qanoatlantiradi.",
    },
    {
      id: 't8-07',
      prompt: '−(+8) ifodani qavssiz yozing.',
      options: ['−8', '8', '0', '−(+8)'],
      correct: 0,
      explain: "Qavs oldida minus bo'lsa, qavs ichidagi son qarama-qarshi ishora bilan yoziladi: −(+8) = −8.",
    },
    {
      id: 't8-08',
      prompt: '−(−12) nechaga teng?',
      options: ['12', '−12', '0', '144'],
      correct: 0,
      explain: "−(3) = +3 qoidasi bo'yicha −(−12) = 12.",
    },
    {
      id: 't8-09',
      prompt: "Sonning moduli qanday son bo'lib chiqadi?",
      options: [
        "Har qanday son uchun ham musbat (0 uchun 0)",
        'Har doim manfiy son',
        "Sonning ishorasi o'zgarmaydi",
        'Faqat butun son',
      ],
      correct: 0,
      explain: "Modul ostidagi musbat ham, manfiy ham son moduldan chiqqanda musbat bo'ladi: |−3| = 3, |5| = 5.",
    },
    {
      id: 't8-10',
      prompt: '|−12|·2 + |8|:4 − |−15| ifodaning qiymatini toping.',
      options: ['11', '17', '19', '5'],
      correct: 0,
      explain: '12·2 + 8:4 − 15 = 24 + 2 − 15 = 11 — bu kitobdagi yechim.',
    },
    {
      id: 't8-11',
      prompt: '(−7)·(−8) nechaga teng?',
      options: ['56', '−56', '−15', '15'],
      correct: 0,
      explain: "Bir xil ishorali sonlar ko'paytmasi musbat bo'ladi: (−7)·(−8) = 56.",
    },
    {
      id: 't8-12',
      prompt: '(−20):(−4) nechaga teng?',
      options: ['5', '−5', '−24', '80'],
      correct: 0,
      explain: "Bir xil ishorali sonlar bo'linmasi musbat: (−20):(−4) = 5 (kitobda (+20):(+4) = +5 va (−20):(−4) = +5).",
    },
  ],
}

export const TOPIC_8_PASS = 7
