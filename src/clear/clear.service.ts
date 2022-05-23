import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { getConnection } from 'typeorm'

@Injectable()
export class ClearService {
  async clearDB() {
    const tableNames = ['timetable', 'subject_hours', 'teacher_to_subject', 'group', 'subject']

    const connection = getConnection()
    try {
      for (const tableName of tableNames) {
        await connection.query(`TRUNCATE table "${tableName}" CASCADE;`)
      }
      return true
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
