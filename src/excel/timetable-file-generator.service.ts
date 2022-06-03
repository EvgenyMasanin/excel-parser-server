import { WeekTimetable } from './../timetable/types/index'
import { Injectable } from '@nestjs/common'
import { TeachersService } from 'src/teachers/teachers.service'
import { TimetableService } from 'src/timetable/timetable.service'
import xlsx from 'xlsx'
import { SubjectTypesMap } from './types/subject.types'
import { WeekDaysMapEN, WeekTypeMap } from './types/timetable.types'
import { Semester } from './types'
import { Row } from './types/excel.types'

@Injectable()
export class TimetableFileGeneratorService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly timetableService: TimetableService
  ) {}

  async generate(semester: Semester) {
    try {
      const rows: Row[] = []

      const teachers = await this.teacherService.findAll()

      let currentTeacherName = ''
      let currentWeekDay = ''

      for (const { id, name } of teachers) {
        const timetable = await this.timetableService.getTeachersTimetable(id)

        Object.entries(timetable).forEach(([day, timetables]) => {
          timetables
            .filter((timetable) => timetable.semester === semester)
            .sort((a, b) => a.lessonNumber - b.lessonNumber)
            .forEach((timetable) => {
              rows.push(this.createRow(timetable, currentTeacherName, name, currentWeekDay, day))
              currentTeacherName = name
              currentWeekDay = day
            })
          currentWeekDay = day
        })
      }

      const workBook = xlsx.utils.book_new()

      const worksheet = xlsx.utils.json_to_sheet(rows)
      xlsx.utils.book_append_sheet(workBook, worksheet, 'Расписание')
      const year = new Date().toLocaleString('ru', {
        year: 'numeric',
      })
      xlsx.writeFile(workBook, `static-files/timetables/timetable(${year}-${semester}).xlsx`)

      return true
    } catch (error) {
      console.log('🚀 ~ generate ~ error', error)

      return false
    }
  }

  private createRow(
    {
      lessonNumber,
      weekType,
      subject,
      subjectType,
      groups,
      course,
      auditorium,
      campus,
    }: WeekTimetable,
    currentTeacherName: string,
    name: string,
    currentWeekDay: string,
    day: string
  ) {
    return {
      ['Имя преподавателя']: currentTeacherName === name ? '' : name,
      день: currentWeekDay === day ? '' : WeekDaysMapEN[day],
      пара: lessonNumber,
      неделя: weekType === 'up/down' ? ('' as WeekTypeMap) : WeekTypeMap[weekType],
      курс: course,
      предмет: subject.name,
      ['тип занятия']: SubjectTypesMap[subjectType],
      группы: groups.map(({ name }) => name).join(', '),
      аудитория: `${auditorium}/${campus}`,
    }
  }
}
