import { ExcelSubject } from './subject.types'

export default class ExcelTeacher {
  subjects: ExcelSubject[]

  constructor(public name: string, public position: string) {
    this.subjects = []
  }
}

export interface TeacherInfo {
  name: string
  position: string
}