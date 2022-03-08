import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TimetableWithAdditionalData } from 'src/mistake-finder/entities/timetable-mistake'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import objectEquals from 'src/utils/objectEquals'
import { Repository } from 'typeorm'
import { CreateTimetableDto } from './dto/create-timetable.dto'
import { UpdateTimetableDto } from './dto/update-timetable.dto'
import { Timetable } from './entities/timetable.entity'

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private readonly timetableRepository: Repository<Timetable>
  ) {}
  async create(createTimetableDto: CreateTimetableDto) {
    return await this.timetableRepository.save(createTimetableDto)
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

  async findAllTimetableWithAdditionalData() {
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
      .getMany()) as TimetableWithAdditionalData[]
  }

  timetablesEquals(timetable1: Timetable, timetable2: Timetable) {
    return objectEquals(timetable1, timetable2, [
      'groupId',
      'subGroupNum',
      'teacherToSubjectId',
      'type',
    ])
  }

  findAll() {
    return `This action returns all timetable`
  }

  findOne(id: number) {
    return `This action returns a #${id} timetable`
  }

  update(id: number, updateTimetableDto: UpdateTimetableDto) {
    return `This action updates a #${id} timetable`
  }

  remove(id: number) {
    return `This action removes a #${id} timetable`
  }
}
