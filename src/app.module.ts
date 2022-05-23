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
import { MistakeFinderModule } from './mistake-finder/mistake-finder.module'
import { SubjectHours } from './subjects/entities/subject-hours.entity'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { User } from './user/entities/user.entity'
import { RoleModule } from './role/role.module'
import { Role } from './role/entities/role.entity'
import { ClearModule } from './clear/clear.module';

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
      entities: [Teacher, User, Role, Subject, TeacherToSubject, Group, Timetable, SubjectHours],
      synchronize: true,
    }),
    ExcelModule,
    TeachersModule,
    SubjectsModule,
    GroupsModule,
    TimetableModule,
    MistakeFinderModule,
    AuthModule,
    UserModule,
    RoleModule,
    ClearModule,
  ],
})
export class AppModule {}
