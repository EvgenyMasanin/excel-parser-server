import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Group } from 'src/groups/entities/group.entity'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import {
  SubjectTypes,
  Semester,
  WeekDaysMap,
  WeekType,
  WeekDaysEN,
  subjectTypes,
  SubgroupNumber,
  subgroupNumber,
  semester,
  weekType,
} from 'src/excel/types'

@Entity()
export class Timetable {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  teacherToSubjectId: number

  @Column()
  groupId: number

  @ManyToOne(() => TeacherToSubject, (teacherToSubject) => teacherToSubject.timetables)
  @JoinColumn({ name: 'teacherToSubjectId' })
  teacherToSubject: TeacherToSubject

  @ManyToOne(() => Group, (group) => group.timetables)
  @JoinColumn({ name: 'groupId' })
  group: Group

  @Column('enum', { enum: SubgroupNumber })
  subGroupNum: subgroupNumber

  @Column('enum', { enum: WeekDaysMap })
  weekDay: WeekDaysEN

  @Column('enum', { enum: subjectTypes })
  type: SubjectTypes

  @Column({ nullable: true })
  hoursPerSemester: number

  @Column({ nullable: true, type: 'float' })
  hoursPerWeek: number

  @Column('enum', { enum: semester })
  semester: Semester

  @Column()
  course: string

  @Column()
  lessonNumber: number

  @Column('enum', { enum: weekType })
  weekType: WeekType

  @Column({ nullable: true })
  auditorium: number

  @Column({ nullable: true })
  campus: number
}
