import { TimetableService } from './timetable.service'
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@nestjs/common'
import xlsx from 'xlsx'
import { ExcelHelperService } from './excel-helper.service'

@Injectable()
export class ExcelService {
  constructor(
    private readonly excelHelperService: ExcelHelperService,
    private readonly timetableService: TimetableService
  ) {}

  getTimeTable() {
    const file = 'src/static/ATF_2.xlsx'
    const table = xlsx.readFile(file)
    const timeTable = this.timetableService.getTimetable(
      this.excelHelperService.toTableFormat(table.Sheets['Table 1']),
      table.Sheets['Table 1']['!merges']
    )
    return timeTable
  }
}
