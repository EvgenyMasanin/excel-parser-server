import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { TimetableService } from './timetable.service'
import { TimetableController } from './timetable.controller'
import { Timetable } from './entities/timetable.entity'

@Module({
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableModule],
  imports: [TypeOrmModule.forFeature([Timetable])],
})
export class TimetableModule {}
