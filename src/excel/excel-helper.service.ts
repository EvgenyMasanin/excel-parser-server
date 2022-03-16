import { Injectable } from '@nestjs/common'
import { WorkSheet, CellObject } from 'xlsx'
import { Table } from './types'

type ColumnName = 'A' | 'B' | 'C' | 'D' | 'E' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'

@Injectable()
export class ExcelHelperService {
  toTableFormat(data: WorkSheet): Table {
    const staffData = Object.keys(data).reduce((accum, key) => {
      if (!['!margins', '!merges'].includes(key)) {
        accum[key] = data[key]
      }
      return accum
    }, {} as Omit<WorkSheet, '!margins' | '!merges'>)

    const table: Table = {}
    Object.keys(staffData).forEach((cellName) => {
      const row = this.getNumOfRow(cellName)
      const column = this.getColumnName(cellName)
      table[row] = { ...table[row] }
      const cell: CellObject = staffData[cellName]

      table[row][column] = cell.v?.toString()
    })
    return table
  }

  toNumber(str: string | number | undefined) {
    if (!str) return 0
    if (typeof str === 'number') return str
    return +str.split(',').join('.')
  }

  private getNumOfRow(str: string) {
    const column = this.getColumnName(str)

    return str.slice(column?.length, str.length)
  }

  private getColumnName(str: string): ColumnName {
    return str[0] as ColumnName
  }

  getNumOfColumn(colName: string) {
    return colName.charCodeAt(0) - 65
  }

  getNameByColumnNum(num: number) {
    return String.fromCharCode(num + 65)
  }

  isFullName(str: string) {
    return Boolean(str?.match(/[А-Я][а-я]+\s+[А-Я]\.[А-Я]\./))
  }
}
