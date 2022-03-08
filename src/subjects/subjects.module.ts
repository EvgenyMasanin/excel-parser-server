import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { SubjectsController } from './subjects.controller'
import { Subject } from './entities/subject.entity'

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  imports: [TypeOrmModule.forFeature([Subject])],
})
export class SubjectsModule {}
