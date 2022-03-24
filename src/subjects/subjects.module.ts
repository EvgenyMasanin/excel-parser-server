import { Group } from 'src/groups/entities/group.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { SubjectsController } from './subjects.controller'
import { Subject } from './entities/subject.entity'
import { SubjectHours } from './entities/subject-hours.entity'

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
  imports: [TypeOrmModule.forFeature([Subject, SubjectHours])],
})
export class SubjectsModule {}
