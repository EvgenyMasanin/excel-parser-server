import { SubjectTypes, Semester, WeekType, WeekDaysEN, SubGroupNumber, CourseNum } from 'src/excel/types'

export interface CreateTimetableDto {
  teacherToSubjectId: number
  groupId: number
  subGroupNum: SubGroupNumber
  weekDay: WeekDaysEN
  subjectType: SubjectTypes
  hoursPerWeek: number
  hoursPerSemester: number
  semester: Semester
  course: CourseNum
  lessonNumber: number
  weekType: WeekType
  auditorium?: number
  campus?: number
}
