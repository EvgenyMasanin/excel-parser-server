import { Role } from 'src/role/entities/role.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  refreshToken: string

  @ManyToMany(() => Role, { eager: true, onDelete: 'CASCADE' })
  @JoinTable()
  roles: Role[]

  @Column()
  teacherId: number

  @OneToOne(() => Teacher, { eager: true })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher
}
