import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Repository } from 'typeorm'
import { TeachersService } from 'src/teachers/teachers.service'
import { Timetable } from './entities/timetable.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import {
  TimetableWithSubject,
  TimetableWithTeacherAndSubject,
} from 'src/mistake-finder/entities/timetable-mistake'
import { CreateTimetableDto } from './dto/create-timetable.dto'
import { UpdateTimetableDto } from './dto/update-timetable.dto'
import objectsEquals from 'src/utils/objects-equals'
import { Week, WeekTimetable, WeekTimetableGroup } from './types'

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private readonly timetableRepository: Repository<Timetable>,
    private readonly teacherService: TeachersService
  ) {}

  async create(createTimetableDto: CreateTimetableDto) {
    return await this.timetableRepository.save(createTimetableDto)
  }

  async findTimetables(options?: FindManyOptions<Timetable>) {
    return await this.timetableRepository.find(options)
  }

  async findTimetablesByTeacherAndSubject(
    teacher: Teacher,
    subject: Subject
  ): Promise<Timetable[]> {
    return await this.timetableRepository.find({
      relations: ['group', 'teacherToSubject'],
      where: {
        teacherToSubjectId: teacher.teacherToSubject.find((t) => t.subjectId === subject.id)?.id,
      },
    })
  }

  async findAllTimetableWithMistakes() {
    return (await this.timetableRepository
      .createQueryBuilder('timetable')
      .leftJoinAndSelect('timetable.group', 'group')
      .leftJoin('timetable.teacherToSubject', 'teacherToSubject')
      .leftJoinAndMapOne(
        'timetable.teacher',
        Teacher,
        'teacher',
        'teacher.id = teacherToSubject.teacherId'
      )
      .leftJoinAndMapOne(
        'timetable.subject',
        Subject,
        'subject',
        'subject.id = teacherToSubject.subjectId'
      )
      .where('timetable.campus = :campus', { campus: null })
      .orWhere('timetable.auditorium = :auditorium', { auditorium: null })
      .getMany()) as TimetableWithTeacherAndSubject[]
  }

  async findAllTimetablesByTeacherToSubjects(teacherToSubjectsIds: number[]) {
    return (await this.timetableRepository
      .createQueryBuilder('timetable')
      .leftJoinAndSelect('timetable.group', 'group')
      .leftJoin('timetable.teacherToSubject', 'teacherToSubject')
      .leftJoinAndMapOne(
        'timetable.subject',
        Subject,
        'subject',
        'subject.id = teacherToSubject.subjectId'
      )
      .where('timetable.teacherToSubjectId IN (:...teacherToSubjectIds)', {
        teacherToSubjectIds: teacherToSubjectsIds,
      })
      .getMany()) as TimetableWithSubject[]
  }

  async getTeachersTimetable(teacherId: number) {
    const teacherToSubjectsIds = (
      await this.teacherService.findAllTeacherToSubjectByTeacherId(teacherId)
    ).map((t) => t.id)

    const timetables = await this.findAllTimetablesByTeacherToSubjects(teacherToSubjectsIds)

    const week = this.getWeek()

    const weekTimetable = timetables.reduce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (week, { group: { subGroupsCount, ...group }, subGroupNum, groupId, ...timetable }) => {
        const weekTimetables = week[timetable.weekDay]

        const weekTimetable = weekTimetables.find((w) =>
          this.weekTimetableEquals(w, { ...timetable, groups: [] })
        )

        const isLecture = timetable.subjectType === 'lecture'

        const weekTimetableGroup: WeekTimetableGroup = {
          ...group,
          subGroupNum: isLecture ? 'all' : subGroupNum,
        }

        if (weekTimetable) {
          const storedGroup = weekTimetable.groups.find((g) =>
            this.weekTimetableGroupEquals(g, weekTimetableGroup)
          )
          if (!storedGroup) weekTimetable.groups = [...weekTimetable.groups, weekTimetableGroup]
        } else {
          weekTimetables.push({ ...timetable, groups: [weekTimetableGroup] })
        }

        return week
      },
      week
    )

    return weekTimetable
  }

  getWeek(): Week {
    return {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    }
  }

  weekTimetableEquals(weekTimetable1: WeekTimetable, weekTimetable2: WeekTimetable) {
    return objectsEquals(weekTimetable1, weekTimetable2, [
      'teacherToSubjectId',
      'weekDay',
      'weekType',
      'lessonNumber',
      'course',
    ])
  }

  weekTimetableGroupEquals(group1: WeekTimetableGroup, group2: WeekTimetableGroup) {
    return objectsEquals(group1, group2, ['id'])
  }

  timetablesEquals(timetable1: Timetable, timetable2: Timetable) {
    return objectsEquals(timetable1, timetable2, [
      'groupId',
      'subGroupNum',
      'teacherToSubjectId',
      'subjectType',
    ])
  }

  async findAll() {
    return await this.timetableRepository.find()
  }

  async findOne(id: number) {
    return await this.timetableRepository.findOne(id)
  }

  async update(id: number, updateTimetableDto: UpdateTimetableDto) {
    return await this.timetableRepository.update(id, updateTimetableDto)
  }

  async remove(id: number) {
    return await this.timetableRepository.softDelete(id)
  }
}
