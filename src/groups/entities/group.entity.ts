import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Timetable } from 'src/timetable/entities/timetable.entity'

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  name: string

  @OneToMany(() => Timetable, (timetable) => timetable.group)
  timetables: Timetable[]
}
