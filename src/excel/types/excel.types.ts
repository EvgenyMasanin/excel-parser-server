import { Range } from 'xlsx'
import { SubjectHours, SubjectTypesMap } from './subject.types'
import { CourseNum, Semester, WeekDaysMapEN, WeekTypeMap } from './timetable.types'

type ColumnName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'

export type TableRow = Partial<Record<ColumnName, string>>

export type Table = Record<string, TableRow>

export interface ExcelSubjectPayload {
  subjectName: string
  semester: Semester
  countOfHours: SubjectHours
}

export interface ExcelTeacherPayload {
  fullName: string
  subjects: ExcelSubjectPayload[]
}

export type Merge = Range

export type Merges = Array<Merge>

export interface Row {
  ['Имя преподавателя']: string
  день: WeekDaysMapEN
  пара: number
  неделя: WeekTypeMap
  курс: CourseNum
  предмет: string
  ['тип занятия']: SubjectTypesMap
  группы: string
  аудитория: string
}
