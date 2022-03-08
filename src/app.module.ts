import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ExcelModule } from './excel/excel.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeachersModule } from './teachers/teachers.module'
import { SubjectsModule } from './subjects/subjects.module'
import { Subject } from './subjects/entities/subject.entity'
import { Teacher } from './teachers/entities/teacher.entity'
import { GroupsModule } from './groups/groups.module'
import { TimetableModule } from './timetable/timetable.module'
import { Group } from './groups/entities/group.entity'
import { TeacherToSubject } from './teachers/entities/teacher-to-subject.entity'
import { Timetable } from './timetable/entities/timetable.entity'
import { MistakeFinderModule } from './mistake-finder/mistake-finder.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Teacher, Subject, TeacherToSubject, Group, Timetable],
      synchronize: true,
    }),
    ExcelModule,
    TeachersModule,
    SubjectsModule,
    GroupsModule,
    TimetableModule,
    MistakeFinderModule,
  ],
})
export class AppModule {}
