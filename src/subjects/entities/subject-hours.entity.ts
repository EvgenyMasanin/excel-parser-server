import { Semester, semester } from 'src/excel/types'
import { Group } from 'src/groups/entities/group.entity'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class SubjectHours {
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

  @Column('enum', { enum: semester })
  semester: Semester

  @Column({ nullable: true, type: 'float' })
  lectureHoursPerWeek: number

  @Column({ nullable: true, type: 'float' })
  laboratoryHoursPerWeek: number

  @Column({ nullable: true, type: 'float' })
  practiceHoursPerWeek: number
}
