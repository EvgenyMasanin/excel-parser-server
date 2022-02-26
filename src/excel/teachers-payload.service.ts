/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@nestjs/common'
import { ExcelHelperService } from './excel-helper.service'
import { ITable, Semester, ITeacherPayload, ISubjectPayload } from './types'

@Injectable()
export class TeachersPayloadService {
  constructor(private readonly excelHelperService: ExcelHelperService) {}

  getTeachersPayload(tableData: ITable) {
    return this.createData(tableData)
  }

  private createData(table: ITable) {
    const subjects: ISubjectPayload[] = []
    const teachers: ITeacherPayload[] = []
    let currentTeacher: ITeacherPayload | null = null
    let semester: Semester = 'first'

    try {
      Object.entries(table).forEach(([, columns]) => {
        if (this.excelHelperService.isFullName(columns.B)) {
          currentTeacher = { fullName: columns.B!, subjects: [] }
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
          const subjectPayload: ISubjectPayload = {
            subjectName: columns.B!,
            semester,
            countOfHours: {
              lectures: +columns.G || 0,
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