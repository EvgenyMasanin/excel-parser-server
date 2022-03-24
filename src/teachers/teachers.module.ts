import { Module } from '@nestjs/common'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Teacher } from './entities/teacher.entity'
import { TeacherToSubject } from './entities/teacher-to-subject.entity'

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
  imports: [TypeOrmModule.forFeature([Teacher, TeacherToSubject])],
})
export class TeachersModule {}
