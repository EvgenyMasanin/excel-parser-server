import { CourseNum, Semester, SubGroupNumber, WeekDaysEN, WeekType } from '.'

export interface ExcelSubject {
  name: string
  semester: Semester
  course: CourseNum
  groups: GroupData[]
  hoursPerSemester: SubjectHours | null
}

export interface GroupData {
  name: string
  subGroupsCount: SubGroupNumber
  hoursPerWeek: SubjectHours
  subGroups: Array<
    Array<{
      weekType: WeekType
      weekDay: WeekDaysEN
      lessonName: string
      lessonNumber: number
    }>
  >
}

export const subjectTypes = ['lecture', 'practice', 'laboratory'] as const
export type SubjectTypes = typeof subjectTypes[number]

export type SubjectHours = Record<SubjectTypes, number>
