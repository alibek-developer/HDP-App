import type { TopicLesson, TopicTest, TheoryBlock, WorkedItem, TopicExercise } from './topicTypes'

/**
 * MAVZU 6 — «Chekli o'nli kasrlar ustida amallar».
 * Manba: kitobning 52–59-betlari (nazariy qism 6.1–6.6, amaliy qism 6.1–6.6).
 */

export const TOPIC_6_META = {
  id: 'mavzu-6',
  num: 6,
  chapter: "Chekli o'nli kasrlar ustida amallar",
  title: "Mavzu 6. Chekli o'nli kasrlar ustida amallar",
  lessonCount: 6,
}

const PRACTICE_NONE: WorkedItem[] = []

/* ------------------------------------------------------------------ 6.1 */

const THEORY_6_1: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Chekli o'nli kasrlar quyidagi ikki xil usul bo'yicha ko'paytiriladi:",
  },
  {
    kind: "MA'LUMOT",
    text: "1. Ustun shaklda ko'paytirish. O'nli kasrlarni ustun shaklda ko'paytirganda ularning verguliga e'tibor bermay, natural sonlar kabi ko'paytirilib, ko'paytuvchilarda birgalikda verguldan keyin nechta raqam bo'lsa, ko'paytmada ham o'ngdan chapga qarab shuncha raqam (sanab) qoldirib, so'ngra vergul qo'yish kerak.",
  },
  {
    kind: 'MASALAN',
    text: "O'nli kasrlarni ustun shaklda ko'paytiring: 13,2 · 0,4",
  },
  {
    kind: 'YECHISH',
    text: "13,2 — verguldan keyin bir xona, 0,4 — verguldan keyin bir xona. Ko'paytirish: 13,2 × 0,4 = 528 va 000, jami verguldan keyin ikki xona → 05,28.",
  },
  {
    kind: "MA'LUMOT",
    text: "2. Oddiy kasrga o'tkazib ko'paytirish. Ushbu usulda chekli o'nli kasrlar avval oddiy kasrga o'tkazilib, keyin ko'paytiriladi.",
  },
  {
    kind: 'MASALAN',
    text: "O'nli kasrlarni oddiy kasrga o'tkazib ko'paytiring: 13,2 · 0,4",
  },
  {
    kind: 'YECHISH',
    text: "13,2 · 0,4 = 132/10 · 4/10 = 528/100 = 5,28",
  },
]

const EXERCISES_6_1: TopicExercise[] = [
  { prompt: "Ustun shaklda ko'paytiring: 1,4 · 1,8", answer: '2,52' },
  { prompt: "Ustun shaklda ko'paytiring: 2,3 · 0,75", answer: '1,725' },
  { prompt: "Ustun shaklda ko'paytiring: 11,3 · 10,4", answer: '117,52' },
  { prompt: '10, 100, 1000 ... ga ko\'paytirishni bajaring: 0,17 · 1000', answer: '170' },
  { prompt: "10, 100, 1000 ... ga ko'paytirishni bajaring: 3,07 · 100", answer: '307' },
  { prompt: "10, 100, 1000 ... ga ko'paytirishni bajaring: 0,054 · 100000", answer: '5400' },
  { prompt: "0,1; 0,01; 0,001 ... ga ko'paytirishni bajaring: 2,01 · 0,001", answer: '0,00201' },
  { prompt: "0,1; 0,01; 0,001 ... ga ko'paytirishni bajaring: 1,5 · 0,01", answer: '0,015' },
  { prompt: "0,1; 0,01; 0,001 ... ga ko'paytirishni bajaring: 0,03 · 0,1", answer: '0,003' },
  { prompt: "Amaliy qism. Ustun shaklda ko'paytiring: 0,5 · 4", answer: '2' },
  { prompt: "Amaliy qism. Ustun shaklda ko'paytiring: 3,5 · 2", answer: '7' },
  { prompt: "Amaliy qism. Ustun shaklda ko'paytiring: 4 · 0,15", answer: '0,6' },
  { prompt: "Amaliy qism. Ustun shaklda ko'paytiring: 0,4 · 1,16", answer: '0,464' },
  { prompt: "Amaliy qism. Ustun shaklda ko'paytiring: 0,7 · 12", answer: '8,4' },
  { prompt: "Amaliy qism. Ustun shaklda ko'paytiring: 2,3 · 10", answer: '23' },
  { prompt: "Amaliy qism. Ustun shaklda ko'paytiring: 2,85 · 0,15", answer: '0,4275' },
  { prompt: "Amaliy qism. Ustun shaklda ko'paytiring: 0,01 · 15", answer: '0,15' },
  { prompt: "Amaliy qism. Oddiy kasrga o'tkazib ko'paytiring: 0,7 · 8", answer: '5,6' },
  { prompt: "Amaliy qism. Oddiy kasrga o'tkazib ko'paytiring: 0,15 · 6", answer: '0,9' },
  { prompt: "Amaliy qism. Oddiy kasrga o'tkazib ko'paytiring: 3,4 · 4", answer: '13,6' },
  { prompt: "Amaliy qism. Oddiy kasrga o'tkazib ko'paytiring: 2,5 · 8", answer: '20' },
  { prompt: "Amaliy qism. Oddiy kasrga o'tkazib ko'paytiring: 5,4 · 3", answer: '16,2' },
  { prompt: "Amaliy qism. Oddiy kasrga o'tkazib ko'paytiring: 0,02 · 12", answer: '0,24' },
  { prompt: "Amaliy qism. Oddiy kasrga o'tkazib ko'paytiring: 3 · 0,008", answer: '0,024' },
  { prompt: "Amaliy qism. Oddiy kasrga o'tkazib ko'paytiring: 3 · 0,6", answer: '1,8' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga ko'paytiring: 1,257 · 0,01", answer: '0,01257' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga ko'paytiring: 0,45 · 0,001", answer: '0,00045' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga ko'paytiring: 6,9 · 0,1", answer: '0,69' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga ko'paytiring: 12 · 0,0001", answer: '0,0012' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga ko'paytiring: 0,7 · 1000", answer: '700' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga ko'paytiring: 2,3 · 100", answer: '230' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga ko'paytiring: 2,85 · 10", answer: '28,5' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga ko'paytiring: 0,01 · 1000", answer: '10' },
]

/* ------------------------------------------------------------------ 6.2 */

const THEORY_6_2: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Chekli o'nli kasrlar quyidagi ikki xil usul bo'yicha bo'linadi:",
  },
  {
    kind: "MA'LUMOT",
    text: "1. Burchak usuli. Chekli o'nli kasrlar ham burchak usulida natural sonlar kabi bo'linadi.",
  },
  {
    kind: 'MASALAN',
    text: "O'nli kasrlarni burchak usulida bo'ling: 2,56 : 0,4",
  },
  {
    kind: 'YECHISH',
    text: "Burchak usulida 2,56 : 0,4 = 25,6 : 4 = 6,4. Bo'lish davomida 2,4; 0,16; 0,16 ayirib boriladi va qoldiq 0 bo'ladi, bo'linma 6,4 ga teng.",
  },
  {
    kind: "MA'LUMOT",
    text: "2. Oddiy kasrga o'tkazib bo'lish. Ushbu usulda chekli o'nli kasrlar avval oddiy kasrga o'tkazilib, keyin bo'linadi.",
  },
  {
    kind: 'MASALAN',
    text: "O'nli kasrlarni oddiy kasrlarga o'tkazib bo'ling: 2,56 : 0,4",
  },
  {
    kind: 'YECHISH',
    text: "2,56 : 0,4 = 256/100 : 4/10 = 256/100 · 10/4 = 64/10 = 6,4",
  },
]

const EXERCISES_6_2: TopicExercise[] = [
  { prompt: "Burchak usuli bilan bo'ling: 6,21 : 0,3", answer: '20,7' },
  { prompt: "Burchak usuli bilan bo'ling: 3,672 : 2,04", answer: '1,8' },
  { prompt: "Burchak usuli bilan bo'ling: 0,3534 : 0,57", answer: '0,62' },
  { prompt: "Oddiy kasrga o'tkazish usuli bilan bo'ling: 0,12 : 0,4", answer: '0,3' },
  { prompt: "Oddiy kasrga o'tkazish usuli bilan bo'ling: 0,1 : 0,8", answer: '0,125' },
  { prompt: "Oddiy kasrga o'tkazish usuli bilan bo'ling: 0,0121 : 0,11", answer: '0,11' },
  { prompt: "10, 100, 1000 ... ga bo'lishni bajaring: 12,064 : 100", answer: '0,12064' },
  { prompt: "10, 100, 1000 ... ga bo'lishni bajaring: 0,004 : 1000", answer: '0,000004' },
  { prompt: "10, 100, 1000 ... ga bo'lishni bajaring: 2,496 : 10000", answer: '0,0002496' },
  { prompt: "0,1; 0,01; 0,001 ... ga bo'lishni bajaring: 10,01 : 0,1", answer: '100,1' },
  { prompt: "0,1; 0,01; 0,001 ... ga bo'lishni bajaring: 0,0153 : 0,001", answer: '15,3' },
  { prompt: "0,1; 0,01; 0,001 ... ga bo'lishni bajaring: 16,8054 : 0,000001", answer: '16805400' },
  { prompt: "Amaliy qism. Burchak usulida bo'ling: 42,3 : 0,9", answer: '47' },
  { prompt: "Amaliy qism. Burchak usulida bo'ling: 121,6 : 4", answer: '30,4' },
  { prompt: "Amaliy qism. Burchak usulida bo'ling: 93,15 : 2,3", answer: '40,5' },
  { prompt: "Amaliy qism. Burchak usulida bo'ling: 18,27 : 7", answer: '2,61' },
  { prompt: "Amaliy qism. Oddiy kasrlarga o'tkazib bo'ling: 2,5 : 0,5", answer: '5' },
  { prompt: "Amaliy qism. Oddiy kasrlarga o'tkazib bo'ling: 3,2 : 4", answer: '0,8' },
  { prompt: "Amaliy qism. Oddiy kasrlarga o'tkazib bo'ling: 3 : 0,15", answer: '20' },
  { prompt: "Amaliy qism. Oddiy kasrlarga o'tkazib bo'ling: 2,56 : 1,6", answer: '1,6' },
  { prompt: "Amaliy qism. Oddiy kasrlarga o'tkazib bo'ling: 5,4 : 3", answer: '1,8' },
  { prompt: "Amaliy qism. Oddiy kasrlarga o'tkazib bo'ling: 0,15 : 0,6", answer: '0,25' },
  { prompt: "Amaliy qism. Oddiy kasrlarga o'tkazib bo'ling: 2,5 : 8", answer: '0,3125' },
  { prompt: "Amaliy qism. Oddiy kasrlarga o'tkazib bo'ling: 3 : 0,6", answer: '5' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga bo'ling: 2,34 : 100", answer: '0,0234' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga bo'ling: 1,68 : 0,1", answer: '16,8' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga bo'ling: 3,25 : 0,1", answer: '32,5' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga bo'ling: 3,25 : 0,01", answer: '325' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga bo'ling: 93,15 : 10", answer: '9,315' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga bo'ling: 5,87 : 100", answer: '0,0587' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga bo'ling: 2,56 : 100", answer: '0,0256' },
  { prompt: "Amaliy qism. 0,1; 0,01; 0,001 ... va 10, 100, 1000 ... ga bo'ling: 2,63 : 1000", answer: '0,00263' },
]

/* ------------------------------------------------------------------ 6.3 */

const THEORY_6_3: TheoryBlock[] = [
  {
    kind: 'MASALAN',
    text: "Cheksiz o'nli kasrlar — o'z ichiga davriy kasrlarni (0,5555...) hamda davriy bo'lmagan (irratsional) sonlarni (0,123342...) oluvchi o'nli kasrlardir.",
  },
  {
    kind: "MA'LUMOT",
    text: "Shulardan davriy bo'lmagan cheksiz o'nli kasrlar, ya'ni irratsional sonlar haqida keyingi darslarda tanisib o'tsak, bugun esa cheksiz davriy o'nli kasrlar mavzusini boshlaymiz.",
  },
  {
    kind: "MA'LUMOT",
    text: "Cheksiz davriy o'nli kasrlar. 1. Kelib chiqishi. Davriy o'nli kasrlarning kelib chiqishi bo'lish amaliga borib taqaladi. Yuqoridagi mavzularda ta'kidlab o'tganimizdek, natural sonlar ustida bo'lish amali har doim ham bizga aniq yechim topib bera olmaydi. Masalan 2 ni 9 ga bo'laylik, unda quyidagicha natija olamiz: 0,2222222... Demak, 2 ni 9 ga bo'lsak bo'linmada verguldan keyin 2 soni cheksiz takrorlanib ketaverganligi sababli, ushbu kasrga davriy kasr deyiladi, cheksiz takrorlanib turgan 2 raqami esa davriy kasrning davri deyiladi.",
  },
  {
    kind: "TA'RIF",
    text: "Raqamining bir qismi cheksiz takrorlanadigan o'nli kasrlarga cheksiz davriy o'nli kasrlar deyiladi.",
  },
  {
    kind: 'MASALAN',
    text: '1) 0,22222 ...   2) 13,01010101 ...   3) 8,1277777 ...',
  },
  {
    kind: "MA'LUMOT",
    text: "2. Davriy kasrning ifodalanishi. Cheksiz davriy o'nli kasrlar yozuvda cheksiz takrorlangan qismi qavs bilan ajratib yoziladi. Bu yozuv Butun dunyo va Turkiyada quyidagicha yoziladi:",
  },
  {
    kind: "MA'LUMOT",
    text: "3. O'qilishi. Cheksiz davriy o'nli kasrlar quyidagicha o'qiladi: 1) 0,(2) yozuv nol butun davrda 2; 2) 13,(01) yozuv o'n uch butun davrda 01; 3) 8,12(7) yozuv esa sakkiz butun o'n ikki, davrda yetti deb o'qiladi.",
  },
  {
    kind: 'ESLATISH',
    text: "Irratsional sonlar haqida keyingi mavzularda batafsil tanishamiz.",
  },
]

const LISTS_6_3 = [
  {
    caption: "Cheksiz o'nli kasrlar quyidagilarga bo'linadi:",
    items: [
      "Davriy cheksiz o'nli kasrlar (ratsional sonlar). Misol: 0,3333...",
      "Davriy bo'lmagan cheksiz o'nli kasrlar (irratsional sonlar). Misol: 0,14151719...",
    ],
  },
  {
    caption: "Davriy kasrning ifodalanishi ikki xil yoziladi:",
    items: [
      'Butun dunyoda: 1) 0,333333... = 0,(3);  2) 13,010101... = 13,(01)',
      "Turkiyada va ba'zi Yevropa davlatlarida: 1) 0,333333... = 0,3 (3 ustida chiziq);  2) 13,010101... = 13,01 (01 ustida chiziq)",
    ],
  },
]

const EXERCISES_6_3: TopicExercise[] = [
  { prompt: "Davrini aniqlang va qavs bilan yozing: 5,727272…", answer: '5,(72)' },
  { prompt: "Davrini aniqlang va qavs bilan yozing: 0,333…", answer: '0,(3)' },
  { prompt: "Davrini aniqlang va qavs bilan yozing: 7,822822822…", answer: '7,(822)' },
  { prompt: "Davrini aniqlang va qavs bilan yozing: 0,35737373…", answer: '0,35(73)' },
  { prompt: 'Davriy qismi qavs ichida berilgan kasrni qavssiz yozing: 0,(82)', answer: '0,828282…' },
  { prompt: 'Davriy qismi qavs ichida berilgan kasrni qavssiz yozing: 11,(212)', answer: '11,212212212…' },
  { prompt: 'Davriy qismi qavs ichida berilgan kasrni qavssiz yozing: 2,23(2)', answer: '2,23222…' },
  { prompt: 'Davriy qismi qavs ichida berilgan kasrni qavssiz yozing: 0,0(210)', answer: '0,0210210…' },
  { prompt: "Amaliy qism. Davrini aniqlang va qavs bilan yozing: 7,2222…", answer: '7,(2)' },
  { prompt: "Amaliy qism. Davrini aniqlang va qavs bilan yozing: 0,37777…", answer: '0,3(7)' },
  { prompt: "Amaliy qism. Davrini aniqlang va qavs bilan yozing: 8,12888…", answer: '8,12(8)' },
  { prompt: "Amaliy qism. Davrini aniqlang va qavs bilan yozing: 0,353535…", answer: '0,(35)' },
  { prompt: 'Amaliy qism. Qavssiz yozing: 1,(17)', answer: '1,171717…' },
  { prompt: 'Amaliy qism. Qavssiz yozing: 0,(21)', answer: '0,212121…' },
  { prompt: 'Amaliy qism. Qavssiz yozing: 2,3(2)', answer: '2,3222…' },
  { prompt: 'Amaliy qism. Qavssiz yozing: 0,0(87)', answer: '0,0878787…' },
]

/* ------------------------------------------------------------------ 6.4 */

const THEORY_6_4: TheoryBlock[] = [
  {
    kind: 'MASALAN',
    text: 'Hisoblang: 0,3333 … · 0,121212 …',
  },
  {
    kind: 'YECHISH',
    text: "Ko'paytirishning ustun usulidan foydalanib ko'paytiradigan bo'lsak, avval eng oxirdagi xonasidan boshlab chapga qarab ko'paytirib kelishimiz kerak edi, ammo ushbu misolda raqamining bir qismi cheksiz takrorlanib turgani uchun oxirdagi xonani o'zi yo'q. Demak, ushbu holatda bu sonlarni ko'paytirishning iloji yo'q.",
  },
  {
    kind: 'XULOSA',
    text: "Demak, davriy kasrlarni ko'paytirish, bo'lish yoki umuman olganda davriy kasrlar ustida amal bajarish biz uchun noqulayliklar tug'dirar ekan. Har qanday aqli odam bunday vaziyatdan chiqib ketadi, dono odamlar esa bunday vaziyatga tushmaydilar. Shunday qilib, biz ham dono odamlar singari “dono” usuldan foydalanib, davriy kasrlar ustida amallar bajaramiz.",
  },
  {
    kind: "MA'LUMOT",
    text: "Dono usul bu — davriy kasrni oddiy kasrga o'tkazish usuli. Dono odam har qanday vaziyatda ham noqulayliklarga duch kelmaydi. Shuning uchun bu usulni dono usul deb atadik. Shunga ko'ra, davriy kasrlarni quyidagicha oddiy kasrlarga o'tkazamiz:",
  },
]

const LISTS_6_4 = [
  {
    caption: "Davriy kasrlarni oddiy kasrlarga o'tkazish:",
    items: [
      '1) 0,333 ... = 0,(3) = 3/9',
      '2) 0,121212 ... = 0,(12) = 12/99',
      '3) 3,222 ... = 3,(2) = 3 2/9',
      '4) 1,3757575 ... = 1,3(75) = 1 (375−3)/990',
    ],
  },
]

const EXERCISES_6_4: TopicExercise[] = [
  { prompt: "Cheksiz davriy o'nli kasrni oddiy kasrga o'tkazing: 0,(8)", answer: '8/9' },
  { prompt: "Cheksiz davriy o'nli kasrni oddiy kasrga o'tkazing: 3,(27)", answer: '3 27/99 = 3 3/11' },
  { prompt: "Cheksiz davriy o'nli kasrni oddiy kasrga o'tkazing: 25,(18)", answer: '25 18/99 = 25 2/11' },
  { prompt: "Cheksiz davriy o'nli kasrni oddiy kasrga o'tkazing: 0,(25)", answer: '25/99' },
  { prompt: "Cheksiz davriy o'nli kasrni oddiy kasrga o'tkazing: 0,2(35)", answer: '(235−2)/990 = 233/990' },
  { prompt: "Cheksiz davriy o'nli kasrni oddiy kasrga o'tkazing: 2,3(16)", answer: '2 (316−3)/990 = 2 313/990' },
  { prompt: "Cheksiz davriy o'nli kasrni oddiy kasrga o'tkazing: 24,23(5)", answer: '24 (235−23)/900 = 24 212/900' },
  { prompt: "Cheksiz davriy o'nli kasrni oddiy kasrga o'tkazing: 0,23(145)", answer: '(23145−23)/99900 = 23122/99900' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 0,(7)", answer: '7/9' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 0,(67)", answer: '67/99' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 2,(57)", answer: '2 57/99' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 8,(5)", answer: '8 5/9' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 9,(17)", answer: '9 17/99' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 41,(4)", answer: '41 4/9' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 6,(21)", answer: '6 21/99' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 5,(07)", answer: '5 7/99' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 5,(101)", answer: '5 101/999' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 9,(11)", answer: '9 11/99' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 5,14(25)", answer: '5 (1425−14)/9900 = 5 1411/9900' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 25,1(6)", answer: '25 (16−1)/90 = 25 15/90 = 25 1/6' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 26,8(15)", answer: '26 (815−8)/990 = 26 807/990' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 25,2(3)", answer: '25 (23−2)/90 = 25 21/90 = 25 7/30' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 0,25(3)", answer: '(253−25)/900 = 228/900 = 19/75' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 0,7(8)", answer: '(78−7)/90 = 71/90' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 1,1(2)", answer: '1 (12−1)/90 = 1 11/90' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 0,0(17)", answer: '17/990' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 5,00(8)", answer: '5 8/900 = 5 2/225' },
  { prompt: "Amaliy qism. Oddiy kasr ko'rinishiga keltiring: 2,0(5)", answer: '2 5/90 = 2 1/18' },
]

/* ------------------------------------------------------------------ 6.5 */

const THEORY_6_5: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Oddiy kasrlarni quyidagi ikkita usul orqali davriy kasrlarga o'tkazamiz:",
  },
  {
    kind: "MA'LUMOT",
    text: "1-usul. Oddiy kasrlarni maxrajni 9, 99, 999, 99... larga keltirish orqali davriy o'nli kasrlarga o'tkazish. Agar kasr noto'g'ri kasr bo'lsa, avval u aralash kasr ko'rinishiga keltirilib, keyin kasr qismi davriy kasr ko'rinishiga keltiriladi.",
  },
  {
    kind: 'MASALAN',
    text: '1) 2/3 = (2·3)/(3·3) = 6/9 = 0,(6)    2) 45/27 = (45:3)/(27:3) = 15/9 = 1 6/9 = 1,(6)',
  },
  {
    kind: "MA'LUMOT",
    text: "2-usul. Oddiy kasrlarni suratini maxrajiga bo'lish orqali davriy kasrlarga o'tkazish. Bu usuldan odatda maxrajni 9, 99, 999, 99... larga keltirib bo'lmaydigan holatlarda foydalanamiz.",
  },
  {
    kind: 'YECHISH',
    text: '130 : 90 = 0,144 ... Demak: 130/90 = 0,144 ... = 0,1(4)',
  },
]

const EXERCISES_6_5: TopicExercise[] = [
  { prompt: "Maxrajni 9, 99, 999, 99... ga keltirish orqali cheksiz davriy o'nli kasr ko'rinishida ifodalang: 2/9", answer: '0,(2)' },
  { prompt: "Maxrajni 9, 99, 999, 99... ga keltirish orqali cheksiz davriy o'nli kasr ko'rinishida ifodalang: 7/11", answer: '63/99 = 0,(63)' },
  { prompt: "Maxrajni 9, 99, 999, 99... ga keltirish orqali cheksiz davriy o'nli kasr ko'rinishida ifodalang: 204/99", answer: '2 6/99 = 2,(06)' },
  { prompt: "Maxrajni 9, 99, 999, 99... ga keltirish orqali cheksiz davriy o'nli kasr ko'rinishida ifodalang: 23/999", answer: '0,(023)' },
  { prompt: "Suratini maxrajiga bo'lish orqali cheksiz davriy o'nli kasr ko'rinishiga keltiring: 23/90", answer: '0,2(5)' },
  { prompt: "Suratini maxrajiga bo'lish orqali cheksiz davriy o'nli kasr ko'rinishiga keltiring: 111/900", answer: '0,12(3)' },
  { prompt: "Suratini maxrajiga bo'lish orqali cheksiz davriy o'nli kasr ko'rinishiga keltiring: 78/990", answer: '0,0(78)' },
  { prompt: "Suratini maxrajiga bo'lish orqali cheksiz davriy o'nli kasr ko'rinishiga keltiring: 13602/9000", answer: '1,51(3)' },
  { prompt: "Amaliy qism. Maxrajni 9, 99, 999, 99... ga keltirib ifodalang: 7/9", answer: '0,(7)' },
  { prompt: "Amaliy qism. Maxrajni 9, 99, 999, 99... ga keltirib ifodalang: 14/11", answer: '126/99 = 1 27/99 = 1,(27)' },
  { prompt: "Amaliy qism. Maxrajni 9, 99, 999, 99... ga keltirib ifodalang: 24/99", answer: '0,(24)' },
  { prompt: "Amaliy qism. Maxrajni 9, 99, 999, 99... ga keltirib ifodalang: 2003/999", answer: '2 5/999 = 2,(005)' },
  { prompt: "Amaliy qism. Suratini maxrajiga bo'lib ifodalang: 3/90", answer: '0,0(3)' },
  { prompt: "Amaliy qism. Suratini maxrajiga bo'lib ifodalang: 1102/900", answer: '1,22(4)' },
  { prompt: "Amaliy qism. Suratini maxrajiga bo'lib ifodalang: 788/990", answer: '0,7(96)' },
  { prompt: "Amaliy qism. Suratini maxrajiga bo'lib ifodalang: 13602/9000", answer: '1,51(3)' },
]

/* ------------------------------------------------------------------ 6.6 */

const THEORY_6_6: TheoryBlock[] = [
  {
    kind: "MA'LUMOT",
    text: "Cheksiz davriy o'nli kasrlar ustida amal bajarish uchun, avval ular oddiy kasrga aylantiriladi, keyin esa o'tgan darslarda o'rganilgan usullardan foydalanib, oddiy kasrlar ustida ko'paytirish, bo'lish, qo'shish va ayirish amallari bajariladi.",
  },
  {
    kind: 'MASALAN',
    text: "1) 8,6(7) − 3,(4) = 8 (67−6)/90 − 3 4/9 = (8 − 3) + (61/90 − 40/90) = 5 + 21/90 = 5 + 7/30 = 5 7/30",
  },
  {
    kind: 'MASALAN',
    text: "2) 0,5(4)·1,4(5) = (54−5)/90 · 1 (45−4)/90 = 49/90 · 1 41/90 = 49/90 · 131/90 = 6419/8100",
  },
]

const EXERCISES_6_6: TopicExercise[] = [
  { prompt: "Qo'shish amalini bajaring: 0,41(6) + 0,(3)", answer: '5/12 + 1/3 = 3/4 = 0,75' },
  { prompt: 'Ayirish amalini bajaring: 3,2(6) − 2,(6)', answer: '3 4/15 − 2 2/3 = 3/5 = 0,6' },
  { prompt: "Ko'paytirish amalini bajaring: 1,3(6) · 0,6(3)", answer: '41/30 · 19/30 = 779/900 = 0,86(5)' },
  { prompt: "Bo'lish amalini bajaring: 0,1(8) : 0,8(1)", answer: '17/90 : 73/90 = 17/73' },
  { prompt: 'Hisoblang: (0,1(6) + 0,(3)) / (0,(3) + 1,1(6))', answer: '(1/6 + 1/3) / (1/3 + 7/6) = (1/2) / (3/2) = 1/3 = 0,(3)' },
  {
    prompt: "# Challenge -1. Cheksiz davriy o'nli kasrlarni oddiy kasrlarga o'tkazganda nega oddiy kasrning maxrajida aynan 9, 99, 90, 990, ... bo'lishini isbotlang.",
  },
  { prompt: "Amaliy qism. Davriy kasrlar ustida amallarni bajaring: 4,6(3) − 1,(8)", answer: '4 19/30 − 1 8/9 = 2 67/90' },
  { prompt: "Amaliy qism. Davriy kasrlar ustida amallarni bajaring: 5,4(3) + 4,5(3)", answer: '5 13/30 + 4 8/15 = 9 29/30' },
  { prompt: "Amaliy qism. Davriy kasrlar ustida amallarni bajaring: 0,(8) + 3,1(6)", answer: '8/9 + 3 1/6 = 4 1/18' },
  { prompt: "Amaliy qism. Davriy kasrlar ustida amallarni bajaring: 3,(3) · 0,3 + 0,2 · 4/9", answer: '1 + 4/45 = 1 4/45' },
  {
    prompt: 'Amaliy qism. Davriy kasrlar ustida amallarni bajaring: (4,(2) + 4,(4) + 4,(6)) / (4,(3) + 4,(5) + 4,(7))',
    answer: '(40/3) / (41/3) = 40/41',
  },
  {
    prompt: 'Amaliy qism. Davriy kasrlar ustida amallarni bajaring: (3,2(6) − 2,(6)) / 0,(3)',
    answer: '(3/5) / (1/3) = 9/5 = 1,8',
  },
]

export const TOPIC_6_LESSONS: TopicLesson[] = [
  {
    id: '6.1',
    n: 1,
    title: "Chekli o'nli kasrlarni ko'paytirish",
    goal: "Chekli o'nli kasrlarni ko'paytirishni o'rganish",
    minutes: 15,
    videos: [
      { id: 'e9DYga1Akv4', title: "Chekli o'nli kasrlarni ko'paytirish (Nazariy qism)" },
      { id: 'DgzIi9-STCE', title: "Chekli o'nli kasrlarni ko'paytirish (Amaliy qism)" },
    ],
    theory: THEORY_6_1,
    example: {
      prompt: "O'nli kasrlarni ustun shaklda ko'paytiring: 13,2 · 0,4",
      stack: {
        op: '·',
        rows: ['13,2', '0,4', '528', '000'],
        result: '05,28',
      },
      steps: [
        "13,2 — verguldan keyin bir xona",
        "0,4 — verguldan keyin bir xona",
        "Ko'paytirish vergulga e'tibor bermay bajariladi: 132 · 4 = 528, 0 · 132 = 000",
        'Jami verguldan keyin ikki xona → 05,28',
      ],
      answer: '5,28',
    },
    practice: PRACTICE_NONE,
    exercises: EXERCISES_6_1,
  },

  {
    id: '6.2',
    n: 2,
    title: "Chekli o'nli kasrlarni bo'lish",
    goal: "Chekli o'nli kasrlarni bo'lishni o'rganish",
    minutes: 15,
    videos: [
      { id: 'mQ31PncB_8U', title: "Chekli o'nli kasrlarni bo'lish (Nazariy qism)" },
      { id: 'p49xIw9eIbE', title: "Chekli o'nli kasrlarni bo'lish (Amaliy qism)" },
    ],
    theory: THEORY_6_2,
    example: {
      prompt: "O'nli kasrlarni burchak usulida bo'ling: 2,56 : 0,4",
      stack: {
        op: ':',
        rows: ['2,56', '0,4'],
        result: '6,4',
      },
      steps: [
        '2,56 : 0,4 = 25,6 : 4',
        '25,6 : 4 = 6,4 (qoldiq 0)',
      ],
      answer: '6,4',
    },
    practice: PRACTICE_NONE,
    exercises: EXERCISES_6_2,
  },

  {
    id: '6.3',
    n: 3,
    title: "Cheksiz o'nli kasrlar. Cheksiz davriy o'nli kasrlar haqida",
    goal: "Cheksiz davriy o'nli kasr haqida ma'lumotga ega bo'lish",
    minutes: 14,
    videos: [
      {
        id: 'RdniF_yMnJo',
        title: "Cheksiz o'nli kasrlar. Cheksiz davriy o'nli kasrlar haqida (Nazariy qism)",
      },
      {
        id: 'aBqxuWj7I4k',
        title: "Cheksiz o'nli kasrlar. Cheksiz davriy o'nli kasrlar haqida (Amaliy qism)",
      },
    ],
    theory: THEORY_6_3,
    lists: LISTS_6_3,
    practice: PRACTICE_NONE,
    exercises: EXERCISES_6_3,
  },

  {
    id: '6.4',
    n: 4,
    title: "Davriy kasrlar bilan bog'liq noqulayliklar. Davriy kasrlardan oddiy kasrlarga o'tish",
    goal: "Cheksiz davriy o'nli kasrlardan oddiy kasrlarga o'tib bilish",
    minutes: 16,
    videos: [
      {
        id: 'gIENCoynrQk',
        title: "Davriy kasrlar bilan bog'liq noqulayliklar. Davriy kasrlardan oddiy kasrlarga o'tish (Nazariy qism)",
      },
      {
        id: '7pg7x0Pkr6A',
        title: "Davriy kasrlar bilan bog'liq noqulayliklar. Davriy kasrlardan oddiy kasrlarga o'tish (Amaliy qism)",
      },
    ],
    theory: THEORY_6_4,
    lists: LISTS_6_4,
    practice: PRACTICE_NONE,
    exercises: EXERCISES_6_4,
  },

  {
    id: '6.5',
    n: 5,
    title: "Oddiy kasrlarni cheksiz davriy o'nli kasrlarga o'tkazish",
    goal: "Oddiy kasrlarni cheksiz davriy o'nli kasrlarga o'tkazib bilish",
    minutes: 14,
    videos: [
      {
        id: 'EGiQwv1DY4c',
        title: "Oddiy kasrlarni cheksiz davriy o'nli kasrlarga o'tkazish (Nazariy qism)",
      },
      {
        id: 'j4ovJR8JZ5I',
        title: "Oddiy kasrlarni cheksiz davriy o'nli kasrlarga o'tkazish (Amaliy qism)",
      },
    ],
    theory: THEORY_6_5,
    example: {
      prompt: "Oddiy kasrni suratini maxrajiga bo'lish orqali davriy kasrga o'tkazing: 130/90",
      steps: [
        '130 : 90 = 0, qoldiqda 40',
        '400 : 90 = 4, qoldiqda 40 — 4 raqami cheksiz takrorlanadi',
        'Natija: 0,144...',
      ],
      answer: '130/90 = 0,144 ... = 0,1(4)',
    },
    practice: PRACTICE_NONE,
    exercises: EXERCISES_6_5,
  },

  {
    id: '6.6',
    n: 6,
    title: "Cheksiz davriy o'nli kasrlar ustida amallar",
    goal: "Cheksiz davriy o'nli kasrlar ustida amal bajarishni o'rganish",
    minutes: 18,
    videos: [
      { id: 'jJmI8Q8-sPk', title: "Cheksiz davriy o'nli kasrlar ustida amallar (Nazariy qism)" },
      { id: 'oNcqZeZeRyo', title: "Cheksiz davriy o'nli kasrlar ustida amallar (Amaliy qism)" },
    ],
    theory: THEORY_6_6,
    example: {
      prompt: "Ayirishni bajaring: 8,6(7) − 3,(4)",
      steps: [
        '8,6(7) = 8 (67−6)/90 = 8 61/90',
        '3,(4) = 3 4/9 = 3 40/90',
        '8 61/90 − 3 40/90 = (8 − 3) + (61/90 − 40/90) = 5 + 21/90',
        '21/90 = 7/30 → 5 7/30',
      ],
      answer: '5 7/30',
    },
    practice: PRACTICE_NONE,
    exercises: EXERCISES_6_6,
  },
]

export const TOPIC_6_TEST: TopicTest = {
  id: '6.7',
  n: 7,
  title: 'Mavzu 6 yakuniy testi',
  goal: "Bo'lim bo'yicha bilimni sinash",
  total: 12,
  coinPerSolve: 5,
  xpPerSolve: 8,
  questions: [
    {
      id: 't6-01',
      prompt: "Ustun shaklda hisoblang: 13,2 · 0,4",
      options: ['5,28', '52,8', '0,528', '5,028'],
      correct: 0,
      explain:
        "Verguldan keyin bir xona va yana bir xona, jami ikki xona: 132 · 4 = 528, natija 5,28 bo'ladi.",
    },
    {
      id: 't6-02',
      prompt: "Hisoblang: 2,56 : 0,4",
      options: ['0,64', '6,4', '64', '0,064'],
      correct: 1,
      explain:
        "2,56 : 0,4 = 256/100 · 10/4 = 64/10 = 6,4. Bo'linuvchi va bo'luvchi verguli bir xil xonaga suriladi.",
    },
    {
      id: 't6-03',
      prompt: "Raqamining bir qismi cheksiz takrorlanadigan o'nli kasrlarga nima deyiladi?",
      options: [
        "Chekli o'nli kasr",
        "Davriy bo'lmagan cheksiz o'nli kasr",
        "Cheksiz davriy o'nli kasr",
        'Irratsional son',
      ],
      correct: 2,
      explain:
        "Ta'rifga ko'ra raqamining bir qismi cheksiz takrorlanadigan o'nli kasr cheksiz davriy o'nli kasr deyiladi, takrorlanuvchi qism esa davr deyiladi.",
    },
    {
      id: 't6-04',
      prompt: 'Davrini aniqlang va kasrni qavs bilan yozing: 0,35737373…',
      options: ['0,(357)', '0,357(3)', '0,3(57)', '0,35(73)'],
      correct: 3,
      explain:
        'Verguldan keyin 35 takrorlanmaydi, 73 esa cheksiz takrorlanadi, shuning uchun yozuv 0,35(73) ko\'rinishida bo\'ladi.',
    },
    {
      id: 't6-05',
      prompt: "0,(12) davriy kasrni oddiy kasrga o'tkazing",
      options: ['12/100', '4/33', '12/10', '1/12'],
      correct: 1,
      explain:
        'Davr ikki xonali bo\'lgani uchun maxraj 99: 12/99 = 4/33.',
    },
    {
      id: 't6-06',
      prompt: "Nega 0,3333 … · 0,121212 … ni bevosita ustun usulida ko'paytirib bo'lmaydi?",
      options: [
        "Kasrlar juda kichik bo'lgani uchun",
        "Chunki kasrlarning eng oxirgi xonasi yo'q",
        "Chunki vergul noto'g'ri qo'yilgan",
        'Chunki davr noldan boshlanadi',
      ],
      correct: 1,
      explain:
        "Ustun usulida ko'paytirish eng oxirgi xonadan boshlanadi, davriy kasrda esa raqam cheksiz takrorlangani uchun oxirgi xona mavjud emas.",
    },
    {
      id: 't6-07',
      prompt: "2/3 kasrni cheksiz davriy o'nli kasr ko'rinishida ifodalang",
      options: ['0,6', '0,(6)', '0,(3)', '0,66'],
      correct: 1,
      explain:
        "Maxrajni 9 ga keltiramiz: 2/3 = 6/9, demak 2/3 = 0,666... = 0,(6).",
    },
    {
      id: 't6-08',
      prompt: "Suratini maxrajiga bo'lib hisoblang: 130/90",
      options: ['0,(14)', '1,(4)', '0,14', '0,1(4)'],
      correct: 3,
      explain:
        "130 : 90 = 0,144..., ya'ni 1 dan keyingi 4 raqami cheksiz takrorlanadi: 0,1(4).",
    },
    {
      id: 't6-09',
      prompt: "Hisoblang: 8,6(7) − 3,(4)",
      options: ['5 7/30', '5 7/90', '4 7/30', '5 21/30'],
      correct: 0,
      explain:
        "8,6(7) = 8 61/90, 3,(4) = 3 40/90. Ayirma 5 + 21/90 = 5 7/30.",
    },
    {
      id: 't6-10',
      prompt: "Hisoblang: 0,5(4) · 1,4(5)",
      options: ['6419/900', '49/90', '6419/8100', '6419/81'],
      correct: 2,
      explain:
        "0,5(4) = 49/90, 1,4(5) = 131/90; 49 · 131 = 6419, 90 · 90 = 8100.",
    },
    {
      id: 't6-11',
      prompt: "Hisoblang: 0,41(6) + 0,(3)",
      options: ['0,58', '0,75', '0,8(3)', '0,7(5)'],
      correct: 1,
      explain:
        "0,41(6) = 375/900 = 5/12, 0,(3) = 1/3 = 4/12; yig'indi 9/12 = 3/4 = 0,75.",
    },
    {
      id: 't6-12',
      prompt: "0,(8) davriy kasrni oddiy kasrga o'tkazing",
      options: ['8/10', '8/9', '9/8', '8/99'],
      correct: 1,
      explain:
        "Bir xonali davr uchun maxraj 9 bo'ladi, shuning uchun 0,(8) = 8/9.",
    },
  ],
}

export const TOPIC_6_PASS = 7
