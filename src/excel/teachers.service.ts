import { Injectable } from '@nestjs/common'
import { ExcelHelperService } from './excel-helper.service'
import { SubjectsService } from './subjects.service'
import {
  GroupData,
  TableRow,
  SubGroupData,
  WeekType,
  CourseNum,
  courses,
  ExcelSubject,
  Table,
  ExcelTeacher,
  Semester,
  Timetable,
  WeekDaysEN,
  TeacherInfo,
} from './types'

@Injectable()
export class TeachersService {
  constructor(
    private readonly subjectService: SubjectsService,
    private readonly excelHelperService: ExcelHelperService
  ) {}

  getTeachers(table: Table, semester: Semester) {
    const courseNumCounter = this.getCourseNumCounter()

    const teachers: ExcelTeacher[] = []

    Object.keys(table).forEach((key) => {
      const row = +key
      const columns = table[key]

      const course = courseNumCounter(columns.B ?? '')

      if (course === 0) return

      if (!columns.I && !columns.F && !columns.L) return

      const { name, position } = this.getTeacherInfo(
        columns.I ? columns.I : columns.L ? columns.L : columns.F
      )

      const lectorInfo = this.getTeacherInfo(columns.F)
      const { subjects: lectorsSubjects, groupName } = this.subjectService.getSubjectData(
        table,
        row,
        columns,
        semester,
        `${lectorInfo.position}, ${lectorInfo.name}`
      )
      const { subjects } = this.subjectService.getSubjectData(
        table,
        row,
        columns,
        semester,
        `${position}, ${name}`
      )

      lectorsSubjects.forEach((subject) => {
        const { lectorName, lectorPosition, lectorSubject } = this.getLector(
          lectorInfo,
          subject,
          columns,
          row,
          table
        )

        const currentLector = teachers.find((teacher) => teacher.name === lectorName)
        if (lectorName) {
          if (!currentLector) {
            const teacher: ExcelTeacher = {
              name: lectorName,
              position: lectorPosition,
              course: {
                first: [],
                second: [],
                thead: [],
                fourth: [],
                fifth: [],
              },
            }

            teacher.course[courses[course]].push(lectorSubject)

            teachers.push(teacher)
          } else if (!this.hasSubject(currentLector, lectorSubject, course)) {
            currentLector.course[courses[course]].push(lectorSubject)
          }
        }
      })
      subjects.forEach((subject) => {
        const currentTeacher = teachers.find((teacher) => teacher.name === name)

        if (!currentTeacher) {
          const teacher: ExcelTeacher = {
            name,
            position,
            course: { first: [], second: [], thead: [], fourth: [], fifth: [] },
          }

          teacher.course[courses[course]].push(subject)

          teachers.push(teacher)
        } else if (!this.hasSubject(currentTeacher, subject, course)) {
          currentTeacher.course[courses[course]].push(subject)
        } else if (
          !currentTeacher.course[courses[course]].find(({ groups }) => groupName in groups)
        ) {
          currentTeacher.course[courses[course]].find(({ name }) => name === subject.name).groups[
            groupName
          ] = subject.groups[groupName]
        } else {
          this.subjectService.mergeSubjectData(table, row, currentTeacher, course, groupName)
        }
      })
    })

    return teachers
  }

  private getLector(
    lectorInfo: TeacherInfo,
    lectorSubject: ExcelSubject,
    columns: TableRow,
    row: number,
    table: Table
  ) {
    const { name, position } = lectorInfo
    let subject: ExcelSubject
    if (name) {
      const groups: string[] = []
      let i = row
      do {
        groups.push(this.subjectService.formatGroupName(table[i].C))
        i += 2
      } while (table[i]?.C && !table[i]?.B)

      subject = lectorSubject

      subject.groups = {}
      groups.forEach((group) => {
        subject.groups[group] = {
          hoursPerWeek: {
            lecture: [this.excelHelperService.toNumber(columns.D)],
            // lecture: [columns.D],
            laboratory: [],
            practice: [],
          },
          subGroups: [],
        }
      })
    }

    return {
      lectorName: name,
      lectorPosition: position,
      lectorSubject: subject,
    }
  }

  setLessonDataToTeachers(teachers: ExcelTeacher[], timeTables: Timetable[]) {
    teachers.forEach((teacher) => {
      Object.entries(teacher.course).forEach(([course, subjects]) => {
        subjects.forEach((subject) => {
          Object.entries(subject.groups).forEach(([groupName, groupData]) => {
            timeTables.forEach((timeTable) => {
              Object.entries(timeTable).forEach(([weekDay, lessons]) => {
                lessons.forEach((lesson, lessonNumber) => {
                  Object.entries(lesson).forEach(([groupNameT, subGroups]) => {
                    if (groupName === groupNameT) {
                      subGroups.forEach((subGroupData, subGroupNumber) => {
                        if (
                          course === courses[subGroupData.course] &&
                          subject.semester === subGroupData.semester
                        ) {
                          if (!groupData.subGroups[subGroupNumber]) {
                            groupData.subGroups[subGroupNumber] = []
                          }

                          this.setSubjectData(
                            subject,
                            groupData,
                            subGroupData,
                            subGroupNumber,
                            weekDay as WeekDaysEN,
                            lessonNumber + 1
                          )
                        }
                      })
                    }
                  })
                })
              })
            })
          })
        })
      })
    })

    return teachers
  }

  setSubjectData(
    subject: ExcelSubject,
    groupData: GroupData,
    subGroupData: SubGroupData,
    subGroupNumber: number,
    weekDay: WeekDaysEN,
    lessonNumber: number
  ) {
    const typeOfSubject1 = this.subjectService.getTypeOfSubject(subGroupData.up)
    const typeOfSubject2 = this.subjectService.getTypeOfSubject(subGroupData.down)

    const subjectHours1 = [...groupData.hoursPerWeek[typeOfSubject1]]
    const subjectHours2 = [...groupData.hoursPerWeek[typeOfSubject2]]

    let type: WeekType
    let lessonName: string

    if (
      this.subjectService.isSameSubject(subject.name, subGroupData.up) &&
      this.subjectService.isSameSubject(subject.name, subGroupData.down)
    ) {
      type = 'up/down'
      lessonName = subGroupData.up
    } else {
      if (this.subjectService.isSameSubject(subject.name, subGroupData.up)) {
        type = 'up'
        lessonName = subGroupData.up
      }
      if (this.subjectService.isSameSubject(subject.name, subGroupData.down)) {
        type = 'down'
        lessonName = subGroupData.down
      }
    }
    let shouldPush = true
    if (!subjectHours1[0] && (type === 'up' || type === 'up/down')) shouldPush = false
    if (!subjectHours2[0] && (type === 'down' || type === 'up/down')) shouldPush = false

    if (shouldPush && type && lessonName) {
      groupData.subGroups[subGroupNumber].push({
        type,
        weekDay,
        lessonName,
        lessonNumber,
      })
    }
  }

  mergeTeachers = (
    firstSemesterTeachers: ExcelTeacher[],
    secondSemesterTeachers: ExcelTeacher[]
  ): ExcelTeacher[] => {
    const teachers: ExcelTeacher[] = []

    secondSemesterTeachers.forEach((secondTeacher) => {
      const firstTeacher = firstSemesterTeachers.find(
        (firstTeacher) => firstTeacher.name === secondTeacher.name
      )

      if (firstTeacher) {
        teachers.push(this.subjectService.mergeSubjects(firstTeacher, secondTeacher))
      } else {
        teachers.push(secondTeacher)
      }
    })
    return teachers
  }

  getTeacherInfo(str = ''): TeacherInfo {
    const strData = str.split(',')
    return {
      name: strData[1]?.trim(),
      position: strData[0] || null,
    }
  }

  private hasSubject(teacher: ExcelTeacher, subject: ExcelSubject, course: CourseNum) {
    return teacher.course[courses[course]].some((subj) => subj.name === subject.name)
  }
//FIXME:
  private getCourseNumCounter() {
    enum CoursesEnum {
      first = 'Курс 1',
      second = 'Курс 2',
      thead = 'Курс 3',
      fourth = 'Курс 4',
    }

    let courseNum: CourseNum | 0 = 0

    return (str: string): CourseNum | 0 => {
      switch (str) {
        case CoursesEnum.first:
          courseNum = 1
          break
        case CoursesEnum.second:
          courseNum = 2
          break
        case CoursesEnum.thead:
          courseNum = 3
          break
        case CoursesEnum.fourth:
          courseNum = 4
          break
        default:
          return courseNum
      }

      return courseNum
    }
  }
}
