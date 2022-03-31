import { Controller, Get } from '@nestjs/common'
import { Public } from 'src/common/decorators'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Get()
  async getUsers() {
    return await this.userService.findOne(14)
  }
}
