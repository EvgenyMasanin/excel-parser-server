import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Teacher } from './teacher.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { SubjectHours } from 'src/subjects/entities/subject-hours.entity'

@Entity()
export class TeacherToSubject {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  teacherId: number

  @Column()
  subjectId: number

  @ManyToOne(() => Teacher, (teacher) => teacher.teacherToSubject)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher

  @ManyToOne(() => Subject, (subject) => subject.teacherToSubject)
  @JoinColumn({ name: 'subjectId' })
  subject: Subject

  @OneToMany(() => Timetable, (timetable) => timetable.teacherToSubject, {
    cascade: true,
  })
  timetables: Timetable[]

  @OneToMany(() => SubjectHours, (subjectHours) => subjectHours.group, {
    cascade: true,
  })
  subjectHours: SubjectHours[]

  @DeleteDateColumn({ select: false })
  deleteAt: Date
}
