import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @OneToMany(() => TeacherToSubject, (teacherToSubject) => teacherToSubject.subject)
  teacherToSubject: TeacherToSubject[]
}
