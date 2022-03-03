/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import {
  DayOfWeek,
  GroupData,
  ITableRow,
  SubGroupData,
  WeekType,
  CourseNum,
  courses,
  ISubject,
  ITable,
  ITeacher,
  Semester,
  Timetable,
} from './types'

@Injectable()
export class TeachersService {
  constructor(private readonly subjectService: SubjectsService) {}

  getTeachers(table: ITable, semester: Semester) {
    const courseNumCounter = this.getCourseNumCounter()

    const teachers: ITeacher[] = []

    Object.keys(table).forEach((key) => {
      const row = +key
      const columns = table[key]

      const course = courseNumCounter(columns.B ?? '')

      if (course === 0) return

      if (!columns.I && !columns.F && !columns.L) return

      const { name, position } = this.getTeacherInfo(
        columns.I ? columns.I : columns.L! ? columns.L! : columns.F!
      )

      const { lectorName, lectorPosition, lectorSubject } = this.getLector(
        columns,
        row,
        table,
        semester
      )

      const { subject, groupName } = this.subjectService.getSubjectData(
        table,
        row,
        columns,
        semester,
        `${position}, ${name}`
      )

      const currentLector = teachers.find(
        (teacher) => teacher.name === lectorName
      )

      if (lectorName) {
        if (!currentLector) {
          const teacher: ITeacher = {
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
      const currentTeacher = teachers.find((teacher) => teacher.name === name)

      if (!currentTeacher) {
        const teacher: ITeacher = {
          name,
          position,
          course: { first: [], second: [], thead: [], fourth: [], fifth: [] },
        }

        teacher.course[courses[course]].push(subject)

        teachers.push(teacher)
      } else if (!this.hasSubject(currentTeacher, subject, course)) {
        currentTeacher.course[courses[course]].push(subject)
      } else if (
        !currentTeacher.course[courses[course]].find(
          ({ groups }) => groupName in groups
        )
      ) {
        currentTeacher.course[courses[course]].find(
          ({ name }) => name === subject.name
        ).groups[groupName] = subject.groups[groupName]
      } else {
        this.subjectService.mergeSubjectData(
          table,
          row,
          currentTeacher,
          course,
          groupName
        )
      }
    })
    return teachers
  }

  private getLector(
    columns: ITableRow,
    row: number,
    table: ITable,
    semester: Semester
  ) {
    const { name, position } = this.getTeacherInfo(columns.F)
    let subject: ISubject
    if (name) {
      const groups: string[] = []
      let i = row
      do {
        groups.push(this.subjectService.formatGroupName(table[i].C!))
        i += 2
      } while (table[i]?.C && !table[i]?.B)

      const subjectData = this.subjectService.getSubjectData(
        table,
        row,
        columns,
        semester,
        `${position}, ${name}`
      )
      subject = subjectData.subject
      subject.groups = {}
      groups.forEach((group) => {
        subject.groups[group] = {
          hoursPerWeek: {
            lecture: [columns.D],
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

  setLessonDataToTeachers(teachers: ITeacher[], timeTables: Timetable[]) {
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
                            weekDay as DayOfWeek,
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
    subject: ISubject,
    groupData: GroupData,
    subGroupData: SubGroupData,
    subGroupNumber: number,
    weekDay: DayOfWeek,
    lessonNumber: number
  ) {
    const typeOfSubject1 = this.getTypeOfSubject(subGroupData.up)
    const typeOfSubject2 = this.getTypeOfSubject(subGroupData.down)

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
    if (!subjectHours1[0]) shouldPush = false
    if (!subjectHours2[0]) shouldPush = false

    if (shouldPush && type && lessonName) {
      groupData.subGroups[subGroupNumber].push({
        weekDay,
        lessonNumber,
        type,
        lessonName,
      })
    }
  }

  getTypeOfSubject(subjectName: string): 'lecture' | 'practice' | 'laboratory' {
    if (subjectName?.match(/\(лек\.\)/)) return 'lecture'
    if (subjectName?.match(/\(пр\.\)/)) return 'practice'
    else return 'laboratory'
  }

  mergeTeachers = (
    firstSemesterTeachers: ITeacher[],
    secondSemesterTeachers: ITeacher[]
  ): ITeacher[] => {
    const teachers: ITeacher[] = []

    secondSemesterTeachers.forEach((secondTeacher) => {
      const firstTeacher = firstSemesterTeachers.find(
        (firstTeacher) => firstTeacher.name === secondTeacher.name
      )

      if (firstTeacher) {
        teachers.push(
          this.subjectService.mergeSubjects(firstTeacher, secondTeacher)
        )
      } else {
        teachers.push(secondTeacher)
      }
    })
    return teachers
  }

  getTeacherInfo(str = '') {
    const strData = str.split(',')
    return {
      name: strData[1]?.trim(),
      position: strData[0],
    }
  }

  private hasSubject(teacher: ITeacher, subject: ISubject, course: CourseNum) {
    return teacher.course[courses[course]].some(
      (subj) => subj.name === subject.name
    )
  }

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
