import { Semester, SubjectTypes } from 'src/excel/types'
import { subgroupNumber, WeekDaysEN } from 'src/excel/types'
import { Group } from 'src/groups/entities/group.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'

export type TimetableWithAdditionalData = Timetable & {
  teacher: Teacher
  subject: Subject
  group: Group
}

export class TimetableMistake {
  readonly teacherId: number
  readonly teacherName: string
  readonly teacherFullName: string
  readonly subjectId: number
  readonly subjectName: string
  readonly groupId: number
  readonly groupName: string
  readonly subGroupNum: subgroupNumber
  readonly semester: Semester
  readonly course: string
  readonly lessonNumber: number
  readonly weekDay: WeekDaysEN
  readonly type: SubjectTypes
  readonly auditorium: number
  readonly campus: number
  
  constructor(timetable: TimetableWithAdditionalData) {
    this.teacherId = timetable.teacher.id
    this.teacherName = timetable.teacher.name
    this.teacherFullName = timetable.teacher.fullName
    this.subjectId = timetable.subject.id
    this.subjectName = timetable.subject.name
    this.groupId = timetable.groupId
    this.groupName = timetable.group.name
    this.subGroupNum = timetable.subGroupNum
    this.semester = timetable.semester
    this.course = timetable.course
    this.lessonNumber = timetable.lessonNumber
    this.weekDay = timetable.weekDay
    this.type = timetable.type
    this.auditorium = timetable.auditorium
    this.campus = timetable.campus
  }
}
