import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { Public } from 'src/common/decorators'

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto)
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll()
  }

  @Get('subjects-by-teacher/:id')
  async findSubjectsByTeacherId(@Param('id') teacherId: number) {
    return await this.subjectsService.findSubjectsByTeacherId(teacherId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne({ id: +id })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(+id, updateSubjectDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id)
  }
}
