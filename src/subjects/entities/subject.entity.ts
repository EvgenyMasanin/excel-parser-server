import { Semester, WeekType } from 'src/excel/types'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

type WithTimetable<T extends Subject> = T & { timetables: Timetable[] }
type WithGroups<T extends Subject> = T & { groups: string[] }
type WithSemesters<T extends Subject> = T & { semesters: Semester[] }
type WithWeekTypes<T extends Subject> = T & { weekTypes: WeekType[] }

export type SubjectWithTimetables = WithTimetable<Subject>
export type SubjectWithAdditionData = WithWeekTypes<WithSemesters<WithGroups<Subject>>>

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @OneToMany(() => TeacherToSubject, (teacherToSubject) => teacherToSubject.subject, {
    cascade: true,
  })
  teacherToSubject: TeacherToSubject[]

  @DeleteDateColumn({ select: false })
  deletedAt?: Date
}
