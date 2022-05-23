import { Semester } from './../excel/types/timetable.types'
import { Timetable } from './../timetable/entities/timetable.entity'
import { CreateSubjectHoursDto } from './dto/create-subject-hours.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, FindManyOptions, Repository } from 'typeorm'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { SubjectHours } from './entities/subject-hours.entity'
import { Subject, SubjectWithAdditionData, SubjectWithTimetables } from './entities/subject.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { WeekType } from 'src/excel/types'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(SubjectHours)
    private readonly subjectHoursRepository: Repository<SubjectHours>
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    return await this.subjectRepository.save(createSubjectDto)
  }

  async findOne(conditions: FindConditions<Subject>) {
    return this.subjectRepository.findOne(conditions)
  }

  async findOneOrCreate(createSubjectDto: CreateSubjectDto) {
    return (
      (await this.subjectRepository.findOne(createSubjectDto)) ||
      (await this.subjectRepository.save(createSubjectDto))
    )
  }

  async findOneOrCreateSubjectHours(createSubjectHoursDto: CreateSubjectHoursDto) {
    return (
      (await this.subjectHoursRepository.findOne(createSubjectHoursDto)) ||
      (await this.subjectHoursRepository.save(createSubjectHoursDto))
    )
  }

  async findSubjectHoursByTeacherAndSubjectAndGroup(
    teacher: Teacher,
    subject: Subject,
    groupId: number
  ): Promise<SubjectHours> {
    return await this.subjectHoursRepository.findOne({
      where: {
        teacherToSubjectId: teacher.teacherToSubject.find((t) => t.subjectId === subject.id)?.id,
        groupId,
      },
    })
  }

  async findAllSubjectHours(options?: FindManyOptions<SubjectHours>) {
    return await this.subjectHoursRepository.find(options)
  }

  async findSubjectsByTeacherId(teacherId: number): Promise<SubjectWithAdditionData[]> {
    if (isNaN(teacherId)) return []

    const subjects = (await this.subjectRepository
      .createQueryBuilder('subject')
      .leftJoin('subject.teacherToSubject', 'teacherToSubject')
      .leftJoinAndMapMany(
        'subject.timetables',
        Timetable,
        'timetable',
        'timetable.teacherToSubjectId = teacherToSubject.id'
      )
      .leftJoinAndSelect('timetable.group', 'group')
      .where('teacherToSubject.teacherId = :teacherId', { teacherId: teacherId })
      .getMany()) as SubjectWithTimetables[]

    const clearSubjects = subjects.map<SubjectWithAdditionData>(
      ({ id, name, teacherToSubject, timetables }) => {
        console.log('🚀 ~ clearSubjects ~ timetables', timetables)

        const initAdditionData = {
          groups: new Set<string>(),
          semesters: new Set<Semester>(),
          weekTypes: new Set<WeekType>(),
        }

        const additionData: typeof initAdditionData = timetables.reduce(
          (additionData, timetable) => {
            additionData.groups.add(timetable.group.name)
            additionData.semesters.add(timetable.semester)
            additionData.weekTypes.add(timetable.weekType)
            return additionData
          },
          initAdditionData
        )

        return {
          id,
          name,
          teacherToSubject,
          groups: [...additionData.groups],
          semesters: [...additionData.semesters],
          weekTypes: [...additionData.weekTypes],
        }
      }
    )
    return clearSubjects
  }

  async findAll() {
    return await this.subjectRepository.find()
  }

  async update(subjectId: number, partialEntity: QueryDeepPartialEntity<Subject>) {
    return await this.subjectRepository.update(subjectId, partialEntity)
  }

  async remove(subjectId: number) {
    const subjectToDelete = await this.subjectRepository.findOne(subjectId, {
      relations: ['teacherToSubject'],
    })

    return await this.subjectRepository.softRemove(subjectToDelete)
  }
}
