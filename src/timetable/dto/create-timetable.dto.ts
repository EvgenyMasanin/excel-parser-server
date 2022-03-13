import { SubjectTypes, Semester, WeekType, WeekDaysEN, SubgroupNumber } from 'src/excel/types'

export interface CreateTimetableDto {
  teacherToSubjectId: number
  groupId: number
  subGroupNum: SubgroupNumber
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
