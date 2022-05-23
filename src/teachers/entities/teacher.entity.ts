import { Column, Entity, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from 'typeorm'
import { TeacherToSubject } from './teacher-to-subject.entity'

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  fullName: string

  @Column({ nullable: true })
  position: string

  @Column({ nullable: true })
  fullPosition: string

  @OneToMany(() => TeacherToSubject, (teacherToSubject) => teacherToSubject.teacher, {
    cascade: true,
    
  })
  teacherToSubject: TeacherToSubject[]

  @DeleteDateColumn({ select: false })
  deletedAt: Date
}
