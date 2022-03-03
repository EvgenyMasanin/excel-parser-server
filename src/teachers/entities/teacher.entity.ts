import { Subject } from 'src/subjects/entities/subject.entity'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm'
import { TeacherToSubject } from './teacher-to-subject.entity'

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  fullName: string

  @Column()
  position: string

  @Column({ nullable: true })
  fullPosition: string

  @OneToMany(
    () => TeacherToSubject,
    (teacherToSubject) => teacherToSubject.teacher
  )
  public teacherToSubject: TeacherToSubject[]
}
