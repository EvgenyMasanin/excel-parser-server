import { Injectable } from '@nestjs/common'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { MistakeWithCountOfLessons } from './entities/mistake-with-count-of-lessons'
import { TimetableMistake } from './entities/timetable-mistake'
import { TeachersService } from 'src/teachers/teachers.service'
import { TimetableService } from 'src/timetable/timetable.service'
import objectEquals from 'src/utils/objectEquals'

@Injectable()
export class MistakeFinderService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly timetableService: TimetableService
  ) {}

  async findMistakes() {
    return {
      mistakesWithCountOfLessons: await this.findMistakesWithCountOfLessons(),
      timetableMistakes: await this.findTimetableMistakes(),
    }
  }

  private async findMistakesWithCountOfLessons() {
    const mistakes: MistakeWithCountOfLessons[] = []

    const teachers = await this.teacherService.findAllTeachersWithAdditionalData()

    for (const teacher of teachers) {
      for (const subject of teacher.subjects) {
        const timetables = await this.timetableService.findTimetablesByTeacherAndSubject(
          teacher,
          subject
        )

        for (const timetable of timetables) {
          const countOfLessons = this.getCountOfLessons(timetables, timetable)
          const errorRate = Math.abs(timetable.hoursPerWeek - countOfLessons)

          if (errorRate > 0.5) {
            mistakes.push(
              new MistakeWithCountOfLessons(teacher, subject, timetable, countOfLessons)
            )
          }
        }
      }
    }

    return this.filterMistakes(mistakes)
  }

  private async findTimetableMistakes() {
    const timetables = await this.timetableService.findAllTimetableWithAdditionalData()

    return timetables.map<TimetableMistake>((timetable) => new TimetableMistake(timetable))
  }

  private filterMistakes(mistakes: MistakeWithCountOfLessons[]) {
    return mistakes.filter(
      (mistake, index) => index === mistakes.findIndex((m) => this.mistakesEquals(m, mistake))
    )
  }

  private getCountOfLessons(timetables: Timetable[], timetable: Timetable) {
    return timetables.reduce((count, t) => {
      if (this.timetableService.timetablesEquals(t, timetable)) {
        return (count += t.weekType === 'up/down' ? (t.hoursPerWeek === 1 ? 1 : 2) : 1)
      }
      return count
    }, 0)
  }

  private mistakesEquals(mistake1: MistakeWithCountOfLessons, mistake2: MistakeWithCountOfLessons) {
    return objectEquals(mistake1, mistake2)
  }
}
