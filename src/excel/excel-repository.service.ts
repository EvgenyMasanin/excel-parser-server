import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SubjectsService } from './subjects.service'
import { Group } from 'src/groups/entities/group.entity'
import { Teacher } from 'src/teachers/entities/teacher.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Timetable } from 'src/timetable/entities/timetable.entity'
import { TeacherToSubject } from 'src/teachers/entities/teacher-to-subject.entity'
import { CreateTimetableDto } from 'src/timetable/dto/create-timetable.dto'
import { ITeacher, subgroupNumber } from './types'

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
    for (const { course, ...createTeacherDto } of teachers) {
      const teacherDB = await this.teacherRepository.save(createTeacherDto)
      const courses = Object.entries(course)
      for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
        const [courseNum, subjects] = courses[courseIndex]

        for (const subject of subjects) {
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

          for (const [groupName, { subGroups, hoursPerWeek }] of groups) {
            const groupDB =
              (await this.groupsRepository.findOne({
                name: groupName,
              })) ||
              (await this.groupsRepository.save({
                name: groupName,
              }))

            for (let subGroupIndex = 0; subGroupIndex < subGroups.length; subGroupIndex++) {
              const subGroup = subGroups[subGroupIndex]
              for (const { lessonName, lessonNumber, type, weekDay } of subGroup) {
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
                  subGroupNum: (subGroupIndex + 1) as subgroupNumber,
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
