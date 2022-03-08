import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { Subject } from './entities/subject.entity'

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    return await this.subjectRepository.save(createSubjectDto)
  }

  findAll() {
    return `This action returns all subjects`
  }

  async findOne(conditions: FindConditions<Subject>) {
    return this.subjectRepository.findOne(conditions)
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`
  }

  remove(id: number) {
    return `This action removes a #${id} subject`
  }
}
