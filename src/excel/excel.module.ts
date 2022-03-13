import { TimetableService as ExcelTimetableService } from './timetable.service'
import { ExcelHelperService } from './excel-helper.service'
import { Module } from '@nestjs/common'
import { ExcelService } from './excel.service'
import { ExcelController } from './excel.controller'
import { TeachersService as ExcelTeachersService } from './teachers.service'
import { SubjectsService as ExcelSubjectsService } from './subjects.service'
import { TeachersPayloadService } from './teachers-payload.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { Group } from 'src/groups/entities/group.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { ExcelRepositoryService } from './excel-repository.service'
import { TeachersService } from 'src/teachers/teachers.service'
import { GroupsService } from 'src/groups/groups.service'
import { TimetableService } from 'src/timetable/timetable.service'
import { SubjectsService } from 'src/subjects/subjects.service'
import { SubjectHours } from 'src/subjects/entities/subject-hours.entity'

@Module({
  providers: [
    ExcelService,
    ExcelHelperService,
    ExcelRepositoryService,
    ExcelTeachersService,
    ExcelSubjectsService,
    TeachersPayloadService,
    ExcelTimetableService,
    TeachersService,
    GroupsService,
    SubjectsService,
    TimetableService,
  ],
  controllers: [ExcelController],
  imports: [
    TypeOrmModule.forFeature([Teacher, Subject, TeacherToSubject, Group, Timetable, SubjectHours]),
  ],
  exports: [ExcelService],
})
export class ExcelModule {}
