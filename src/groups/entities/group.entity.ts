import { SubjectHours } from '../../subjects/entities/subject-hours.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { SubgroupNumber } from 'src/excel/types';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  name: string

  @Column()
  countOfSubGroups: SubgroupNumber

  @OneToMany(() => Timetable, (timetable) => timetable.group)
  timetables: Timetable[]

  @OneToMany(() => SubjectHours, (subjectHours) => subjectHours.group)
  subjectHours: SubjectHours[]
}
