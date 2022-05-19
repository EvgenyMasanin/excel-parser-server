import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { Group } from './entities/group.entity'

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    return await this.groupsRepository.save(createGroupDto)
  }

  async findAll() {
    return await this.groupsRepository.find()
  }

  async findOne(conditions: FindConditions<Group>) {
    return await this.groupsRepository.findOne(conditions)
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return await this.groupsRepository.update(id, updateGroupDto)
  }

  async remove(id: number) {
    const groupToDelete = await this.groupsRepository.findOne(id, {
      relations: ['subjectHours', 'timetables'],
    })

    return await this.groupsRepository.softRemove(groupToDelete)
  }
}
