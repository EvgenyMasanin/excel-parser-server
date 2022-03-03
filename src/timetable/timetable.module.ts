import { Module } from '@nestjs/common'
import { TimetableService } from './timetable.service'
import { TimetableController } from './timetable.controller'

@Module({
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableModule],
})
export class TimetableModule {}
