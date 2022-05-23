import { UpdateUserDto } from './dto/update-user.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleService } from 'src/role/role.service'
import { DeepPartial, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { createUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { BasicRoles } from 'src/common/decorators/role.decorator'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService
  ) {}

  async create({ rolesId, ...dto }: createUserDto, isAdmin?: boolean) {
    const newUser = this.userRepository.create(dto)

    newUser.password = await bcrypt.hash(dto.password, 10)

    if (rolesId?.length > 0) {
      newUser.roles = await this.roleService.findMany(rolesId)
    } else {
      newUser.roles = [await this.roleService.findOneByName(BasicRoles.teacher)]
      if (isAdmin) newUser.roles.push(await this.roleService.findOneByName(BasicRoles.admin))
    }

    return await this.userRepository.save(newUser)
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ email })
  }

  async findOne(userId: number) {
    return await this.userRepository.findOne(userId)
  }

  async isAdminExist() {
    const users = await this.userRepository.find({
      relations: ['roles'],
    })

    const isAdminExist = users.some((user) =>
      user.roles.some((role) => role.name === BasicRoles.admin)
    )
    return {
      isAdminExist,
    }
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'email'],
    })
  }

  async update(userId: number, partialEntity: DeepPartial<User>) {
    if (Array.isArray(partialEntity.roles)) {
      const roles = await this.roleService.findMany(
        partialEntity.roles.map(({ id }) => id as number)
      )

      return await this.userRepository.save({
        ...partialEntity,
        id: userId,
        roles,
      })
    }

    return await this.userRepository.update(userId, partialEntity)
  }

  async remove(userId: number) {
    return await this.userRepository.delete(userId)
  }
}
