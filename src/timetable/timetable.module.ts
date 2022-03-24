import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { TimetableService } from './timetable.service'
import { TimetableController } from './timetable.controller'
import { Timetable } from './entities/timetable.entity'
import { TeachersModule } from 'src/teachers/teachers.module'

@Module({
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
  imports: [TypeOrmModule.forFeature([Timetable]), TeachersModule],
})
export class TimetableModule {}
