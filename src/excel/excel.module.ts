import { TimetableService } from './timetable.service'
import { ExcelHelperService } from './excel-helper.service'
import { Module } from '@nestjs/common'
import { ExcelService } from './excel.service'
import { ExcelController } from './excel.controller'
import { TeachersService } from './teachers.service'
import { SubjectsService } from './subjects.service'
import { TeachersPayloadService } from './teachers-payload.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { Group } from 'src/groups/entities/group.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { ExcelRepositoryService } from './excel-repository.service'

@Module({
  providers: [
    ExcelService,
    ExcelHelperService,
    ExcelRepositoryService,
    TeachersService,
    SubjectsService,
    TeachersPayloadService,
    TimetableService,
  ],
  controllers: [ExcelController],
  imports: [TypeOrmModule.forFeature([Teacher, Subject, TeacherToSubject, Group, Timetable])],
  exports: [ExcelService],
})
export class ExcelModule {}
