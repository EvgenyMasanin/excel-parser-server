import { Module } from '@nestjs/common'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Teacher } from './entities/teacher.entity'
import { TeacherToSubject } from './entities/teacher-to-subject.entity'
import { SubjectHours } from 'src/subjects/entities/subject-hours.entity'

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  imports: [TypeOrmModule.forFeature([Teacher, TeacherToSubject, SubjectHours])],
})
export class TeachersModule {}
