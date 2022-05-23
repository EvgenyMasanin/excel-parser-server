import { Controller, Get } from '@nestjs/common'
import { Public } from 'src/common/decorators'
import { ClearService } from './clear.service'

@Controller('clear')
export class ClearController {
  constructor(private readonly clearService: ClearService) {}

  @Public()
  @Get()
  async clearDB() {
    return await this.clearService.clearDB()
  }
}
