import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BasicRoles } from 'src/common/decorators/role.decorator'
import { Repository } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.save(createRoleDto)
  }

  async findMany(rolesIds: number[]) {
    return await this.roleRepository.findByIds(rolesIds)
  }

  async findAll() {
    return await this.roleRepository.find()
  }

  async findOne(id: number) {
    return await this.roleRepository.findOne(id)
  }

  async findOneByName(name: string) {
    return await this.roleRepository.findOne({ name })
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.roleRepository.update(id, updateRoleDto)
  }

  async remove(id: number) {
    return await this.roleRepository.delete(id)
  }

  async generateBasicRoles() {
    if (await this.roleRepository.findOne({ name: BasicRoles.admin })) {
      return 'Basic roles already generated'
    }

    const admin: CreateRoleDto = { name: BasicRoles.admin, description: 'Role with full access' }
    const teacher: CreateRoleDto = { name: BasicRoles.teacher, description: 'Basic role' }

    await this.roleRepository.save(admin)
    await this.roleRepository.save(teacher)

    return 'Basic roles generated'
  }
}
