import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleService } from 'src/role/role.service'
import { Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { createUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService
  ) {}

  async create(dto: createUserDto) {
    const newUser = this.userRepository.create(dto)

    newUser.roles = [await this.roleService.findOneByName('Teacher')]

    return await this.userRepository.save(newUser)
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ email })
  }

  async findOne(userId: number) {
    return await this.userRepository.findOne(userId)
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'email'],
    })
  }

  async update(userId: number, partialEntity: QueryDeepPartialEntity<User>) {
    return await this.userRepository.update(userId, partialEntity)
  }

  async remove(userId: number) {
    return await this.userRepository.softDelete(userId)
  }

}
