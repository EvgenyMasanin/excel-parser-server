import { Injectable } from '@nestjs/common'
import { ExcelHelperService } from './excel-helper.service'
import {
  CourseNum,
  courses,
  ISubject,
  ITable,
  ITableRow,
  ITeacher,
  Semester,
  SubjectTypes,
  ITeacherPayload,
} from './types'

@Injectable()
export class SubjectsService {
  constructor(private readonly excelHelperService: ExcelHelperService) {}

  getSubjectData(
    table: ITable,
    row: number,
    columns: ITableRow,
    semester: Semester,
    teacherName: string
  ): { subject: ISubject; groupName: string } {
    let realRow = row

    while (!table[realRow]?.B && !table[realRow]?.C) realRow--

    const realColumns = table[realRow]

    const subGroup = row - realRow

    const groupName = this.formatGroupName(realColumns.C!)

    const allGroups = []

    let i = realRow
    do {
      allGroups.push(table[i].C!)
      i += 2
    } while (table[i]?.C && !table[i]?.B && realColumns.F === teacherName)

    let lecture = 0

    if (realColumns.B!) {
      lecture =
        realColumns.F! === teacherName ? this.excelHelperService.toNumber(realColumns.D ?? 0) : 0
    } else {
      lecture = table[realRow - 2].F === teacherName ? table[realRow - 2].D : 0
    }

    const subject: ISubject = {
      name: this.formatSubjectName(realColumns.B || table[realRow - 2].B),
      // name: realColumns.B || table[realRow - 2].B,
      semester,
      groups: {
        [groupName]: {
          hoursPerWeek: {
            lecture: [lecture],
            laboratory: [],
            practice: [],
          },
          subGroups: [],
        },
      },
      hoursPerSemester: null,
    }

    if (this.excelHelperService.toNumber(columns.G ?? 0) !== 0) {
      subject.groups[groupName].hoursPerWeek.laboratory.push(
        ...Array(subGroup).fill(0),
        this.excelHelperService.toNumber(columns.G ?? 0)
      )
    }
    if (this.excelHelperService.toNumber(columns.J ?? 0) !== 0) {
      subject.groups[groupName].hoursPerWeek.practice.push(
        ...Array(subGroup).fill(0),
        this.excelHelperService.toNumber(columns.J ?? 0)
      )
    }

    return { subject, groupName }
  }

  mergeSubjects(firstTeacher: ITeacher, secondTeacher: ITeacher): ITeacher {
    return {
      name: firstTeacher.name,
      position: firstTeacher.position,
      course: {
        first: [...firstTeacher.course.first, ...secondTeacher.course.first],
        second: [...firstTeacher.course.second, ...secondTeacher.course.second],
        thead: [...firstTeacher.course.thead, ...secondTeacher.course.thead],
        fourth: [...firstTeacher.course.fourth, ...secondTeacher.course.fourth],
        fifth: [...firstTeacher.course.fifth, ...secondTeacher.course.fifth],
      },
    }
  }

  mergeSubjectData(
    table: ITable,
    row: number,
    teacher: ITeacher,
    course: CourseNum,
    groupName: string
  ) {
    let realRow = row
    while (!table[realRow].B) realRow--

    const realColumns = table[realRow]
    const columns = table[row]
    const subject = teacher.course[courses[course]].find(
      (subj) => subj.name === this.formatSubjectName(realColumns.B!)
    )!
    if (this.excelHelperService.toNumber(columns.G ?? 0) !== 0)
      subject.groups[groupName].hoursPerWeek.laboratory.push(
        this.excelHelperService.toNumber(columns.G ?? 0)
      )
    if (this.excelHelperService.toNumber(columns.J ?? 0) !== 0)
      subject.groups[groupName].hoursPerWeek.practice.push(
        this.excelHelperService.toNumber(columns.J ?? 0)
      )
    return teacher.course
  }

  setHoursPerSemester(teachers: ITeacher[], teachersPayload: ITeacherPayload[]) {
    teachers.forEach((teacher) => {
      const teacherPayload = teachersPayload.find((teacherPayload) => {
        return teacherPayload.fullName === teacher.name
      })

      if (teacherPayload) {
        teacher.course.first.forEach((subject) => {
          this.setHours(subject, teacherPayload)
        })
        teacher.course.second.forEach((subject) => {
          this.setHours(subject, teacherPayload)
        })
        teacher.course.thead.forEach((subject) => {
          this.setHours(subject, teacherPayload)
        })
        teacher.course.fourth.forEach((subject) => {
          this.setHours(subject, teacherPayload)
        })
      }
    })

    return teachers
  }

  private setHours(subject: ISubject, teacherPayload: ITeacherPayload) {
    const sub = teacherPayload.subjects.find(
      (sub) => sub.subjectName === subject.name && sub.semester === subject.semester
    )

    if (sub) {
      subject.hoursPerSemester = sub.countOfHours
    }
  }

  isSameSubject(firstSubject: string, secondSubject: string) {
    const [firstSubjectName, firstSubjectAbbreviation] =
      this.getSubjectNameAndAbbreviation(firstSubject)
    const [secondSubjectName, secondSubjectAbbreviation] =
      this.getSubjectNameAndAbbreviation(secondSubject)

    const isSameFullName = (fsn: string, ssn: string) => {
      const fsnArr = fsn?.toLowerCase().split(' ')
      const ssnArr = ssn?.toLowerCase().split(/\s|\./).filter(Boolean)
      if (fsnArr?.length !== ssnArr?.length) return false
      return fsnArr?.every((fsn, i) => fsn?.startsWith(ssnArr?.[i]))
    }

    return (
      firstSubjectName === secondSubjectName ||
      isSameFullName(firstSubjectName, secondSubjectName) ||
      firstSubjectAbbreviation.some((ab) => secondSubjectAbbreviation.includes(ab)) ||
      firstSubjectAbbreviation.includes(secondSubjectName)
    )
  }

  getSubjectNameAndAbbreviation(str: string): [name: string, abbreviations: string[]] {
    const name = str?.slice(0, str.includes('(') ? str.indexOf('(') : str.length).trim()
    const abbreviations: string[] = []
    const words = name?.split(/\s|-/)

    abbreviations.push(
      words
        ?.map((word) => (this.isAbbreviation(word) ? word : word[0]))
        .join('')
        .toLocaleLowerCase()
    )
    abbreviations.push(
      words
        ?.map((word) => (word === 'и' ? '' : this.isAbbreviation(word) ? word : word[0]))
        .join('')
        .toLocaleLowerCase()
    )
    // console.log(name, abbreviations)

    return [name?.toLowerCase(), abbreviations]
  }

  private isAbbreviation(str: string) {
    return str.split('').every((letter) => letter.match(/[A-ZА-Я]/))
  }

  formatSubjectName(subjectName: string) {
    return subjectName?.split('(')[0].trim()
  }

  formatGroupName(groupName: string) {
    let isMiss = false
    return groupName
      .split('')
      .map((letter) => {
        if (letter === '-') isMiss = false
        if (letter !== '_' && !isMiss) return letter
        if (letter === '_') {
          isMiss = true
          return ''
        }
      })
      .join('')
  }

  getTypeOfSubject(subjectName: string): SubjectTypes {
    if (subjectName?.match(/\(лек\.\)/)) return 'lecture'
    if (subjectName?.match(/\(пр\.\)/)) return 'practice'
    else return 'laboratory'
  }

  getAuditoriumAndCampus(subjectName: string): {
    auditorium: number | null
    campus: number | null
  } {
    const auditorium = +subjectName.match(/а\.?\s*\d+/)?.[0].split(/а\.?\s*/)[1] || null
    const campus = auditorium ? +subjectName.match(/\/\d+/)?.[0].slice(1) || 1 : null
    return { auditorium, campus }
  }
}
