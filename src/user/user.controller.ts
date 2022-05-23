import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll() {
    return await this.userService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.userService.findOne(id)
  }

  @Post()
  async create(@Body() { email, password, rolesId, teacherId }: UpdateUserDto) {
    return await this.userService.create({
      email,
      password,
      teacherId,
      rolesId,
    })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() { email, password, rolesId, teacherId }: UpdateUserDto) {
    return this.userService.update(+id, {
      email,
      password,
      teacherId,
      roles: rolesId.map((id) => ({ id })),
    })
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
