import { Injectable } from '@nestjs/common'
import { TeachersService } from 'src/teachers/teachers.service'
import { TimetableService } from 'src/timetable/timetable.service'
import xlsx from 'xlsx'
import { SubjectTypesMap } from './types/subject.types'
import { WeekDaysMapEN, WeekTypeMap } from './types/timetable.types'
import { Semester } from './types'

@Injectable()
export class TimetableFileGeneratorService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly timetableService: TimetableService
  ) {}

  async generate(semester: Semester) {
    const test: any[] = []

    const teachers = await this.teacherService.findAll()

    let currentTeacherName = ''
    let currentWeekDay = ''

    await Promise.all(
      teachers.map(async ({ id, name }) => {
        const timetable = await this.timetableService.getTeachersTimetable(id)
        Object.entries(timetable).forEach(([day, timetables]) => {
          timetables
            .filter((timetable) => timetable.semester === semester)
            .forEach(
              ({
                lessonNumber,
                weekType,
                subject,
                subjectType,
                groups,
                course,
                auditorium,
                campus,
              }) => {
                test.push({
                  ['Имя преподавателя']: currentTeacherName === name ? '' : name,
                  день: currentWeekDay === day ? '' : WeekDaysMapEN[day],
                  пара: lessonNumber,
                  неделя: WeekTypeMap[weekType],
                  курс: course,
                  предмет: subject.name,
                  ['тип занятия']: SubjectTypesMap[subjectType],
                  группы: groups.map(({ name }) => name).join(', '),
                  аудитория: `${auditorium}/${campus}`,
                })
                currentTeacherName = name
                currentWeekDay = day
              }
            )
        })
      })
    )

    const workBook = xlsx.utils.book_new()

    const worksheet = xlsx.utils.json_to_sheet(test)
    xlsx.utils.book_append_sheet(workBook, worksheet, 'Расписание')
    const year = new Date().toLocaleString('ru', {
      year: 'numeric',
    })
    xlsx.writeFile(workBook, `static/timetables/timetable(${year}-${semester}).xlsx`)

    return test
  }
}
