import { SubjectHours } from '../../subjects/entities/subject-hours.entity'
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { SubGroupNumber, subGroupNumber } from 'src/excel/types'

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  name: string

  @Column()
  subGroupsCount: SubGroupNumber

  @OneToMany(() => Timetable, (timetable) => timetable.group, {
    cascade: true
  })
  timetables: Timetable[]

  @OneToMany(() => SubjectHours, (subjectHours) => subjectHours.group, {
    cascade: true
  })
  subjectHours: SubjectHours[]

  @DeleteDateColumn({select: false})
  deletedAt?: Date
}
