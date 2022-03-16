import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ExcelHelperService } from './excel-helper.service'
import { TeachersService } from './teachers.service'
import {
  CourseNum,
  ExcelSubject,
  Table,
  Semester,
  SubjectTypes,
  ExcelTeacherPayload,
  GroupData,
  SubjectHours,
  TeacherInfo,
  SubGroupNumber,
} from './types'

import ExcelTeacher from './types/teacher.types'

export type TeacherDataAndSubject = {
  teacherData: {
    name: string
    position: string
  }
  subjects: ExcelSubject[]
}

@Injectable()
export class SubjectsService {
  constructor(
    private readonly excelHelperService: ExcelHelperService,
    @Inject(forwardRef(() => TeachersService))
    private readonly teacherService: TeachersService
  ) {}

  getTeachersDataAndSubjects(
    table: Table,
    row: number,
    groupsNames: string[],
    semester: Semester,
    course: CourseNum
  ): TeacherDataAndSubject[] {
    const columns = table[row]

    const groupsCount = groupsNames.length

    const teachersData = this.getTeachersData(table, row, groupsCount)

    const subjectsNames = this.getSubjectNames(columns.B)

    const teachers = teachersData
      .map(({ name, position }) => {
        if (!name) return
        const groups = this.getGroups(table, row, groupsNames, name)

        const subjects = this.getSubjects(subjectsNames, course, semester, groups)

        return { teacherData: { name, position }, subjects }
      })
      .filter(Boolean)
    return teachers
  }

  private getGroups(table: Table, row: number, groupsNames: string[], teacherName: string) {
    const columns = table[row]

    return groupsNames
      .map<GroupData>((groupName, i) => {
        const currentRow = row + i * 2
        const currentColumns = table[currentRow]

        const subGroupsCount = this.getSubGroupsCount(table, currentRow)

        const lectorInfo = this.teacherService.getTeacherInfo(columns.F)

        const laboratoryTeacherInfo = this.teacherService.getTeacherInfo(currentColumns.I)
        const practiceTeacherInfo = this.teacherService.getTeacherInfo(currentColumns.L)

        const hoursPerWeek: SubjectHours = {
          lecture:
            teacherName === lectorInfo.name ? this.excelHelperService.toNumber(columns.D) : 0,
          laboratory:
            teacherName === laboratoryTeacherInfo.name
              ? this.excelHelperService.toNumber(currentColumns.G)
              : 0,
          practice:
            teacherName === practiceTeacherInfo.name
              ? this.excelHelperService.toNumber(currentColumns.J)
              : 0,
        }

        if (!this.isTeacherTeach(hoursPerWeek)) return

        return {
          name: this.formatGroupName(groupName),
          subGroupsCount,
          hoursPerWeek,
          subGroups: [],
        }
      })
      .filter(Boolean)
  }

  private getSubjects(
    subjectsNames: string[],
    course: CourseNum,
    semester: Semester,
    groups: GroupData[]
  ) {
    return subjectsNames.map<ExcelSubject>((subjectName) => ({
      name: subjectName,
      course,
      semester,
      groups: [...groups],
      hoursPerSemester: null,
    }))
  }

  private isTeacherTeach(hoursPerWeek: SubjectHours) {
    return (
      hoursPerWeek.lecture !== 0 || hoursPerWeek.laboratory !== 0 || hoursPerWeek.practice !== 0
    )
  }

  private getSubjectNames(subjectsNames: string) {
    return this.formatSubjectName(subjectsNames)
      .split('/')
      .map((name) => name.trim())
  }

  private getTeachersData(table: Table, row: number, groupsCount: number): TeacherInfo[] {
    const teachersSet = new Set<string>()

    for (let i = row; i < row + groupsCount; i++) {
      teachersSet.add(table[i].F)
      teachersSet.add(table[i].I)
      teachersSet.add(table[i].L)
    }
    return [...teachersSet]
      .map((teacherData) => this.teacherService.getTeacherInfo(teacherData))
      .filter(Boolean)
  }

  private getSubGroupsCount(table: Table, row: number): SubGroupNumber {
    return table[row + 1]?.G || table[row + 1]?.J ? 2 : 1
  }

  private setHours(subject: ExcelSubject, teacherPayload: ExcelTeacherPayload) {
    const sub = teacherPayload.subjects.find(
      (sub) => sub.subjectName === subject.name && sub.semester === subject.semester
    )

    if (sub) {
      subject.hoursPerSemester = sub.countOfHours
    }
  }

  private isAbbreviation(str: string) {
    return str.split('').every((letter) => letter.match(/[A-ZА-Я]/))
  }

  private formatGroupName(groupName: string) {
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

  mergeSubjects(firstTeacher: ExcelTeacher, secondTeacher: ExcelTeacher): ExcelTeacher {
    return {
      name: firstTeacher.name,
      position: firstTeacher.position,
      subjects: [...firstTeacher.subjects, ...secondTeacher.subjects],
    }
  }

  setHoursPerSemester(teachers: ExcelTeacher[], teachersPayload: ExcelTeacherPayload[]) {
    teachers.forEach((teacher) => {
      const teacherPayload = teachersPayload.find((teacherPayload) => {
        return teacherPayload.fullName === teacher.name
      })

      if (teacherPayload) {
        teacher.subjects.forEach((subject) => {
          this.setHours(subject, teacherPayload)
        })
      }
    })

    return teachers
  }

  isSameSubjectName(firstSubject: string, secondSubject: string) {
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

    return [name?.toLowerCase(), abbreviations]
  }

  formatSubjectName(subjectName: string) {
    return subjectName?.split('(')[0].trim()
  }

  getTypeOfSubject(subjectName: string): SubjectTypes {
    if (subjectName?.match(/\(лек\.?\)/)) return 'lecture'
    if (subjectName?.match(/\(пр\.?\)/)) return 'practice'
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
