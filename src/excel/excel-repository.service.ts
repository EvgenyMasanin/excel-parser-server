import { Injectable } from '@nestjs/common'
import { SubjectsService as ExcelSubjectsService } from './subjects.service'
import { GroupsService } from 'src/groups/groups.service'
import { TeachersService } from 'src/teachers/teachers.service'
import { SubjectsService } from 'src/subjects/subjects.service'
import { TimetableService } from 'src/timetable/timetable.service'
import { CreateTimetableDto } from 'src/timetable/dto/create-timetable.dto'
import { ITeacher, subgroupNumber } from './types'

@Injectable()
export class ExcelRepositoryService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly subjectService: SubjectsService,
    private readonly groupService: GroupsService,
    private readonly timetableService: TimetableService,
    private readonly excelSubjectService: ExcelSubjectsService
  ) {}

  async saveToDB(teachers: ITeacher[]) {
    for (const { course, ...createTeacherDto } of teachers) {
      const teacherDB = await this.teacherService.create(createTeacherDto)
      const courses = Object.entries(course)
      for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
        const [courseNum, subjects] = courses[courseIndex]

        for (const subject of subjects) {
          const subjectDB =
            (await this.subjectService.findOne({
              name: subject.name,
            })) ||
            (await this.subjectService.create({
              name: subject.name,
            }))

          const teacherToSubjectDB =
            (await this.teacherService.findOneTeacherToSubject({
              teacherId: teacherDB.id,
              subjectId: subjectDB.id,
            })) ||
            (await this.teacherService.createTeacherToSubject({
              teacherId: teacherDB.id,
              subjectId: subjectDB.id,
            }))

          const groups = Object.entries(subject.groups)

          for (const [groupName, { subGroups, hoursPerWeek }] of groups) {
            const groupDB =
              (await this.groupService.findOne({
                name: groupName,
              })) ||
              (await this.groupService.create({
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
                  hoursPerWeek:
                    subjectType === 'lecture'
                      ? hoursPerWeek[subjectType][0]
                      : hoursPerWeek[subjectType][subGroupIndex] || 0,
                  campus,
                  weekDay,
                  auditorium,
                  lessonNumber,
                }

                await this.timetableService.create(timetableDto)
              }
            }
          }
        }
      }
    }
  }
}
