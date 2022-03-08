import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Subject } from 'src/subjects/entities/subject.entity'
import { FindConditions, Repository } from 'typeorm'
import { CreateTeacherToSubjectDto } from './dto/create-teacher-to-subject.dto'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import { TeacherToSubject } from './entities/teacher-to-subject.entity'
import { Teacher } from './entities/teacher.entity'
import { TeacherWithAdditionalData } from './tipes'

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(TeacherToSubject)
    private readonly teacherToSubjectRepository: Repository<TeacherToSubject>
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    return await this.teacherRepository.save(createTeacherDto)
  }

  async createTeacherToSubject(createTeacherToSubjectDto: CreateTeacherToSubjectDto) {
    return await this.teacherToSubjectRepository.save(createTeacherToSubjectDto)
  }
  async findOneTeacherToSubject(conditions: FindConditions<TeacherToSubject>) {
    return await this.teacherToSubjectRepository.findOne(conditions)
  }

  findAllTeachersWithAdditionalData = async () =>
    (await this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.teacherToSubject', 'teacherToSubject')
      .leftJoinAndMapMany(
        'teacher.subjects',
        Subject,
        'subject',
        'subject.id = teacherToSubject.subjectId'
      )
      .getMany()) as TeacherWithAdditionalData[]

  findAll() {
    return `This action returns all teachers`
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`
  }
}
