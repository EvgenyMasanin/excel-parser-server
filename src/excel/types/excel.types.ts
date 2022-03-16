import { Range } from 'xlsx'
import { SubjectHours } from './subject.types'
import { Semester } from './timetable.types'

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
