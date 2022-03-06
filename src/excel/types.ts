import { Range } from 'xlsx'

export const semester = ['first', 'second'] as const
export type Semester = typeof semester[number]

export enum SemestersMap {
  'осенний' = 'first',
  'весенний' = 'second',
}

export interface ISubjectHours {
  lecture: number[]
  laboratory: number[]
  practice: number[]
}

export interface GroupData {
  hoursPerWeek: ISubjectHours
  subGroups: Array<
    Array<{
      type: WeekType
      weekDay: WeekDaysEN
      lessonName: string
      lessonNumber: number
    }>
  >
}

export interface ISubject {
  name: string
  semester: Semester
  groups: Record<string, GroupData>
  hoursPerSemester: {
    lecture: number
    laboratory: number
    practice: number
  } | null
}

export interface ITeacher {
  name: string
  position: string
  course: {
    first: ISubject[]
    second: ISubject[]
    thead: ISubject[]
    fourth: ISubject[]
    fifth: ISubject[]
  }
}

export interface SubGroupData {
  up: string | null
  down: string | null
  semester: Semester
  course: CourseNum
}

export const SubgroupNumber = [1, 2] as const
export type subgroupNumber = typeof SubgroupNumber[number]

export type Timetable = Record<WeekDaysMap, Array<Record<string, Array<SubGroupData>>>>

export const courses = {
  1: 'first',
  2: 'second',
  3: 'thead',
  4: 'fourth',
  5: 'fifth',
} as const

export interface ITableRow {
  A?: number
  B?: string
  C?: string
  D?: number
  E?: string
  F?: string
  G?: number
  H?: string
  I?: string
  J?: number
  K?: string
  L?: string
  M?: string
}

export type ITable = Record<string, ITableRow>

export type CourseNum = 1 | 2 | 3 | 4 | 5

export interface ISubjectPayload {
  subjectName: string
  semester: Semester
  countOfHours: {
    lecture: number
    laboratory: number
    practice: number
  }
}

export interface ITeacherPayload {
  fullName: string
  subjects: ISubjectPayload[]
}

export enum WeekDaysMap {
  'Понедельник' = 'monday',
  'Вторник' = 'tuesday',
  'Среда' = 'wednesday',
  'Четверг' = 'thursday',
  'Пятница' = 'friday',
  'Суббота' = 'saturday',
}

export const weekDaysRU = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
] as const

export type WeekDaysRU = keyof typeof WeekDaysMap
export type WeekDaysEN = `${WeekDaysMap}`

export type Merge = Range

export type Merges = Array<Merge>

export const lessons = {
  '8.30-10.05': 'Первая пара',
  '10.25-12.00': 'Вторая пара',
  '12.30-14.05': 'Третья пара',
  '14.20-15.55': 'Четвёртая пара',
  '16.05-17.40': 'Пятая пара',
  '17.50-19.25': 'Шестая пара',
} as const

export enum Lessons {
  'Первая пара',
  'Вторая пара',
  'Третья пара',
  'Четвёртая пара',
  'Пятая пара',
  'Шестая пара',
}

export const weekType = ['up', 'down', 'up/down'] as const
export type WeekType = typeof weekType[number]

export const subjectTypes = ['lecture', 'practice', 'laboratory'] as const
export type SubjectTypes = typeof subjectTypes[number]
