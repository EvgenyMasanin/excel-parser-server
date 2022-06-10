import { Injectable } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import isOdd from 'src/utils/is-odd'
import objectsEquals from 'src/utils/objects-equals'
import ExcelTeacher from './types/teacher.types'

import {
  GroupData,
  WeekType,
  CourseNum,
  ExcelSubject,
  Table,
  Semester,
  Timetable,
  WeekDaysEN,
  TeacherInfo,
  SubGroupTimetable,
} from './types'

@Injectable()
export class TeachersService {
  constructor(private readonly subjectService: SubjectsService) {}

  getTeachers(table: Table, semester: Semester) {
    const courseNumCounter = this.getCourseNumCounter()

    const teachers: ExcelTeacher[] = []

    const tableEntries = Object.entries(table)

    for (let i = 0; i < tableEntries.length; i++) {
      const [key, columns] = tableEntries[i]

      const row = +key
      if (isOdd(row)) continue

      const course = courseNumCounter(columns.B ?? '')

      if (course === 0) continue
      if (!columns.I && !columns.F && !columns.L) continue
      const groupNames = this.getGroupsNames(table, row)
      const groupsCount = groupNames.length

      if (groupsCount !== 1) {
        while (+tableEntries[i][0] < row + groupsCount * 2 - 2) {
          i++
        }
      }

      const teachersDataAndSubjects = this.subjectService.getTeachersDataAndSubjects(
        table,
        row,
        groupNames,
        semester,
        course
      )

      teachersDataAndSubjects.forEach(({ teacherData: { name, position }, subjects }) => {
        const currentTeacher = teachers.find((teacher) => teacher.name === name)
        if (!currentTeacher) {
          const teacher = new ExcelTeacher(name, position)
          teacher.subjects.push(...subjects)
          teachers.push(teacher)
        } else {
          subjects.forEach((subject) => {
            const currentSubject = currentTeacher.subjects.find((s) =>
              this.subjectsEquals(s, subject)
            )

            if (currentSubject) {
              currentSubject.groups.push(...subject.groups)
            } else {
              currentTeacher.subjects.push(subject)
            }
          })
        }
      })
    }

    return teachers
  }

  private subjectsEquals(subject1: ExcelSubject, subject2: ExcelSubject) {
    return objectsEquals(subject1, subject2, ['name', 'course', 'semester'])
  }

  private getGroupsNames(table: Table, row: number): string[] {
    const groupsNames: string[] = []
    do {
      groupsNames.push(table[row]?.C)
      row += 2
    } while (!table[row]?.B && table[row]?.C)
    return groupsNames
  }

  setLessonDataToTeachers(teachers: ExcelTeacher[], timeTables: Timetable[]) {
    teachers.forEach((teacher) => {
      teacher.subjects.forEach((subject) => {
        subject.groups.forEach((groupData) => {
          timeTables.forEach((timeTable) => {
            Object.entries(timeTable).forEach(([weekDay, lessons]) => {
              lessons.forEach((lesson, lessonNumber) => {
                lesson.forEach((group) => {
                  if (groupData.name === group.name) {
                    if (teacher.name.toLowerCase().startsWith('сад'))
                      console.log(
                        '🚀 ~ teachers.forEach ~ teacher',
                        teacher.name,
                        subject.name,
                        group.name,
                        subject.course,
                        group.course,
                        subject.semester === group.semester
                      )
                    group.subgroupsTimetable.forEach((subGroupData, subGroupNumber) => {
                      if (subject.course === group.course && subject.semester === group.semester) {
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

    return teachers
  }

  private setSubjectData(
    subject: ExcelSubject,
    groupData: GroupData,
    subGroupData: SubGroupTimetable,
    subGroupNumber: number,
    weekDay: WeekDaysEN,
    lessonNumber: number
  ) {
    const typeOfSubject1 = this.subjectService.getTypeOfSubject(subGroupData.up)
    const typeOfSubject2 = this.subjectService.getTypeOfSubject(subGroupData.down)

    const subjectHours1 = groupData.hoursPerWeek[typeOfSubject1]
    const subjectHours2 = groupData.hoursPerWeek[typeOfSubject2]

    let type: WeekType
    let lessonName: string

    if (
      this.subjectService.isSameSubjectName(subject.name, subGroupData.up) &&
      this.subjectService.isSameSubjectName(subject.name, subGroupData.down)
    ) {
      type = 'up/down'
      lessonName = subGroupData.up
    } else {
      if (this.subjectService.isSameSubjectName(subject.name, subGroupData.up)) {
        type = 'up'
        lessonName = subGroupData.up
      }
      if (this.subjectService.isSameSubjectName(subject.name, subGroupData.down)) {
        type = 'down'
        lessonName = subGroupData.down
      }
    }
    let shouldPush = true
    if (!subjectHours1 && (type === 'up' || type === 'up/down')) shouldPush = false
    if (!subjectHours2 && (type === 'down' || type === 'up/down')) shouldPush = false

    if (shouldPush && type && lessonName) {
      groupData.subGroups[subGroupNumber].push({
        weekType: type,
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
