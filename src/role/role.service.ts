import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role'
  }

  async findAll() {
    return `This action returns all role`
  }

  async findOne(id: number) {
    return await this.roleRepository.findOne(id)
  }

  async findOneByName(name: string) {
    return await this.roleRepository.findOne({ name })
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`
  }

  async remove(id: number) {
    return `This action removes a #${id} role`
  }
}
