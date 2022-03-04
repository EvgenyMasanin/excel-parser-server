import { CourseNum } from 'src/excel/types'
import { Injectable } from '@nestjs/common'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Group } from 'src/groups/entities/group.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { ITeacher } from './types'
import { Repository } from 'typeorm'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { CreateTimetableDto } from 'src/timetable/dto/create-timetable.dto'
import { SubjectsService } from './subjects.service'

@Injectable()
export class ExcelRepositoryService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(TeacherToSubject)
    private readonly teacherToSubjectRepository: Repository<TeacherToSubject>,
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(Timetable)
    private readonly timetableRepository: Repository<Timetable>,
    private readonly excelSubjectService: SubjectsService
  ) {}

  async saveToDB(teachers: ITeacher[]) {
    for (let teacherIndex = 0; teacherIndex < teachers.length; teacherIndex++) {
      const { course, ...createTeacherDto } = teachers[teacherIndex]
      const teacherDB = await this.teacherRepository.save(createTeacherDto)
      const courses = Object.entries(course)
      for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
        const [courseNum, subjects] = courses[courseIndex]

        for (let subjectIndex = 0; subjectIndex < subjects.length; subjectIndex++) {
          const subject = subjects[subjectIndex]
          const subjectDB =
            (await this.subjectRepository.findOne({
              name: subject.name,
            })) ||
            (await this.subjectRepository.save({
              name: subject.name,
            }))

          const teacherToSubjectDB = await this.teacherToSubjectRepository.save({
            teacherId: teacherDB.id,
            subjectId: subjectDB.id,
          })

          const groups = Object.entries(subject.groups)

          for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            const [groupName, { subGroups, hoursPerWeek }] = groups[groupIndex]
            const groupDB =
              (await this.groupsRepository.findOne({
                name: groupName,
              })) ||
              (await this.groupsRepository.save({
                name: groupName,
              }))

            for (let subGroupIndex = 0; subGroupIndex < subGroups.length; subGroupIndex++) {
              const subGroup = subGroups[subGroupIndex]
              for (let lessonIndex = 0; lessonIndex < subGroup.length; lessonIndex++) {
                const { lessonName, lessonNumber, type, weekDay } = subGroup[lessonIndex]
                const subjectType = this.excelSubjectService.getTypeOfSubject(lessonName)
                const { auditorium, campus } =
                  this.excelSubjectService.getAuditoriumAndCampus(lessonName)

                const timetableDto: CreateTimetableDto = {
                  groupId: groupDB.id,
                  teacherToSubjectId: teacherToSubjectDB.id,
                  weekType: type,
                  course: courseNum,
                  type: subjectType,
                  semester: subject.semester,
                  subGroupNum: (subGroupIndex + 1) as 1 | 2,
                  hoursPerSemester: subject.hoursPerSemester?.[subjectType],
                  hoursPerWeek: hoursPerWeek[subjectType][subGroupIndex] || 0,
                  campus,
                  weekDay,
                  auditorium,
                  lessonNumber,
                }
                
                await this.timetableRepository.save(timetableDto)
              }
            }
          }
        }
      }
    }
  }
}
