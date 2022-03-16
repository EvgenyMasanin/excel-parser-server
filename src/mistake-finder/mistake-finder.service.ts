import { SubjectTypes, subjectTypes } from 'src/excel/types'
import { SubjectsService } from 'src/subjects/subjects.service'
import { SubGroupNumber } from '../excel/types'
import { Injectable } from '@nestjs/common'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { CountOfLessonsMistake } from './entities/count-of-lessons-mistake'
import { TimetableMistake } from './entities/timetable-mistake'
import { TeachersService } from 'src/teachers/teachers.service'
import { TimetableService } from 'src/timetable/timetable.service'
import objectsEquals from 'src/utils/objects-equals'
import { Group } from 'src/groups/entities/group.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'

@Injectable()
export class MistakeFinderService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly timetableService: TimetableService,
    private readonly subjectService: SubjectsService
  ) {}

  async findMistakes() {
    return {
      mistakesWithCountOfLessons: await this.findMistakesWithCountOfLessons(),
      timetableMistakes: await this.findTimetableMistakes(),
    }
  }

  private async findMistakesWithCountOfLessons() {
    const mistakes: CountOfLessonsMistake[] = []

    const subjectsHours = await this.subjectService.findAllSubjectHours({ relations: ['group'] })

    for (const { group, teacherToSubjectId, semester, ...hoursPerWeek } of subjectsHours) {
      const timetables = await this.timetableService.findTimetables({
        where: {
          teacherToSubjectId,
          groupId: group.id,
          semester,
        },
      })

      const { teacher, subject } = await this.teacherService.findOneTeacherToSubject({
        relations: ['teacher', 'subject'],
        where: {
          id: teacherToSubjectId,
        },
      })

      const lecturesTimetables: Timetable[] = []
      const laboratoriesTimetables: Timetable[] = []
      const practicesTimetables: Timetable[] = []

      const timetablesByTypes: Record<SubjectTypes, Timetable[]> = {
        lecture: lecturesTimetables,
        laboratory: laboratoriesTimetables,
        practice: practicesTimetables,
      }

      for (const timetable of timetables) {
        switch (timetable.subjectType) {
          case 'lecture':
            lecturesTimetables.push(timetable)
            break
          case 'practice':
            practicesTimetables.push(timetable)
            break
          case 'laboratory':
            laboratoriesTimetables.push(timetable)
            break
        }
      }

      for (const subjectType of subjectTypes) {
        mistakes.push(
          ...this.getMistakeIfTimetablesEmpty(
            timetablesByTypes[subjectType],
            group,
            teacher,
            subject,
            subjectType,
            hoursPerWeek[`${subjectType}HoursPerWeek`]
          ),
          ...(await this.getMistake(
            timetablesByTypes[subjectType],
            teacher,
            subject,
            group,
            hoursPerWeek[`${subjectType}HoursPerWeek`]
          ))
        )
      }
    }

    return this.filterMistakes(mistakes)
  }
  private getMistakeIfTimetablesEmpty(
    timetables: Timetable[],
    group: Group,
    teacher: Teacher,
    subject: Subject,
    subjectType: SubjectTypes,
    expectedHours: number
  ) {
    const mistakes: CountOfLessonsMistake[] = []
    if (timetables.length === 0) {
      for (let groupNumber = 1; groupNumber <= group.subGroupsCount; groupNumber++) {
        if (expectedHours !== 0)
          mistakes.push(
            new CountOfLessonsMistake(
              teacher,
              subject,
              group,
              subjectType,
              groupNumber as SubGroupNumber,
              expectedHours,
              0
            )
          )
      }
    }

    return mistakes
  }

  private async getMistake(
    timetables: Timetable[],
    teacher: Teacher,
    subject: Subject,
    group: Group,
    expectedHours: number
  ) {
    const mistakes: CountOfLessonsMistake[] = []
    for (const timetable of timetables) {
      const countOfLessons = this.getCountOfLessons(timetables, timetable)
      const errorRate = Math.abs(expectedHours - countOfLessons)

      if (errorRate > 0.5) {
        mistakes.push(
          new CountOfLessonsMistake(
            teacher,
            subject,
            group,
            timetable.subjectType,
            timetable.subGroupNum,
            expectedHours,
            countOfLessons
          )
        )
      }
    }
    return mistakes
  }

  private async findTimetableMistakes() {
    const timetables = await this.timetableService.findAllTimetableWithAdditionalData()

    return timetables.map<TimetableMistake>((timetable) => new TimetableMistake(timetable))
  }

  private filterMistakes(mistakes: CountOfLessonsMistake[]) {
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

  private mistakesEquals(mistake1: CountOfLessonsMistake, mistake2: CountOfLessonsMistake) {
    return objectsEquals(mistake1, mistake2)
  }
}
