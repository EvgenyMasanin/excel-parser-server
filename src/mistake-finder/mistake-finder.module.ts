import { SubjectsModule } from './../subjects/subjects.module'
import { Module } from '@nestjs/common'
import { MistakeFinderService } from './mistake-finder.service'
import { MistakeFinderController } from './mistake-finder.controller'
import { TeachersModule } from 'src/teachers/teachers.module'
import { TimetableModule } from 'src/timetable/timetable.module'

@Module({
  controllers: [MistakeFinderController],
  providers: [MistakeFinderService],
  imports: [TeachersModule, TimetableModule, SubjectsModule],
})
export class MistakeFinderModule {}
