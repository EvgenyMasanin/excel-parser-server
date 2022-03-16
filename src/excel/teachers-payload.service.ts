import { Injectable } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { ExcelHelperService } from './excel-helper.service'
import { Table, Semester, ExcelTeacherPayload, ExcelSubjectPayload } from './types'
//FIXME: wrong hours per semester
@Injectable()
export class TeachersPayloadService {
  constructor(
    private readonly excelHelperService: ExcelHelperService,
    private readonly subjectsService: SubjectsService
  ) {}

  getTeachersPayload(tableData: Table) {
    return this.createData(tableData)
  }

  private createData(table: Table) {
    const subjects: ExcelSubjectPayload[] = []
    const teachers: ExcelTeacherPayload[] = []
    let currentTeacher: ExcelTeacherPayload | null = null
    let semester: Semester = 'first'

    try {
      Object.entries(table).forEach(([, columns]) => {
        if (this.excelHelperService.isFullName(columns.B)) {
          currentTeacher = { fullName: columns.B, subjects: [] }
          teachers.push(currentTeacher)
          semester = 'first'
          return
        }
        if (columns.B?.toLowerCase() === 'весна') {
          semester = 'second'
          return
        }
        if (columns.B?.toLowerCase() === 'вакансия3') {
          throw new Error('End of data.')
        }
        if (columns.B && currentTeacher) {
          const subjectPayload: ExcelSubjectPayload = {
            subjectName: this.subjectsService.formatSubjectName(columns.B),
            semester,
            countOfHours: {
              lecture: +columns.G || 0,
              laboratory: +columns.H || 0,
              practice: +columns.I || 0,
            },
          }

          subjects.push(subjectPayload)
          currentTeacher?.subjects.push(subjectPayload)
        }
      })
    } catch {}
    return teachers
  }
}
