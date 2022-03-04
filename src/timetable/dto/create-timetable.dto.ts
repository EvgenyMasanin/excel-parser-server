import { SubjectTypes, Semester, WeekType, WeekDays, DayOfWeek } from 'src/excel/types'

export interface CreateTimetableDto {
  teacherToSubjectId: number
  groupId: number
  subGroupNum: 1 | 2
  weekDay: DayOfWeek
  type: SubjectTypes
  hoursPerWeek: number
  hoursPerSemester: number
  semester: Semester
  course: string
  lessonNumber: number
  weekType: WeekType
  auditorium?: number
  campus?: number
}
