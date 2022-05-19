import { Group } from './group.types'

export type Timetable = Record<WeekDaysMap, Group[][]>

export enum SemestersMap {
  'осенний' = 'first',
  'весенний' = 'second',
}

export const courses = {
  1: 'first',
  2: 'second',
  3: 'thead',
  4: 'fourth',
  5: 'fifth',
} as const

export type CourseNum = 1 | 2 | 3 | 4 | 5

export const semester = ['first', 'second'] as const
export type Semester = typeof semester[number]

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

export enum WeekDaysMap {
  'Понедельник' = 'monday',
  'Вторник' = 'tuesday',
  'Среда' = 'wednesday',
  'Четверг' = 'thursday',
  'Пятница' = 'friday',
  'Суббота' = 'saturday',
}

export enum WeekDaysMapEN {
  'monday' = 'Понедельник',
  'tuesday' = 'Вторник',
  'wednesday' = 'Среда',
  'thursday' = 'Четверг',
  'friday' = 'Пятница',
  'saturday' = 'Суббота',
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

export const weekType = ['up', 'down', 'up/down'] as const
export type WeekType = typeof weekType[number]

export enum WeekTypeMap {
  'up' = 'Верхняя',
  'down' = 'Нижняя',
  'up/down' = 'Верхняя/Нижняя',
}
