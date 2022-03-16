import { SubGroupNumber, SubjectTypes } from 'src/excel/types'
import { Group } from 'src/groups/entities/group.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'

export class CountOfLessonsMistake {
  readonly teacherId: number
  readonly teacherName: string
  readonly subjectId: number
  readonly subjectName: string
  readonly subjectType: SubjectTypes
  readonly groupId: number
  readonly groupName: string
  readonly subgroupNum: SubGroupNumber
  readonly expectedHoursPerWeek: number
  readonly realHoursPerWeek: number

  constructor(
    teacher: Teacher,
    subject: Subject,
    group: Group,
    subjectType: SubjectTypes,
    subgroupNum: SubGroupNumber,
    expectedHoursPerWeek: number,
    realHoursPerWeek: number
  ) {
    this.teacherId = teacher.id
    this.teacherName = teacher.name
    this.subjectId = subject.id
    this.subjectName = subject.name
    this.subjectType = subjectType
    this.groupId = group.id
    this.groupName = group.name
    this.subgroupNum = subgroupNum
    this.expectedHoursPerWeek = expectedHoursPerWeek
    this.realHoursPerWeek = realHoursPerWeek
  }
}
