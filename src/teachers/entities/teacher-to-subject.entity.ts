import { Subject } from 'src/subjects/entities/subject.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Teacher } from './teacher.entity'

@Entity()
export class TeacherToSubject {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  public teacherId!: number

  @Column()
  public subjectId!: number

  @ManyToOne(() => Teacher, (teacher) => teacher.teacherToSubject)
  public teacher: Teacher

  @ManyToOne(() => Subject, (subject) => subject.teacherToSubject)
  public subject: Subject

  @OneToMany(() => Timetable, (timetable) => timetable.teacherToSubject)
  timetables: Timetable[]
}
