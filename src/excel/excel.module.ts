import { TimetableModule } from 'src/timetable/timetable.module'
import { GroupsModule } from './../groups/groups.module'
import { TimetableService } from './timetable.service'
import { ExcelHelperService } from './excel-helper.service'
import { Module } from '@nestjs/common'
import { ExcelService } from './excel.service'
import { ExcelController } from './excel.controller'
import { TeachersService } from './teachers.service'
import { SubjectsService } from './subjects.service'
import { TeachersPayloadService } from './teachers-payload.service'
import { ExcelRepositoryService } from './excel-repository.service'
import { TeachersModule } from 'src/teachers/teachers.module'
import { SubjectsModule } from 'src/subjects/subjects.module'

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
  exports: [ExcelService],
  imports: [TeachersModule, SubjectsModule, GroupsModule, TimetableModule],
})
export class ExcelModule {}
