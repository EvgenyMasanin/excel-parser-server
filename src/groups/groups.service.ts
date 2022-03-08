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

  findAll() {
    return `This action returns all groups`
  }

  async findOne(conditions: FindConditions<Group>) {
    return await this.groupsRepository.findOne(conditions)
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`
  }

  remove(id: number) {
    return `This action removes a #${id} group`
  }
}
