import { Semester } from "src/excel/types"

export interface CreateSubjectHoursDto {
  teacherToSubjectId: number
  groupId: number
  semester: Semester
  lectureHoursPerWeek: number
  laboratoryHoursPerWeek: number
  practiceHoursPerWeek: number
}
