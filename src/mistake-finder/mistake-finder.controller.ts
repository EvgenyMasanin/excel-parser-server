import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { MistakeFinderService } from './mistake-finder.service'
import { CreateMistakeFinderDto } from './dto/create-mistake-finder.dto'
import { UpdateMistakeFinderDto } from './dto/update-mistake-finder.dto'

@Controller('mistake-finder')
export class MistakeFinderController {
  constructor(private readonly mistakeFinderService: MistakeFinderService) {}

  @Get()
  create() {
    return this.mistakeFinderService.findMistakes()
  }
}
