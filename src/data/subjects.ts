import type { ImageSourcePropType } from 'react-native'
import { TOPICS, shortTitle } from './curriculum'

/**
 * Fanlar (kurs darajasi). Algebra I ichida darslikning barcha 10 mavzusi bor;
 * qolgan fanlar hali yuklanmagan va bo'sh holatni chizadi.
 */

export interface SubjectTopic {
  num: number
  title: string
}

export interface Subject {
  id: string
  name: string
  /** fan kartasidagi bitta harf */
  badge: string
  /** keng fotosurat — fan sarlavhasi va bo'sh holat uchun */
  photo: ImageSourcePropType
  /** kvadrat miniatura — ro'yxat qatorlari uchun */
  thumb: ImageSourcePropType
  topics: SubjectTopic[]
}

export const SUBJECTS: Subject[] = [
  {
    id: 'algebra-1',
    name: 'Algebra I',
    badge: 'A1',
    photo: require('../assets/subjects/algebra-1.webp'),
    thumb: require('../assets/subjects/algebra-1.webp'),
    topics: TOPICS.map(t => ({ num: t.meta.num, title: shortTitle(t.meta.title) })),
  },
  {
    id: 'algebra-2',
    name: 'Algebra II',
    badge: 'A2',
    photo: require('../assets/subjects/algebra-2-cover.webp'),
    thumb: require('../assets/subjects/algebra-2.webp'),
    topics: [],
  },
  {
    id: 'geometriya',
    name: 'Geometriya',
    badge: 'G',
    photo: require('../assets/subjects/geometriya-cover.webp'),
    thumb: require('../assets/subjects/geometriya.webp'),
    topics: [],
  },
  {
    id: 'stereometriya',
    name: 'Stereometriya',
    badge: 'S',
    photo: require('../assets/subjects/stereometriya-cover.webp'),
    thumb: require('../assets/subjects/stereometriya.webp'),
    topics: [],
  },
]

export const findSubject = (id: string) => SUBJECTS.find(s => s.id === id)

export { topicLessonIds, topicTestCount, topicVideoCount } from './curriculum'
