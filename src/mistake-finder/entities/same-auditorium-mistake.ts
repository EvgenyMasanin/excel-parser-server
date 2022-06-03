import {
  CourseNum,
  Semester,
  SubjectTypes,
  WeekDaysEN,
  WeekType,
  SubGroupNumber,
} from 'src/excel/types'
import { TimetableWithTeacherAndSubject } from './missing-campus-or-auditorium-mistake'

class SameAuditoriumMistakeTimetableData {
  id: number
  teacherName: string
  subjectName: string
  subjectType: SubjectTypes
  groupName: string
  subGroupNumber: SubGroupNumber
  auditorium: number
  campus: number
  course: CourseNum
  lessonNumber: number
  semester: Semester
  weekDay: WeekDaysEN
  weekType: WeekType

  constructor(timetable: TimetableWithTeacherAndSubject) {
    this.id = timetable.id
    this.teacherName = timetable.teacher.name
    this.subjectName = timetable.subject.name
    this.subjectType = timetable.subjectType
    this.groupName = timetable.group.name
    this.subGroupNumber = timetable.subGroupNum
    this.auditorium = timetable.auditorium
    this.campus = timetable.campus
    this.course = timetable.course
    this.lessonNumber = timetable.lessonNumber
    this.semester = timetable.semester
    this.weekDay = timetable.weekDay
    this.weekType = timetable.weekType
  }
}

export class SameAuditoriumMistake {
  timetable1: SameAuditoriumMistakeTimetableData
  timetable2: SameAuditoriumMistakeTimetableData

  constructor(
    timetable1: TimetableWithTeacherAndSubject,
    timetable2: TimetableWithTeacherAndSubject
  ) {
    this.timetable1 = new SameAuditoriumMistakeTimetableData(timetable1)
    this.timetable2 = new SameAuditoriumMistakeTimetableData(timetable2)
  }
}
