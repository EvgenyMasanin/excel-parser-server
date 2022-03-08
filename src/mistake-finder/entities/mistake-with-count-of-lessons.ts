import { subgroupNumber, SubjectTypes } from 'src/excel/types'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'

export class MistakeWithCountOfLessons {
  readonly teacherId: number
  readonly teacherName: string
  readonly subjectId: number
  readonly subjectName: string
  readonly subjectType: SubjectTypes
  readonly groupId: number
  readonly groupName: string
  readonly subgroupNum: subgroupNumber
  readonly expectedHoursPerWeek: number
  readonly realHoursPerWeek: number
  
  constructor(teacher: Teacher, subject: Subject, timetable: Timetable, countOfLessons: number) {
    this.teacherId = teacher.id
    this.teacherName = teacher.name
    this.subjectId = subject.id
    this.subjectName = subject.name
    this.subjectType = timetable.type
    this.groupId = timetable.group.id
    this.groupName = timetable.group.name
    this.subgroupNum = timetable.subGroupNum
    this.expectedHoursPerWeek = timetable.hoursPerWeek
    this.realHoursPerWeek = countOfLessons
  }
}
