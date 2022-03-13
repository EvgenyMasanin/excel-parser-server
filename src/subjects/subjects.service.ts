import { Group } from 'src/groups/entities/group.entity';
import { CreateSubjectHoursDto } from './dto/create-subject-hours.dto';
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, FindManyOptions, Repository } from 'typeorm'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { SubjectHours } from './entities/subject-hours.entity'
import { Subject } from './entities/subject.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity';

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

  findAll() {
    return `This action returns all subjects`
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`
  }

  remove(id: number) {
    return `This action removes a #${id} subject`
  }
}
