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
  topics: SubjectTopic[]
}

export const SUBJECTS: Subject[] = [
  {
    id: 'algebra-1',
    name: 'Algebra I',
    badge: 'A1',
    topics: TOPICS.map(t => ({ num: t.meta.num, title: shortTitle(t.meta.title) })),
  },
  { id: 'algebra-2', name: 'Algebra II', badge: 'A2', topics: [] },
  { id: 'geometriya', name: 'Geometriya', badge: 'G', topics: [] },
  { id: 'stereometriya', name: 'Stereometriya', badge: 'S', topics: [] },
]

export const findSubject = (id: string) => SUBJECTS.find(s => s.id === id)

export { topicLessonIds, topicTestCount, topicVideoCount } from './curriculum'
