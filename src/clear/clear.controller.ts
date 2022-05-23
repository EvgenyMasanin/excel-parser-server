import { Controller, Get } from '@nestjs/common'
import { ClearService } from './clear.service'

@Controller('clear')
export class ClearController {
  constructor(private readonly clearService: ClearService) {}

  @Get()
  async clearDB() {
    return await this.clearService.clearDB()
  }
}
