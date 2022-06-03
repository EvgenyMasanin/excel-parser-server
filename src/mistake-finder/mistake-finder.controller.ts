import { Controller, Get } from '@nestjs/common'
import { MistakeFinderService } from './mistake-finder.service'

@Controller('mistake-finder')
export class MistakeFinderController {
  constructor(private readonly mistakeFinderService: MistakeFinderService) {}

  @Get()
  async findMistakes() {
    return await this.mistakeFinderService.findMistakes()
  }
}
