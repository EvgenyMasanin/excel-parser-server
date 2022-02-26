import { TimetableService } from './timetable.service'
import { ExcelHelperService } from './excel-helper.service'
import { Module } from '@nestjs/common'
import { ExcelService } from './excel.service'
import { ExcelController } from './excel.controller'
import { TeachersService } from './teachers.service'
import { SubjectsService } from './subjects.service'
import { TeachersPayloadService } from './teachers-payload.service'

@Module({
  providers: [
    ExcelService,
    ExcelHelperService,
    TeachersService,
    SubjectsService,
    TeachersPayloadService,
    TimetableService,
  ],
  controllers: [ExcelController],
  imports: [],
  exports: [ExcelService],
})
export class ExcelModule {}
