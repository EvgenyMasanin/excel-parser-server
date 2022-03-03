import {
  CourseNum,
  DayOfWeek,
  Semester,
  WeekDays,
  WeekType,
} from 'src/excel/types'
import { Group } from 'src/groups/entities/group.entity'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Timetable {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => TeacherToSubject,
    (teacherToSubject) => teacherToSubject.timetables
  )
  teacherToSubject: TeacherToSubject

  @ManyToOne(() => Group, (group) => group.timetables)
  group: Group

  @Column('enum', { enum: WeekDays })
  weekDay: DayOfWeek

  @Column('enum', { enum: ['Lecture', 'Laboratory', 'Practice'] })
  type: 'Lecture' | 'Laboratory' | 'Practice'

  @Column()
  hoursPerSemester: number

  @Column()
  hoursPerWeek: number

  @Column('enum', { enum: ['first', 'second'] })
  semester: Semester

  @Column()
  course: CourseNum

  @Column()
  lessonNumber: number

  @Column('enum', { enum: ['up', 'down'] })
  weekType: WeekType

  @Column()
  auditorium: number

  @Column()
  campus: number
}
