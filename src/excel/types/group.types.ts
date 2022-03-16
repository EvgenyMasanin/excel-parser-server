import { Semester, CourseNum } from './index';
export interface Group {
  name: string
  subgroupsCount: number
  semester: Semester
  course: CourseNum
  subgroupsTimetable: SubGroupTimetable[]
}

export interface SubGroupTimetable {
  up: string | null
  down: string | null
}

export interface SubGroupData {
  up: string | null
  down: string | null
  semester: Semester
  course: CourseNum
}
export const subGroupNumber = [1, 2] as const
export type SubGroupNumber = typeof subGroupNumber[number]
