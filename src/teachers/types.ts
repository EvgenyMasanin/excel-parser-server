import { Subject } from 'src/subjects/entities/subject.entity'
import { TeacherToSubject } from './entities/teacher-to-subject.entity'
import { Teacher } from './entities/teacher.entity'

export type TeacherWithAdditionalData = Teacher & {
  subjects: Subject[]
  teacherToSubject: TeacherToSubject[]
}
