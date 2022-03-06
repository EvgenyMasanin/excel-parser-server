import { Injectable } from '@nestjs/common'
import { WorkSheet } from 'xlsx'
import { ITable } from './types'

type ColumnName = 'A' | 'B' | 'C' | 'D' | 'E' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'

@Injectable()
export class ExcelHelperService {
  toTableFormat(data: WorkSheet): ITable {
    const staffData = Object.keys(data).reduce((accum, key) => {
      if (!['!margins', '!merges'].includes(key)) {
        accum[key] = data[key]
      }
      return accum
    }, {} as Omit<WorkSheet, '!margins' | '!merges'>)

    const table = {} as ITable
    Object.keys(staffData).forEach((key) => {
      const row = this.getNumOfRow(key)
      const column = this.getColumnName(key)
      table[row] = { ...table[row] }
      table[row][column] = staffData[key].v as never
    })
    return table
  }

  toNumber(str: string | number) {
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
