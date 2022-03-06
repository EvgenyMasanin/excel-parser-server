import { SubjectTypes, Semester, WeekType, WeekDaysEN, subgroupNumber } from 'src/excel/types'

export interface CreateTimetableDto {
  teacherToSubjectId: number
  groupId: number
  subGroupNum: subgroupNumber
  weekDay: WeekDaysEN
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
