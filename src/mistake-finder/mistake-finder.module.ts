import { Subject } from 'src/subjects/entities/subject.entity'
import { Module } from '@nestjs/common'
import { MistakeFinderService } from './mistake-finder.service'
import { MistakeFinderController } from './mistake-finder.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { Group } from 'src/groups/entities/group.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { TeachersService } from 'src/teachers/teachers.service'
import { TimetableService } from 'src/timetable/timetable.service'

@Module({
  controllers: [MistakeFinderController],
  providers: [MistakeFinderService, TeachersService, TimetableService],
  imports: [TypeOrmModule.forFeature([Timetable, Group, Teacher, Subject, TeacherToSubject])],
})
export class MistakeFinderModule {}
