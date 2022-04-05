import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { TeachersService } from './teachers.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto)
  }

  @Get()
  findAll() {
    return this.teachersService.findAll()
  }

  @Get('teachers-to-subjects')
  findAllTeachersToSubjects() {
    return this.teachersService.findAllTeachersToSubjects()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    console.log('🚀 ~ update ~ updateTeacherDto', updateTeacherDto)
    return this.teachersService.update(+id, updateTeacherDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(+id)
  }
}
