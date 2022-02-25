export type Semester = 'first' | 'second'
export enum SemestersTranslations {
  'осенний' = 'first',
  'весенний' = 'second',
}

export type obj = { [key: string]: any }

export interface ISubjectHours {
  lecture: number[]
  laboratory: number[]
  practice: number[]
}

export interface GroupData {
  hoursPerWeek: ISubjectHours
  subGroups: Array<
    Array<{
      // up: string | null
      // down: string | null
      type: WeekType
      weekDay: DayOfWeek
      lessonNumber: number
      lessonName: string
    }>
  >
}

export interface ISubject {
  name: string
  semester: Semester
  groups: {
    [groupName: string]: GroupData
  }
  hoursPerSemester: {
    lectures: number
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

export type Timetable = {
  [key in WeekDays]: Array<{
    [key: string]: Array<SubGroupData>
  }>
}

interface ICourses {
  1: 'first'
  2: 'second'
  3: 'thead'
  4: 'fourth'
  5: 'fifth'
}

export const courses: ICourses = {
  1: 'first',
  2: 'second',
  3: 'thead',
  4: 'fourth',
  5: 'fifth',
}

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

export interface ITable {
  [key: string]: ITableRow
}

export type CourseNum = 1 | 2 | 3 | 4 | 5

export interface ISubjectPayload {
  subjectName: string
  semester: Semester
  countOfHours: {
    lectures: number
    laboratory: number
    practice: number
  }
}

export interface ITeacherPayload {
  fullName: string
  subjects: ISubjectPayload[]
}

export type DayOfWeek =
  | 'Понедельник'
  | 'Вторник'
  | 'Среда'
  | 'Четверг'
  | 'Пятница'
  | 'Суббота'

export const weekDays: Array<DayOfWeek> = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]

export enum WeekDays {
  'Понедельник' = 'monday',
  'Вторник' = 'tuesday',
  'Среда' = 'wednesday',
  'Четверг' = 'thursday',
  'Пятница' = 'friday',
  'Суббота' = 'saturday',
}

export type Merge = {
  s: { c: number; r: number }
  e: { c: number; r: number }
}

export type Merges = Array<Merge>

export const lessons = {
  '8.30-10.05': 'Первая пара',
  '10.25-12.00': 'Вторая пара',
  '12.30-14.05': 'Третья пара',
  '14.20-15.55': 'Четвёртая пара',
  '16.05-17.40': 'Пятая пара',
  '17.50-19.25': 'Шестая пара',
}

export enum Lessons {
  'Первая пара',
  'Вторая пара',
  'Третья пара',
  'Четвёртая пара',
  'Пятая пара',
  'Шестая пара',
}

export type WeekType = 'up' | 'down' | 'up/down'
