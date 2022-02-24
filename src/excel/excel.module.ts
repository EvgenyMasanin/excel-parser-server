import { TimetableService } from './timetable.service'
import { ExcelHelperService } from './excel-helper.service'
import { Module } from '@nestjs/common'
import { ExcelService } from './excel.service'
import { ExcelController } from './excel.controller'

@Module({
  providers: [ExcelService, ExcelHelperService, TimetableService],
  controllers: [ExcelController],
  imports: [],
  exports: [ExcelService],
})
export class ExcelModule {}
