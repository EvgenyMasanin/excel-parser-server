import { Module } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Group } from './entities/group.entity'
import { SubjectHours } from 'src/subjects/entities/subject-hours.entity'

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [TypeOrmModule.forFeature([Group, SubjectHours])],
})
export class GroupsModule {}
