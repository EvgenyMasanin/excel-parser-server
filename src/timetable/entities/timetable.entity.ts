import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Group } from 'src/groups/entities/group.entity'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { DayOfWeek, SubjectTypes, Semester, WeekDays, WeekType } from 'src/excel/types'

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

  @Column('enum', { enum: [1, 2] })
  subGroupNum: 1 | 2

  @Column('enum', { enum: WeekDays })
  weekDay: DayOfWeek

  @Column('enum', { enum: SubjectTypes })
  type: SubjectTypes

  @Column({ nullable: true })
  hoursPerSemester: number

  @Column({ nullable: true, type: 'float' })
  hoursPerWeek: number

  @Column('enum', { enum: ['first', 'second'] })
  semester: Semester

  @Column()
  course: string

  @Column()
  lessonNumber: number

  @Column('enum', { enum: ['up', 'down', 'up/down'] })
  weekType: WeekType

  @Column({ nullable: true })
  auditorium: number

  @Column({ nullable: true })
  campus: number
}
